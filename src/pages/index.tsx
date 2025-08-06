import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function DocumentHeader() {
  return (
    <header className={styles.documentHeader}>
      <div className="container">
        <div className={styles.documentMeta}>
          <div className={styles.documentType}>Internet Draft</div>
          <div className={styles.documentDate}>January 2025</div>
        </div>
        
        <div className={styles.documentTitle}>
          <Heading as="h1" className={styles.specTitle}>
            Universal Tool Calling Protocol (UTCP)
          </Heading>
          <div className={styles.specSubtitle}>
            Specification for Direct API Integration with AI Agents
          </div>
        </div>

        <div className={styles.documentInfo}>
          <table className={styles.specTable}>
            <tbody>
              <tr>
                <td><strong>Version:</strong></td>
                <td>0.1.0 (Draft)</td>
              </tr>
              <tr>
                <td><strong>License:</strong></td>
                <td>Mozilla Public License 2.0</td>
              </tr>
              <tr>
                <td><strong>Repository:</strong></td>
                <td>
                  <Link 
                    to="https://github.com/universal-tool-calling-protocol" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.specLink}>
                    github.com/universal-tool-calling-protocol
                  </Link>
                </td>
              </tr>
              <tr>
                <td><strong>Status:</strong></td>
                <td>Draft - Request for Comments</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Universal Tool Calling Protocol"
      description="Universal Tool Calling Protocol (UTCP) - A specification for direct API integration with AI agents. Open source protocol definition.">
      <DocumentHeader />
      <main className={styles.documentMain}>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
