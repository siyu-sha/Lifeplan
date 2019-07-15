from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from budgeting.models import Participant


class ParticipantSerializer(serializers.Serializer):
    username = serializers.CharField(write_only=True)
    email = serializers.CharField(validators=[UniqueValidator(queryset=Participant.objects.all())])
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    password = serializers.CharField(write_only=True)
    postcode = serializers.IntegerField()
    birth_year = serializers.IntegerField()

    def create(self, validated_data):
        """
        Create and return a new `Participant` instance, given the validated data.
        """
        user = Participant.objects.create(
                username=validated_data['username'],
                email=validated_data['email'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                password=make_password(validated_data['password']),
                postcode=validated_data['postcode'],
                birth_year=validated_data['birth_year']
        )
        return user

    def update(self, instance, validated_data):
        """
        Update and return an existing `Participant` instance, given the validated data.
        """
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.password = validated_data.get('password', instance.password)
        instance.postcode = validated_data.get('postcode', instance.postcode)
        instance.birth_year = validated_data.get('birth_year', instance.birth_year)

        instance.save()
        return instance
