# Choose Your Adventure

A dynamic, interactive **choose-your-own-adventure game** powered by a **React frontend** and **Django backend**, featuring AI-powered storytelling and image generation.

---

## 🎮 Features

- **Interactive Storytelling** - Make meaningful choices that shape the narrative direction
- **AI-Generated Visuals** - Dynamic AI-generated images that correspond to your story choices
- **User Authentication** - Secure JWT-based login and registration
- **Game History** - Track and review past adventures and choices
- **Voice Input** - Speech-to-text support for hands-free interaction
- **Modern UI** - Beautiful, responsive design with smooth animations and Tailwind CSS
- **Real-time API Communication** - Axios-powered REST API integration

---

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Speech Recognition** - Voice input support
- **React Hot Toast** - Toast notifications

### Backend
- **Django 5.0** - Python web framework
- **Django REST Framework** - RESTful API toolkit
- **djangorestframework-simplejwt** - JWT authentication
- **django-cors-headers** - CORS support
- **Ollama** - Local AI model integration
- **Pillow** - Image processing

---

## 📋 Prerequisites

- **Node.js** (v16+) and npm
- **Python** (3.8+) and pip
- **Virtual environment** (recommended for Python)

---

## 🚀 Setup and Installation

### Frontend Setup

```bash
cd frontend/app
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### Backend Setup

```bash
cd backend/backend
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
.\venv\Scripts\activate

# Install dependencies
pip install -r ../requirements.txt

# Apply migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

The backend will run on `http://127.0.0.1:8000`

---

## 📁 Project Structure

```
Choose_Your_Adventure/
├── backend/
│   ├── backend/                    # Django project root
│   │   ├── ChooseYourAdventure/   # Main Django settings
│   │   ├── App1/                  # Main app with game logic
│   │   ├── manage.py              # Django management script
│   │   ├── db.sqlite3             # Database
│   │   └── generated_images/      # AI-generated image storage
│   ├── requirements.txt           # Python dependencies
│   └── venv/                      # Virtual environment
├── frontend/
│   └── app/                       # React application
│       ├── src/
│       │   ├── components/        # React components
│       │   ├── App.jsx            # Main app component
│       │   └── index.css          # Global styles
│       ├── package.json
│       ├── vite.config.js         # Vite configuration
│       └── tailwind.config.js     # Tailwind configuration
└── README.md
```

---

## 🔌 API Endpoints

The application communicates through these key endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/handle_choice` | Submit player choice, get next story segment |
| POST | `/generate-image` | Generate AI image for story prompt |
| POST | `/api/token/` | User login (JWT authentication) |
| POST | `/api/token/refresh/` | Refresh JWT token |
| POST | `/register/` | User registration |
| GET | `/api/user/` | Get current user profile |
| GET | `/game-history/` | Retrieve past game sessions |

---

## 🎯 How to Play

1. **Register/Login** - Create an account or log in
2. **Start Adventure** - Begin a new story
3. **Make Choices** - Select from available options to progress
4. **View Visuals** - See AI-generated images for each scene
5. **Track History** - Review your choices and paths taken

---

## 🔧 Development

### Frontend Development
```bash
cd frontend/app
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
```

### Backend Development
```bash
cd backend/backend
python manage.py makemigrations  # Create migrations
python manage.py migrate         # Apply migrations
python manage.py createsuperuser # Create admin user
python manage.py runserver       # Start dev server
```

---

## 🐳 Docker Support

Both frontend and backend include Dockerfiles for containerized deployment.

```bash
# Build and run with Docker
docker build -t choose-adventure-backend ./backend
docker build -t choose-adventure-frontend ./frontend/app
```

---

## 📝 Environment Configuration

Create a `.env` file in the backend directory for configuration:

```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Contact

For questions or feedback, contact: **criste.ioan92@yahoo.com**

---

## 📄 License

This project is open source and available under the MIT License.
