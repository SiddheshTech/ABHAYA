FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy shared module and service code
COPY shared/ ./shared/
COPY services/__init__.py ./services/__init__.py
COPY services/core_api/ ./services/core_api/

EXPOSE 8000

CMD ["uvicorn", "services.core_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
