from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from .models import ChoiceResponse
from .serializers import UserSerializer
from .my_auth_backend import MyAuthBackend
import json
from django.utils.decorators import method_decorator
from django.contrib.auth.models import User
from .serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.generics import ListAPIView
from .serializers import ChoiceResponseSerializer
from django.core.files.base import ContentFile
from django.utils.timezone import now
import io
from .models import GeneratedImage
from django.conf import settings
from .serializers import GeneratedImageSerializer
import ollama
import requests
from urllib.request import urlopen



class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "user": serializer.data,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        request.user.auth_token.delete()
        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)


class HandleChoiceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        user_choice = data.get('choice', None)
        
        # Retrieve the user's previous choices and responses from the database
        previous_data = ChoiceResponse.objects.filter(user=request.user).order_by('created_at').values('choice', 'response')
        
        if user_choice is not None:
            # Build rich conversation history
            chat_history = ""
            for entry in previous_data[:10]:  # Last 10 interactions for context
                chat_history += f"Player action: {entry['choice']}\n"
                chat_history += f"Story: {entry['response'][:200]}...\n\n"
            
            # More flexible and engaging prompt
            template_str = """You are a storyteller guiding a player through an epic fantasy adventure in the Whispering Woods.

Setting: The player seeks the lost Gem of Serenity, facing mystical challenges, ancient guardians, and branching paths.

Your role:
- Continue the narrative from where it left off
- React directly to the player's last action/choice
- Create NEW scenes, challenges, and opportunities - don't repeat previous events
- Describe atmosphere, sensory details, and consequences of their actions
- Present 2-3 clear choices for what they do next (always end with: "What do you do?")
- If they die/fail, end with "The End." to signal game over

Conversation history:
{chat_history}

Player's action: {human_input}

Story continuation (be creative, advance the plot, introduce new elements):"""
            
            # Build chat history from previous interactions
            history_text = chat_history if chat_history else "This is the beginning of the adventure."
            
            full_prompt = template_str.format(
                chat_history=history_text,
                human_input=user_choice
            )
            
            # Generate story from Ollama with better parameters
            response = ollama.generate(
                model="llama3.2",
                prompt=full_prompt,
                stream=False,
                options={
                    "temperature": 0.8,  # More creative/varied responses
                    "top_p": 0.9,
                    "top_k": 40,
                    "num_predict": 400,  # Longer responses
                }
            )
            
            story = response.get('response', '').strip()
            
            # Ensure story isn't just repeating the choice
            if story.lower().startswith(user_choice.lower()):
                story = story[len(user_choice):].strip()
            
            # Extract choices from story if they exist
            extracted_choices = self._extract_choices_from_story(story)
            
            # Save the user's choice and generated story to the database
            ChoiceResponse.objects.create(
                user=request.user,
                choice=user_choice,
                response=story,
                previous_choices=','.join([e['choice'] for e in previous_data])
            )
            
            return Response({
                'success': True,
                'story': story,
                'choices': extracted_choices
            })
        else:
            return Response({'error': 'User choice is missing'}, status=status.HTTP_400_BAD_REQUEST)

    def _extract_choices_from_story(self, story):
        """
        Extract clickable choices from the story text.
        Looks for patterns like:
        - "1. Choice text"
        - "* Choice text"
        - "- Choice text"
        - "• Choice text"
        And also looks for "What do you do?" followed by choices
        """
        import re
        
        choices = []
        
        # Pattern 1: Numbered choices (1., 2., 3., etc.)
        numbered_choices = re.findall(r'^\s*\d+\.\s+(.+?)(?=^\s*\d+\.|$)', story, re.MULTILINE | re.DOTALL)
        for choice in numbered_choices:
            # Clean up the choice text
            clean_choice = choice.strip().split('\n')[0]
            if clean_choice and len(clean_choice) > 3:
                choices.append(clean_choice)
        
        # Pattern 2: Bullet points (*, -, •)
        if not choices:
            bullet_choices = re.findall(r'^\s*[*\-•]\s+(.+?)(?=^\s*[*\-•]|$)', story, re.MULTILINE | re.DOTALL)
            for choice in bullet_choices:
                clean_choice = choice.strip().split('\n')[0]
                if clean_choice and len(clean_choice) > 3:
                    choices.append(clean_choice)
        
        # Pattern 3: Lines after "What do you do?" or similar
        if not choices:
            what_do = re.search(r'What do you (?:do|choose)\?(.+?)(?:$|The End)', story, re.IGNORECASE | re.DOTALL)
            if what_do:
                remaining = what_do.group(1)
                # Look for any list-like structure
                potential_choices = re.findall(r'[A-Z][^.!?]*[.!?]', remaining)
                choices = [c.strip() for c in potential_choices if len(c.strip()) > 5][:3]
        
        # Limit to 3 choices max
        return choices[:3]


class ImageGenerationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        prompt = request.data.get('prompt', None)
        if prompt is None:
            return Response({'error': 'Prompt is required'}, status=400)

        comfyui_server = "http://127.0.0.1:8188"
        
        try:
            # Enhanced prompt engineering for better image generation
            enhanced_prompt = self._enhance_prompt(prompt)
            
            # Build ComfyUI workflow with KSampler and basic nodes
            workflow = {
                "1": {
                    "inputs": {
                        "ckpt_name": "sd15.safetensors"
                    },
                    "class_type": "CheckpointLoaderSimple",
                    "_meta": {"title": "Load Checkpoint"}
                },
                "2": {
                    "inputs": {
                        "text": enhanced_prompt,
                        "clip": ["1", 1]
                    },
                    "class_type": "CLIPTextEncode",
                    "_meta": {"title": "CLIP Text Encode (Positive)"}
                },
                "3": {
                    "inputs": {
                        "text": "blurry, low quality, distorted, ugly, bad proportions, deformed, disfigured, amateur, watermark, text, logo",
                        "clip": ["1", 1]
                    },
                    "class_type": "CLIPTextEncode",
                    "_meta": {"title": "CLIP Text Encode (Negative)"}
                },
                "4": {
                    "inputs": {
                        "seed": hash(enhanced_prompt) % 2147483647,
                        "steps": 30,
                        "cfg": 8.5,
                        "sampler_name": "dpmpp_2m",
                        "scheduler": "karras",
                        "denoise": 1.0,
                        "model": ["1", 0],
                        "positive": ["2", 0],
                        "negative": ["3", 0],
                        "latent_image": ["5", 0]
                    },
                    "class_type": "KSampler",
                    "_meta": {"title": "KSampler"}
                },
                "5": {
                    "inputs": {
                        "width": 768,
                        "height": 512,
                        "batch_size": 1
                    },
                    "class_type": "EmptyLatentImage",
                    "_meta": {"title": "Empty Latent Image"}
                },
                "6": {
                    "inputs": {
                        "samples": ["4", 0],
                        "vae": ["1", 2]
                    },
                    "class_type": "VAEDecode",
                    "_meta": {"title": "VAE Decode"}
                },
                "7": {
                    "inputs": {
                        "images": ["6", 0],
                        "filename_prefix": "adventure_scene"
                    },
                    "class_type": "SaveImage",
                    "_meta": {"title": "Save Image"}
                }
            }
            
            response = requests.post(
                f"{comfyui_server}/prompt",
                json={"prompt": workflow},
                timeout=300
            )
            
            if response.status_code != 200:
                return Response({'error': f'ComfyUI error: {response.text}'}, status=400)
            
            result = response.json()
            prompt_id = result.get('prompt_id')
            
            if not prompt_id:
                return Response({'error': 'No prompt_id returned from ComfyUI'}, status=400)
            
            import time
            max_retries = 120
            retry_count = 0
            
            while retry_count < max_retries:
                history_response = requests.get(f"{comfyui_server}/history/{prompt_id}")
                
                if history_response.status_code == 200:
                    history = history_response.json()
                    if prompt_id in history and "outputs" in history[prompt_id]:
                        outputs = history[prompt_id]["outputs"]
                        for node_output in outputs.values():
                            if "images" in node_output:
                                image_info = node_output["images"][0]
                                image_filename = image_info["filename"]
                                
                                image_url = f"{comfyui_server}/view?filename={image_filename}"
                                image_data = urlopen(image_url).read()
                                image_file_name = f"{now().strftime('%Y%m%d%H%M%S')}.png"
                                image_file = ContentFile(image_data, name=image_file_name)
                                
                                generated_image = GeneratedImage.objects.create(
                                    user=request.user,
                                    prompt=prompt,
                                    image=image_file
                                )
                                
                                return Response({
                                    'image_url': request.build_absolute_uri(settings.MEDIA_URL + str(generated_image.image))
                                }, status=200)
                
                retry_count += 1
                time.sleep(0.5)
            
            return Response({'error': 'ComfyUI generation timeout'}, status=500)
            
        except Exception as e:
            return Response({'error': f'Error: {str(e)}'}, status=500)

    def _enhance_prompt(self, raw_prompt):
        """
        Enhance raw story prompt to create better image descriptions.
        Transforms vague story segments into detailed visual scenes.
        """
        # Remove dialogue and focus on scene description
        import re
        
        # Remove quoted dialogue
        scene = re.sub(r'"[^"]*"', '', raw_prompt)
        scene = re.sub(r"'[^']*'", '', scene)
        
        # Extract action/scene elements
        scene = scene.strip()
        
        # Build structured prompt with quality indicators
        enhanced = (
            f"{scene}, "
            "detailed fantasy art, "
            "cinematic lighting, "
            "dramatic atmosphere, "
            "high quality, "
            "professional illustration, "
            "coherent composition, "
            "vibrant colors, "
            "sharp focus, "
            "intricate details, "
            "fantasy adventure game art style, "
            "immersive environment, "
            "atmospheric perspective"
        )
        
        return enhanced

# Combining decorators for function-based views
@method_decorator(csrf_exempt, name='dispatch')
class IsLoggedInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        auth_backend = MyAuthBackend()
        is_logged_in = auth_backend.is_logged_in(request)
        return JsonResponse({'is_logged_in': is_logged_in})


class HistoryView(ListAPIView):
    serializer_class = ChoiceResponseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChoiceResponse.objects.filter(user=self.request.user)
