FROM server-python-base:latest
WORKDIR /app
COPY shared/ ./shared/
COPY services/__init__.py ./services/__init__.py
COPY services/ghost_engine/ ./services/ghost_engine/
EXPOSE 8001
CMD ["uvicorn", "services.ghost_engine.main:app", "--host", "0.0.0.0", "--port", "8001"]
