from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from budgeting.models import *

class ParticipantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Participant
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'birth_year', 'postcode', )
        read_only_fields = ('id',)
        extra_kwargs = {
            'username': {'write_only':True},
            'password': {'write_only':True}
        }

    def create(self, validated_data):
        """
        Create and return a new `User` instance, given the validated data.
        """
        user = Participant.objects.create(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=make_password(validated_data['password']),
            postcode=validated_data['postcode'],
            birth_year=validated_data['birth_year']
        )
        return user
#
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
        fields = ['id', 'name']

class SupportGroupSerializer(serializers.ModelSerializer):
    support_categories = SupportCategorySerializer(many=True, read_only=True)

    class Meta:
        model = SupportGroup
        fields = ['name', 'support_categories']


class RegistrationGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationGroup
        fields = ('id','number', 'name')

        def create(self, validated_data):
            group = RegistrationGroup.objects.create(
                number=validated_data['number'],
                name=validated_data['name']
            )
            return group

class SupportItemSerializer(serializers.ModelSerializer):
    support_category = SupportCategorySerializer(many=False, read_only=True)
    registration_group =RegistrationGroupSerializer(many=False, read_only=True)
    class Meta:
        model = SupportItem
        fields = ('id','support_category','registration_group','name', 'number', 'description','unit','price_NA_SA_TAS_WA','price_ACT_NSW_QLD_VIC','price_national','price_remote','price_very_remote')

    def create(self, validated_data):
        item = SupportItem.objects.create(
            support_category=validated_data['support_category'],
            registration_group = validated_data['registration_group'],
            name = validated_data['name'],
            number = validated_data['number'],
            description = validated_data['description'],
            unit = validated_data['unit'],
            price_NA_SA_TAS_WA = validated_data['price_NA_SA_TAS_WA'],
            price_ACT_NSW_QLD_VIC = validated_data['price_ACT_NSW_QLD_VIC'],
            price_national = validated_data['price_national'],
            price_remote = validated_data['price_remote'],
            price_very_remote = validated_data['price_very_remote']
        )
        return item