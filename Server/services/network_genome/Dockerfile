FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY shared/ ./shared/
COPY services/__init__.py ./services/__init__.py
COPY services/network_genome/ ./services/network_genome/

EXPOSE 8003

CMD ["uvicorn", "services.network_genome.main:app", "--host", "0.0.0.0", "--port", "8003"]
