import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from 'recharts';
import { BarChart3, Database, Film, Star, Clock, Layers, Users, BookOpen } from 'lucide-react';

export default function InsightsPage({ stats }) {
  if (!stats) {
    return (
      <div className="py-20 text-center glass-card rounded-3xl p-8">
        <p className="text-sm text-slate-400">Loading ML Insights Dataset Statistics...</p>
      </div>
    );
  }

  const customTooltipStyle = {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderRadius: '12px',
    color: '#f8fafc',
    fontSize: '12px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <section className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Exploratory Data Analysis (EDA) & Recharts</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Machine Learning Insights Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Quantitative analysis of the merged TMDB 5000 Movie & Credits dataset used to train our Content-Based TF-IDF recommendation engine.
          </p>
        </div>
      </section>

      {/* Key Metric KPI Cards */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Movies Analyzed</span>
            <Film className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats.total_movies?.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">TMDB verified records</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">TF-IDF Vocabulary</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-mono">
              {stats.vocabulary_size?.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">1-gram & 2-gram features</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Rating</span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              {stats.avg_rating} <span className="text-sm font-normal text-slate-400">/ 10</span>
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Mean vote score</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Runtime</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
              {stats.avg_runtime} <span className="text-sm font-normal text-slate-400">min</span>
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">~1 hr 48 mins</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Votes</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300">
              {(stats.total_votes_analyzed / 1000000).toFixed(1)}M+
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Community votes</span>
          </div>
        </div>
      </section>

      {/* Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Distribution Chart */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Film className="w-4 h-4 text-indigo-400" />
              <span>Genre Distribution (Top 12 Genres)</span>
            </h3>
            <p className="text-xs text-slate-400">Total movie count per category</p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.genre_distribution} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={customTooltipStyle} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.genre_distribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? '#6366f1' : '#8b5cf6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rating Distribution Histogram */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Vote Average Distribution (Histogram)</span>
            </h3>
            <p className="text-xs text-slate-400">Demonstrates a near-Gaussian distribution centered at ~6.2</p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.rating_distribution} margin={{ top: 10, right: 10, left: -15, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="range" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={customTooltipStyle} cursor={{ fill: 'rgba(245, 158, 11, 0.1)' }} />
                <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]}>
                  {stats.rating_distribution.map((entry, index) => (
                    <Cell
                      key={`cell-rating-${index}`}
                      fill={entry.range === '6-7' ? '#f59e0b' : '#d97706'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yearly Releases Timeline */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Movie Releases Trend (1998 – 2016)</span>
            </h3>
            <p className="text-xs text-slate-400">Annual distribution of titles in the dataset</p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.yearly_distribution} margin={{ top: 10, right: 10, left: -15, bottom: 10 }}>
                <defs>
                  <linearGradient id="yearGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#yearGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Directors */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Top 10 Most Frequent Directors</span>
            </h3>
            <p className="text-xs text-slate-400">Number of films directed in this dataset</p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.top_directors}
                layout="vertical"
                margin={{ top: 5, right: 15, left: 35, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                  width={100}
                />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
    </section>
     {/* 

      {/* EDA Academic Explanation Note *}
      <section className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-3">
        <div className="flex items-center space-x-2 text-indigo-300 font-bold text-sm">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>Exploratory Data Analysis (EDA) Insights for Viva</span>
        </div>
        <ul className="list-disc list-inside space-y-1.5 text-slate-400 leading-relaxed">
          <li>
            <strong className="text-slate-200">Class Imbalance:</strong> Drama (2,297) and Comedy (1,722) comprise over 50% of the dataset, while niche genres like Mystery (348) and War are less represented.
          </li>
          <li>
            <strong className="text-slate-200">Rating Distribution:</strong> The vote averages follow a bell-shaped curve peaking between 6.0 and 7.0, with an overall mean of 6.17.
          </li>
          <li>
            <strong className="text-slate-200">Feature Sparsity:</strong> With 5,000 TF-IDF features across 4,803 documents, the feature space is sparse, which is ideal for cosine similarity computations.
          </li>
        </ul>
      </section> */}
    </div>
  );
}
