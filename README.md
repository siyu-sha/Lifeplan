# ndis-financial-planner

This project is the brainchild of Capital Guardians: An intelligent estimator for the NIDS, aiming to facilitate access for all potential participants.

## Technology Overview

This is a containerised project aiming to achieve simple production deployment: Three containers are specified

Database - simple mysql container based on the official image. Further investigation required, unlikely to be suitable for production.

## How to Run A Development build

`docker-compose build`
followed by
`docker-compose up`

When complete ctrl-c to end process,
`docker-compose down`
to remove containers and clean up.

## Settings

Django settings can be found in backend/ndis_calculator/ndis_calculator/settings.py. We will expand these settings to encompass production-ready settings. Only settings appropriate for development will be committed to the repository, production-ready will remain private.

## Deployment

If the develop branch is currently building, the app will be deployed at lachieblack.com:3000/8000 (Frontend/backend)
Please note HTTPS is not currently enabled and as such, only enter dummy data over the internet!
