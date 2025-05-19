# Choose Your Adventure

### A dynamic, choose-your-own-adventure game powered by a React frontend and a Django backend, featuring AI-generated imagery using Stable Diffusion.

---

## Features

*   **Interactive Storytelling:** Make choices that influence the direction of the narrative.
*   **AI-Generated Visuals:** Experience unique, AI-generated images (via Stable Diffusion) that correspond to story developments.
*   **User Authentication:** Secure login and registration system.
*   **Game History:** Review your past choices and story progression (feature suggested by `History.jsx`).
*   **Speech-to-Text Input:** Interact with the game using voice commands (feature suggested by `Dictaphone.jsx`).
*   **Dynamic Firefly Animation:** Engaging visual background with interactive fireflies.

---

## Tech Stack

*   **Frontend:**
    *   React
    *   Vite (Build tool)
    *   Axios (for API calls)
    *   React Router (for navigation)
    *   React Speech Recognition
*   **Backend:**
    *   Django (Python web framework)
    *   Django REST framework (for building APIs)
    *   Simple JWT (for token-based authentication)
*   **Image Generation:**
    *   Stable Diffusion (or an API providing access to it)

---

## Prerequisites

*   Node.js and npm (for the frontend)
*   Python and pip (for the backend)
*   Access to a Stable Diffusion service/API (for image generation)

---

## Setup and Installation

### Frontend (`frontend/app`)

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend/app
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Backend (`backend`)

**Note:** The backend setup appears to be incomplete in the current workspace. The core Django project file (`manage.py`) is missing. The instructions below assume a standard Django project structure will be restored or provided.

1.  **Navigate to the backend directory (assuming it's the Django project root):**
    ```bash
    cd backend 
    ```
    *(If your Django project is nested deeper, adjust the path accordingly once `manage.py` is present.)*

2.  **Create and activate a virtual environment (recommended):**
    ```bash
    python -m venv env_backend 
    # On Windows
    .\env_backend\Scripts\activate
    # On macOS/Linux
    source env_backend/bin/activate
    ```
3.  **Install Python dependencies:**
    *(Assuming a `requirements.txt` file will be available in the Django project root)*
    ```bash
    pip install -r requirements.txt 
    ```
4.  **Apply database migrations (once `manage.py` and database settings are configured):**
    ```bash
    python manage.py migrate
    ```

---

## Running the Application

### Frontend

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend/app
    ```
2.  **Start the development server (usually on `http://localhost:5173` or similar):**
    ```bash
    npm run dev
    ```
    The frontend is configured to make API calls to `http://127.0.0.1:8000`.

### Backend

1.  **Navigate to the Django project root directory (where `manage.py` is located).**
2.  **Activate the virtual environment (if not already active).**
3.  **Start the Django development server (usually on `http://127.0.0.1:8000`):**
    ```bash
    python manage.py runserver
    ```

---

## Key API Endpoints (Expected)

The frontend application ([`frontend/app/src/App.jsx`](frontend/app/src/App.jsx:0)) interacts with the following backend endpoints:

*   `POST /handle_choice`: Submits the player's choice and current prompt, expects a story segment in return.
*   `POST /generate-image`: Submits a prompt (story segment), expects an image URL in return.
*   Authentication endpoints (e.g., `/api/token/`, `/api/token/refresh/`, `/register/`) are also expected for user login and registration.

---

## Project Structure Overview

```
.
├── backend/                # Contains backend code (Django)
│   └── env_backend/        # Python virtual environment (currently most of the content)
│   └── ...                 # (Expected: Django project app, manage.py, settings.py etc.)
├── frontend/               # Contains frontend code (React)
│   └── app/                # React application source
│       ├── public/
│       ├── src/            # Main source files (components, App.jsx, etc.)
│       ├── package.json
│       └── ...
└── README.md               # This file
```

---

## Contact

For more details, contact criste.ioan92@yahoo.com
