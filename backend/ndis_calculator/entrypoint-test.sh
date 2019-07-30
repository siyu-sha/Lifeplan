timeout 120 /bin/bash -c 'until echo > /dev/tcp/db/3306; do sleep 2; done' > /dev/null 2>&1 &
python manage.py makemigrations --no-input
python manage.py migrate --no-input
coverage run manage.py test budgeting.tests
