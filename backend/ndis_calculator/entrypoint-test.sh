timeout 120 bash -c 'until echo > /dev/tcp/db/3306; do sleep 2; done'
python manage.py makemigrations --no-input
python manage.py migrate --no-input
coverage run manage.py test budgeting.tests
