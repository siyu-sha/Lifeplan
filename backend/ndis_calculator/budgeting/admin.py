from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .forms import ParticipantCreationForm, ParticipantChangeForm
from .models import (Participant,
                     SupportGroup,
                     SupportItem,
                     SupportCategory,
                     RegistrationGroup,
                     Plan,
                     Goal,
                     PlanGoal,
                     PlanCategory,
                     PlanItem,
                     )


class ParticipantAdmin(UserAdmin):
    add_form = ParticipantCreationForm
    form = ParticipantChangeForm
    model = Participant
    list_display = ['email', 'first_name', 'last_name', 'postcode', 'birth_year']


admin.site.register(Participant, ParticipantAdmin)
# Default registrations
admin.site.register(SupportGroup)
admin.site.register(SupportItem)
admin.site.register(SupportCategory)
admin.site.register(RegistrationGroup)
admin.site.register(Plan)
admin.site.register(Goal)
admin.site.register(PlanGoal)
admin.site.register(PlanCategory)
admin.site.register(PlanItem)
