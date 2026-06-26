FROM server-python-base:latest
WORKDIR /app
COPY shared/ ./shared/
COPY services/__init__.py ./services/__init__.py
COPY services/psychology_search/ ./services/psychology_search/
EXPOSE 8004
CMD ["uvicorn", "services.psychology_search.main:app", "--host", "0.0.0.0", "--port", "8004"]
