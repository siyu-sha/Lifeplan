from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .forms import ParticipantCreationForm, ParticipantChangeForm
from .models import Participant


class ParticipantAdmin(UserAdmin):
    add_form = ParticipantCreationForm
    form = ParticipantChangeForm
    model = Participant
    list_display = ['email', 'first_name', 'last_name', 'postcode', 'birth_year']


admin.site.register(Participant, ParticipantAdmin)
