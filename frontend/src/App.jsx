import { useState, useEffect } from 'react';
import './index.css';

/* ─── Confidence Bar ─── */
function ConfidenceBar({ value }) {
  return (
    <div className="conf-block">
      <div className="conf-header">
        <span className="conf-label">AI Confidence Score</span>
        <span className="conf-value">{value}%</span>
      </div>
      <div className="conf-track">
        <div
          className="conf-fill"
          style={{ '--bar-w': `${value}%`, width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/* ─── Loading Skeleton ─── */
function LoadingSkeleton() {
  const messages = [
    'Streaming live financial data…',
    'Normalizing company entity…',
    'Scanning NSE / BSE market feeds…',
    'Running risk vector scoring via Nemotron…',
    'Building institutional report…',
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % messages.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="loading-section">
      <div className="loading-grid">
        <div className="skeleton-card glass">
          <div className="sk-label">Verdict Panel</div>
          <div className="sk sk-xl" style={{ width: '100%', marginBottom: '1.25rem' }} />
          <div className="sk sk-lg" style={{ width: '100%' }} />
          <div className="sk" style={{ width: '70%' }} />
          <div className="sk sk-lg" style={{ width: '100%', marginTop: '1rem' }} />
          <div className="sk" style={{ width: '60%' }} />
          <div className="sk" style={{ width: '90%' }} />
        </div>

        <div className="skeleton-card glass">
          <div className="sk-label">Analysis Report</div>
          <div className="sk" style={{ width: '45%', marginBottom: '1.25rem' }} />
          {[100, 80, 100, 68, 100, 88, 100, 64, 100, 76].map((w, i) => (
            <div key={i} className="sk" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>

      <div className="loading-status">
        <span className="spinner" />
        {messages[idx]}
      </div>
    </div>
  );
}

/* ─── Factor List ─── */
function FactorList({ items, type }) {
  const isGreen = type === 'pro';
  return (
    <ul className="factor-list">
      {items?.map((item, i) => (
        <li
          key={i}
          className="factor-item"
          style={{ animationDelay: `${0.28 + i * 0.07}s` }}
        >
          <span className={`factor-bullet ${isGreen ? 'green' : 'red'}`}>
            {isGreen ? '✓' : '✕'}
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ══════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════ */
export default function App() {
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [result, setResult]           = useState(null);
  const [error, setError]             = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const res = await fetch('https://tradevest-ai.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${res.status}: Failed to fetch research data`);
      }

      const data = await res.json();
      setResult({ ...data, queryName: companyName });
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isInvest = result?.decision === 'Invest';

  return (
    <>
      {/* ── Animated background blobs ── */}
      <div className="bg-scene">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <div className="page">
        {/* ── Navbar ── */}
        <nav className="navbar" style={{ justifyContent: 'center' }}>
          <div className="brand">
            <span className="brand-trade">Trade</span>
            <span className="brand-vest">Vest</span>
            <span className="brand-ai">AI</span>
          </div>
        </nav>

        {/* ── Main area ── */}
        <main className="main">

          {/* Search block */}
          <div className="search-block">
            <div className="search-header">
              <div className="search-header-eyebrow">
                <span className="pulse-dot" />
                Powered by Nemotron · Tavily Live Search
              </div>
              <h2>Analyze any listed company, globally or on Indian exchanges</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="search-card glass">
                <label className="search-label" htmlFor="companyInput">
                  Company or Stock Name
                </label>
                <div className="search-row">
                  <input
                    id="companyInput"
                    type="text"
                    className="search-input"
                    placeholder="e.g. Apple · Tata Motors · NVIDIA · Reliance…"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={isLoading}
                    required
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="search-btn"
                    disabled={isLoading || !companyName.trim()}
                  >
                    {isLoading ? 'Analyzing…' : 'Analyze →'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Error */}
          {error && (
            <div className="error-banner">
              <div className="error-inner">
                <span>⚠️</span>
                {error}
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && <LoadingSkeleton />}

          {/* Results */}
          {result && !isLoading && (
            <div className="results-section">
              <div className="results-grid">

                {/* Verdict Card */}
                <div className="verdict-card glass">
                  <div className="verdict-company">
                    {result.company || result.queryName}
                  </div>

                  <div className={`verdict-badge ${isInvest ? 'invest' : 'pass'}`}>
                    <span>{isInvest ? '📈' : '⛔'}</span>
                    {result.decision}
                  </div>

                  {result.companyDetails && (
                    <p className="verdict-details">{result.companyDetails}</p>
                  )}

                  {result.confidence != null && (
                    <ConfidenceBar value={result.confidence} />
                  )}
                </div>

                {/* Analysis Card */}
                <div className="analysis-card glass">
                  <div className="analysis-eyebrow">
                    Institutional Analysis Report
                  </div>

                  {/* Pros */}
                  <div>
                    <div className="section-head">
                      <div className="section-icon green">💡</div>
                      <span className="section-label green">Growth Drivers &amp; Strengths</span>
                    </div>
                    <FactorList items={result.pros} type="pro" />
                  </div>

                  <div className="divider" />

                  {/* Cons */}
                  <div>
                    <div className="section-head">
                      <div className="section-icon red">⚠️</div>
                      <span className="section-label red">Risk Factors &amp; Headwinds</span>
                    </div>
                    <FactorList items={result.cons} type="con" />
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="footer">
          <span>© 2026 <span className="footer-brand">TradeVest AI</span>. For informational purposes only.</span>
          <span>Not financial advice.</span>
        </footer>
      </div>
    </>
  );
}
