"""
Django Settings — Production
Configuration spécifique à l'environnement de production sur Render
"""

from .settings import *  # Importe toutes les configurations de base

import os
from decouple import config

# ─────────────────────────────────────────────
# PRODUCTION SETTINGS
# ─────────────────────────────────────────────

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Les hôtes autorisés en production (via variable d'environnement)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')

# ─────────────────────────────────────────────
# DATABASE — PostgreSQL (Render)
# ─────────────────────────────────────────────
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# ─────────────────────────────────────────────
# REDIS — Upstash (avec TLS)
# ─────────────────────────────────────────────
REDIS_URL = config('REDIS_URL')

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [REDIS_URL],
        },
    },
}

# ─────────────────────────────────────────────
# CORS — Frontend sur Vercel
# ─────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='').split(',')
CORS_ALLOW_CREDENTIALS = True

# ─────────────────────────────────────────────
# SECURITY — Recommandations pour la production
# ─────────────────────────────────────────────
# Force HTTPS
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# Sécurité des headers
SECURE_HSTS_SECONDS = 31536000  # 1 an
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# ─────────────────────────────────────────────
# STATIC FILES — Collecte pour production
# ─────────────────────────────────────────────
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# ─────────────────────────────────────────────
# LOGGING — Pour déboguer en production
# ─────────────────────────────────────────────
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}