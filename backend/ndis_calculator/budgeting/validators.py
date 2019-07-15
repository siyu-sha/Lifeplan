import datetime
from django.core.exceptions import ValidationError


def validate_birth_year(birth_year):
    now = datetime.datetime.now()
    if birth_year > now.year or birth_year < 1800:
        raise ValidationError('Invalid birth year')

def validate_postcode(postcode):
    if postcode < 100:
        raise ValidationError('Invalid postcode')