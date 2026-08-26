import os

# Build-time: render uses 10000 for the PORT env var
# Vercel proxy handles /api in dev; in production the frontend calls the live backend URL
BACKEND_URL = os.environ.get('VITE_API_URL', '')

# For the backend itself
PORT = int(os.environ.get('PORT', 5000))
