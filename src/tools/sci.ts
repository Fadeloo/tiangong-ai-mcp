import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import cleanObject from './_shared/clean_object.js';
import { base_url, supabase_anon_key, x_region } from './_shared/config.js';

const input_schema = {
  query: z.string().min(1).describe('Requirements or questions from the user.'),
  topK: z.number().default(5).describe('Number of top chunk results to return.'),
  extK: z
    .number()
    .default(0)
    .describe('Number of additional chunks to include before and after each topK result.'),
  filter: z
    .object({
      journal: z.array(z.string()).optional().describe('Filter by journal.'),
      doi: z.array(z.string()).optional().describe('Filter by DOI.'), // 新增 DOI 筛选条件
    })
    .optional()
    .describe(
      'DO NOT USE IT IF NOT EXPLICIT REQUESTED IN THE QUERY. Optional filter conditions for specific fields, as an object with optional arrays of values.',
    ),
  dateFilter: z
    .object({
      date: z
        .object({
          gte: z.number().optional(),
          lte: z.number().optional(),
        })
        .optional(),
    })
    .optional()
    .describe(
      'DO NOT USE IT IF NOT EXPLICIT REQUESTED IN THE QUERY. Optional filter conditions for date ranges in UNIX timestamps.',
    ),
};

async function searchSci(
  x_api_key: string,
  {
    query,
    topK,
    extK,
    filter,
    dateFilter,
  }: {
    query: string;
    topK: number;
    extK: number;
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

export function regSciTool(server: McpServer) {
  server.tool(
    'Search_Sci_Tool',
    'Perform search on academic database for precise and specialized information.',
    input_schema,
    async ({ query, topK, extK, filter, dateFilter }, extra) => {
      const result = await searchSci('',{
        query,
        topK,
        extK,
        filter,
        dateFilter,
      });
      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    },
  );
}
