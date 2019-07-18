from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Participant


class ParticipantCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
        model = Participant
        fields = ('email', 'password', 'first_name', 'last_name', 'postcode', 'birth_year')


class ParticipantChangeForm(UserChangeForm):
st
    class Meta:
        model = Participant
        fields = ('email', 'password', 'first_name', 'last_name', 'postcode', 'birth_year')
