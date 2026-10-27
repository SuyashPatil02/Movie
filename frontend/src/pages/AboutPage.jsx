import React, { useState } from 'react';
import {
  BookOpen,
  Code2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Layers,
  Sparkles,
  GitBranch,
  Terminal,
  ExternalLink,
} from 'lucide-react';

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const vivaQuestions = [
    {
      q: '1. What type of recommendation system is CineMood, and why was this approach chosen?',
      a: 'CineMood is a Content-Based Recommendation System. It recommends movies based on the intrinsic attributes of the items (overview, genres, keywords, cast, and director) rather than user interaction histories. This approach was chosen because it does not suffer from the cold-start item problem (new movies can be recommended immediately) and does not require private user profiles or massive user-item rating matrices.',
    },
    {
      q: '2. What is TF-IDF, and how does it work in this project?',
      a: 'TF-IDF stands for Term Frequency-Inverse Document Frequency. TF measures how frequently a term occurs in a specific movie\'s tags soup. IDF measures how important or rare the term is across all 4,803 movies (IDF = log(N / DF)). By multiplying TF by IDF, terms that appear frequently in a specific movie but rarely across the entire corpus receive higher weights, filtering out common noise words and emphasizing distinctive plot themes.',
    },
    {
      q: '3. Why is Cosine Similarity used instead of Euclidean Distance?',
      a: 'In high-dimensional text feature spaces (here, 5,000 dimensions), document length can vary significantly. Euclidean distance measures the magnitude difference between vectors, meaning longer movie synopses could falsely appear dissimilar simply due to word count. Cosine similarity measures the cosine of the angle between two vectors, focusing strictly on orientation and thematic similarity independent of document length.',
    },
    {
      q: '4. Why did we collapse multi-word entity names like "Sam Worthington" into "samworthington"?',
      a: 'If we keep spaces in names, standard tokenizers split "Sam Worthington" into "sam" and "worthington". A movie featuring "Sam Mendes" or "Sam Neill" would then register a false keyword overlap simply because of the common first name "Sam". Collapsing into "samworthington" creates a distinct, unique entity token in the vocabulary.',
    },
    {
      q: '5. Is the Mood-Based Discovery powered by an Emotion Detection Neural Network?',
      a: 'No. As stated for academic integrity, Mood-Based Discovery is a deterministic, rule-based domain ontology mapping. It maps user-selected emotional states (e.g., Happy, Adventurous, Suspenseful) to curated sets of TMDB genres and keywords. We deliberately avoid black-box or fake emotion detection.',
    },
    {
      q: '6. How are the recommendations explainable?',
      a: 'Instead of displaying unsupported "99% match" percentages, CineMood provides transparent evidence for each recommendation: exact cosine similarity scores rounded to 3 decimal places, matching genres, common plot keywords, and shared directors or lead actors.',
    },
    {
      q: '7. How did you handle missing values during preprocessing?',
      a: 'Using Pandas in preprocess.py: missing overviews were filled with empty strings (""), missing runtimes were filled with 0, missing ratings were imputed with 0.0, and unparseable JSON arrays in cast/crew were safely handled via ast.literal_eval exception handling. Duplicates on movie ID were removed.',
    },
    {
      q: '8. How does the frontend achieve instant performance without calling the TMDB API or running Python on Vercel?',
      a: 'The Python pipeline precomputes the top 10 recommendations and dataset statistics offline, saving them as optimized, compact JSON payloads. The React frontend fetches these static JSON files into an in-memory O(1) Map. This makes the frontend 100% serverless, zero-latency, and deployable on free static hosting like Vercel with zero paid API keys.',
    },
    {
      q: '9. Does CineMood use algorithms like K-Means, SVM, or Linear Regression?',
      a: 'No. This is an information retrieval and content-based filtering project using Vector Space Modeling (TF-IDF and Cosine Similarity). Falsely claiming the use of SVM, Regression, or K-Means is avoided because those algorithms solve classification/clustering/regression tasks, not content-based ranking.',
    },
    {
      q: '10. What are the limitations of Content-Based Filtering?',
      a: 'Content-Based Filtering cannot recommend serendipitous or novel movies outside the user\'s current vocabulary circle (overspecialization). It also relies heavily on the quality and richness of metadata descriptions.',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <section className="p-6 sm:p-10 rounded-3xl glass-panel border border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic CSE Engineering Project • Machine Learning Syllabus</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About CineMood & Viva Guide
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            A comprehensive overview of the machine learning pipeline, vector space mathematics, architecture decisions, and viva defense questions for practical examination.
          </p>
        </div>
      </section>

      {/* Pipeline Architecture Steps */}
      <section className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span>Machine Learning Pipeline Architecture</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">Step 1</span>
            <h3 className="font-bold text-sm text-white">Dataset Ingestion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Loads TMDB 5,000 movies & credits CSVs. Merges on movie ID and handles null values.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">Step 2</span>
            <h3 className="font-bold text-sm text-white">Feature Engineering</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts genres, keywords, top cast, director. Collapses entity strings into unified tags.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">Step 3</span>
            <h3 className="font-bold text-sm text-white">TF-IDF Vectorization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Constructs 5,000-feature sparse matrix with English stop-words filtering and n-grams.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">Step 4</span>
            <h3 className="font-bold text-sm text-white">Cosine Similarity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Computes dot products normalized by Euclidean lengths to derive angular similarity.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Step 5</span>
            <h3 className="font-bold text-sm text-white">Compact Export</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Precomputes top 10 ranked candidates with evidence for 100% serverless Vercel deployment.
            </p>
          </div>
        </div>
      </section>

      {/* Honest Viva Syllabus Matrix (Crucial for Viva Examiner) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl glass-card border border-emerald-500/30 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Concepts Implemented in Project</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Pandas Data Preprocessing:</strong> Merging relational datasets, handling missing text/ratings, deduplication.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Feature Engineering & NLP:</strong> Entity tokenization, space collapsing (e.g. "James Cameron" &rarr; "jamescameron"), tags soup composition.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>TF-IDF Vector Space Model:</strong> Term Frequency and Inverse Document Frequency matrix generation with stop words removal.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Cosine Similarity:</strong> Normalized dot product metric for high-dimensional angular distance ranking.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Exploratory Data Analysis:</strong> Frequency distributions, rating histogram, runtime analysis via Recharts.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-amber-500/30 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <AlertCircle className="w-5 h-5" />
            <span>Concepts NOT Used (Viva Transparency)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Collaborative Filtering:</strong> NOT used (requires user-item matrix of hundreds of thousands of registered user ratings).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Supervised Classification (SVM / Naive Bayes / Random Forest):</strong> NOT used because recommendation here is a similarity ranking task, not a label prediction task.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Regression:</strong> NOT used (we are not predicting continuous revenue or box office totals).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Clustering (K-Means):</strong> NOT used (similarity is calculated continuously per movie, not grouped into discrete clusters).</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Viva Q&A Accordion */}
      <section className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <span>Top Viva & Practical Examination Q&A</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Click any question below to study the technical defense prepared for your viva examination.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          {vivaQuestions.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-slate-200 hover:text-white"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
