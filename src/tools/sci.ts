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
    filter: {
      type: 'object',
      properties: {
        journal: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Filter by journal.',
        },
        doi: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Filter by DOI.',
        },
      },
      description:
        'DO NOT USE IT IF NOT EXPLICIT REQUESTED IN THE QUERY. Optional filter conditions for specific fields, as an object with optional arrays of values.',
    },
    dateFilter: {
      type: 'object',
      properties: {
        date: {
          type: 'object',
          properties: {
            gte: {
              type: 'number',
            },
            lte: {
              type: 'number',
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

export async function searchSci(
  x_api_key: string,
  {
    query,
    topK,
    extK,
    filter,
    dateFilter,
  }: {
    query: string;
    topK?: number;
    extK?: number;
    filter?: {
      journal?: string[];
      doi?: string[];
    };
    dateFilter?: {
      date?: {
        gte?: number;
        lte?: number;
      };
    };
  },
): Promise<string> {
  const url = `${base_url}/sci_search`;
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

export const SearchSCITool: Tool = {
  name: 'Search_SCI_Tool',
  description: 'Perform search on academic database for precise and specialized information.',
  inputSchema: input_schema,
};
