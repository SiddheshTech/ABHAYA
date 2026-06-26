FROM server-python-base:latest
WORKDIR /app
COPY shared/ ./shared/
COPY services/__init__.py ./services/__init__.py
COPY services/core_api/ ./services/core_api/
EXPOSE 8000
CMD ["uvicorn", "services.core_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
