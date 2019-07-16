from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from budgeting.models import Participant
from django.contrib.auth.hashers import check_password
import datetime




class AuthenticationApiTests(APITestCase):
    # refresh = ''

    def setUp(self):
        # What does the below do?
        super(AuthenticationApiTests, self).setUp()
        self.stub_participant_data = {
            "email": "example@example.com",
            "password": "password123",
            "firstName": "John",
            "lastName": "Smith",
            "postcode": 3000,
            "birthYear": 2019
        }

        self.url_auth_register = reverse('auth_register')
        self.url_auth_login = reverse('auth_login')
        self.url_auth_refresh = reverse('auth_refresh')

    # def setUp(self):
    #     return
        # super(AuthenticationApiTests, self).setUp()
        # url = reverse('auth_register')
        # data = {
        #         "email": "ayaya@azurlane.com",
        #         "firstName": "IJN",
        #         "lastName": "Ayanami",
        #         "password": "DD45",
        #         "postcode": 3000,
        #         "birthYear": 1945
        #     }
        # response = self.client.post(url, data, format='json')

    def create_stub_participant(self):
        return self.client.post(self.url_auth_register, self.stub_participant_data, format='json')

    def create_participant(self, participant_data):
        return self.client.post(self.url_auth_register, participant_data, format='json')

    def assert_equal_participant(self, participant_data, participant):
        participant = participant.__dict__
        for key in participant_data:
            if key == 'password':
                self.assertTrue(check_password(participant_data[key], participant[key]))
            elif key == 'firstName':
                self.assertEqual(participant_data[key], participant["first_name"])
            elif key == 'lastName':
                self.assertEqual(participant_data[key], participant["last_name"])
            elif key == 'birthYear':
                self.assertEqual(participant_data[key], participant["birth_year"])
            else:
                self.assertEqual(participant_data[key], participant[key])

    def assert_participant_not_created(self, function):
        participant_count_before = Participant.objects.count()

        function()

        participant_count_after = Participant.objects.count()

        self.assertEqual(participant_count_before, participant_count_after)

    def test_register(self):
        """
        Ensure we can register a new user.
        """
        # url = reverse('auth_register')
        # data = {
        #         "email": "ayaya@azurlane.com",
        #         "firstName": "IJN",
        #         "lastName": "Ayanami",
        #         "password": "DD45",
        #         "postcode": 3000,
        #         "birthYear": 1945
        #     }
        # response = self.client.post(url, data, format='json')
        # self.assertEqual(response.status_code, status.HTTP_200_OK)
        # self.assertEqual(Participant.objects.count(), 1)
        # self.assertEqual(Participant.objects.get().email, 'ayaya@azurlane.com')

        response = self.create_stub_participant()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        participant = Participant.objects.get(id=response.data['id'])

        self.assert_equal_participant(self.stub_participant_data, participant)


    def test_login(self):
        """
        Ensure we can login.
        """
        # url = reverse('auth_login')
        # data = {
        #         "username": "ayaya@azurlane.com",
        #         "password": "DD45",
        #     }
        # response = self.client.post(url, data, format='json')
        # self.assertEqual(response.status_code, status.HTTP_200_OK)
        # self.__class__.refresh = response.json()['refresh']

        self.create_stub_participant()

        data = {
            "username": self.stub_participant_data['email'],
            "password": self.stub_participant_data['password'],
        }
        response = self.client.post(self.url_auth_login, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('refresh', response.data)
        self.assertIn('access', response.data)

        # self.__class__.refresh = response.json()['refresh']

    def test_refresh(self):
        """
        Ensure we can refresh expired access tokens.
        """
        # url = reverse('auth_refresh')
        # data = {
        #         "refresh": self.__class__.refresh
        #     }
        # response = self.client.post(url, data, format='json')
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.create_stub_participant()

        data = {
            "refresh": response.data['tokens']['refresh']
        }

        response = self.client.post(self.url_auth_refresh, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_register_existing_email(self):
        self.create_stub_participant()

        def code():
            response = self.create_stub_participant()

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assert_participant_not_created(code)

    def test_register_invalid_email(self):
        def code():
            user_data = {
                **self.stub_participant_data,
                'email': 'invalid@a'
            }

            response = self.create_participant(user_data)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assert_participant_not_created(code)

    def test_register_missing_fields(self):
        def code():
            for key in self.stub_participant_data:
                participant_data = {
                    **self.stub_participant_data,
                    key: ""
                }

                response = self.create_participant(participant_data)
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assert_participant_not_created(code)

    def test_register_invalid_birth_year(self):
        def too_low():
            participant_data = {
                **self.stub_participant_data,
                'birth_year': 1799
            }

            response = self.create_participant(participant_data)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assert_participant_not_created(too_low)

        def too_high():
            participant_data = {
                **self.stub_participant_data,
                'birth_year': datetime.datetime.now().year + 1
            }

            response = self.create_participant(participant_data)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assert_participant_not_created(too_high)


# class ParticipantApiTests(APITestCase):
#     access = ''
#
#     def setUp(self):
#         super(ParticipantApiTests, self).setUp()
#         url = reverse('auth_register')
#         data = {
#                 "email": "ayaya@azurlane.com",
#                 "firstName": "IJN",
#                 "lastName": "Ayanami",
#                 "password": "DD45",
#                 "postcode": 3000,
#                 "birthYear": 1945
#             }
#         response = self.client.post(url, data, format='json')
#
#         url = reverse('auth_login')
#         data = {
#                 "username": "ayaya@azurlane.com",
#                 "password": "DD45",
#             }
#         response = self.client.post(url, data, format='json')
#         self.__class__.access = response.json()['access']
#
#     def test_participant_id(self):
#         """
#         Ensure we can get current participant's details.
#         """
#         url = reverse('participant_id')
#         self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.__class__.access)
#         response = self.client.get(url, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data, {
#                 'email': 'ayaya@azurlane.com',
#                 'first_name': 'IJN',
#                 'last_name': 'Ayanami',
#                 'postcode': 3000,
#                 'birth_year': 1945,
#                 'id': 4
#             })
