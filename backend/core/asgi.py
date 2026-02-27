"""
ASGI config — Dashboard Analytics
Gère HTTP (Django) + WebSocket (Channels)
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from metrics.routing import websocket_urlpatterns

# Utilise la variable d'environnement si définie (ex: core.settings_prod sur Render)
# sinon fallback sur settings de base
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    # AllowedHostsOriginValidator retiré car il bloque les connexions
    # venant de Vercel (origine différente du domaine Render)
    'websocket': URLRouter(websocket_urlpatterns),
})