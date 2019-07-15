from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from budgeting.models import Participant


class AuthenticationApiTests(APITestCase):
    refresh = ''

    def setUp(self):
        super(AuthenticationApiTests, self).setUp()
        url = reverse('auth_register')
        data = {
                "email": "ayaya@azurlane.com",
                "firstName": "IJN",
                "lastName": "Ayanami",
                "password": "DD45",
                "postcode": 3000,
                "birthYear": 1945
            }
        response = self.client.post(url, data, format='json')

    def test_register(self):
        """
        Ensure we can register a new user.
        """
        url = reverse('auth_register')
        data = {
                "email": "ayaya@azurlane.com",
                "firstName": "IJN",
                "lastName": "Ayanami",
                "password": "DD45",
                "postcode": 3000,
                "birthYear": 1945
            }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Participant.objects.count(), 1)
        self.assertEqual(Participant.objects.get().email, 'ayaya@azurlane.com')

    def test_login(self):
        """
        Ensure we can login.
        """
        url = reverse('auth_login')
        data = {
                "username": "ayaya@azurlane.com",
                "password": "DD45",
            }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.__class__.refresh = response.json()['refresh']

    def test_refresh(self):
        """
        Ensure we can refresh expired access tokens.
        """
        url = reverse('auth_refresh')
        data = {
                "refresh": self.__class__.refresh
            }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ParticipantApiTests(APITestCase):
    access = ''

    def setUp(self):
        super(ParticipantApiTests, self).setUp()
        url = reverse('auth_register')
        data = {
                "email": "ayaya@azurlane.com",
                "firstName": "IJN",
                "lastName": "Ayanami",
                "password": "DD45",
                "postcode": 3000,
                "birthYear": 1945
            }
        response = self.client.post(url, data, format='json')

        url = reverse('auth_login')
        data = {
                "username": "ayaya@azurlane.com",
                "password": "DD45",
            }
        response = self.client.post(url, data, format='json')
        self.__class__.access = response.json()['access']

    def test_participant_id(self):
        """
        Ensure we can get current participant's details.
        """
        url = reverse('participant_id')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.__class__.access)
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
                'email': 'ayaya@azurlane.com',
                'first_name': 'IJN',
                'last_name': 'Ayanami',
                'postcode': 3000,
                'birth_year': 1945,
                'id': 4
            })
