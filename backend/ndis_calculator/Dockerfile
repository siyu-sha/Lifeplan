FROM python:3.6

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        mysql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/ndis_calculator
COPY ./requirements.txt /app/ndis_calculator/requirements.txt
RUN pip install -r requirements.txt

EXPOSE 8000
