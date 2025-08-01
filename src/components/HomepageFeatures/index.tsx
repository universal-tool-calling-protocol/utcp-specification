import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function HomepageFeatures(): ReactNode {
  return (
    <>
      {/* Introduction Section */}
      <section className={styles.features}>
        <div className="container">
          <div className="row">
            <div className="col col--12">
              <div className="text--center padding-horiz--md">
                <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>
                  The Universal Tool Calling Protocol (UTCP) is an open standard, as an alternative to the MCP, 
                  that describes how to call existing tools rather than proxying those calls through a new server. 
                  After discovery, the agent speaks directly to the tool's native endpoint (HTTP, gRPC, WebSocket, CLI, …), 
                  eliminating the "wrapper tax," reducing latency, and letting you keep your existing auth, billing and security in place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className={clsx(styles.features, 'padding-vert--lg')} style={{backgroundColor: 'var(--ifm-color-emphasis-100)'}}>
        <div className="container">
          <div className="row">
            <div className="col col--12">
              <Heading as="h2" className="text--center margin-bottom--lg">Getting Started</Heading>
              <div className="row">
                <div className="col col--6">
                  <ul style={{fontSize: '1.1rem'}}>
                    <li>📚 <Link to="/docs">Read the Documentation</Link> for specs, examples and best practices</li>
                    <li>📜 Read the <Link to="/about/RFC">RFC</Link> for the formal proposal</li>
                    <li>🤖 Play around with the <Link to="https://github.com/universal-tool-calling-protocol/utcp-agent">UTCP-agent</Link> and <Link to="https://github.com/universal-tool-calling-protocol/utcp-examples">UTCP-examples</Link> to prototype how the protocol works</li>
                  </ul>
                </div>
                <div className="col col--6">
                  <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}><strong>💻 Start building with our SDKs:</strong></p>
                  <ul style={{fontSize: '1.1rem'}}>
                    <li><Link to="https://github.com/universal-tool-calling-protocol/python-utcp">Python SDK</Link></li>
                    <li><Link to="https://github.com/universal-tool-calling-protocol/typescript-utcp">TypeScript SDK</Link></li>
                    <li><Link to="https://github.com/universal-tool-calling-protocol/go-utcp">Go SDK</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UTCP vs MCP Section */}
      <section className={clsx(styles.features, 'padding-vert--lg')} style={{backgroundColor: 'var(--ifm-color-emphasis-100)'}}>
        <div className="container">
          <div className="row">
            <div className="col col--12">
              <div className="text--center margin-bottom--lg">
                <p style={{fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>
                  UTCP's Core principle:
                </p>
                <p style={{fontSize: '1.2rem', fontStyle: 'italic'}}>
                  If humans can interact with an API, AI should be able to do the same with no change in the API and the same security guarantees.
                </p>
              </div>
              
              <div className="row">
                <div className="col col--12">
                  <Heading as="h3" className="margin-bottom--md">Core Requirements</Heading>
                  <div className="row">
                    <div className="col col--6">
                      <ul style={{fontSize: '1.1rem'}}>
                        <li><strong>No wrapper tax:</strong> UTCP must be able to call any tool without requiring any changes to the tool itself or the infrastructure required to call it.</li>
                        <li><strong>No security tax:</strong> UTCP must be able to call any tool while guaranteeing the same security as if the tool was called by a human.</li>
                      </ul>
                    </div>
                    <div className="col col--6">
                      <ul style={{fontSize: '1.1rem'}}>
                        <li><strong>Scalable:</strong> UTCP must be able to handle a large number of tools and calls.</li>
                        <li><strong>Simple:</strong> UTCP must be simple to implement and use.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contributing and About Section */}
      <section className={clsx(styles.features, 'padding-vert--lg')}>
        <div className="container">
          <div className="row">
            <div className="col col--6">
              <Heading as="h2" className="margin-bottom--md">Contributing</Heading>
              <p style={{fontSize: '1.1rem'}}>
                We welcome issues, pull requests and design discussion. If you'd like to add support for another language, 
                tool or framework, open a discussion first so we can align on the design!
              </p>
            </div>
            <div className="col col--6">
              <Heading as="h2" className="margin-bottom--md">About</Heading>
              <p style={{fontSize: '1.1rem'}}>
                UTCP is an open‑source project released under the MPL‑2.0 license and maintained by a growing community 
                of AI‑tooling enthusiasts. If your organization relies on direct, low‑latency access to existing APIs—or 
                if you simply dislike writing wrappers—we'd love to have you involved!
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
