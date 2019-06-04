from django.test import TestCase

import datetime as dt

# from budgeting.models import CustomUser
# from budgeting.models import CategoryList
# from budgeting.models import SupportItem
# from budgeting.models import Plan
# from budgeting.models import Budgeting
# from budgeting.models import Goal
from backend.ndis_calculator.budgeting.models import *


# from backend.ndis_calculator.budgeting.models import Goal


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
    def create_Goal(description="A Set of description Text"):
        return Goal.objects.create(description=description)

    def test_Goal(self):
        g = self.create_Goal()
        self.assertTrue(isinstance(g, Goal))


class CategoryTest(TestCase):
    @staticmethod
    def create_Goal(description="to be a web developer"):
        return Goal.objects.create(description=description)

    def test_Goal(self):
        goal = self.create_Goal()
        self.assertTrue(isinstance(goal, Goal))


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


class PlanTest(TestCase):
    @staticmethod
    def create_Plan(start_time=dt.date(year=2018, month=6, day=1),
                    end_time=dt.date(year=2019, month=6, day=1),
                    participant=CustomUserTest.create_CustomUser(),
                    goals=GoalTest.create_Goal(),
                    categories=CategoryListTest.create_Category(),
                    support_items=SupportItemListTest.create_SupportItem()
                    ):
        obj = Plan.objects.create(start_time=start_time,
                                  end_time=end_time,
                                  participant=participant,
                                  goals=goals,
                                  categories=categories,
                                  support_items=support_items
                                  )
        return obj

    def test_Plan(self):
        p = self.create_Plan()
        self.assertTrue(isinstance(p, Plan))


class PlanContainsCategoriesTest(TestCase):
    @staticmethod
    def create_PlanContainsCategories(plan=PlanTest.create_Plan(),
                                      category=CategoryListTest.create_Category(),
                                      amount=10000.50):
        return PlanContainsCategories.objects.create(plan=plan,
                                                     category=category,
                                                     amount=amount
                                                     )

    def test_PlanContainsCategories(self):
        pContainsCat = self.create_PlanContainsCategories()
        self.assertTrue(isinstance(pContainsCat, PlanContainsCategories))


class PlanContainsItemsTest(TestCase):
    @staticmethod
    def create_PlanContainsItems(plan=PlanTest.create_Plan(),
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

    def test_PlanContainsItems(self):
        pContainsItems = self.create_PlanContainsItems()
        self.assertTrue(isinstance(pContainsItems, PlanContainsItems))
