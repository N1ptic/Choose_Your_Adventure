from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import ChoiceResponse
from .models import GeneratedImage

class GeneratedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedImage
        fields = ['id', 'user', 'prompt', 'image', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    class Meta:
        model = User
        fields = ('username', 'password', 'email')  # You can include more fields as needed


class MyTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    # You can add more fields if needed

    def validate(self, attrs):
        # Use the authenticate method to validate the username and password
        user = authenticate(username=attrs.get('username'), password=attrs.get('password'))
        if user:
            # If authentication is successful, include the user in validated_data
            data = super().validate(attrs)
            data['user'] = user
            return data
        else:
            # If authentication fails, raise a validation error
            raise serializers.ValidationError('Unable to log in with provided credentials.')


class ChoiceResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChoiceResponse
        fields = ['choice', 'response', 'created_at']  # Assuming you have a 'created_at' field
