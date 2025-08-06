import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function HomepageFeatures(): ReactNode {
  return (
    <>
      {/* UTCP vs MCP Comparison */}
      <section className={styles.comparisonSection}>
        <div className="container">
          <Heading as="h2" className={clsx('text--center', styles.sectionTitle)}>
            UTCP vs MCP: The Key Difference
          </Heading>
          <div className="row">
            <div className="col col--6">
              <div className={styles.comparisonCard}>
                <div className={styles.comparisonHeader}>
                  <span className={styles.comparisonIcon}>❌</span>
                  <h3>MCP Approach</h3>
                </div>
                <div className={styles.comparisonContent}>
                  <div className={styles.architectureDiagram}>
                    <div className={styles.architectureStep}>
                      <span className={styles.stepNumber}>1</span>
                      <span>AI Agent</span>
                    </div>
                    <div className={styles.arrow}>→</div>
                    <div className={styles.architectureStep}>
                      <span className={styles.stepNumber}>2</span>
                      <span>MCP Server</span>
                    </div>
                    <div className={styles.arrow}>→</div>
                    <div className={styles.architectureStep}>
                      <span className={styles.stepNumber}>3</span>
                      <span>Your API</span>
                    </div>
                  </div>
                  <ul className={styles.comparisonList}>
                    <li>Build & maintain wrapper servers</li>
                    <li>Added latency from proxy layer</li>
                    <li>Duplicate auth & security logic</li>
                    <li>Infrastructure complexity</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col col--6">
              <div className={styles.comparisonCard}>
                <div className={styles.comparisonHeader}>
                  <span className={styles.comparisonIcon}>✅</span>
                  <h3>UTCP Approach</h3>
                </div>
                <div className={styles.comparisonContent}>
                  <div className={styles.architectureDiagram}>
                    <div className={styles.architectureStep}>
                      <span className={styles.stepNumber}>1</span>
                      <span>AI Agent</span>
                    </div>
                    <div className={styles.arrow}>→</div>
                    <div className={styles.architectureStep}>
                      <span className={styles.stepNumber}>2</span>
                      <span>Your API</span>
                    </div>
                  </div>
                  <ul className={styles.comparisonList}>
                    <li>Direct API calls, no wrappers</li>
                    <li>Zero added latency</li>
                    <li>Existing security intact</li>
                    <li>Minimal setup required</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Providers Showcase */}
      <section className={styles.providersSection}>
        <div className="container">
          <Heading as="h2" className={clsx('text--center', styles.sectionTitle)}>
            Real APIs Already Available
          </Heading>
          <p className={clsx('text--center', styles.sectionSubtitle)}>
            These APIs are ready to use with UTCP—no changes required
          </p>
          <div className={styles.providersGrid}>
            <div className={styles.providerCard}>
              <div className={styles.providerHeader}>
                <span className={styles.providerIcon}>📚</span>
                <div className={styles.providerTitleGroup}>
                  <h3>Open Library</h3>
                  <span className={styles.providerCategory}>Books & Literature</span>
                </div>
              </div>
              <p>Access millions of books and catalog data from Internet Archive</p>
              <div className={styles.providerMeta}>
                <span className={styles.providerType}>HTTP API</span>
                <span className={styles.providerStatus}>✅ Ready</span>
              </div>
            </div>
            <div className={styles.providerCard}>
              <div className={styles.providerHeader}>
                <span className={styles.providerIcon}>📰</span>
                <div className={styles.providerTitleGroup}>
                  <h3>News API</h3>
                  <span className={styles.providerCategory}>News & Media</span>
                </div>
              </div>
              <p>Current and historic news articles from thousands of sources</p>
              <div className={styles.providerMeta}>
                <span className={styles.providerType}>HTTP API</span>
                <span className={styles.providerStatus}>✅ Ready</span>
              </div>
            </div>
            <div className={styles.providerCard}>
              <div className={styles.providerHeader}>
                <span className={styles.providerIcon}>🤖</span>
                <div className={styles.providerTitleGroup}>
                  <h3>OpenAI</h3>
                  <span className={styles.providerCategory}>AI & ML</span>
                </div>
              </div>
              <p>GPT models and AI capabilities through OpenAI's API</p>
              <div className={styles.providerMeta}>
                <span className={styles.providerType}>HTTP API</span>
                <span className={styles.providerStatus}>✅ Ready</span>
              </div>
            </div>
          </div>
          <div className="text--center" style={{marginTop: '2rem'}}>
            <Link to="/registry" className={styles.ctaButton}>
              Browse All Providers →
            </Link>
          </div>
        </div>
      </section>

      {/* Community and Contributing */}
      <section className={styles.communitySection}>
        <div className="container">
          <div className="row">
            <div className="col col--6">
              <div className={styles.communityCard}>
                <span className={styles.communityIcon}>🤝</span>
                <h3>Join the Community</h3>
                <p>
                  We're building the future of AI-tool interaction together. 
                  Contribute to specs, share your use cases, or help build SDKs.
                </p>
                <div className={styles.communityLinks}>
                  <Link to="https://discord.gg/ZpMbQ8jRbD" target="_blank" rel="noopener noreferrer">Discord</Link>
                  <Link to="/about/contributing">Contributing Guide</Link>
                  <Link to="/about/RFC">Read the RFC</Link>
                </div>
              </div>
            </div>
            <div className="col col--6">
              <div className={styles.communityCard}>
                <span className={styles.communityIcon}>📖</span>
                <h3>Open Source</h3>
                <p>
                  UTCP is released under the MPL-2.0 license and maintained by AI-tooling 
                  enthusiasts who believe in direct, efficient AI-API communication.
                </p>
                <div className={styles.communityStats}>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>4+</span>
                    <span className={styles.statLabel}>Language SDKs</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>10+</span>
                    <span className={styles.statLabel}>Protocol Types</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
