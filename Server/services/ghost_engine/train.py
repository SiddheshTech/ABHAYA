import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier

# Seed for reproducibility
np.random.seed(42)

# --- 1. Synthesize Data ---
def generate_synthetic_data(num_samples=2000):
    print(f"Generating {num_samples} synthetic forensic records...")
    
    # Target Classes (District -> Village Cluster)
    targets = [
        {"district": "Dumka", "village": "Amrapara Tribal Village Group", "region": "Jharkhand Borderlands"},
        {"district": "Latehar", "village": "Mahuadanr Cluster", "region": "Jharkhand Central"},
        {"district": "Katihar", "village": "Barari Riverine Area", "region": "Bihar Borderlands"},
        {"district": "Dhubri", "village": "Gauripur East", "region": "Assam Sector 4"},
        {"district": "Siliguri", "village": "Naxalbari Sub-Sector", "region": "West Bengal"}
    ]
    
    data = []
    
    for _ in range(num_samples):
        target = np.random.choice(targets)
        
        # Base numericals with some noise depending on region
        if target["district"] in ["Dumka", "Latehar"]:
            age = np.random.uniform(7.0, 14.0)
            height = age * 5.5 + 60 + np.random.normal(0, 4) 
            weight = age * 2.0 + 8 + np.random.normal(0, 2)
            face_features = np.random.choice([
                "Prominent cheekbones, dark birthmark on shoulder",
                "Faint horizontal scar on knee",
                "Ectomorphic structure, deep set eyes",
                "Scar on left eyebrow, prominent chin"
            ])
            language = np.random.choice([
                "Speaks a mix of Hindi and an unidentified tribal dialect (Santali/Sadri)",
                "Lari Santali influence, nasal vowels",
                "Broken Hindi with strong Sadri accent",
                "Munda language family acoustic phonemes"
            ])
            microbiome_markers = np.random.choice(["High iron/laterite soil trace", "Red soil microbiome cluster"])
            nutrition_deficiency = np.random.choice(["Chronic Vitamin B12 and Iron deficiency mapped to Zone 4", "Protein energy malnutrition pattern (Stunting)"])
            clothing_weave = np.random.choice(["Santhal traditional check pattern thread fragments", "Coarse cotton weave typical of local handloom"])
        else:
            age = np.random.uniform(7.0, 14.0)
            height = age * 6.0 + 65 + np.random.normal(0, 5) 
            weight = age * 2.2 + 10 + np.random.normal(0, 2)
            face_features = np.random.choice([
                "Round face, minor scar on wrist",
                "Symmetric features, minor burn mark on hand",
                "Average build, clear skin",
                "Mole on right cheek"
            ])
            language = np.random.choice([
                "Speaks fluent regional Bengali / Rajbanshi dialect",
                "Bhojpuri variant mixed with Maithili",
                "Assamese dialect with Bengali mix",
                "Standard Hindi with eastern border accent"
            ])
            microbiome_markers = np.random.choice(["Alluvial soil pathogen signature", "High moisture riverine bacterial trace"])
            nutrition_deficiency = np.random.choice(["Iodine deficiency indicators", "Standard baseline nutrition (borderline anemia)"])
            clothing_weave = np.random.choice(["Synthetic blend mass-produced in eastern hubs", "Silk-cotton blended thread fragments"])
        
        data.append({
            "age": age,
            "height": height,
            "weight": weight,
            "features": face_features,
            "language": language,
            "microbiome_markers": microbiome_markers,
            "nutrition_deficiency": nutrition_deficiency,
            "clothing_weave": clothing_weave,
            "target_district": target["district"],
            "target_village": target["village"],
            "target_region": target["region"]
        })
        
    df = pd.DataFrame(data)
    return df

# --- 2. Train Models ---
def train_and_save_model():
    # Increase to 10,000 to get high accuracy as requested
    df = generate_synthetic_data(10000)
    
    # We will predict a combined class string: "Region|District|Village"
    df["target_class"] = df["target_region"] + "|" + df["target_district"] + "|" + df["target_village"]
    
    X = df[["age", "height", "weight", "features", "language", "microbiome_markers", "nutrition_deficiency", "clothing_weave"]]
    y = df["target_class"]
    
    print("Building Highly Detailed USP-1 ML Pipeline...")
    numeric_features = ["age", "height", "weight"]
    numeric_transformer = StandardScaler()
    
    text_transformer = TfidfVectorizer(max_features=100)
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_features),
            ("text_feat", text_transformer, "features"),
            ("text_lang", text_transformer, "language"),
            ("text_micro", text_transformer, "microbiome_markers"),
            ("text_nutri", text_transformer, "nutrition_deficiency"),
            ("text_cloth", text_transformer, "clothing_weave")
        ]
    )
    
    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(n_estimators=150, max_depth=15, random_state=42))
    ])
    
    print("Training High-Accuracy Model (this may take a few seconds)...")
    pipeline.fit(X, y)
    
    score = pipeline.score(X, y)
    print(f"Training Accuracy: {score * 100:.2f}% (Overfit expected on synthetic data)")
    
    os.makedirs(os.path.join(os.path.dirname(__file__), "models"), exist_ok=True)
    model_path = os.path.join(os.path.dirname(__file__), "models", "ghost_engine_rf.joblib")
    
    joblib.dump(pipeline, model_path)
    print(f"Model saved successfully to {model_path}")
    
    classes = pipeline.classes_
    with open(os.path.join(os.path.dirname(__file__), "models", "classes.json"), "w") as f:
        json.dump(list(classes), f)

if __name__ == "__main__":
    train_and_save_model()
