// src/services/articleService.ts

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  publishedAt: string;
  platform: 'medium' | 'hackernoon' | 'dev' | 'personal' | 'hashnode' | 'substack' | 'clouddley' | 'other';
  url: string;
  author: string;
  readTime?: number;
  tags?: string[];
  image?: string;
}

// Custom articles configuration (without images - they'll be fetched automatically)
const customArticles: Omit<Article, 'image'>[] = [
  {
    id: 'custom-1',
    title: 'Run apps, databases, brokers, and AI anywhere - with no vendor lock-in',
    excerpt: 'Learn how Clouddley lets teams deploy and run workloads anywhere without being tied to a single cloud provider....',
    publishedAt: '2025-12-02T10:00:00Z',
    platform: 'clouddley',
    url: 'https://blog.clouddley.com/posts/run-apps-databases-brokers-and-ai-anywhere-with-no-vendor-lock-in', // Image will be extracted from this URL
    author: 'Faith Kovi',
    readTime: 4,
    tags: ['clouddley']
  },
  {
    id: 'custom-2',
    title: 'How We Cut Our Google Cloud Bill by 60% with Clouddley',
    excerpt: 'A breakdown of how Clouddley helped reduce cloud costs by 60% while improving control, visibility, and performance....',
    publishedAt: '2025-11-05T14:30:00Z',
    platform: 'clouddley',
    url: 'https://blog.clouddley.com/posts/how-we-cut-our-cloud-bill-by-60-percent-with-clouddley',
    author: 'Faith Kovi',
    readTime: 4,
    tags: ['clouddley']
  }
];

class ArticleService {
  private readonly RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';
  private imageCache = new Map<string, string | null>();
  
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
   * Extract Open Graph image from a URL using a metadata API
   * Uses multiple methods as fallback
   */
  private async extractOGImage(url: string): Promise<string | undefined> {
    // Check cache first
    if (this.imageCache.has(url)) {
      const cached = this.imageCache.get(url);
      return cached || undefined;
    }

    try {
      // Method 1: Try using a CORS proxy to fetch the page directly
      // This is the most reliable method
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (data.contents) {
        const html = data.contents;
        
        // Try to extract og:image
        const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
        if (ogImageMatch && ogImageMatch[1]) {
          this.imageCache.set(url, ogImageMatch[1]);
          return ogImageMatch[1];
        }

        // Try twitter:image as fallback
        const twitterImageMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
        if (twitterImageMatch && twitterImageMatch[1]) {
          this.imageCache.set(url, twitterImageMatch[1]);
          return twitterImageMatch[1];
        }

        // Try to find any image in meta tags
        const anyMetaImage = html.match(/<meta[^>]*content=["']([^"']*\.(?:jpg|jpeg|png|gif|webp)[^"']*)["']/i);
        if (anyMetaImage && anyMetaImage[1]) {
          this.imageCache.set(url, anyMetaImage[1]);
          return anyMetaImage[1];
        }
      }
    } catch (error) {
      console.warn(`Failed to extract image from ${url}:`, error);
    }

    // Method 2: Try OpenGraph.io API (has free tier)
    // Uncomment if you have an API key
    // try {
    //   const apiKey = 'YOUR_OPENGRAPH_IO_KEY';
    //   const response = await fetch(`https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?app_id=${apiKey}`);
    //   const data = await response.json();
    //   if (data.hybridGraph?.image) {
    //     this.imageCache.set(url, data.hybridGraph.image);
    //     return data.hybridGraph.image;
    //   }
    // } catch (error) {
    //   console.warn('OpenGraph.io fallback failed:', error);
    // }

    // Cache null result to avoid repeated failed attempts
    this.imageCache.set(url, null);
    return undefined;
  }

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
   * Fetch custom articles and extract their OG images
   */
  async fetchCustomArticles(): Promise<Article[]> {
    const articlesWithImages = await Promise.all(
      customArticles.map(async (article) => {
        // Try to extract image from URL
        const image = await this.extractOGImage(article.url);
        
        return {
          ...article,
          image
        } as Article;
      })
    );

    return articlesWithImages;
  }

  /**
   * Fetch articles from all platforms (including custom ones)
   */
  async fetchAllArticles(): Promise<Article[]> {
    try {
      const [
        mediumArticles, 
        hackernoonArticles, 
        devArticles,
        customArticlesList
      ] = await Promise.allSettled([
        this.fetchMediumArticles(),
        this.fetchHackernoonArticles(),
        this.fetchDevArticles(),
        this.fetchCustomArticles() // This now includes image extraction
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

      if (customArticlesList.status === 'fulfilled') {
        allArticles.push(...customArticlesList.value);
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
   * Manually refresh image for a specific article (useful for retry)
   */
  async refreshArticleImage(article: Article): Promise<Article> {
    // Clear cache for this URL
    this.imageCache.delete(article.url);
    
    // Re-fetch image
    const image = await this.extractOGImage(article.url);
    
    return {
      ...article,
      image
    };
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
    
    const plainText = content.replace(/<[^>]*>/g, '');
    
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
      return categories.slice(0, 5);
    }
    
    return categories.split(/[,;|]/).map(tag => tag.trim()).filter(Boolean).slice(0, 5);
  }

  private extractImage(content: string): string | undefined {
    if (!content) return undefined;
    
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