import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Layout from '@theme/Layout';
import { articleService, Article } from '@site/src/services/articleService';
import styles from './blog.module.css';

// Optimized Search Component with debouncing
const SearchBar: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = React.memo(({ value, onChange, placeholder = "Search articles..." }) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputWrapper}>
        <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className={styles.searchInput}
        />
        {localValue && (
          <button 
            onClick={() => {
              setLocalValue('');
              onChange('');
            }}
            className={styles.clearButton}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
});

// Enhanced Tag Cloud with better UX
const TagCloud: React.FC<{
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}> = React.memo(({ tags, selectedTags, onTagToggle }) => {
  if (!tags.length) return null;

  return (
    <div className={styles.tagCloud}>
      <h3 className={styles.tagCloudTitle}>Popular Tags</h3>
      <div className={styles.tagCloudContainer}>
        {tags.map((tag, index) => (
          <button
            key={tag}
            className={`${styles.tagCloudItem} ${
              selectedTags.includes(tag) ? styles.tagCloudItemActive : ''
            }`}
            onClick={() => onTagToggle(tag)}
            style={{ animationDelay: `${index * 0.05}s` }}
            aria-pressed={selectedTags.includes(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
});

// Enhanced Article Card with preview functionality
const ArticleCard: React.FC<{ 
  article: Article; 
  onClick: (article: Article) => void;
  onPreview?: (article: Article) => void;
  index: number;
}> = React.memo(({ article, onClick, onPreview, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getPlatformConfig = (platform: string) => {
    const configs = {
      medium: { color: '#00ab6c', icon: 'M' },
      hackernoon: { color: '#00ff00', icon: 'HN' },
      dev: { color: '#0a0a0a', icon: 'DEV' },
      default: { color: '#6366f1', icon: 'WEB' }
    };
    return configs[platform] || configs.default;
  };

  const formatDate = useCallback((dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  const platformConfig = getPlatformConfig(article.platform);

  return (
    <article 
      className={styles.articleCard}
      style={{ 
        animationDelay: `${Math.min(index * 0.1, 1)}s`,
        '--hover-shadow-color': platformConfig.color
      } as React.CSSProperties}
    >
      {article.image && !imageError && (
        <div className={styles.cardImage}>
          <img 
            src={article.image} 
            alt={article.title}
            loading="lazy"
            className={imageLoaded ? styles.imageLoaded : styles.imageLoading}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          <div 
            className={styles.platformBadge} 
            style={{ backgroundColor: platformConfig.color }}
          >
            {platformConfig.icon}
          </div>
        </div>
      )}
      
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>
          {article.title}
        </h3>
        <p className={styles.cardExcerpt}>{article.excerpt}</p>
        
        <div className={styles.cardMeta}>
          <time className={styles.publishDate} dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
          {article.readTime && (
            <span className={styles.readTime}>{article.readTime} min read</span>
          )}
        </div>
        
        {article.tags && article.tags.length > 0 && (
          <div className={styles.cardTags}>
            {article.tags.slice(0, 3).map((tag, tagIndex) => (
              <span 
                key={tag} 
                className={styles.tag}
                style={{ animationDelay: `${(index * 0.1) + (tagIndex * 0.05)}s` }}
              >
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className={`${styles.tag} ${styles.tagMore}`}>
                +{article.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className={styles.cardActions}>
          {onPreview && (
            <button 
              className={styles.previewButton}
              onClick={(e) => {
                e.stopPropagation();
                onPreview(article);
              }}
              aria-label={`Preview ${article.title}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </button>
          )}
          <button 
            className={styles.readButton}
            onClick={() => onClick(article)}
            aria-label={`Read full article: ${article.title}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Read on {article.platform}
          </button>
        </div>
      </div>
    </article>
  );
});

// Article Preview Modal
const ArticlePreview: React.FC<{
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onReadFull: (article: Article) => void;
}> = ({ article, isOpen, onClose, onReadFull }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !article) return null;

  return (
    <div className={styles.previewOverlay} onClick={onClose}>
      <div className={styles.previewModal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>{article.title}</h2>
          <button className={styles.previewClose} onClick={onClose} aria-label="Close preview">
            ×
          </button>
        </header>
        
        <div className={styles.previewContent}>
          {article.image && (
            <img 
              src={article.image} 
              alt={article.title}
              className={styles.previewImage}
            />
          )}
          
          <div className={styles.previewMeta}>
            <time>{new Date(article.publishedAt).toLocaleDateString()}</time>
            {article.readTime && <span>{article.readTime} min read</span>}
            <span className={styles.previewPlatform}>{article.platform}</span>
          </div>

          <div className={styles.previewExcerpt}>
            <p>{article.excerpt}</p>
            <p className={styles.previewNote}>
              This is a preview. The full article is available on {article.platform}.
            </p>
          </div>

          {article.tags && (
            <div className={styles.previewTags}>
              {article.tags.map(tag => (
                <span key={tag} className={styles.previewTag}>{tag}</span>
              ))}
            </div>
          )}
        </div>

        <footer className={styles.previewFooter}>
          <button 
            className={styles.previewReadFull}
            onClick={() => onReadFull(article)}
          >
            Read Full Article on {article.platform}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </footer>
      </div>
    </div>
  );
};

// Main Blog Component
export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'readTime'>('date');
  
  // Preview state
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Optimized fetch function
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedArticles = await articleService.fetchAllArticles();
      setArticles(fetchedArticles);
    } catch (err) {
      setError('Failed to load articles. Please try again later.');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Optimized filtering and sorting
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    if (searchQuery) {
      filtered = articleService.searchArticles(filtered, searchQuery);
    }

    if (selectedTags.length > 0) {
      filtered = articleService.getArticlesByTags(filtered, selectedTags);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'readTime':
          return (b.readTime || 0) - (a.readTime || 0);
        case 'date':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });
  }, [articles, searchQuery, selectedTags, sortBy]);

  const popularTags = useMemo(() => {
    return articleService.getPopularTags(articles, 15);
  }, [articles]);

  // Event handlers
  const handleArticleClick = useCallback((article: Article) => {
    window.open(article.url, '_blank', 'noopener,noreferrer');
  }, []);

  const handleArticlePreview = useCallback((article: Article) => {
    setPreviewArticle(article);
    setIsPreviewOpen(true);
  }, []);

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedTags([]);
  }, []);

  const hasActiveFilters = searchQuery || selectedTags.length > 0;

  return (
    <Layout>
      <title>Blog - My articles across platforms</title>
      <main className={`container ${styles.blogContainer}`}>
        {/* Animated Header */}
        <header className={styles.blogHeader}>
          <h1 className={styles.blogTitle}>
            <span className={styles.titleWord}>My</span>
            <span className={styles.titleWord}>Articles</span>
          </h1>
          <p className={styles.blogSubtitle}>
            Thoughts, tutorials, and insights from across the web
          </p>
          <div className={styles.headerStats}>
            {!loading && (
              <span className={styles.statsItem}>
                {articles.length} articles published
              </span>
            )}
          </div>
        </header>

        {/* Enhanced Filters Section */}
        <section className={styles.filtersSection} aria-label="Article filters">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search articles, tags, or platforms..."
          />

          <div className={styles.filterControls}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'readTime')}
                className={styles.filterSelect}
              >
                <option value="date">Latest First</option>
                <option value="title">Title A-Z</option>
                <option value="readTime">Read Time</option>
              </select>
            </div>
          </div>

          <TagCloud
            tags={popularTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />

          {hasActiveFilters && (
            <div className={styles.activeFilters}>
              <span className={styles.activeFiltersLabel}>Active filters:</span>
              {searchQuery && (
                <span className={styles.activeFilter}>
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} aria-label="Remove search filter">×</button>
                </span>
              )}
              {selectedTags.map(tag => (
                <span key={tag} className={styles.activeFilter}>
                  {tag}
                  <button onClick={() => handleTagToggle(tag)} aria-label={`Remove ${tag} filter`}>×</button>
                </span>
              ))}
              <button className={styles.clearAllFilters} onClick={clearAllFilters}>
                Clear all
              </button>
            </div>
          )}
        </section>

        {/* Results Count */}
        {!loading && (
          <div className={styles.resultsCount} role="status" aria-live="polite">
            Showing {filteredArticles.length} of {articles.length} articles
          </div>
        )}

        {/* Loading State with Skeleton */}
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading articles from all platforms...</p>
            <div className={styles.skeletonGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeletonCard}>
                  <div className={styles.skeletonImage}></div>
                  <div className={styles.skeletonContent}>
                    <div className={styles.skeletonTitle}></div>
                    <div className={styles.skeletonText}></div>
                    <div className={styles.skeletonMeta}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={styles.errorContainer} role="alert">
            <div className={styles.errorIcon}>⚠️</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button onClick={fetchArticles} className={styles.retryButton}>
              Try Again
            </button>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && filteredArticles.length > 0 && (
          <div className={styles.articlesGrid} role="main">
            {filteredArticles.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={handleArticleClick}
                onPreview={handleArticlePreview}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredArticles.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <h3>No articles found</h3>
            <p>
              {hasActiveFilters 
                ? "Try adjusting your filters or search terms."
                : "No articles have been published yet."
              }
            </p>
            {hasActiveFilters && (
              <button className={styles.clearFiltersButton} onClick={clearAllFilters}>
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Article Preview Modal */}
        <ArticlePreview
          article={previewArticle}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onReadFull={handleArticleClick}
        />
      </main>
    </Layout>
  );
}