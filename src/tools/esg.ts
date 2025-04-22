import { Tool } from '@modelcontextprotocol/sdk/types.js';

import cleanObject from '../_shared/clean_object.js';
import { base_url, supabase_anon_key, x_region } from '../_shared/config.js';

const input_schema = {
  type: 'object' as const,
  properties: {
    query: {
      type: 'string',
      minLength: 1,
      description: 'Requirements or questions from the user.',
    },
    topK: {
      type: 'number',
      default: 5,
      description: 'Number of top chunk results to return.',
    },
    extK: {
      type: 'number',
      default: 0,
      description: 'Number of additional chunks to include before and after each topK result.',
    },
    metaContains: {
      type: 'string',
      description:
        'An optional keyword string used for fuzzy searching within document metadata, such as report titles, company names, or other metadata fields. DO NOT USE IT BY DEFAULT.',
    },
    filter: {
      type: 'object',
      properties: {
        rec_id: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Filter by record ID.',
        },
        country: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Filter by country.',
        },
      },
      description:
        'DO NOT USE IT IF NOT EXPLICIT REQUESTED IN THE QUERY. Optional filter conditions for specific fields, as an object with optional arrays of values.',
    },
    dateFilter: {
      type: 'object',
      properties: {
        publication_date: {
          type: 'object',
          properties: {
            gte: {
              type: 'number',
              description: 'Greater than or equal to date in UNIX timestamp',
            },
            lte: {
              type: 'number',
              description: 'Less than or equal to date in UNIX timestamp',
            },
          },
        },
      },
      description:
        'DO NOT USE IT IF NOT EXPLICIT REQUESTED IN THE QUERY. Optional filter conditions for date ranges in UNIX timestamps.',
    },
  },
  required: ['query'],
};

export async function searchEsg(
  x_api_key: string,
  {
    query,
    topK,
    extK,
    metaContains,
    filter,
    dateFilter,
  }: {
    query: string;
    topK?: number;
    extK?: number;
    metaContains?: string;
    filter?: {
      rec_id?: string[];
      country?: string[];
    };
    dateFilter?: {
      publication_date?: {
        gte?: number;
        lte?: number;
      };
    };
  },
): Promise<string> {
  const url = `${base_url}/esg_search`;
  // console.error('URL:', url);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabase_anon_key}`,
        'x-api-key': x_api_key,
        'x-region': x_region,
      },
      body: JSON.stringify(
        cleanObject({
          query,
          topK,
          extK,
          metaContains,
          filter,
          dateFilter,
        }),
      ),
    });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error making the request:', error);
    throw error;
  }
}

export const SearchEsgTool: Tool = {
  name: 'Search_ESG_Tool',
  description: 'Perform search on ESG database.',
  inputSchema: input_schema,
};
