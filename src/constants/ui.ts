export const UI_CONSTANTS = {
  DESCRIPTION_LIMIT: 150,
  DESCRIPTION_MAX_LIMIT: 300,
  COPY_SUCCESS_TIMEOUT: 2000,
  DEFAULT_CATEGORY: 'Other',
  DISCOVER_CATEGORY: 'Discover',
  NO_DESCRIPTION_TEXT: 'No description available'
} as const;

// Curated list of providers for the Discover category
export const DISCOVER_PROVIDERS = [
  'openai',
  'newsapi', 
  'openlibrary',
  'github',
  'stripe',
  'spotify',
  'powertools_developer',
  'api2pdf_pdf_generation_powered_by_aws_lambda',
  'weatherbit_interactive_swagger_ui_documentation'
] as const;