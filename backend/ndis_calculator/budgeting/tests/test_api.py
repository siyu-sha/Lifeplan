import datetime
import json

from budgeting.models import (
    Participant,
    Plan,
    PlanCategory,
    PlanItem,
    RegistrationGroup,
    SupportCategory,
    SupportGroup,
    SupportItem,
    SupportItemGroup,
)
from django.contrib.auth.hashers import check_password
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

URL_AUTH_REGISTER = reverse("auth_register")
URL_AUTH_LOGIN = reverse("auth_login")
URL_AUTH_REFRESH = reverse("auth_refresh")
URL_PARTICIPANT_CURRENT_USER = reverse("participant_current_user")

STUB_PARTICIPANT_DATA = {
    "email": "example@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Smith",
    "postcode": "3000",
    "birthYear": 2019,
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
        return self.client.post(
            URL_AUTH_REGISTER, STUB_PARTICIPANT_DATA, format="json"
        )

    def create_participant(self, participant_data):
        return self.client.post(
            URL_AUTH_REGISTER, participant_data, format="json"
        )

    def assert_equal_participant(self, participant_data, participant):
        participant = participant.__dict__
        for key in participant_data:
            if key == "password":
                # doesn't get checked due to serializer
                self.assertTrue(
                    check_password(participant_data[key], participant[key])
                )
            elif key == "firstName":
                self.assertEqual(
                    participant_data[key], participant["first_name"]
                )
            elif key == "lastName":
                self.assertEqual(
                    participant_data[key], participant["last_name"]
                )
            elif key == "birthYear":
                self.assertEqual(
                    participant_data[key], participant["birth_year"]
                )
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
        self.assertIn("tokens", response.data)
        participant = Participant.objects.get(id=response.data["id"])

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
            "username": STUB_PARTICIPANT_DATA["email"],
            "password": STUB_PARTICIPANT_DATA["password"],
        }
        response = self.client.post(URL_AUTH_LOGIN, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("refresh", response.data)
        self.assertIn("access", response.data)

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

        data = {"refresh": response.data["tokens"]["refresh"]}

        response = self.client.post(URL_AUTH_REFRESH, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_register_existing_email(self):
        self.create_stub_participant()

        def code():
            response = self.create_stub_participant()

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assert_participant_not_created(code)

    def test_register_invalid_email(self):
        def code():
            user_data = {**STUB_PARTICIPANT_DATA, "email": "invalid@a"}

            response = self.create_participant(user_data)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assert_participant_not_created(code)

    def test_register_missing_fields(self):
        def code():
            for key in STUB_PARTICIPANT_DATA:
                participant_data = {**STUB_PARTICIPANT_DATA, key: ""}

                response = self.create_participant(participant_data)
                self.assertEqual(
                    response.status_code, status.HTTP_400_BAD_REQUEST
                )

        self.assert_participant_not_created(code)

    def test_register_invalid_birth_year(self):
        def too_low():
            participant_data = {**STUB_PARTICIPANT_DATA, "birth_year": 1799}

            response = self.create_participant(participant_data)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assert_participant_not_created(too_low)

        def too_high():
            participant_data = {
                **STUB_PARTICIPANT_DATA,
                "birth_year": datetime.datetime.now().year + 1,
            }

            response = self.create_participant(participant_data)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assert_participant_not_created(too_high)


class ParticipantApiTests(APITestCase):
    access = ""

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

    def test_participant_current_user(self):
        """
        Ensure we can get current participant's details.
        """
        response = self.client.post(
            URL_AUTH_REGISTER, STUB_PARTICIPANT_DATA, format="json"
        )

        self.client.credentials(
            HTTP_AUTHORIZATION="Bearer " + response.data["tokens"]["access"]
        )
        participant_data = {"id": response.data["id"], **STUB_PARTICIPANT_DATA}
        participant_data.pop("password")
        response = self.client.get(URL_PARTICIPANT_CURRENT_USER, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # render to camelCase JSON for easier comparison
        response.render()

        self.assertEqual(participant_data, json.loads(response.content))


class SupportGroupTests(APITestCase):
    def setUp(self):
        self.URL_SUPPORT_GROUP_LIST = reverse("support_group_list")

    def test_support_group_list(self):
        response = self.client.get(self.URL_SUPPORT_GROUP_LIST)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for support_group in response.data:
            for support_category in support_group["support_categories"]:
                self.assertIn("id", support_category)
                self.assertIn("name", support_category)


class SupportItemTests(APITestCase):
    fixtures = [
        "registration_group.json",
        "support_group.json",
        "support_category.json",
        "support_item.json",
        "support_item_group.json",
    ]

    def setUp(self):
        self.URL_SUPPORT_ITEMS_LIST = reverse("support_items_list")
        self.POSTCODE_RANGE = (200, 9999)
        self.REGISTRATION_GROUP_ID_RANGE = (8, 43)
        self.SUPPORT_CATEGORY_ID_RANGE = (3, 17)

    def get_support_item_list(
        self, birth_year, postcode, registration_group, support_category
    ):
        return self.client.get(
            self.URL_SUPPORT_ITEMS_LIST
            + f"?birth-year={birth_year}&postcode={postcode}&registration-group-id={registration_group}&support-category-id={support_category}"
        )

    def test_support_item_list(self):
        response = self.client.get(
            self.URL_SUPPORT_ITEMS_LIST
            + "?birth-year=1996&postcode=3051&registration-group-id=22&support-category-id=5"
        )
        for item in response.data:
            test = SupportItem.objects.get(id=item["id"])
            self.assertEqual(test.support_category.id, 5)
            self.assertEqual(test.registration_group.id, 22)
            if test.price_ACT_NSW_QLD_VIC is not None:
                self.assertEqual(
                    float(item["price"]), test.price_ACT_NSW_QLD_VIC
                )
            else:
                self.assertEqual(float(item["price"]), test.price_national)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class SupportItemGroupTest(APITestCase):
    # Needs creation post-fixtures, #TODO
    def pointless_method_stub(self):
        return None


class CreatePlanItem(APITestCase):
    fixtures = [
        "registration_group.json",
        "support_group.json",
        "support_category.json",
        "support_item.json",
        "support_item_group.json",
    ]

    def setUp(self):
        self.URL_CREATE_PLAN_ITEM = reverse(
            "plan_item_create",
            kwargs={"participantID": 1, "planCategoryID": 1},
        )
        self.TEST_DATA = {
            "supportItemGroupID": 2,
            "price": 120.22,
            "number": 1,
        }

    def test_create_plan_item(self):
        if Participant.objects.filter(pk=1).__len__() == 0:
            Participant.objects.create(
                pk=1,
                email="1@qq.com",
                first_name="Red",
                last_name="Blue",
                postcode="1",
                birth_year=1996,
            )
        participant = Participant.objects.get(pk=1)
        if Plan.objects.filter(pk=1).__len__() == 0:
            Plan.objects.create(
                pk=1,
                participant=participant,
                start_date="2019-09-20",
                end_date="2020-09-20",
            )
        plan = Plan.objects.get(pk=1)
        if SupportItemGroup.objects.filter(pk=2).__len__() == 0:
            SupportItemGroup.objects.create(
                pk=2, name="group", base_item=SupportItem.objects.get(pk=144)
            )
        supportItemGroup = SupportItemGroup.objects.get(pk=2)
        supportCategory = SupportCategory.objects.get(pk=3)
        if PlanCategory.objects.filter(pk=1).__len__() == 0:
            PlanCategory.objects.create(
                pk=1, plan=plan, support_category=supportCategory, budget=4.0
            )
        planCategory = PlanCategory.objects.get(pk=1)
        test = PlanItem.objects.filter(
            plan_category=planCategory,
            support_item_group=supportItemGroup,
            quantity=1,
            price_actual=120.22,
        )
        len = test.__len__()
        self.client.post(self.URL_CREATE_PLAN_ITEM, self.TEST_DATA)
        test = PlanItem.objects.filter(
            plan_category=planCategory,
            support_item_group=supportItemGroup,
            quantity=1,
            price_actual=120.22,
        )
        self.assertEqual(len + 1, test.__len__())


class RegistrationGroupTests(APITestCase):
    def setUp(self):
        self.URL_REGISTRATION_GROUP_LIST = reverse("registration_group_list")

    def test_registration_group_list(self):
        response = self.client.get(self.URL_REGISTRATION_GROUP_LIST)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for registration_group in response.data:
            self.assertIn("id", registration_group)
            self.assertIn("number", registration_group)
            self.assertIn("name", registration_group)


class RetrivePlanItemsTests(APITestCase):
    # Needs creation post-fixtures, #TODO
    def pointless_method_stub(self):
        return None


""" This test needs updating due to the change of plan creating API
class CreatePlan(APITestCase):
    def setUp(self):
        self.URL_CREATE_PLAN = reverse("plan_create")
        self.TEST_DATA = {
            "participant_id": 1,
            "start_date": "2019-09-20",
            "end_date": "2020-09-20",
        }

    # may need improvement in the future
    def test_create_plan_item(self):
        if Participant.objects.filter(pk=1).__len__() == 0:
            Participant.objects.create(
                pk=1,
                email="1@qq.com",
                first_name="Red",
                last_name="Blue",
                postcode="1",
                birth_year=1996,
            )
        response = self.client.post(self.URL_CREATE_PLAN, self.TEST_DATA)
        par = Participant.objects.get(pk=1)
        test = Plan.objects.filter(
            participant=par,
            start_date="2019-09-20",
            end_date="2020-09-20",
            generated=False,
        )
        if test.__len__() == 1:
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        else:
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
"""


class DeletePlanItem(APITestCase):
    fixtures = [
        "registration_group.json",
        "support_group.json",
        "support_category.json",
        "support_item.json",
        "support_item_group.json",
    ]

    def setUp(self):
        self.URL_DELETE_PLAN_ITEM = reverse(
            "plan_item_delete", kwargs={"planCategoryId": 1}
        )
        self.TEST_DATA = {"planItemIdList": [100, 101]}

    def test_create_plan_item(self):
        if Participant.objects.filter(pk=1).__len__() == 0:
            Participant.objects.create(
                pk=1,
                email="1@qq.com",
                first_name="Red",
                last_name="Blue",
                postcode="1",
                birth_year=1996,
            )
        participant = Participant.objects.get(pk=1)
        if Plan.objects.filter(pk=1).__len__() == 0:
            Plan.objects.create(
                pk=1,
                participant=participant,
                start_date="2019-09-20",
                end_date="2020-09-20",
            )
        plan = Plan.objects.get(pk=1)
        if SupportItemGroup.objects.filter(pk=2).__len__() == 0:
            SupportItemGroup.objects.create(
                pk=2, name="group", base_item=SupportItem.objects.get(pk=144)
            )
        supportItemGroup = SupportItemGroup.objects.get(pk=2)
        supportCategory = SupportCategory.objects.get(pk=3)
        if PlanCategory.objects.filter(pk=1).__len__() == 0:
            PlanCategory.objects.create(
                pk=1, plan=plan, support_category=supportCategory, budget=4.0
            )
        planCategory = PlanCategory.objects.get(pk=1)
        if PlanItem.objects.filter(pk=100).__len__() == 0:
            PlanItem.objects.create(
                pk=100,
                plan_category=planCategory,
                support_item_group=supportItemGroup,
                quantity=1,
                price_actual=120.22,
            )
        if PlanItem.objects.filter(pk=101).__len__() == 0:
            PlanItem.objects.create(
                pk=101,
                plan_category=planCategory,
                support_item_group=supportItemGroup,
                quantity=2,
                price_actual=140.22,
            )
        result1 = (
            PlanItem.objects.filter(pk=100).__len__()
            + PlanItem.objects.filter(pk=101).__len__()
        )
        self.client.post(self.URL_DELETE_PLAN_ITEM, self.TEST_DATA)
        result2 = (
            PlanItem.objects.filter(pk=100).__len__()
            + PlanItem.objects.filter(pk=101).__len__()
        )
        self.assertEqual(result1 - 2, result2)
