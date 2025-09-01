import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Head from '@docusaurus/Head';
import styles from './projects.module.css';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: 'documentation' | 'tooling' | 'content-strategy' | 'developer-experience';
  featured: boolean;
  links: {
    demo?: string;
    repository?: string;
    documentation?: string;
  };
  metrics?: {
    label: string;
    value: string;
  }[];
}

const projectsData: Project[] = [
  {
    id: 'portfolio-docusaurus',
    title: 'Portfolio Website',
    description: 'Modern portfolio website built with Docusaurus showcasing projects, technical skills, and professional experience. Features responsive design, dark mode support, and optimized performance with static site generation.',
    technologies: ['Docusaurus', 'React', 'MDX', 'TypeScript', 'CSS3'],
    category: 'documentation',
    featured: true,
    links: {
      demo: 'https://faithkovi.xyz',
      repository: 'https://github.com/FaithKovi/faithkovi-portfolio'
    },
    metrics: [
      { label: 'Performance Score', value: '95+' },
      { label: 'Load Time', value: '<2s' }
    ]
  },
];

const categoryLabels = {
  'documentation': 'Documentation'
  // 'tooling': 'Developer Tooling',
  // 'content-strategy': 'Content Strategy',
  // 'developer-experience': 'Developer Experience'
};

const categoryColors = {
  'documentation': '#2563eb',
  'tooling': '#059669',
  'content-strategy': '#dc2626',
  'developer-experience': '#7c3aed'
};

// Dark mode category colors
const categoryColorsDark = {
  'documentation': '#3b82f6',
  'tooling': '#10b981',
  'content-strategy': '#ef4444',
  'developer-experience': '#8b5cf6'
};

export default function Projects() {
  const { siteConfig } = useDocusaurusContext();
  const [filter, setFilter] = useState<string>('all');
  const [visibleProjects, setVisibleProjects] = useState<Set<string>>(
    new Set(projectsData.map(p => p.id)) // Initialize with all project IDs visible
  );
  const [isFilterTransition, setIsFilterTransition] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setIsDarkMode(isDark);
    };

    // Check initial theme
    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  const filteredProjects = filter === 'all' 
    ? projectsData 
    : projectsData.filter(project => project.category === filter);

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const otherProjects = filteredProjects.filter(p => !p.featured);

  // Handle filter changes with transition
  const handleFilterChange = (newFilter: string) => {
    if (newFilter === filter) return;
    
    setIsFilterTransition(true);
    setFilter(newFilter);
    
    // For "All Projects", immediately show all projects to avoid observer issues
    if (newFilter === 'all') {
      setTimeout(() => {
        const allProjectIds = projectsData.map(p => p.id);
        setVisibleProjects(new Set(allProjectIds));
        setIsFilterTransition(false);
      }, 50);
    } else {
      // Reset visibility for other filters with a slight delay to prevent flickering
      setTimeout(() => {
        setVisibleProjects(new Set());
        setIsFilterTransition(false);
      }, 50);
    }
  };

  useEffect(() => {
    // Don't set up observer during filter transitions
    if (isFilterTransition) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleProjects(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Small delay to ensure DOM is updated after filter change
    const timeoutId = setTimeout(() => {
      const projectElements = document.querySelectorAll('[data-project-id]');
      projectElements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [filter, isFilterTransition]);

  const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
    const isVisible = visibleProjects.has(project.id);
    const currentCategoryColors = isDarkMode ? categoryColorsDark : categoryColors;
    
    return (
      <div
        id={project.id}
        data-project-id={project.id}
        className={`${styles.projectCard} ${isVisible ? styles.visible : ''} ${isFilterTransition ? styles.filtering : ''}`}
        style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
      >
        <div className={styles.projectHeader}>
          <div className={styles.categoryBadge} 
               style={{ backgroundColor: currentCategoryColors[project.category] }}>
            {categoryLabels[project.category]}
          </div>
          {project.featured && (
            <div className={styles.featuredBadge}>Featured</div>
          )}
        </div>
        
        <h3 className={styles.projectTitle}>{project.title}</h3>
        <p className={styles.projectDescription}>{project.description}</p>
        
        {project.metrics && (
          <div className={styles.metrics}>
            {project.metrics.map((metric, i) => (
              <div key={i} className={styles.metric}>
                <span className={styles.metricValue}>{metric.value}</span>
                <span className={styles.metricLabel}>{metric.label}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className={styles.technologies}>
          {project.technologies.map((tech, i) => (
            <span key={i} className={styles.techTag}>{tech}</span>
          ))}
        </div>
        
        <div className={styles.projectLinks}>
          {project.links.demo && (
            <a href={project.links.demo} className={styles.projectLink}>
              <span>View Demo</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </a>
          )}
          {project.links.repository && (
            <a href={project.links.repository} className={styles.projectLink}>
              <span>Repository</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </a>
          )}
          {project.links.documentation && (
            <a href={project.links.documentation} className={styles.projectLink}>
              <span>Documentation</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <Head>
        <title>Projects</title>
        <meta name="description" content="Documentation engineering and technical writing projects by Faith Kovi" />
      </Head>
      <div className={styles.projectsContainer}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Projects</h1>
            <p className={styles.subtitle}>
              Documentation engineering and technical writing projects that improve 
              developer experience and drive product adoption
            </p>
          </div>
        </header>

        <div className={styles.filterSection}>
          <div className={styles.filters}>
            <button 
              className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All Projects ({projectsData.length})
            </button>
            {Object.entries(categoryLabels).map(([key, label]) => {
              const count = projectsData.filter(p => p.category === key).length;
              const currentCategoryColors = isDarkMode ? categoryColorsDark : categoryColors;
              return (
                <button 
                  key={key}
                  className={`${styles.filterButton} ${filter === key ? styles.active : ''}`}
                  onClick={() => handleFilterChange(key)}
                  style={filter === key ? { borderColor: currentCategoryColors[key] } : {}}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <main className={styles.projectsMain}>
          {filter === 'all' ? (
            // Show all projects in a single section when "All Projects" is selected
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>All Projects</h2>
              <div className={styles.projectsGrid}>
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </section>
          ) : (
            // Show featured/other split for category filters
            <>
              {featuredProjects.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Featured Projects</h2>
                  <div className={styles.projectsGrid}>
                    {featuredProjects.map((project, index) => (
                      <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                  </div>
                </section>
              )}

              {otherProjects.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    {featuredProjects.length > 0 ? 'More Projects' : 'Projects'}
                  </h2>
                  <div className={styles.projectsGrid}>
                    {otherProjects.map((project, index) => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        index={featuredProjects.length + index} 
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </Layout>
  );
}