FROM python:3.6-slim-stretch

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        default-libmysqlclient-dev \
        gcc \
        python3-dev \
        mysql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/ndis_calculator
COPY ./requirements.txt /app/ndis_calculator/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000
