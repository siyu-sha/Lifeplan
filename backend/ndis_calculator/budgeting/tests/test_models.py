from django.test import TestCase

import datetime as dt

from budgeting.models import CustomUser
from budgeting.models import Category
from budgeting.models import SupportItem
from budgeting.models import Plan
from budgeting.models import Budgeting
from budgeting.models import Goal


class CustomUserTest(TestCase):
    @staticmethod
    def create_CustomUser(username="test",
                          first_name="John",
                          last_name="Smith",
                          password="password123",
                          email="John.Smith@test.com",
                          address="123 Fake St",
                          # second of January, 2000
                          birthday=dt.date(year=2000, month=1, day=2),
                          ):
        if CustomUser.objects.filter(username="test").first():
            return CustomUser.objects.first()
        else:
            return CustomUser.objects.create(username=username,
                                             first_name=first_name,
                                             last_name=last_name,
                                             password=password,
                                             email=email,
                                             address=address,
                                             birthday=birthday,
                                             )

    def test_CustomUser(self):
        cu = self.create_CustomUser()
        self.assertTrue(isinstance(cu, CustomUser))
        # self.assertEqual() - assert any custom methods we create work


class CategoryTest(TestCase):
    @staticmethod
    def create_Category(name="testCat"):
        return Category.objects.create(name=name)

    def test_Category(self):
        cat = self.create_Category()
        self.assertTrue(isinstance(cat, Category))


class SupportItemTest(TestCase):
    @staticmethod
    def create_SupportItem(name="item1",
                           description="description goes here",
                           cost=2.20,
                           category=CategoryTest.create_Category()):
        return SupportItem.objects.create(name=name,
                                          description=description,
                                          cost=cost,
                                          category=category,
                                          )

    def test_SupportItem(self):
        si = self.create_SupportItem()
        self.assertTrue(isinstance(si, SupportItem))


class PlanTest(TestCase):
    @staticmethod
    def create_Plan(start_time=dt.date(year=2018, month=6, day=1),
                    end_time=dt.date(year=2019, month=6, day=1),
                    total_funds=100,
                    customer=CustomUserTest.create_CustomUser(),
                    ):
        obj = Plan.objects.create(start_time=start_time,
                                  end_time=end_time,
                                  total_funds=total_funds,
                                  customer=customer,
                                  )
        Budgeting.objects.create(plan=obj,
                                 item=SupportItemTest.create_SupportItem(),
                                 num_item=1,
                                 cost_per_unit=1,
                                 weekday_7_7=1.0,
                                 after_hour_weekend=1.0,
                                 holiday_7_7=1.0,
                                 holiday_after_hour=1.0, )
        return obj

    def test_Plan(self):
        p = self.create_Plan()
        self.assertTrue(isinstance(p, Plan))


class BudgetingTest(TestCase):
    @staticmethod
    def create_Budgeting(plan=PlanTest.create_Plan(),
                         item=SupportItemTest.create_SupportItem(),
                         num_item=1,
                         cost_per_unit=1,
                         weekday_7_7=1.0,
                         after_hour_weekend=1.0,
                         holiday_7_7=1.0,
                         holiday_after_hour=1.0,
                         ):
        return Budgeting.objects.create(plan=plan,
                                        item=item,
                                        num_item=num_item,
                                        cost_per_unit=cost_per_unit,
                                        weekday_7_7=weekday_7_7,
                                        after_hour_weekend=after_hour_weekend,
                                        holiday_7_7=holiday_7_7,
                                        holiday_after_hour=holiday_after_hour,
                                        )

    def test_Budgeting(self):
        b = self.create_Budgeting()
        self.assertTrue(isinstance(b, Budgeting))


class GoalTest(TestCase):
    @staticmethod
    def create_Goal(type="ABC",
                    description="A Set of description Text",
                    how_to_achieve="Somehow",
                    how_to_support="Somehow Support",
                    customer=CustomUserTest.create_CustomUser(),
                    ):
        return Goal.objects.create(type=type,
                                   description=description,
                                   how_to_achieve=how_to_achieve,
                                   how_to_support=how_to_support,
                                   customer=customer,
                                   )

    def test_Goal(self):
        g = self.create_Goal()
        self.assertTrue(isinstance(g, Goal))
