from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from budgeting.models import Participant
from django.contrib.auth.hashers import check_password
import datetime
import json
from budgeting.models import *

URL_AUTH_REGISTER = reverse('auth_register')
URL_AUTH_LOGIN = reverse('auth_login')
URL_AUTH_REFRESH = reverse('auth_refresh')
URL_PARTICIPANT_ID = reverse('participant_id')

STUB_PARTICIPANT_DATA = {
    "email": "example@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Smith",
    "postcode": '3000',
    "birthYear": 2019
}


class AuthenticationApiTests(APITestCase):
    # refresh = ''

    def setUp(self):
        # What does the below do?
        super(AuthenticationApiTests, self).setUp()

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
        return self.client.post(URL_AUTH_REGISTER, STUB_PARTICIPANT_DATA, format='json')

    def create_participant(self, participant_data):
        return self.client.post(URL_AUTH_REGISTER, participant_data, format='json')

    def assert_equal_participant(self, participant_data, participant):
        participant = participant.__dict__
        for key in participant_data:
            if key == 'password':
                # doesn't get checked due to serializer
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

        self.assert_equal_participant(STUB_PARTICIPANT_DATA, participant)

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
            "username": STUB_PARTICIPANT_DATA['email'],
            "password": STUB_PARTICIPANT_DATA['password'],
        }
        response = self.client.post(URL_AUTH_LOGIN, data, format='json')
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

        response = self.client.post(URL_AUTH_REFRESH, data, format='json')
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
                **STUB_PARTICIPANT_DATA,
                'email': 'invalid@a'
            }

            response = self.create_participant(user_data)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assert_participant_not_created(code)

    def test_register_missing_fields(self):
        def code():
            for key in STUB_PARTICIPANT_DATA:
                participant_data = {
                    **STUB_PARTICIPANT_DATA,
                    key: ""
                }

                response = self.create_participant(participant_data)
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assert_participant_not_created(code)

    def test_register_invalid_birth_year(self):
        def too_low():
            participant_data = {
                **STUB_PARTICIPANT_DATA,
                'birth_year': 1799
            }

            response = self.create_participant(participant_data)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assert_participant_not_created(too_low)

        def too_high():
            participant_data = {
                **STUB_PARTICIPANT_DATA,
                'birth_year': datetime.datetime.now().year + 1
            }

            response = self.create_participant(participant_data)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assert_participant_not_created(too_high)


class ParticipantApiTests(APITestCase):
    access = ''

    def setUp(self):
        super(ParticipantApiTests, self).setUp()
        # url = reverse('auth_register')
        # STUB_PARTICIPANT_DATA = {
        #         "email": "ayaya@azurlane.com",
        #         "firstName": "IJN",
        #         "lastName": "Ayanami",
        #         "password": "DD45",
        #         "postcode": 3000,
        #         "birthYear": 1945
        #     }
        # response = self.client.post(url, data, format='json')
        #
        # url = reverse('auth_login')
        # data = {
        #         "username": "ayaya@azurlane.com",
        #         "password": "DD45",
        #     }
        # response = self.client.post(url, data, format='json')
        # self.__class__.access = response.json()['access']

    def test_participant_id(self):
        """
        Ensure we can get current participant's details.
        """
        response = self.client.post(URL_AUTH_REGISTER, STUB_PARTICIPANT_DATA, format='json')

        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + response.data['tokens']['access'])
        participant_data = {
            'id': response.data['id'],
            **STUB_PARTICIPANT_DATA

        }
        participant_data.pop('password')
        response = self.client.get(URL_PARTICIPANT_ID, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # render to camelCase JSON for easier comparison
        response.render()

        self.assertEqual(participant_data, json.loads(response.content))


class SupportGroupTests(APITestCase):

    def setUp(self):
        self.URL_SUPPORT_GROUP_LIST = reverse('support_group_list')

    def test_support_group_list(self):
        response = self.client.get(self.URL_SUPPORT_GROUP_LIST)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for support_group in response.data:
            # print(support_group)
            for support_category in support_group['support_categories']:
                self.assertIn('id', support_category)
                self.assertIn('name', support_category)


class SupportItemTests(APITestCase):
    fixtures = ['registration_group.json', 'support_group.json', 'support_category.json', 'support_item.json']

    def setUp(self):
        self.URL_SUPPORT_ITEMS_LIST = reverse('support_items_list')
        self.POSTCODE_RANGE = (200, 9999)
        self.REGISTRATION_GROUP_ID_RANGE = (8, 43)
        self.SUPPORT_CATEGORY_ID_RANGE = (3, 17)

    def get_support_item_list(self, birth_year, postcode, registration_group, support_category):
        return self.client.get(self.URL_SUPPORT_ITEMS_LIST + f'?birth-year={birth_year}&postcode={postcode}&registration-group-id={registration_group}&support-category-id={support_category}')

    def test_support_item_list(self):
        response = self.client.get(self.URL_SUPPORT_ITEMS_LIST + '?birth-year=1996&postcode=3051&registration-group-id=22&support-category-id=5')
        for item in response.data:
            test = SupportItem.objects.get(id=item['id'])
            self.assertEqual(test.support_category.id, 5)
            self.assertEqual(test.registration_group.id, 22)
            if test.price_ACT_NSW_QLD_VIC is not None:
                self.assertEqual(float(item['price']), test.price_ACT_NSW_QLD_VIC)
            else:
                self.assertEqual(float(item['price']), test.price_national)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

#Needs updating after adding information in database
class CreatePlanItem(APITestCase):
    fixtures = ['registration_group.json', 'support_group.json', 'support_category.json', 'support_item.json']

    def setUp(self):
        self.URL_CREATE_PLAN_ITEM = "http://localhost:8000/api/v1/participants/0/plan-goals/0/plan-categories/0/plan-items"
        self.TEST_DATA={"supportItemID": 144,"price": 120.22,"number": 1}

    def test_create_plan_item(self):
        response = self.client.post(self.URL_CREATE_PLAN_ITEM,self.TEST_DATA)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)