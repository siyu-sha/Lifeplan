from budgeting.models import *
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator


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


# class ParticipantSerializer(serializers.Serializer):
#     username = serializers.CharField(write_only=True)
#     email = serializers.EmailField()
#     first_name = serializers.CharField()
#     last_name = serializers.CharField()
#     password = serializers.CharField(write_only=True)
#     postcode = serializers.IntegerField()
#     birth_year = serializers.IntegerField()
#
#     def create(self, validated_data):
#         """
#         Create and return a new `Participant` instance, given the validated data.
#         """
#         user = Participant.objects.create(
#                 username=validated_data['username'],
#                 email=validated_data['email'],
#                 first_name=validated_data['first_name'],
#                 last_name=validated_data['last_name'],
#                 password=make_password(validated_data['password']),
#                 postcode=validated_data['postcode'],
#                 birth_year=validated_data['birth_year']
#         )
#         return user
#
#     def update(self, instance, validated_data):
#         """
#         Update and return an existing `Participant` instance, given the validated data.
#         """
#         instance.username = validated_data.get('username', instance.username)
#         instance.email = validated_data.get('email', instance.email)
#         instance.first_name = validated_data.get('first_name', instance.first_name)
#         instance.last_name = validated_data.get('last_name', instance.last_name)
#         instance.password = validated_data.get('password', instance.password)
#         instance.postcode = validated_data.get('postcode', instance.postcode)
#         instance.birth_year = validated_data.get('birth_year', instance.birth_year)
#
#         instance.save()
#         return instance


class SupportCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportCategory
        fields = ["id", "name"]


class SupportGroupSerializer(serializers.ModelSerializer):
    support_categories = SupportCategorySerializer(many=True, read_only=True)

    class Meta:
        model = SupportGroup
        fields = ["id", "name", "support_categories"]


class RegistrationGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationGroup
        fields = ["id", "number", "name"]


class SupportItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportItem
        fields = "__all__"


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

    # in methods in case of any changes need to be made (e.g. rounding prices/ formatting)
    def get_unit(self, obj):
        return obj.unit()

    def get_price(self, obj):
        return obj.price()

    def get_description(self, obj):
        return obj.description()

    class Meta:
        model = SupportItemGroup
        fields = ["id", "name", "unit", "price", "description"]


class PlanItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanItem
        fields = "__all__"
