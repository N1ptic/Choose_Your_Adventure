import unittest
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .views import UserRegistrationView, LogoutView, HandleChoiceView, IsLoggedInView, HistoryView
import json
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class TestViews(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_user_registration_view(self):
        data = {
            'username': 'testuser1',
            'email': 'testuser1@example.com',
            'password': 'testpassword1'
        }
        response = self.client.post('/accounts/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_logout_view(self):
        response = self.client.post('/logout/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'message': 'Successfully logged out.'})

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

    def test_handle_choice_view(self):
        data = {
            'choice': 'test_choice'
        }
        response = self.client.post('/handle_choice', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('success', response.json())
        self.assertIn('story', response.json())

    def test_is_logged_in_view(self):
        # Test is_logged_in view
        response = self.client.post('/is_logged_in/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertIn('is_logged_in', response_data)


if __name__ == '__main__':
    unittest.main()
