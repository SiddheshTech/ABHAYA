import os
import networkx as nx
import pandas as pd
import numpy as np
import joblib
import random
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

def generate_synthetic_syndicate_graph():
    """Generates a synthetic graph representing trafficking networks."""
    G = nx.Graph()
    
    # 1. Define nodes
    locations = ["Mumbai Hub", "Pune Transport", "Nashik Toll", "Surat Border", "Delhi Central"]
    people = [f"Kingpin_{i}" for i in range(1, 4)] + [f"Recruiter_{i}" for i in range(1, 10)]
    financials = [f"UPI_{i}" for i in range(1, 15)] + [f"Hawala_{i}" for i in range(1, 5)]
    vehicles = [f"Truck_{i}" for i in range(1, 8)]
    
    # Add nodes with types
    for loc in locations:
        G.add_node(loc, type="Location")
    for p in people:
        G.add_node(p, type="Person")
    for f in financials:
        G.add_node(f, type="Financial")
    for v in vehicles:
        G.add_node(v, type="Vehicle")
        
    # 2. Add edges to form a structured network
    # Kingpins connect to recruiters, hawala, and major hubs
    for i, kp in enumerate(people[:3]):
        # Connect to locations
        G.add_edge(kp, random.choice(locations), weight=random.uniform(0.7, 1.0))
        # Connect to recruiters
        recruiters = people[3:6] if i == 0 else (people[6:8] if i == 1 else people[8:])
        for r in recruiters:
            G.add_edge(kp, r, weight=random.uniform(0.5, 0.9))
            # Recruiters connect to vehicles and UPIs
            G.add_edge(r, random.choice(vehicles), weight=random.uniform(0.3, 0.8))
            G.add_edge(r, random.choice(financials), weight=random.uniform(0.4, 0.9))
            
    # Add cross-connections (sister networks sharing a common ancestor node)
    G.add_edge(people[0], financials[1], weight=0.9)
    G.add_edge(people[1], financials[1], weight=0.85) # Hawala node shared between two kingpins
    
    return G

def extract_features_and_train(G):
    """
    Computes graph centralities and trains a model.
    Goal: Predict where the network routes to if a specific node is taken out.
    """
    # Calculate centralities
    pr = nx.pagerank(G, weight='weight')
    bc = nx.betweenness_centrality(G, weight='weight')
    dc = nx.degree_centrality(G)
    
    data = []
    
    # Generate training data: if Node X collapses, what is the resulting network shift?
    for node in G.nodes():
        # Feature vector for this node
        feat = {
            "node_id": node,
            "pagerank": pr[node],
            "betweenness": bc[node],
            "degree": dc[node],
            "is_person": 1 if G.nodes[node].get("type") == "Person" else 0,
            "is_financial": 1 if G.nodes[node].get("type") == "Financial" else 0
        }
        
        # Target: Expected shift location
        # If highly central, it causes a shift to a major hub (e.g., Pune). Else, minor shift.
        if bc[node] > 0.05:
            shift_loc = "Pune Transport Hub A"
        else:
            shift_loc = "Nashik Toll Naka 2"
            
        feat["target_shift"] = shift_loc
        data.append(feat)
        
    df = pd.DataFrame(data)
    
    # Features for model
    X = df[["pagerank", "betweenness", "degree", "is_person", "is_financial"]]
    
    y_shift = df["target_shift"]
    
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('rf', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    
    pipeline.fit(X, y_shift)
    
    return pipeline, G, pr, bc

if __name__ == "__main__":
    print("Generating Synthetic Criminal Network Graph...")
    G = generate_synthetic_syndicate_graph()
    
    print("Computing Centralities and Training Mutation Model...")
    model, graph, pr, bc = extract_features_and_train(G)
    
    # Save the models
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)
    
    # Save ML Model
    joblib.dump(model, os.path.join(models_dir, "mutation_model.joblib"))
    
    # Save graph centralities for fast API lookups
    joblib.dump({"pagerank": pr, "betweenness": bc}, os.path.join(models_dir, "graph_metrics.joblib"))
    
    print(f"Network Genome Engine trained on {len(G.nodes())} nodes and {len(G.edges())} edges.")
    print(f"Artifacts saved to {models_dir}")
