FROM server-python-base:latest
WORKDIR /app
COPY shared/ ./shared/
COPY services/__init__.py ./services/__init__.py
COPY services/migration_sensor/ ./services/migration_sensor/
EXPOSE 8002
CMD ["uvicorn", "services.migration_sensor.main:app", "--host", "0.0.0.0", "--port", "8002"]
