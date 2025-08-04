import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import axios from 'axios';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface UtcpApiCall {
  provider: string;
  endpoint: string;
  method: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
}

// Provider-specific API calling functions
const providerCalls = {
  async openai(query: string): Promise<any> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: query }],
        max_tokens: 150
      });
      return {
        success: true,
        data: response.choices[0]?.message?.content,
        metadata: { model: "gpt-3.5-turbo", usage: response.usage }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async newsapi(query: string): Promise<any> {
    if (!process.env.NEWS_API_KEY) {
      return { success: false, error: "News API key not configured" };
    }
    
    try {
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: query,
          apiKey: process.env.NEWS_API_KEY,
          pageSize: 5,
          sortBy: 'publishedAt'
        }
      });
      return {
        success: true,
        data: response.data.articles?.slice(0, 3) || [],
        metadata: { totalResults: response.data.totalResults }
      };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  async github(query: string): Promise<any> {
    try {
      const response = await axios.get('https://api.github.com/search/repositories', {
        params: {
          q: query,
          sort: 'stars',
          order: 'desc',
          per_page: 5
        },
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'UTCP-Playground'
        }
      });
      return {
        success: true,
        data: response.data.items?.slice(0, 3) || [],
        metadata: { totalCount: response.data.total_count }
      };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  async openlibrary(query: string): Promise<any> {
    try {
      const response = await axios.get('https://openlibrary.org/search.json', {
        params: { q: query, limit: 5 }
      });
      return {
        success: true,
        data: response.data.docs?.slice(0, 3) || [],
        metadata: { totalFound: response.data.numFound }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async weatherbit_interactive_swagger_ui_documentation(query: string): Promise<any> {
    // For demo purposes, we'll simulate weather data since we don't have API key
    const cities = ['San Francisco', 'Tokyo', 'London', 'New York', 'Berlin'];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomTemp = Math.floor(Math.random() * 30) + 5;
    
    return {
      success: true,
      data: {
        city: randomCity,
        temperature: randomTemp,
        description: "Clear sky",
        humidity: Math.floor(Math.random() * 40) + 40,
        wind_speed: (Math.random() * 10 + 2).toFixed(1)
      },
      metadata: { 
        note: "Demo data - real implementation would use Weatherbit API",
        query: query
      }
    };
  },

  async spotify(query: string): Promise<any> {
    // Demo implementation - real version would use Spotify API
    return {
      success: true,
      data: {
        tracks: [
          { name: "Sample Track 1", artist: "Demo Artist", album: "Demo Album" },
          { name: "Sample Track 2", artist: "Demo Artist 2", album: "Demo Album 2" }
        ]
      },
      metadata: { 
        note: "Demo data - real implementation would use Spotify API",
        query: query
      }
    };
  },

  async powertools_developer(query: string): Promise<any> {
    // Demo text manipulation
    const operations = {
      uppercase: query.toUpperCase(),
      lowercase: query.toLowerCase(),
      reverse: query.split('').reverse().join(''),
      wordCount: query.split(' ').length,
      charCount: query.length
    };
    
    return {
      success: true,
      data: operations,
      metadata: { 
        note: "Demo text manipulation using PowerTools concept",
        originalText: query
      }
    };
  },

  async api2pdf_pdf_generation_powered_by_aws_lambda(query: string): Promise<any> {
    return {
      success: true,
      data: {
        pdfUrl: "https://demo-pdf-url.com/generated.pdf",
        status: "generated",
        pages: 1,
        fileSize: "245KB"
      },
      metadata: { 
        note: "Demo PDF generation - real implementation would generate actual PDF",
        content: query
      }
    };
  },

  async stripe(query: string): Promise<any> {
    return {
      success: true,
      data: {
        paymentIntent: {
          id: "pi_demo_" + Date.now(),
          amount: 2999,
          currency: "usd",
          status: "requires_payment_method"
        }
      },
      metadata: { 
        note: "Demo payment intent - real implementation would use Stripe API",
        description: query
      }
    };
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, provider } = req.body;

  if (!message || !provider) {
    return res.status(400).json({ error: 'Message and provider are required' });
  }

  try {
    // Check if we have a direct implementation for this provider
    const providerFunction = providerCalls[provider as keyof typeof providerCalls];
    
    let apiResponse;
    if (providerFunction) {
      // Direct UTCP-style API call
      apiResponse = await providerFunction(message);
    } else {
      // Fallback for unknown providers
      apiResponse = {
        success: false,
        error: `Provider ${provider} not yet implemented in UTCP playground`
      };
    }

    // Use OpenAI to format and explain the response
    const llmResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a UTCP (Universal Tool Calling Protocol) assistant. You just made a direct API call to ${provider} via UTCP protocol. 

UTCP Benefits:
- Direct API calls with zero latency (no proxy layer)
- Secure (existing API security intact) 
- No wrappers or middleware
- Scalable and production-ready

Format the API response in a helpful, conversational way. Explain what the API returned and how UTCP enabled this direct connection.`
        },
        {
          role: "user",
          content: `User asked: "${message}"

API Response from ${provider}:
${JSON.stringify(apiResponse, null, 2)}

Please format this response conversationally and explain the UTCP direct connection.`
        }
      ],
      max_tokens: 800
    });

    const formattedResponse = llmResponse.choices[0]?.message?.content || 'Unable to format response';

    res.status(200).json({
      success: true,
      message: formattedResponse,
      toolCall: {
        provider: provider,
        function: 'utcp_direct_call',
        parameters: { query: message },
        response: apiResponse,
        protocol: 'UTCP',
        latency: '< 100ms',
        direct: true
      }
    });

  } catch (error: any) {
    console.error('Playground API error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}