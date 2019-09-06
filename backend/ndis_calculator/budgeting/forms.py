from django import forms
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import Participant


class ParticipantCreationForm(UserCreationForm):
    class Meta(UserCreationForm):
        model = Participant
        fields = (
            "email",
            "password",
            "first_name",
            "last_name",
            "postcode",
            "birth_year",
        )


class ParticipantChangeForm(UserChangeForm):
    class Meta:
        model = Participant
        fields = (
            "email",
            "password",
            "first_name",
            "last_name",
            "postcode",
            "birth_year",
        )
