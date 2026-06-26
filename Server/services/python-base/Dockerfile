# Shared Python base image for all Rakshak FastAPI microservices.
# Build once, reuse across all 5 services — avoids OOM from parallel pip installs.
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
