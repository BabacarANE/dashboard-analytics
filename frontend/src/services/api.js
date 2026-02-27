import axios from 'axios'

// Utilise la variable d'environnement ou l'URL locale par défaut
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
    baseURL: `${API_URL}/api`,  // Construction dynamique de l'URL
    timeout: 10_000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Optionnel : log pour déboguer en développement
if (import.meta.env.DEV) {
    console.log('🌐 API URL:', `${API_URL}/api`)
}

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.detail || error.message || 'Erreur réseau'
        console.error('[API Error]', message)
        return Promise.reject(error)
    }
)

export default api