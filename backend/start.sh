#!/bin/bash
# Applique les migrations
python manage.py migrate --noinput

# Lance le générateur en arrière-plan
python manage.py generate_metrics --interval 3 &

# Lance le serveur ASGI
daphne -b 0.0.0.0 -p $PORT core.asgi:application
