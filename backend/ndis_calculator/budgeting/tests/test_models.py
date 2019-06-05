from django.test import TestCase

import datetime as dt

from budgeting.models import CustomUser
from budgeting.models import CategoryList
from budgeting.models import RegistrationGroup
from budgeting.models import SupportItemList
from budgeting.models import Plan
from budgeting.models import PlanContainsCategories
from budgeting.models import PlanContainsItems
from budgeting.models import Goal

class CustomUserTest(TestCase):
    @staticmethod
    def create_CustomUser(username="test",
                          first_name="John",
                          last_name="Smith",
                          password="password123",
                          email="John.Smith@test.com",
                          postcode="3000",
                          birth_year="1945",
                          ):
        if CustomUser.objects.filter(username="test").first():
            return CustomUser.objects.first()
        else:
            return CustomUser.objects.create(username=username,
                                             first_name=first_name,
                                             last_name=last_name,
                                             password=password,
                                             email=email,
                                             postcode=postcode,
                                             birth_year=birth_year,
                                             )

    def test_CustomUser(self):
        cu = self.create_CustomUser()
        self.assertTrue(isinstance(cu, CustomUser))
        # self.assertEqual() - assert any custom methods we create work


class GoalTest(TestCase):
    @staticmethod
    def create_Goal(description="To be a web developer"):
        return Goal.objects.create(description=description)

    def test_Goal(self):
        g = self.create_Goal()
        self.assertTrue(isinstance(g, Goal))


class CategoryListTest(TestCase):
    @staticmethod
    def create_Category(name="testCat", purpose="core"):
        return CategoryList.objects.create(name=name, purpose=purpose)

    def test_Category(self):
        cat = self.create_Category()
        self.assertTrue(isinstance(cat, CategoryList))


class RegistrationGroupTest(TestCase):
    @staticmethod
    def create_RegistrationGroup(code="123",
                                 name="testGroup",
                                 description="Rental of adapted vehicle",
                                 product_count=10,
                                 experience="working with people",
                                 professions="Social Worker; Welfare Worker"
                                 ):
        return RegistrationGroup.objects.create(code=code,
                                                name=name,
                                                description=description,
                                                product_count=product_count,
                                                experience=experience,
                                                professions=professions)

    def test_Category(self):
        rg = self.create_RegistrationGroup()
        self.assertTrue(isinstance(rg, RegistrationGroup))


class SupportItemListTest(TestCase):
    @staticmethod
    def create_SupportItem(ref_no=123,
                           name="item1",
                           is_labour=True,
                           unit_of_measurement="Hour",
                           price_limit=850.25,
                           outcome="home",
                           category=CategoryListTest.create_Category(),
                           registration_group=RegistrationGroupTest.create_RegistrationGroup()
                           ):
        return SupportItemList.objects.create(ref_no=ref_no,
                                              name=name,
                                              is_labour=is_labour,
                                              unit_of_measurement=unit_of_measurement,
                                              price_limit=price_limit,
                                              outcome=outcome,
                                              category=category,
                                              registration_group=registration_group
                                              )

    def test_SupportItem(self):
        si = self.create_SupportItem()
        self.assertTrue(isinstance(si, SupportItemList))

class PlanContainsCategoriesTest(TestCase):
    @staticmethod
    def create_PlanContainsCategories(plan,
                                      category=CategoryListTest.create_Category(),
                                      amount=10000.50):
        return PlanContainsCategories.objects.create(plan=plan,
                                                     category=category,
                                                     amount=amount
                                                     )


class PlanContainsItemsTest():
    @staticmethod
    def create_PlanContainsItems(plan,
                                 support_item=SupportItemListTest.create_SupportItem(),
                                 cost_per_unit=200.50,
                                 quantity=2,
                                 hours_weekday=10.50,
                                 hours_weekend=10.50,
                                 hours_holiday=0.00,
                                 hours_holiday_after_hours=2.50,
                                 goal=GoalTest.create_Goal()
                                 ):
        return PlanContainsItems.objects.create(plan=plan,
                                                support_item=support_item,
                                                cost_per_unit=cost_per_unit,
                                                quantity=quantity,
                                                hours_weekday=hours_weekday,
                                                hours_weekend=hours_weekend,
                                                hours_holiday=hours_holiday,
                                                hours_holiday_after_hours=hours_holiday_after_hours,
                                                goal=goal
                                                )

class PlanTest(TestCase):
    p = None
    def setUp(self) -> None:
        self.p = None
    def create_Plan(self,
                    start_date=dt.date(year=2018, month=6, day=1),
                    end_date=dt.date(year=2019, month=6, day=1),
                    participant=CustomUserTest.create_CustomUser(),
                    goals=GoalTest.create_Goal(),
                    ):
        obj = Plan.objects.create(start_date=start_date,
                                  end_date=end_date,
                                  participant=participant,
                                  goals=goals,
                                  )
        self.categories = PlanContainsCategoriesTest.create_PlanContainsCategories(plan=obj)
        self.items = PlanContainsItemsTest.create_PlanContainsItems(plan=obj)
        return obj

    def test_Plan(self):
        if self.p is None:
            self.p = self.create_Plan(self)
        self.assertTrue(isinstance(self.p, Plan))

    def test_PlanContainsItems(self):
        if self.p is None:
            self.p = self.create_Plan(self)
        self.assertTrue(isinstance(self.items, PlanContainsItems))

    def test_PlanContainsCategories(self):
        if self.p is None:
            self.p = self.create_Plan(self)
        self.assertTrue(isinstance(self.categories, PlanContainsCategories))