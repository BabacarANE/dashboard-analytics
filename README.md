# 📊 Dashboard Analytics en Temps Réel

Application full-stack de monitoring avec mise à jour en temps réel via WebSocket.

![Stack](https://img.shields.io/badge/Django-5.0+-green?logo=django)
![Stack](https://img.shields.io/badge/React-18+-blue?logo=react)
![Stack](https://img.shields.io/badge/WebSocket-Django%20Channels-purple)
![Stack](https://img.shields.io/badge/Redis-Upstash-red)
![Deploy](https://img.shields.io/badge/Backend-Render-lightgrey)
![Deploy](https://img.shields.io/badge/Frontend-Vercel-black)

---

## 🌐 Démo

- **Frontend :** [https://dashboard-analytics-tawny-pi.vercel.app](https://dashboard-analytics-tawny-pi.vercel.app)
- **API :** [https://dashboard-analytics-backend-o0nq.onrender.com/api/metrics/](https://dashboard-analytics-backend-o0nq.onrender.com/api/metrics/)

> ⚠️ Le backend est hébergé sur Render Free Tier — prévoir 30-50 secondes de cold start au premier chargement.

---

## ✨ Fonctionnalités

- 📡 **Temps réel via WebSocket** — métriques mises à jour toutes les 10 secondes
- 📊 **Graphiques interactifs** — LineChart, BarChart avec Recharts
- 🎯 **KPI Cards** — visiteurs, ventes, revenus, performance système
- 🔄 **Reconnexion automatique** — backoff exponentiel en cas de coupure
- 📱 **Responsive** — desktop, tablette, mobile
- 🕐 **Filtres temporels** — 1h, 24h, 7j, 30j
- 🔔 **Notifications** — alertes sur événements importants

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                 │
│          React 18 + Recharts + Tailwind CSS          │
└────────────────────┬────────────────────────────────┘
                     │ HTTP REST + WebSocket (WSS)
┌────────────────────▼────────────────────────────────┐
│                  BACKEND (Render)                    │
│         Django 5 + Django Channels + Daphne          │
│                                                      │
│  ┌─────────────┐    ┌──────────────────────────┐    │
│  │  API REST   │    │   WebSocket Consumer      │    │
│  │    DRF      │    │   MetricConsumer          │    │
│  └─────────────┘    └────────────┬─────────────┘    │
│                                  │                   │
│  ┌───────────────────────────────▼─────────────┐    │
│  │         Channel Layer (Redis/Upstash)        │    │
│  └───────────────────────────────┬─────────────┘    │
│                                  │                   │
│  ┌───────────────────────────────▼─────────────┐    │
│  │    Générateur de données (background)        │    │
│  │    python manage.py generate_metrics         │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│              DATABASE (PostgreSQL / SQLite)          │
└─────────────────────────────────────────────────────┘
```

**Flux de données temps réel :**
1. Le générateur Python crée des métriques toutes les 10s
2. Il les persiste en base PostgreSQL
3. Il les broadcast via `group_send` sur le Channel Layer Redis
4. Le Consumer WebSocket transmet aux clients connectés
5. React met à jour l'état local sans re-render inutile

---

## 🛠️ Stack Technique

### Backend
| Technologie | Version | Rôle |
|---|---|---|
| Django | 5.0+ | Framework web |
| Django Channels | 4.0+ | WebSocket via ASGI |
| Daphne | latest | Serveur ASGI |
| Django REST Framework | latest | API REST |
| channels-redis | latest | Channel Layer |
| Redis (Upstash) | 7.0+ | Message broker |
| PostgreSQL | latest | Base de données prod |

### Frontend
| Technologie | Version | Rôle |
|---|---|---|
| React | 18+ | Framework UI |
| Vite | latest | Build tool |
| Recharts | latest | Graphiques |
| Tailwind CSS | latest | Styling |
| Axios | latest | Client HTTP |
| WebSocket API | native | Connexion temps réel |

---

## 🚀 Installation locale

### Prérequis

- Python 3.11+
- Node.js 18+
- Redis (local ou [Upstash](https://upstash.com))

### Backend

```bash
# 1. Cloner le repo
git clone https://github.com/ton-username/dashboard-analytics.git
cd dashboard-analytics/backend

# 2. Créer l'environnement virtuel
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows

# 3. Installer les dépendances
pip install -r requirements.txt

# 4. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec tes valeurs

# 5. Appliquer les migrations
python manage.py migrate

# 6. Lancer le serveur ASGI
daphne -b 0.0.0.0 -p 8000 core.asgi:application

# 7. Dans un autre terminal, lancer le générateur
python manage.py generate_metrics --interval 10
```

### Frontend

```bash
cd dashboard-analytics/frontend

# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec tes valeurs

# 3. Lancer le serveur de dev
npm run dev
```

---

## ⚙️ Variables d'environnement

### Backend (`.env`)

```dotenv
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
REDIS_URL=redis://localhost:6379
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (`.env.local`)

```dotenv
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws/metrics/
```

---

## 📡 API Endpoints

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/metrics/` | Liste des métriques (paginée) |
| `GET` | `/api/metrics/latest/` | Dernières métriques par type |
| `GET` | `/api/metrics/stats/` | Statistiques agrégées |
| `WS` | `/ws/metrics/` | Flux WebSocket temps réel |

### Format message WebSocket

```json
{
  "type": "metric_update",
  "metric_type": "visitors",
  "value": 142,
  "change": 12,
  "timestamp": "2025-02-13T19:30:00Z"
}
```

### Types de métriques

| Type | Description | Unité |
|---|---|---|
| `visitors` | Visiteurs actifs | nombre |
| `pageviews` | Pages vues | nombre |
| `sales` | Ventes | nombre |
| `revenue` | Revenus | € |
| `cpu` | Usage CPU | % |
| `memory` | Usage mémoire | % |
| `requests` | Requêtes/s | nombre |
| `signups` | Inscriptions | nombre |

---

## 🧩 Structure du projet

```
dashboard-analytics/
├── backend/
│   ├── core/
│   │   ├── asgi.py          # Config ASGI + routing WebSocket
│   │   ├── settings.py      # Settings de base
│   │   ├── settings_prod.py # Settings production
│   │   └── urls.py          # URLs principales
│   ├── metrics/
│   │   ├── models.py        # Modèle Metric
│   │   ├── serializers.py   # Serializers DRF
│   │   ├── views.py         # ViewSets API REST
│   │   ├── consumers.py     # Consumer WebSocket
│   │   ├── routing.py       # Routing WebSocket
│   │   └── management/
│   │       └── commands/
│   │           └── generate_metrics.py  # Générateur de données
│   ├── requirements.txt
│   └── start.sh             # Script démarrage production
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx
    │   │   ├── MetricCard.jsx
    │   │   ├── RealtimeChart.jsx
    │   │   ├── TimeFilter.jsx
    │   │   └── WebSocketStatus.jsx
    │   ├── hooks/
    │   │   ├── useWebSocket.js
    │   │   └── useMetrics.js
    │   └── services/
    │       └── api.js
    ├── package.json
    └── vite.config.js
```

---

## ☁️ Déploiement

### Backend sur Render

1. Créer un **Web Service** sur [render.com](https://render.com)
2. Connecter le repo GitHub
3. Configurer :
   - **Root Directory :** `backend`
   - **Build Command :** `pip install -r requirements.txt`
   - **Start Command :** `bash start.sh`
4. Ajouter les variables d'environnement (voir section ci-dessus)

### Frontend sur Vercel

1. Importer le repo sur [vercel.com](https://vercel.com)
2. Configurer :
   - **Root Directory :** `frontend`
   - **Framework :** Vite
3. Ajouter les variables d'environnement :
   ```
   VITE_API_URL=https://ton-backend.onrender.com
   VITE_WS_URL=wss://ton-backend.onrender.com/ws/metrics/
   ```

### Redis avec Upstash

1. Créer une base sur [upstash.com](https://upstash.com)
2. Copier la **Redis URL** (commence par `rediss://`)
3. L'ajouter dans les variables Render : `REDIS_URL=rediss://...`

---

## 🧠 Points techniques notables

**Reconnexion WebSocket avec backoff exponentiel**
Le hook `useWebSocket.js` implémente une reconnexion automatique avec délai croissant (1s, 2s, 4s... jusqu'à 30s max, 10 tentatives) pour gérer les coupures réseau sans spam de requêtes.

**Générateur de données réalistes**
Chaque métrique évolue de façon continue à partir de sa valeur précédente avec une variation aléatoire bornée — ce qui produit des courbes réalistes plutôt que des valeurs aléatoires indépendantes.

**Architecture ASGI hybride**
Daphne sert simultanément les requêtes HTTP classiques (DRF) et les connexions WebSocket persistantes via le `ProtocolTypeRouter` de Django Channels.

---

## 📝 Licence

MIT — libre d'utilisation pour tout projet personnel ou professionnel.
