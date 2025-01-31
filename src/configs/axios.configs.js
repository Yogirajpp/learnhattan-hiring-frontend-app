import ax from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const axios = ax.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default axios;