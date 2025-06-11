import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Parser from 'rss-parser';

type Article = {
  title: string;
  link: string;
  pubDate: string;
};

const MEDIUM_RSS_URL = 'https://medium.com/feed/@faithkovi'; // Replace with your Medium username
const CACHE_KEY = 'medium_articles_cache';
const CACHE_DURATION = 1000 * 60 * 60 * 6; // 6 hours

const MediumFeed: React.FC<{ limit?: number }> = ({ limit = 5 }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setArticles(data.slice(0, limit));
        setLoading(false);
        return;
      }
    }

    const fetchArticles = async () => {
      try {
        const response = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_RSS_URL)}`);
        const items = response.data.items.slice(0, limit).map((item: any) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate
        }));
        setArticles(items);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: items, timestamp: Date.now() }));
      } catch (error) {
        console.error('Failed to fetch Medium articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [limit]);

  if (loading) return <p className="text-sm text-gray-500">Loading Medium articles...</p>;

  return (
    <div className="space-y-4">
      {articles.map((article, index) => (
        <div key={index} className="border rounded-xl p-4 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-primary">{article.title}</h3>
          <p className="text-sm text-gray-500">{new Date(article.pubDate).toLocaleDateString()}</p>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-blue-600 hover:underline"
          >
            Read more on Medium →
          </a>
        </div>
      ))}
    </div>
  );
};

export default MediumFeed;
