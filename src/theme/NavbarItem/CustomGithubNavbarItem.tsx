import React from 'react';
import { useLocation } from '@docusaurus/router';
import GitHubButton from '../../components/GitHubButton';

interface CustomGithubNavbarItemProps {
  mobile?: boolean;
  [key: string]: any;
}

const CustomGithubNavbarItem: React.FC<CustomGithubNavbarItemProps> = ({ mobile, ...props }) => {
  const location = useLocation();
  const isBlogPage = location.pathname.startsWith('/blog');

  // For mobile view, always show simple version
  if (mobile) {
    return (
      <a
        href="https://github.com/universal-tool-calling-protocol"
        target="_blank"
        rel="noopener noreferrer"
        className="navbar__item navbar__link"
        {...props}
      >
        GitHub
      </a>
    );
  }

  // Show fancy button only on blog pages, normal link elsewhere
  if (isBlogPage) {
    return <GitHubButton />;
  }

  // Normal GitHub link for non-blog pages
  return (
    <a
      href="https://github.com/universal-tool-calling-protocol"
      target="_blank"
      rel="noopener noreferrer"
      className="navbar__item navbar__link"
      {...props}
    >
      GitHub
    </a>
  );
};

export default CustomGithubNavbarItem;