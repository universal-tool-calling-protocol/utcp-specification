import React from 'react';
import type { Provider } from '../../types/provider';
import { DISCOVER_PROVIDERS } from '../../constants/ui';
import styles from './DiscoverPage.module.css';

interface DiscoverPageProps {
  providers: Provider[];
}

interface DiscoverSection {
  title: string;
  subtitle: string;
  providers: string[];
  featured?: boolean;
}

const DISCOVER_SECTIONS: DiscoverSection[] = [
  {
    title: "APIs We Love Right Now",
    subtitle: "The most powerful tools to supercharge your AI agents",
    providers: ['openai', 'github', 'stripe'],
    featured: true
  },
  {
    title: "Quick Start",
    subtitle: "Get instant results with these beginner-friendly APIs",
    providers: ['newsapi', 'weatherbit_interactive_swagger_ui_documentation', 'openlibrary']
  },
  {
    title: "Business Tools", 
    subtitle: "Professional APIs that drive real value",
    providers: ['stripe', 'powertools_developer', 'api2pdf_pdf_generation_powered_by_aws_lambda']
  },
  {
    title: "Creative & Media",
    subtitle: "Bring your projects to life with rich content",
    providers: ['spotify', 'api2pdf_pdf_generation_powered_by_aws_lambda']
  }
];

interface ProviderVisual {
  emoji: string;
  color: string;
  gradient: string;
  description: string;
}

const PROVIDER_VISUALS: Record<string, ProviderVisual> = {
  'openai': { 
    emoji: '🤖', 
    color: '#00D4AA', 
    gradient: 'linear-gradient(135deg, #00D4AA 0%, #00A085 100%)',
    description: 'Generate text, images, and more with GPT models'
  },
  'github': { 
    emoji: '⚡', 
    color: '#24292e', 
    gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    description: 'Access repositories, issues, and development workflows'
  },
  'stripe': { 
    emoji: '💳', 
    color: '#6772E5', 
    gradient: 'linear-gradient(135deg, #6772E5 0%, #5469D4 100%)',
    description: 'Accept payments and manage transactions globally'
  },
  'newsapi': { 
    emoji: '📰', 
    color: '#FF6B35', 
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    description: 'Real-time news from thousands of sources worldwide'
  },
  'spotify': { 
    emoji: '🎵', 
    color: '#1DB954', 
    gradient: 'linear-gradient(135deg, #1DB954 0%, #1ED760 100%)',
    description: 'Stream music and manage playlists'
  },
  'openlibrary': { 
    emoji: '📚', 
    color: '#8B4513', 
    gradient: 'linear-gradient(135deg, #D2691E 0%, #8B4513 100%)',
    description: 'Access millions of books and author information'
  },
  'powertools_developer': { 
    emoji: '🛠️', 
    color: '#007ACC', 
    gradient: 'linear-gradient(135deg, #007ACC 0%, #005A9E 100%)',
    description: 'Text manipulation, date formatting, and utility functions'
  },
  'api2pdf_pdf_generation_powered_by_aws_lambda': { 
    emoji: '📄', 
    color: '#E53E3E', 
    gradient: 'linear-gradient(135deg, #E53E3E 0%, #C53030 100%)',
    description: 'Generate PDFs from URLs and documents'
  },
  'weatherbit_interactive_swagger_ui_documentation': { 
    emoji: '🌤️', 
    color: '#3182CE', 
    gradient: 'linear-gradient(135deg, #3182CE 0%, #2C5282 100%)',
    description: 'Current weather data and forecasts'
  }
};

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ providers }) => {
  const getProviderByName = (name: string): Provider | undefined => {
    return providers.find(p => p.name === name);
  };

  const ProviderCard: React.FC<{ provider: Provider; featured?: boolean; size?: 'small' | 'medium' | 'large' }> = ({ 
    provider, 
    featured = false, 
    size = 'medium' 
  }) => {
    const visual: ProviderVisual = PROVIDER_VISUALS[provider.name] || { 
      emoji: '🔧', 
      color: '#667085', 
      gradient: 'linear-gradient(135deg, #667085 0%, #475467 100%)',
      description: 'A powerful API tool for your applications'
    };
    
    return (
      <div className={`${styles.providerCard} ${featured ? styles.featured : ''} ${styles[size]}`}>
        <div className={styles.providerIcon} style={{ background: visual.gradient }}>
          <span className={styles.emoji}>{visual.emoji}</span>
        </div>
        <div className={styles.providerInfo}>
          <h3 className={styles.providerName}>
            {provider.metadata?.maintainer || provider.name}
          </h3>
          <p className={styles.providerCategory}>{provider.metadata?.category || 'Tools'}</p>
          <p className={styles.providerDescription}>
            {visual.description || provider.metadata?.description || 'No description available'}
          </p>
          {featured && (
            <div className={styles.featuredBadge}>
              <span>⭐ Featured</span>
            </div>
          )}
        </div>
        <div className={styles.providerActions}>
          <button className={styles.tryButton}>Try Now</button>
          <a 
            href={provider.metadata?.documentation_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.docsLink}
          >
            Docs
          </a>
        </div>
      </div>
    );
  };

  const HeroSection: React.FC<{ section: DiscoverSection }> = ({ section }) => {
    const sectionProviders = section.providers
      .map(getProviderByName)
      .filter((p): p is Provider => p !== undefined);

    if (sectionProviders.length === 0) return null;

    return (
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>{section.title}</h1>
            <p className={styles.heroSubtitle}>{section.subtitle}</p>
          </div>
          <div className={styles.heroCards}>
            {sectionProviders.map((provider, index) => (
              <ProviderCard 
                key={provider.name} 
                provider={provider} 
                featured={true}
                size={index === 0 ? 'large' : 'medium'}
              />
            ))}
          </div>
        </div>
      </section>
    );
  };

  const Section: React.FC<{ section: DiscoverSection }> = ({ section }) => {
    const sectionProviders = section.providers
      .map(getProviderByName) 
      .filter((p): p is Provider => p !== undefined);

    if (sectionProviders.length === 0) return null;

    return (
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          <p className={styles.sectionSubtitle}>{section.subtitle}</p>
        </div>
        <div className={styles.sectionGrid}>
          {sectionProviders.map(provider => (
            <ProviderCard key={provider.name} provider={provider} size="small" />
          ))}
        </div>
      </section>
    );
  };

  const featuredSection = DISCOVER_SECTIONS.find(s => s.featured);
  const regularSections = DISCOVER_SECTIONS.filter(s => !s.featured);

  return (
    <div className={styles.discoverPage}>
      {featuredSection && <HeroSection section={featuredSection} />}
      
      <div className={styles.sections}>
        {regularSections.map(section => (
          <Section key={section.title} section={section} />
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <h3>Ready to build with UTCP?</h3>
          <p>Direct API calls, no wrappers, no compromises.</p>
          <button className={styles.ctaButton}>Get Started</button>
        </div>
      </div>
    </div>
  );
};