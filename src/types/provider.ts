export interface Provider {
  name: string;
  provider_type: string;
  url?: string;
  http_method?: string;
  content_type?: string;
  file_path?: string;
  metadata?: {
    description?: string;
    category?: string;
    last_updated?: string;
    maintainer?: string;
    documentation_url?: string;
    version?: string;
    openapi_version?: string;
    quality_score?: number;
    is_popular?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface CategoryCount {
  category: string;
  count: number;
}