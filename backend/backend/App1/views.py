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
from openai import OpenAI
import json
from django.utils.decorators import method_decorator
from django.contrib.auth.models import User
from .serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.generics import ListAPIView
from .serializers import ChoiceResponseSerializer
from diffusers import StableDiffusionPipeline
import torch
from django.core.files.base import ContentFile
from django.utils.timezone import now
import io
from .models import GeneratedImage
from django.conf import settings
from .serializers import GeneratedImageSerializer



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
        
        # Retrieve the user's previous choices from the database
        previous_choices = ChoiceResponse.objects.filter(user=request.user).values_list('choice', flat=True)
        
        prompt = "You find yourself in a dark forest. What do you do?"
        
        if user_choice is not None:
            template_str = """
            You are now the guide of a mystical journey in the Whispering Woods. 
            A traveler named seeks the lost Gem of Serenity. 
            You must navigate her through challenges, choices, and consequences, 
            dynamically adapting the tale based on the traveler's decisions. 
            Your goal is to create a branching narrative experience where each choice 
            leads to a new path, ultimately determining user's fate. 
            Here are some rules to follow:
            1. Start by asking the player to choose some kind of weapons that will be used later in the game
            2. Have a few paths that lead to success
            3. Have some paths that lead to death. If the user dies generate a response that explains the death and ends in the text: "The End.", I will search for this text to end the game

            Here is the chat history, use this to understand what to say next: {chat_history}
            Human: {human_input}
            AI:"""
            
            prompt += f"\nYou chose: {user_choice}\n"
            
            # Append the user's previous choices to the prompt
            for choice in previous_choices:
                prompt += f"Previously, you chose: {choice}\n"
            
            openai = OpenAI(api_key='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')
            
            # Generate story from OpenAI GPT-3.5 Turbo
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": template_str.format(chat_history=prompt, human_input=user_choice)}
                ],
                max_tokens=300
            )
            
            story = response.choices[0].message.content
            
            # Here you save the user's choice, the generated story, and the previous choices to the database
            ChoiceResponse.objects.create(
                user=request.user,
                choice=user_choice,
                response=story,
                previous_choices=','.join(previous_choices)
            )
            
            return Response({'success': True, 'story': story})
        else:
            return Response({'error': 'User choice is missing'}, status=status.HTTP_400_BAD_REQUEST)


class ImageGenerationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        prompt = request.data.get('prompt', None)
        if prompt is None:
            return Response({'error': 'Prompt is required'}, status=400)

        model_id = "runwayml/stable-diffusion-v1-5"
        pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
        pipe = pipe.to("cuda")

        image = pipe(prompt).images[0]

        # Save the generated image to a file
        image_file_name = f"{now().strftime('%Y%m%d%H%M%S')}.png"
        image_bytes = io.BytesIO()
        image.save(image_bytes, format='PNG')
        image_content = image_bytes.getvalue()
        image_file = ContentFile(image_content, name=image_file_name)

        # Create a new GeneratedImage object and save it to the database
        generated_image = GeneratedImage.objects.create(
            user=request.user,
            prompt=prompt,
            image=image_file
        )
        serializer = GeneratedImageSerializer(generated_image)
        return Response({'image_url': request.build_absolute_uri(settings.MEDIA_URL + str(generated_image.image))}, status=200)

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
