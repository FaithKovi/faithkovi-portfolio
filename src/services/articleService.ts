// src/services/articleService.ts

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  publishedAt: string;
  platform: 'medium' | 'hackernoon' | 'dev' | 'other';
  url: string;
  author: string;
  readTime?: number;
  tags?: string[];
  image?: string;
}

class ArticleService {
  private readonly RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';
  
  // Your platform configurations
  private readonly platforms = {
    medium: {
      rssUrl: 'https://medium.com/feed/@vera-kaka',
      name: 'medium'
    },
    hackernoon: {
      rssUrl: 'https://hackernoon.com/feed/u/faithkovi',
      name: 'hackernoon'
    },
    dev: {
      rssUrl: 'https://dev.to/feed/your-username',
      name: 'dev'
    }
  };

  /**
   * Fetch articles from Medium via RSS
   */
  async fetchMediumArticles(): Promise<Article[]> {
    try {
      const response = await fetch(
        `${this.RSS_TO_JSON_API}?rss_url=${encodeURIComponent(this.platforms.medium.rssUrl)}`
      );
      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error('Failed to fetch Medium articles');
      }

      return data.items.map((item: any) => this.transformMediumArticle(item));
    } catch (error) {
      console.error('Error fetching Medium articles:', error);
      return [];
    }
  }

  /**
   * Fetch articles from Hackernoon via RSS
   */
  async fetchHackernoonArticles(): Promise<Article[]> {
    try {
      const response = await fetch(
        `${this.RSS_TO_JSON_API}?rss_url=${encodeURIComponent(this.platforms.hackernoon.rssUrl)}`
      );
      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error('Failed to fetch Hackernoon articles');
      }

      return data.items.map((item: any) => this.transformHackernoonArticle(item));
    } catch (error) {
      console.error('Error fetching Hackernoon articles:', error);
      return [];
    }
  }

  /**
   * Fetch articles from Dev.to via their API
   */
  async fetchDevArticles(): Promise<Article[]> {
    try {
      const response = await fetch('https://dev.to/api/articles?username=your-username');
      const articles = await response.json();
      
      return articles.map((article: any) => this.transformDevArticle(article));
    } catch (error) {
      console.error('Error fetching Dev.to articles:', error);
      return [];
    }
  }

  /**
   * Fetch articles from all platforms
   */
  async fetchAllArticles(): Promise<Article[]> {
    try {
      const [mediumArticles, hackernoonArticles, devArticles] = await Promise.allSettled([
        this.fetchMediumArticles(),
        this.fetchHackernoonArticles(),
        this.fetchDevArticles()
      ]);

      const allArticles: Article[] = [];

      if (mediumArticles.status === 'fulfilled') {
        allArticles.push(...mediumArticles.value);
      }

      if (hackernoonArticles.status === 'fulfilled') {
        allArticles.push(...hackernoonArticles.value);
      }

      if (devArticles.status === 'fulfilled') {
        allArticles.push(...devArticles.value);
      }

      // Sort by publication date (newest first)
      return allArticles.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching articles from all platforms:', error);
      return [];
    }
  }

  /**
   * Transform Medium RSS item to Article interface
   */
  private transformMediumArticle(item: any): Article {
    return {
      id: this.generateId(item.link),
      title: item.title,
      excerpt: this.extractExcerpt(item.description || item.content),
      content: item.content,
      publishedAt: item.pubDate,
      platform: 'medium',
      url: item.link,
      author: item.author || 'Unknown',
      readTime: this.estimateReadTime(item.content || item.description),
      tags: this.extractTags(item.categories),
      image: this.extractImage(item.content || item.description)
    };
  }

  /**
   * Transform Hackernoon RSS item to Article interface
   */
  private transformHackernoonArticle(item: any): Article {
    return {
      id: this.generateId(item.link),
      title: item.title,
      excerpt: this.extractExcerpt(item.description || item.content),
      content: item.content,
      publishedAt: item.pubDate,
      platform: 'hackernoon',
      url: item.link,
      author: item.author || 'Unknown',
      readTime: this.estimateReadTime(item.content || item.description),
      tags: this.extractTags(item.categories),
      image: this.extractImage(item.content || item.description)
    };
  }

  /**
   * Transform Dev.to API response to Article interface
   */
  private transformDevArticle(article: any): Article {
    return {
      id: article.id.toString(),
      title: article.title,
      excerpt: article.description,
      publishedAt: article.published_at,
      platform: 'dev',
      url: article.url,
      author: article.user.name,
      readTime: article.reading_time_minutes,
      tags: article.tag_list,
      image: article.cover_image || article.social_image
    };
  }

  /**
   * Utility methods
   */
  private generateId(url: string): string {
    return btoa(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
  }

  private extractExcerpt(content: string, maxLength: number = 200): string {
    if (!content) return '';
    
    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, '');
    
    // Truncate to maxLength
    if (plainText.length <= maxLength) return plainText;
    
    return plainText.substring(0, maxLength).trim() + '...';
  }

  private estimateReadTime(content: string): number {
    if (!content) return 1;
    
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.round(wordCount / wordsPerMinute));
  }

  private extractTags(categories: string[] | string): string[] {
    if (!categories) return [];
    
    if (Array.isArray(categories)) {
      return categories.slice(0, 5); // Limit to 5 tags
    }
    
    // If it's a string, split by common separators
    return categories.split(/[,;|]/).map(tag => tag.trim()).filter(Boolean).slice(0, 5);
  }

  private extractImage(content: string): string | undefined {
    if (!content) return undefined;
    
    // Try to extract first image from HTML content
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : undefined;
  }

  /**
   * Search articles by query
   */
  searchArticles(articles: Article[], query: string): Article[] {
    if (!query.trim()) return articles;
    
    const searchTerm = query.toLowerCase();
    
    return articles.filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      article.platform.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Filter articles by platform
   */
  filterByPlatform(articles: Article[], platform: string): Article[] {
    if (platform === 'all') return articles;
    return articles.filter(article => article.platform === platform);
  }

  /**
   * Filter articles by date range
   */
  filterByDateRange(articles: Article[], startDate?: Date, endDate?: Date): Article[] {
    return articles.filter(article => {
      const articleDate = new Date(article.publishedAt);
      
      if (startDate && articleDate < startDate) return false;
      if (endDate && articleDate > endDate) return false;
      
      return true;
    });
  }

  /**
   * Get articles by tags
   */
  getArticlesByTags(articles: Article[], tags: string[]): Article[] {
    if (!tags.length) return articles;
    
    return articles.filter(article => 
      article.tags?.some(tag => 
        tags.some(searchTag => 
          tag.toLowerCase().includes(searchTag.toLowerCase())
        )
      )
    );
  }

  /**
   * Get popular tags from all articles
   */
  getPopularTags(articles: Article[], limit: number = 10): string[] {
    const tagCounts: { [key: string]: number } = {};
    
    articles.forEach(article => {
      article.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag]) => tag);
  }
}






export const articleService = new ArticleService();