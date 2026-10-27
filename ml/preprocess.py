"""
CineMood — Smart Movie Discovery & Recommendation System
Academic Machine Learning Preprocessing & Recommendation Generation Script

This script:
1. Loads TMDB 5000 movies and credits datasets.
2. Merges them on movie ID and handles missing values.
3. Performs Feature Engineering:
   - Extracts genres, keywords, overview, cast, and director.
   - Cleans and collapses multi-word entity strings (e.g., 'Sam Worthington' -> 'samworthington').
   - Constructs a unified 'tags' text soup for Content-Based Filtering.
4. Performs TF-IDF (Term Frequency-Inverse Document Frequency) vectorization with stop words removal.
5. Computes Cosine Similarity between movie feature vectors.
6. Precomputes Top 10 Explainable Recommendations for every movie (with shared genres, keywords, cast, and similarity scores).
7. Generates compact JSON files for the zero-dependency React frontend:
   - movies.json
   - recommendations.json
   - dataset_stats.json (for Recharts ML Insights Dashboard)
"""

import os
import sys
import json
import ast
import time
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def find_dataset_files():
    """Locate the TMDB 5000 dataset CSV files across common relative directory locations."""
    possible_dirs = [
        Path("../MovieDataset"),
        Path("./MovieDataset"),
        Path("../../MovieDataset"),
        Path("../data"),
        Path("./data"),
        Path("."),
    ]
    
    movies_file = None
    credits_file = None
    
    for directory in possible_dirs:
        m_candidate = directory / "tmdb_5000_movies.csv"
        c_candidate = directory / "tmdb_5000_credits.csv"
        if m_candidate.exists() and c_candidate.exists():
            movies_file = m_candidate.resolve()
            credits_file = c_candidate.resolve()
            break
            
    return movies_file, credits_file


def parse_json_safely(val):
    """Safely parse JSON or Python literal string representations."""
    if not isinstance(val, str) or not val.strip():
        return []
    try:
        return json.loads(val)
    except Exception:
        try:
            return ast.literal_eval(val)
        except Exception:
            return []


def extract_genres(val):
    """Extract list of genre names from JSON column."""
    items = parse_json_safely(val)
    return [item.get("name", "").strip() for item in items if isinstance(item, dict) and item.get("name")]


def extract_keywords(val, limit=8):
    """Extract top N keyword tags."""
    items = parse_json_safely(val)
    return [item.get("name", "").strip().lower() for item in items if isinstance(item, dict) and item.get("name")][:limit]


def extract_cast(val, limit=4):
    """Extract top N actors from the cast list."""
    items = parse_json_safely(val)
    return [item.get("name", "").strip() for item in items if isinstance(item, dict) and item.get("name")][:limit]


def extract_director(val):
    """Extract the Director name from the crew list."""
    items = parse_json_safely(val)
    for item in items:
        if isinstance(item, dict) and item.get("job") == "Director":
            return item.get("name", "").strip()
    return ""


def collapse_name(name):
    """Collapse spaces in entity names to prevent accidental token splitting in TF-IDF."""
    return name.replace(" ", "").lower() if isinstance(name, str) else ""


def build_explanation(movie_a, movie_b, score):
    """
    Construct a truthful, grounded explanation for why movie_b was recommended for movie_a.
    Uses verifiable evidence: shared genres, shared keywords, common cast, and director.
    """
    shared_genres = list(set(movie_a["genres"]).intersection(set(movie_b["genres"])))
    shared_keywords = list(set(movie_a["keywords"]).intersection(set(movie_b["keywords"])))
    shared_cast = list(set(movie_a["cast"]).intersection(set(movie_b["cast"])))
    same_director = bool(movie_a["director"] and movie_a["director"] == movie_b["director"])

    evidence = []
    if shared_genres:
        evidence.append(f"Matching genres: {', '.join(shared_genres[:3])}")
    if shared_keywords:
        evidence.append(f"Common themes: {', '.join(shared_keywords[:3])}")
    if same_director:
        evidence.append(f"Directed by {movie_a['director']}")
    elif shared_cast:
        evidence.append(f"Starring {shared_cast[0]}")
    
    if not evidence:
        evidence.append("High contextual storyline & plot vocabulary alignment")

    reason = " • ".join(evidence)
    return {
        "shared_genres": shared_genres,
        "shared_keywords": shared_keywords,
        "shared_cast": shared_cast,
        "same_director": same_director,
        "reason": reason,
        "score": round(float(score), 3)
    }


def main():
    print("=" * 70)
    print(" CineMood — Academic ML Preprocessing & Content-Based Filtering Pipeline")
    print("=" * 70)

    start_time = time.time()
    movies_path, credits_path = find_dataset_files()

    if not movies_path or not credits_path:
        print("\n[ERROR] TMDB 5000 CSV files not found!")
        print("Please ensure the following files exist:")
        print("  - tmdb_5000_movies.csv")
        print("  - tmdb_5000_credits.csv")
        print("\nDownload them from Kaggle:")
        print("  https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata")
        print("\nPlace both files inside the 'MovieDataset' folder or next to this script.")
        print("CineMood adheres to academic honesty: never substituting fake data.")
        sys.exit(1)

    print(f"\n[1/6] Loading datasets...")
    print(f"  Movies:  {movies_path}")
    print(f"  Credits: {credits_path}")

    movies_df = pd.read_csv(movies_path)
    credits_df = pd.read_csv(credits_path)
    print(f"  Loaded {len(movies_df)} movies and {len(credits_df)} credit records.")

    print("\n[2/6] Merging datasets on unique Movie ID & cleaning missing values...")
    # Merge movies and credits using movie ID
    # tmdb_5000_movies has 'id', tmdb_5000_credits has 'movie_id'
    df = movies_df.merge(credits_df, left_on="id", right_on="movie_id", suffixes=("", "_credit"))
    
    # Drop duplicates if any
    df = df.drop_duplicates(subset=["id"]).reset_index(drop=True)

    # Impute missing textual and numerical values
    df["overview"] = df["overview"].fillna("")
    df["runtime"] = df["runtime"].fillna(0).astype(int)
    df["vote_average"] = df["vote_average"].fillna(0.0).round(1)
    df["vote_count"] = df["vote_count"].fillna(0).astype(int)
    df["popularity"] = df["popularity"].fillna(0.0).round(1)
    df["release_date"] = df["release_date"].fillna("")

    # Parse and extract structured attributes
    print("  Extracting genres, keywords, cast (top 4), and director...")
    df["genres_list"] = df["genres"].apply(extract_genres)
    df["keywords_list"] = df["keywords"].apply(extract_keywords)
    df["cast_list"] = df["cast"].apply(extract_cast)
    df["director"] = df["crew"].apply(extract_director)

    # Extract release year
    df["year"] = df["release_date"].apply(lambda d: d.split("-")[0] if isinstance(d, str) and "-" in d else "")

    print(f"  Dataset cleaned: {len(df)} valid movie records ready for feature engineering.")

    print("\n[3/6] Feature Engineering & Content Soup Generation...")
    # NLP text preprocessing: collapse entity strings to form distinct tokens
    def create_tags(row):
        overview = row["overview"].lower()
        genres = " ".join([collapse_name(g) for g in row["genres_list"]])
        keywords = " ".join([collapse_name(k) for k in row["keywords_list"]])
        cast = " ".join([collapse_name(c) for c in row["cast_list"]])
        director = collapse_name(row["director"])
        # Give higher weight to genres, keywords, and director by including them in the bag of words
        return f"{overview} {genres} {genres} {keywords} {keywords} {cast} {director}"

    df["tags"] = df.apply(create_tags, axis=1)

    print("\n[4/6] Computing TF-IDF Matrix & Cosine Similarity...")
    # TF-IDF Vectorizer with English stop words removal and n-gram range (1, 2)
    tfidf = TfidfVectorizer(max_features=5000, stop_words="english", ngram_range=(1, 2))
    tfidf_matrix = tfidf.fit_transform(df["tags"])
    print(f"  TF-IDF matrix shape: {tfidf_matrix.shape} ({tfidf_matrix.shape[0]} movies x {tfidf_matrix.shape[1]} vocabulary features)")

    # Compute cosine similarity matrix
    print("  Calculating Cosine Similarity matrix...")
    similarity = cosine_similarity(tfidf_matrix)

    print("\n[5/6] Precomputing Top 10 Explainable Recommendations for each movie...")
    # Precompute top 10 recommendations for each movie to keep the frontend instant and lightweight
    recommendations_dict = {}
    movies_list = []

    # Prepare quick-access lookup array of dicts
    movie_records = []
    for idx, row in df.iterrows():
        rec = {
            "id": int(row["id"]),
            "title": str(row["title"]),
            "overview": str(row["overview"]),
            "genres": row["genres_list"],
            "keywords": row["keywords_list"],
            "cast": row["cast_list"],
            "director": str(row["director"]),
            "vote_average": float(row["vote_average"]),
            "vote_count": int(row["vote_count"]),
            "release_date": str(row["release_date"]),
            "year": str(row["year"]),
            "runtime": int(row["runtime"]),
            "popularity": float(row["popularity"]),
        }
        movie_records.append(rec)
        movies_list.append(rec)

    for i, current_movie in enumerate(movie_records):
        movie_id = current_movie["id"]
        # Fast top-11 selection using argpartition (O(N) instead of O(N log N))
        row_sim = similarity[i]
        top_k_indices = np.argpartition(-row_sim, 12)[:12]
        # Sort only the candidate subset
        candidate_scores = [(idx, float(row_sim[idx])) for idx in top_k_indices if idx != i]
        top_candidates = sorted(candidate_scores, key=lambda x: x[1], reverse=True)[:10]

        recs = []
        for candidate_idx, score in top_candidates:
            target_movie = movie_records[candidate_idx]
            explanation = build_explanation(current_movie, target_movie, score)
            recs.append({
                "id": target_movie["id"],
                "score": explanation["score"],
                "reason": explanation["reason"],
                "shared_genres": explanation["shared_genres"][:3],
                "shared_keywords": explanation["shared_keywords"][:3],
            })

        recommendations_dict[str(movie_id)] = recs

    print("\n[6/6] Compiling ML Insights Dataset Statistics...")
    # 1. Genre distribution
    all_genres = [g for sublist in df["genres_list"] for g in sublist]
    genre_series = pd.Series(all_genres).value_counts()
    genre_distribution = [{"name": g, "count": int(c)} for g, c in genre_series.items() if g]

    # 2. Rating distribution bins
    bins = [0, 2, 4, 6, 7, 8, 10]
    labels = ["0-2", "2-4", "4-6", "6-7", "7-8", "8-10"]
    rating_binned = pd.cut(df["vote_average"], bins=bins, labels=labels, include_lowest=True).value_counts().sort_index()
    rating_distribution = [{"range": str(r), "count": int(c)} for r, c in rating_binned.items()]

    # 3. Yearly movie trends (from 1980 onwards for clean chart)
    numeric_year = pd.to_numeric(df["year"], errors="coerce")
    year_df = df[numeric_year >= 1980]
    yearly_counts = year_df["year"].value_counts().sort_index()
    yearly_distribution = [{"year": str(y), "count": int(c)} for y, c in yearly_counts.items()]

    # 4. Top Directors
    directors = df[df["director"] != ""]["director"].value_counts().head(10)
    top_directors = [{"name": str(d), "count": int(c)} for d, c in directors.items()]

    dataset_stats = {
        "total_movies": int(len(df)),
        "total_genres": int(len(genre_series)),
        "vocabulary_size": int(tfidf_matrix.shape[1]),
        "avg_rating": round(float(df[df['vote_average'] > 0]['vote_average'].mean()), 2),
        "avg_runtime": round(float(df[df['runtime'] > 0]['runtime'].mean()), 1),
        "total_votes_analyzed": int(df["vote_count"].sum()),
        "genre_distribution": genre_distribution[:12],
        "rating_distribution": rating_distribution,
        "yearly_distribution": yearly_distribution[-20:],  # Last 20 recorded years
        "top_directors": top_directors,
    }

    # Determine destination paths
    script_dir = Path(__file__).resolve().parent
    output_dirs = [
        script_dir.parent / "frontend" / "public" / "data",
        script_dir / "data"
    ]

    for out_dir in output_dirs:
        out_dir.mkdir(parents=True, exist_ok=True)
        
        movies_out = out_dir / "movies.json"
        recs_out = out_dir / "recommendations.json"
        stats_out = out_dir / "dataset_stats.json"

        with open(movies_out, "w", encoding="utf-8") as f:
            json.dump(movies_list, f, separators=(",", ":"))

        with open(recs_out, "w", encoding="utf-8") as f:
            json.dump(recommendations_dict, f, separators=(",", ":"))

        with open(stats_out, "w", encoding="utf-8") as f:
            json.dump(dataset_stats, f, indent=2)

        print(f"  Successfully saved JSON payloads to: {out_dir}")
        print(f"    - movies.json ({os.path.getsize(movies_out) / 1024:.1f} KB)")
        print(f"    - recommendations.json ({os.path.getsize(recs_out) / 1024:.1f} KB)")
        print(f"    - dataset_stats.json ({os.path.getsize(stats_out) / 1024:.1f} KB)")

    elapsed = time.time() - start_time
    print(f"\n[DONE] Pipeline completed successfully in {elapsed:.2f} seconds!")
    print("=" * 70)


if __name__ == "__main__":
    main()
