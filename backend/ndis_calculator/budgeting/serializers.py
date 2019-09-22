from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from .models import (
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


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = (
            "id",
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "birth_year",
            "postcode",
        )
        read_only_fields = ("id",)
        extra_kwargs = {
            "username": {"write_only": True},
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        """
        Create and return a new `User` instance, given the validated data.
        """
        user = Participant.objects.create(
            username=validated_data["email"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            password=make_password(validated_data["password"]),
            postcode=validated_data["postcode"],
            birth_year=validated_data["birth_year"],
        )
        return user


class PlanSerializer(serializers.ModelSerializer):
    participant = serializers.ReadOnlyField(source="participant.id")
    plan_categories = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True
    )

    class Meta:
        model = Plan
        fields = "__all__"


class PlanCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanCategory
        fields = "__all__"


class PlanItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanItem
        fields = "__all__"


class SupportCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportCategory
        fields = ["id", "name"]


class SupportGroupSerializer(serializers.ModelSerializer):
    support_categories = SupportCategorySerializer(many=True, read_only=True)

    class Meta:
        model = SupportGroup
        fields = ["id", "name", "support_categories"]


class SupportItemGroupSerializer(serializers.ModelSerializer):
    EACH = "EA"
    HOUR = "H"
    DAY = "D"
    WEEK = "WK"
    MONTH = "MON"
    YEAR = "YR"

    UNIT_CHOICES = [
        (EACH, "each"),
        (HOUR, "hour"),
        (DAY, "day"),
        (WEEK, "week"),
        (MONTH, "month"),
        (YEAR, "year"),
    ]
    unit = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    # in methods in case of any changes need to be made
    # (e.g. rounding prices/formatting)
    def get_unit(self, obj):
        return obj.unit()

    def get_price(self, obj):
        return obj.price()

    def get_description(self, obj):
        return obj.description()

    class Meta:
        model = SupportItemGroup
        fields = ["id", "name", "unit", "price", "description"]


class SupportItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportItem
        fields = "__all__"


class RegistrationGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationGroup
        fields = ["id", "number", "name"]
