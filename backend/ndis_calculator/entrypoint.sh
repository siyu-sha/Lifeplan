timeout -t 60 bash -c 'until echo > /dev/tcp/db/3306; do sleep 2; done'
python manage.py makemigrations --no-input
python manage.py migrate --no-input
python manage.py runserver 0.0.0.0:8000
