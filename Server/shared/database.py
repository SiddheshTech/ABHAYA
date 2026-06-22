"""
Database configuration and connection managers for Rakshak Backend.
Supports PostgreSQL (via SQLAlchemy Async), Neo4j, and Elasticsearch.
"""

import os
from elasticsearch import Elasticsearch
from neo4j import GraphDatabase
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

# --- PostgreSQL (via SQLAlchemy Async) ---
POSTGRES_URL = os.getenv(
    "POSTGRES_URL",
    "postgresql+asyncpg://rakshak_user:rakshak_password@localhost:5432/rakshak_db"
)

# Async engine for SQLAlchemy 2.0
engine = create_async_engine(POSTGRES_URL, echo=True)

# Recommended async session maker for SQLAlchemy 2.0+
AsyncSessionLocal = async_sessionmaker(
    engine, expire_on_commit=False
)

class Base(DeclarativeBase):
    """Base class for all SQLAlchemy declarative models."""

async def get_pg_db():
    """Dependency generator that yields an async PostgreSQL session."""
    async with AsyncSessionLocal() as session:
        yield session

# --- Neo4j ---
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "rakshak_graph_pass")

class Neo4jConnection:
    """Manages the Neo4j Graph Database connection and queries."""

    def __init__(self, uri, user, pwd):
        self.__uri = uri
        self.__user = user
        self.__password = pwd
        self.__driver = None
        try:
            self.__driver = GraphDatabase.driver(
                self.__uri, auth=(self.__user, self.__password)
            )
        except Exception as e: # pylint: disable=broad-exception-caught
            print("Failed to create the Neo4j driver:", e)

    def close(self):
        """Closes the Neo4j driver connection."""
        if self.__driver is not None:
            self.__driver.close()

    def query(self, query_str, parameters=None, db=None):
        """Executes a query against the Neo4j graph database."""
        assert self.__driver is not None, "Driver not initialized!"
        session = None
        response = None
        try:
            session = (
                self.__driver.session(database=db)
                if db is not None
                else self.__driver.session()
            )
            response = list(session.run(query_str, parameters))
        except Exception as e: # pylint: disable=broad-exception-caught
            print("Neo4j Query failed:", e)
        finally:
            if session is not None:
                session.close()
        return response

neo4j_conn = Neo4jConnection(NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD)

def get_neo4j_db():
    """Returns the singleton Neo4j connection instance."""
    return neo4j_conn

# --- Elasticsearch ---
ES_HOST = os.getenv("ES_HOST", "http://localhost:9200")

# Pass hosts explicitly as a keyword argument
es_client = Elasticsearch(hosts=[ES_HOST])

def get_es_client():
    """Returns the Elasticsearch client."""
    return es_client
