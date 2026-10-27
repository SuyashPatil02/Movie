# 🎬 CineMood — Smart Movie Discovery & Recommendation System

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-yellow.svg)](https://www.python.org/)
[![Scikit--Learn](https://img.shields.io/badge/Scikit--Learn-1.2%2B-F7931E.svg)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An academic Machine Learning and Full-Stack Engineering project built for 3rd-year Computer Science Engineering practicals and viva examinations. **CineMood** implements a high-performance **Content-Based Recommendation Engine** using **TF-IDF Vectorization** and **Cosine Similarity** on the real-world **TMDB 5000 Movie Dataset**, paired with an interactive, cinematic dark-themed React frontend deployable on **Vercel** with zero external API dependencies or paid keys.

---

## 📌 Project Overview

Traditional recommendation systems in academic demonstrations often rely on hardcoded arrays or toy mockups. CineMood processes real data from **4,803 films and 3.3M+ community votes**, applying natural language processing (NLP) and vector space modeling to extract latent plot and metadata features.

### Key Highlights
- **100% Real Dataset:** Ingests and cleans `tmdb_5000_movies.csv` and `tmdb_5000_credits.csv`.
- **Explainable AI:** Every recommendation discloses its exact Cosine Similarity score (e.g. `0.472`) and specific evidence (matching genres, plot themes, shared directors or lead actors).
- **Rule-Based Mood Discovery:** Deterministic mapping of emotional states (Happy, Adventurous, Romantic, etc.) to verified genre combinations—no fake emotion detection.
- **Client-Side Scalability:** Python precomputes top recommendations into compact JSON payloads, enabling instant sub-millisecond client-side filtering and full static hosting compatibility on Vercel.
- **Zero Paid APIs:** Does not require TMDB API keys, third-party backend servers, or external AI tokens.

---

## 🚀 Features

### 1. 🎭 Mood-Based Discovery
- Select from 6 curated moods: **Happy**, **Relaxed**, **Adventurous**, **Romantic**, **Suspenseful**, and **Thought-provoking**.
- Clearly mapped to verified movie genres and thematic tags.
- Transparently documented as rule-based ontology mapping for academic honesty.

### 2. ⚡ Similar Movie Recommendations (Content-Based Filtering)
- Live search across 4,800+ titles with real-time autocomplete suggestions.
- Generates the **Top 10 similar movies** ranked in descending order of Cosine Similarity.
- Quick test presets for famous films (e.g., *Inception*, *The Dark Knight*, *Avatar*, *Interstellar*, *The Avengers*, *Titanic*).

### 3. 🔍 Explainable Recommendations
- Grounded rationale box for every recommended title:
  - Exact Cosine Similarity score (0.000 to 1.000).
  - Common genres overlap pills.
  - Shared plot keywords and themes.
  - Director or starring actor matches.

### 4. 🎛️ Smart Filters & Sorting
- Dynamic multi-filter engine:
  - **Genre:** Filter by any of 18 standard TMDB genres.
  - **Minimum Rating:** Interactive slider from 0.0 to 9.0+.
  - **Era / Year:** 2010s, 2000s, 1990s, or Pre-1990 Classics.
  - **Runtime:** Quick (<90m), Standard (90–130m), or Epic (>130m).
  - **Sorting:** Popularity, Rating, Release Year, or Title.

### 5. 📌 Personal Watchlist
- Save movies with a single click.
- Persistent across browser sessions using HTML5 `localStorage`.
- Includes item counter, one-click removal, and direct "Find Similar" action.

### 6. 🎬 Movie Details Modal
- Full cinematic synopsis, director, top 4 cast members, release date, runtime, and TMDB community vote counts.
- Graceful poster fallback system: dynamically displays TMDB posters when available or renders high-aesthetic genre-themed SVG gradient cards if offline or unavailable.

### 7. 📊 ML Insights Dashboard (Recharts)
- **Genre Distribution:** Interactive bar chart of the top 12 genres in TMDB.
- **Vote Average Distribution:** Histogram displaying a Gaussian-like distribution centered at ~6.2.
- **Yearly Trend:** Area chart tracing film releases from 1980 to 2016.
- **Top 10 Directors:** Frequency distribution of notable filmmakers (Spielberg, Scorsese, Nolan, etc.).
- Real metrics: 4,803 Movies Analyzed, 5,000 TF-IDF features, 3.3M+ votes analyzed.

### 8. 🎓 Academic About & Viva Preparation Guide
- Complete explanation of mathematical formulations (TF-IDF, Cosine Similarity, Vector Space Model).
- Syllabus compliance matrix distinguishing applied concepts from unapplied algorithms.
- Interactive FAQ accordion containing 10 comprehensive viva defense answers.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite 5, JavaScript (ES6+) |
| **Styling & Design** | Tailwind CSS 3.4, Custom Glassmorphism, Google Fonts (Inter) |
| **UI Icons** | Lucide React |
| **Data Visualization** | Recharts (ResponsiveContainer, BarChart, AreaChart) |
| **Machine Learning** | Python 3.10+, Pandas, NumPy, Scikit-Learn |
| **NLP & Vectors** | `TfidfVectorizer` (max_features=5000, ngrams=(1,2)), `cosine_similarity` |
| **Client Storage** | Browser `localStorage` (Watchlist) |
| **Deployment** | GitHub, Vercel (Static SPA) |

---

## 📂 Project Structure

```text
cinemood/
├── MovieDataset/                    # Original Kaggle CSV files (git-ignored)
│   ├── tmdb_5000_movies.csv
│   └── tmdb_5000_credits.csv
├── ml/                              # Python Machine Learning pipeline
│   ├── preprocess.py                # Dataset merging, TF-IDF & similarity generator
│   ├── requirements.txt             # Python dependencies
│   └── data/                        # Local generated JSON copy
│       ├── movies.json
│       ├── recommendations.json
│       └── dataset_stats.json
├── frontend/                        # React + Vite web application
│   ├── public/
│   │   └── data/                    # Precomputed JSON served statically
│   │       ├── movies.json
│   │       ├── recommendations.json
│   │       └── dataset_stats.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Responsive top navigation & tab routing
│   │   │   ├── MovieCard.jsx        # Movie card with poster fallback & badges
│   │   │   ├── MovieDetailsModal.jsx# Full metadata modal
│   │   │   └── ExplanationBadge.jsx # Evidence & similarity score display
│   │   ├── pages/
│   │   │   ├── DiscoverPage.jsx     # Hero search, mood selector & smart filters
│   │   │   ├── RecommendPage.jsx    # Top 10 similar movies & query inspector
│   │   │   ├── WatchlistPage.jsx    # Saved movies via localStorage
│   │   │   ├── InsightsPage.jsx     # Recharts ML EDA visualizations
│   │   │   └── AboutPage.jsx        # Project documentation & Viva Q&A
│   │   ├── hooks/
│   │   │   ├── useMovieData.js      # JSON fetching & in-memory O(1) map indexing
│   │   │   └── useWatchlist.js      # LocalStorage synchronization
│   │   ├── utils/
│   │   │   └── constants.js         # Mood ontologies, genres, gradients, presets
│   │   ├── App.jsx                  # Main application orchestrator
│   │   ├── main.jsx                 # React root renderer
│   │   └── index.css                # Tailwind directives & glow utilities
│   ├── index.html                   # HTML5 shell with Google Fonts & metadata
│   ├── package.json                 # Node dependencies & build scripts
│   ├── vite.config.js               # Vite bundler configuration
│   ├── tailwind.config.js           # Custom dark theme color palette
│   ├── postcss.config.js            # PostCSS Autoprefixer plugin
│   └── vercel.json                  # SPA rewrite rules & caching headers
├── .gitignore                       # Git ignore rules for node_modules & large CSVs
└── README.md                        # Academic documentation & viva guide
```

---

## 📊 Dataset Attribution

This project uses the official **TMDB 5000 Movie Dataset** available on Kaggle:
- **Download Page:** [Kaggle TMDB 5000 Movie Metadata](https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata)
- **Files Required:**
  1. `tmdb_5000_movies.csv` (contains metadata, budget, genres, keywords, runtime, vote_average)
  2. `tmdb_5000_credits.csv` (contains movie_id, cast members, crew directors)

Place both CSV files inside a folder named `MovieDataset/` at the root of the project.

---

## ⚙️ Installation & Local Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/<your-username>/cinemood.git
cd cinemood
```

### Step 2: Set Up Python ML Preprocessing
```bash
# Navigate to ml folder (or run from root)
python -m pip install -r ml/requirements.txt

# Run the ML pipeline (takes ~15-20 seconds)
python ml/preprocess.py
```

**Expected Console Output:**
```text
======================================================================
 CineMood — Academic ML Preprocessing & Content-Based Filtering Pipeline
======================================================================
[1/6] Loading datasets...
[2/6] Merging datasets on unique Movie ID & cleaning missing values...
[3/6] Feature Engineering & Content Soup Generation...
[4/6] Computing TF-IDF Matrix & Cosine Similarity...
  TF-IDF matrix shape: (4803, 5000) (4803 movies x 5000 vocabulary features)
[5/6] Precomputing Top 10 Explainable Recommendations for each movie...
[6/6] Compiling ML Insights Dataset Statistics...
  Successfully saved JSON payloads to: frontend/public/data
    - movies.json (~3.2 MB)
    - recommendations.json (~7.4 MB)
    - dataset_stats.json (~3.1 KB)
[DONE] Pipeline completed successfully in 16.46 seconds!
======================================================================
```

### Step 3: Set Up and Run the React Frontend
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser at:
```text
http://localhost:5173/
```

---

## 🌐 Deployment on Vercel

Because CineMood precomputes recommendations into static JSON files during the ML preprocessing phase, the frontend is a **pure Single-Page Application (SPA)** that can be hosted on Vercel for free with zero backend maintenance.

### Step-by-Step Vercel Deployment

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit of CineMood recommendation system"
   git branch -M main
   git remote add origin https://github.com/<your-username>/cinemood.git
   git push -u origin main
   ```
   *(Note: The raw 45MB CSV files are in `.gitignore` and will not be pushed; the generated JSON files in `frontend/public/data/` are pushed and served directly).*

2. **Log in to [Vercel](https://vercel.com/):**
   - Click **Add New...** &rarr; **Project**.
   - Select your GitHub repository (`cinemood`).

3. **Configure Project Settings in Vercel:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click `Edit` and select `frontend` (⚠️ **Crucial Step**).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Deploy:**
   - Click **Deploy**.
   - Vercel will install dependencies, run the Vite production build, bundle Tailwind CSS, and deploy your site to a global CDN URL (e.g., `https://cinemood-app.vercel.app`).

---

## 🧠 Machine Learning Methodology

### 1. Relational Merging & Cleaning
- Merges `tmdb_5000_movies.csv` with `tmdb_5000_credits.csv` on `id == movie_id`.
- Removes duplicate entries.
- Imputes missing overviews with empty strings `""`, missing runtimes with `0`, and missing ratings with `0.0`.

### 2. Feature Engineering & Entity Collapsing
To build a discriminative content descriptor, we extract:
- **Overview:** Plot description tokens.
- **Genres:** Top categories (e.g., Action, Science Fiction).
- **Keywords:** Thematic tags (e.g., space colony, time travel).
- **Top 4 Cast Members:** Leading actors.
- **Director:** Primary filmmaker.

**Entity Collapsing:** Multi-word entities are collapsed into single tokens (e.g., `"James Cameron"` &rarr; `"jamescameron"`, `"Sam Worthington"` &rarr; `"samworthington"`). This prevents accidental token collisions where movies with completely different directors sharing a first name ("James") would register false similarity.

### 3. TF-IDF Vectorization
The combined textual tags soup is transformed into numerical vectors using `TfidfVectorizer`:
$$\text{TF}(t, d) = \frac{\text{Count of term } t \text{ in document } d}{\text{Total terms in document } d}$$
$$\text{IDF}(t) = \log\left(\frac{N}{\text{DF}(t)}\right) + 1$$
$$\text{TF-IDF}(t, d) = \text{TF}(t, d) \times \text{IDF}(t)$$
- We constrain `max_features=5000` to capture the most informative n-grams `(1, 2)` while filtering out standard English stop words.

### 4. Cosine Similarity Metric
Because document vector lengths can vary based on synopsis length, Euclidean distance would falsely penalize longer descriptions. We compute the normalized angular cosine similarity:
$$\text{Cosine Similarity}(\vec{A}, \vec{B}) = \frac{\vec{A} \cdot \vec{B}}{\|\vec{A}\| \|\vec{B}\|} = \frac{\sum_{i=1}^n A_i B_i}{\sqrt{\sum_{i=1}^n A_i^2} \sqrt{\sum_{i=1}^n B_i^2}}$$
- Scores range between **0.000** (completely orthogonal / no vocabulary overlap) and **1.000** (identical content vector).

---

## ⚖️ Academic Honesty & Syllabus Alignment

In technical college viva examinations, examiners frequently test whether students understand which algorithms were actually implemented.

| Category | Status | Academic Justification |
| :--- | :---: | :--- |
| **Content-Based Filtering** | ✅ **Used** | Core architecture of the system using movie item metadata. |
| **TF-IDF Feature Extraction** | ✅ **Used** | Converts raw text into a 5,000-dimensional weighted vector space. |
| **Cosine Similarity** | ✅ **Used** | Measures directional alignment between high-dimensional sparse vectors. |
| **Data Preprocessing (Pandas)** | ✅ **Used** | Merges relational CSVs, handles null values, parses JSON columns. |
| **Exploratory Data Analysis** | ✅ **Used** | Recharts visualizations of genre frequency, rating distributions, and yearly trends. |
| **Collaborative Filtering** | ❌ **Not Used** | Requires a massive user-item interaction matrix of individual user ratings. |
| **K-Means / Clustering** | ❌ **Not Used** | Recommendations are ranked continuously using pairwise similarity, not clustered into discrete clusters. |
| **Supervised Classification (SVM / KNN)** | ❌ **Not Used** | This is a ranking / information retrieval task, not a class-label classification task. |
| **Regression** | ❌ **Not Used** | We are not predicting continuous target variables like box-office gross. |
| **Emotion AI / Facial Detection** | ❌ **Not Used** | Mood-based discovery is an explicit rule-based domain ontology mapping. |

---

## 🎯 Viva Preparation: Questions & Answers

### Q1: What is the difference between Content-Based and Collaborative Filtering?
> **Answer:** Content-Based Filtering recommends items based on the intrinsic characteristics and features of the items themselves (e.g., genres, synopsis, actors, director). Collaborative Filtering recommends items based on user interaction patterns and ratings from similar users (user-user or item-item matrix factorization). CineMood uses Content-Based Filtering, which solves the cold-start item problem and requires no private user profiles.

### Q2: Why did you choose Cosine Similarity over Euclidean Distance?
> **Answer:** In high-dimensional text feature spaces (here, 5,000 dimensions), document length varies widely. Euclidean distance measures the straight-line magnitude difference between vector endpoints, which means two identical movies with one having a longer synopsis would have a large distance. Cosine similarity measures the angle between vectors, capturing thematic orientation independent of vector length.

### Q3: Why is Term Frequency multiplied by Inverse Document Frequency?
> **Answer:** Term Frequency (TF) alone would over-emphasize common words like "movie", "film", or "story". Inverse Document Frequency (IDF) penalizes words that appear across almost all documents and boosts rare, discriminative keywords (like "superhero", "submarines", "space colony"). Multiplying them assigns high weight only to terms that are frequent in a specific movie but rare across the entire dataset.

### Q4: Why did you collapse spaces in actor and director names?
> **Answer:** Standard tokenizers treat spaces as token delimiters. Without collapsing, "Sam Worthington" becomes `sam` and `worthington`. If another movie has "Sam Mendes", both movies would match on the token `sam`, resulting in false recommendation links. Collapsing into `samworthington` guarantees that the full entity name acts as a unique token.

### Q5: How do you handle cold-start items in this project?
> **Answer:** Because Content-Based Filtering relies entirely on item metadata, any newly added movie with an overview, genres, and cast can be immediately vectorized and recommended without waiting for user reviews or ratings.

### Q6: What are the main limitations of Content-Based Filtering?
> **Answer:**
> 1. **Overspecialization (Serendipity problem):** The system will only recommend movies similar to what the user queries, never suggesting surprising or cross-genre discoveries.
> 2. **Feature Dependency:** The recommendation quality is bounded by the quality and descriptiveness of the text metadata.

---

## 📄 License
This project is developed for educational and academic demonstration purposes under the MIT License.
Dataset metadata is provided by [The Movie Database (TMDB)](https://www.themoviedb.org/).
