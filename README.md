# Team-3

A FastAPI backend application with modern Python tooling.

## 🚀 Quick Start

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies using uv:**

   ```bash
   uv sync
   ```

3. **Activate the virtual environment:**

   ```bash
   source .venv/bin/activate
   ```

4. **Run the development server:**

   ```bash
   uv run fastapi dev app/main.py
   ```

### 🌐 Accessing the Application

- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

## 📁 Project Structure

```text
backend/
├── app/
│   ├── main.py         # FastAPI application entry point
│   ├── db/             # Database configuration
│   ├── models/         # Data models
│   └── routes/         # API route definitions
├── pyproject.toml      # Project dependencies and configuration
└── uv.lock            # Dependency lock file
```

## 🛠️ Development

This project uses [uv](https://docs.astral.sh/uv/) for fast Python package management and virtual environment handling.
