import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Universal Tool Calling Protocol (UTCP)
        </Heading>
        <p className="hero__subtitle">A protocol that lets AI agents call any tool, over any channel—directly and without wrappers (unlike the MCP)</p>
        <div className={styles.buttons}>
          <Link
            className="button button--outline button--lg"
            to="/docs">
            📚 Read the Documentation
          </Link>
          <Link
            className="button button--outline button--lg"
            to="https://github.com/universal-tool-calling-protocol">
            💻 View on GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
