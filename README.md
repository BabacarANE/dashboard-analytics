# 📊 Dashboard Analytics en Temps Réel

> Stack : **Django 5** + **Django Channels** + **React 18** + **WebSocket** + **Redis**

---

## 🏗️ Architecture

```
dashboard-analytics/
├── backend/                  # Django + Channels
│   ├── core/                 # Settings, URLs, ASGI
│   │   ├── settings.py
│   │   ├── asgi.py           ← Channels routing
│   │   └── urls.py
│   ├── metrics/              # App principale
│   │   ├── models.py         (Phase 2)
│   │   ├── serializers.py    (Phase 2)
│   │   ├── views.py          (Phase 2)
│   │   ├── consumers.py      (Phase 3)
│   │   └── routing.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── components/       # Composants UI
│   │   │   ├── charts/       # Graphiques Recharts
│   │   │   └── ui/           # Composants génériques
│   │   ├── hooks/            # Hooks personnalisés (useWebSocket, etc.)
│   │   ├── services/         # api.js, websocket.js
│   │   ├── pages/            # Pages
│   │   └── utils/            # Helpers
│   ├── package.json
│   └── .env.example
│
└── docker-compose.yml        # Redis local
```

---

## 🚀 Installation & Démarrage

### Prérequis
- Python 3.11+
- Node.js 18+
- Docker (pour Redis local)

---

### 1. Démarrer Redis (Docker)
```bash
docker-compose up -d
```

---

### 2. Backend Django

```bash
cd backend

# Créer et activer l'environnement virtuel
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env selon vos besoins

# Lancer les migrations
python manage.py migrate

# Démarrer le serveur ASGI (avec Channels)
python manage.py runserver
# ou avec Daphne :
# daphne -p 8000 core.asgi:application
```

Backend disponible sur : `http://localhost:8000`

---

### 3. Frontend React

```bash
cd frontend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Démarrer le serveur de dev
npm run dev
```

Frontend disponible sur : `http://localhost:5173`

---

## 📋 Roadmap

| Phase | Description | Statut |
|-------|-------------|--------|
| 1 | Setup & Configuration | ✅ Done |
| 2 | Backend Models & API REST | 🔜 |
| 3 | WebSocket Consumer | 🔜 |
| 4 | Générateur de données | 🔜 |
| 5 | Frontend Composants | 🔜 |
| 6 | Frontend Graphiques | 🔜 |
| 7 | Polish UI/UX | 🔜 |
| 8 | Déploiement | 🔜 |
| 9 | Documentation | 🔜 |

---

## 🛠️ Tech Stack

**Backend**
- Django 5.0 + Django REST Framework
- Django Channels 4.0 (WebSocket)
- Redis 7 (Channel Layer)
- SQLite (dev) / PostgreSQL (prod)

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Recharts
- Axios
