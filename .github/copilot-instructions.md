# Copilot Instructions for Team-3

## Project Overview
- **Backend**: Python FastAPI app located in `backend/app/`.
- **Entry Point**: `backend/app/main.py`.
- **API Docs**: Available at `http://localhost:8000/docs` when running.

## Developer Workflows
- **Install dependencies**: Uses [uv](https://uv.pypa.io/) for dependency management.
  ```bash
  cd backend
  uv sync
  ```
- **Activate virtual environment**:
  ```bash
  source .venv/bin/activate
  ```
- **Run the backend server**:
  ```bash
  uv run fastapi dev app/main.py
  ```
- **Default host**: `localhost:8000`

## Code Structure
- `backend/app/db/`: Database config (see `config.py`).
- `backend/app/models/`: Data models (see `heros.py`).
- `backend/app/routes/`: API route definitions (see `heroes.py`).
- `backend/app/main.py`: FastAPI app setup and entrypoint.

## Patterns & Conventions
- **Routes**: Defined in `routes/heroes.py`, imported into `main.py`.
- **Models**: Defined in `models/heros.py`.
- **Config**: Database and app config in `db/config.py`.
- **Testing/Debugging**: No explicit test or debug scripts found; follow FastAPI conventions.

## Integration Points
- **External dependencies**: Managed via `pyproject.toml` and `uv.lock`.
- **API docs**: Swagger UI at `/docs`.

## Tips for AI Agents
- Use the `uv` tool for all dependency and run commands.
- Follow the directory structure for adding new routes or models.
- Reference `README.md` for up-to-date run instructions.

---
If any conventions or workflows are unclear, check `README.md` or ask for clarification.
