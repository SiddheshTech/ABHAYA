FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY shared/ ./shared/
COPY services/__init__.py ./services/__init__.py
COPY services/ghost_engine/ ./services/ghost_engine/

EXPOSE 8001

CMD ["uvicorn", "services.ghost_engine.main:app", "--host", "0.0.0.0", "--port", "8001"]
