import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function HomepageFeatures(): ReactNode {
  return (
    <>
      {/* Abstract */}
      <section className={styles.specSection}>
        <div className="container">
          <Heading as="h2" className={styles.specSectionTitle}>
            Abstract
          </Heading>
          <div className={styles.specContent}>
            <p>
              The Universal Tool Calling Protocol (UTCP) is a specification that enables 
              AI agents to directly interact with tool endpoints using native protocols. 
              This specification defines a standardized format for describing tool 
              capabilities, input schemas, and implementation details across multiple 
              communication protocols including HTTP, gRPC, WebSocket, and CLI interfaces.
            </p>
            <p>
              UTCP addresses the need for a unified approach to tool integration in 
              AI systems by providing a protocol-agnostic description format that 
              allows agents to understand and invoke tools without requiring 
              custom integration code for each service.
            </p>
          </div>
        </div>
      </section>

      {/* Tool Specification Format */}
      <section className={styles.specSection}>
        <div className="container">
          <Heading as="h2" className={styles.specSectionTitle}>
            1. Tool Specification Format
          </Heading>
          <div className={styles.specContent}>
            <p>
              A UTCP tool specification is defined as a JSON document containing 
              the following required and optional fields:
            </p>
            
            <div className={styles.specExample}>
              <div className={styles.exampleTitle}>Example 1: HTTP Tool Definition</div>
              <pre className={styles.exampleCode}>
{`{
  "name": "weather_api",
  "description": "Retrieve current weather information for a location",
  "version": "1.0",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name or coordinates"
      },
      "units": {
        "type": "string",
        "enum": ["metric", "imperial", "kelvin"],
        "default": "metric"
      }
    },
    "required": ["location"]
  },
  "implementation": {
    "protocol": "http",
    "method": "GET",
    "url": "https://api.weather.service/v1/current",
    "headers": {
      "Authorization": "Bearer {{API_KEY}}",
      "Accept": "application/json"
    },
    "parameters": {
      "q": "{{location}}",
      "units": "{{units}}"
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Support */}
      <section className={styles.specSection}>
        <div className="container">
          <Heading as="h2" className={styles.specSectionTitle}>
            2. Supported Protocols
          </Heading>
          <div className={styles.specContent}>
            <p>
              UTCP supports multiple communication protocols to accommodate diverse 
              integration requirements:
            </p>
            
            <div className={styles.specList}>
              <div className={styles.specListItem}>
                <strong>HTTP/HTTPS</strong> - RESTful APIs and GraphQL endpoints
                <div className={styles.specListDetail}>
                  Supports GET, POST, PUT, DELETE, PATCH methods with customizable 
                  headers, query parameters, and request bodies.
                </div>
              </div>
              <div className={styles.specListItem}>
                <strong>gRPC</strong> - Remote procedure call framework
                <div className={styles.specListDetail}>
                  Binary protocol with strong typing and efficient serialization 
                  using Protocol Buffers.
                </div>
              </div>
              <div className={styles.specListItem}>
                <strong>WebSocket</strong> - Bidirectional communication
                <div className={styles.specListDetail}>
                  Real-time communication for streaming data and interactive tools.
                </div>
              </div>
              <div className={styles.specListItem}>
                <strong>CLI</strong> - Command-line interfaces
                <div className={styles.specListDetail}>
                  Execute system commands and interact with command-line tools.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Guide */}
      <section className={styles.specSection}>
        <div className="container">
          <Heading as="h2" className={styles.specSectionTitle}>
            3. Implementation Guide
          </Heading>
          <div className={styles.specContent}>
            <p>
              To implement UTCP support, systems must provide the following capabilities:
            </p>
            
            <div className={styles.implementationTable}>
              <table>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Required</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Parser</strong></td>
                    <td>Yes</td>
                    <td>JSON schema validation and tool definition parsing</td>
                  </tr>
                  <tr>
                    <td><strong>Protocol Adapters</strong></td>
                    <td>Yes</td>
                    <td>Support for HTTP, with optional gRPC, WebSocket, CLI</td>
                  </tr>
                  <tr>
                    <td><strong>Authentication Handler</strong></td>
                    <td>Yes</td>
                    <td>Bearer, API-Key, OAuth2, Basic authentication schemes</td>
                  </tr>
                  <tr>
                    <td><strong>Parameter Resolution</strong></td>
                    <td>Yes</td>
                    <td>Template variable substitution ({`{{variable_name}}`})</td>
                  </tr>
                  <tr>
                    <td><strong>Response Processor</strong></td>
                    <td>Yes</td>
                    <td>Handle protocol-specific responses and error codes</td>
                  </tr>
                  <tr>
                    <td><strong>Registry Client</strong></td>
                    <td>Optional</td>
                    <td>Discovery and retrieval of tool specifications</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              For detailed implementation examples, see the 
              <Link to="/docs" className={styles.inlineLink}> documentation</Link> and 
              <Link to="/registry" className={styles.inlineLink}> tool registry</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* References */}
      <section className={styles.specSection}>
        <div className="container">
          <Heading as="h2" className={styles.specSectionTitle}>
            4. References
          </Heading>
          <div className={styles.specContent}>
            <div className={styles.referenceList}>
              <div className={styles.referenceItem}>
                <strong>[RFC7617]</strong> Reschke, J., "The 'Basic' HTTP Authentication Scheme", RFC 7617, September 2015.
              </div>
              <div className={styles.referenceItem}>
                <strong>[RFC6749]</strong> Hardt, D., Ed., "The OAuth 2.0 Authorization Framework", RFC 6749, October 2012.
              </div>
              <div className={styles.referenceItem}>
                <strong>[RFC6750]</strong> Jones, M. and D. Hardt, "The OAuth 2.0 Authorization Framework: Bearer Token Usage", RFC 6750, October 2012.
              </div>
              <div className={styles.referenceItem}>
                <strong>[JSON-Schema]</strong> Wright, A. and H. Andrews, "JSON Schema: A Media Type for Describing JSON Documents", draft-handrews-json-schema-02, September 2019.
              </div>
              <div className={styles.referenceItem}>
                <strong>[HTTP/1.1]</strong> Fielding, R., et al., "Hypertext Transfer Protocol (HTTP/1.1): Message Syntax and Routing", RFC 7230, June 2014.
              </div>
              <div className={styles.referenceItem}>
                <strong>[gRPC]</strong> Google, "gRPC: A high performance, open source universal RPC framework", 2023.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appendix */}
      <section className={styles.specSection}>
        <div className="container">
          <Heading as="h2" className={styles.specSectionTitle}>
            Appendix A: Tool Registry
          </Heading>
          <div className={styles.specContent}>
            <p>
              This specification includes a reference implementation and tool registry 
              containing 127 tool definitions covering major API providers and services.
            </p>
            
            <div className={styles.appendixLinks}>
              <div className={styles.appendixLinkItem}>
                <Link to="/registry" className={styles.appendixLink}>Browse Tool Registry</Link>
                <div className={styles.appendixLinkDesc}>Complete catalog of UTCP tool specifications</div>
              </div>
              <div className={styles.appendixLinkItem}>
                <Link to="/docs" className={styles.appendixLink}>Technical Documentation</Link>
                <div className={styles.appendixLinkDesc}>Implementation guides and API reference</div>
              </div>
              <div className={styles.appendixLinkItem}>
                <Link to="/about/contributing" className={styles.appendixLink}>Contributing Guidelines</Link>
                <div className={styles.appendixLinkDesc}>How to contribute tools and improvements</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
