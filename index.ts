#!/usr/bin/env node

import { RestServerTransport } from '@chatmcp/sdk/server/rest.js';
import { getAuthValue, getParamValue } from '@chatmcp/sdk/utils/index.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { searchEsg, SearchEsgTool } from './src/tools/esg.js';

const x_api_key = process.env.X_API_KEY ?? getParamValue('x_api_key') ?? '';

const mode = getParamValue('mode') || 'stdio';
const port = getParamValue('port') || 9593;
const endpoint = getParamValue('endpoint') || '/rest';

const server = new Server(
  {
    name: 'TianGong-MCP-Server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [SearchEsgTool],
}));

server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
  try {
    // before: use global params

    // after: get auth params from request, if global params not set
    const apiKey = x_api_key || getAuthValue(request, 'X_API_KEY');
    if (!apiKey) {
      throw new Error('X_API_KEY not set');
    }

    const { name, arguments: args } = request.params;
    if (!args) {
      throw new Error('No arguments provided');
    }
    switch (name) {
      case 'Search_ESG_Tool': {
        // if (!Array.isArray(args.messages)) {
        //   throw new Error("Invalid arguments for perplexity_ask: 'messages' must be an array");
        // }

        const query = args.query;
        if (typeof query !== 'string') {
          throw new Error("Invalid arguments: 'query' must be a string");
        }

        // after: pass params to every function
        const result = await searchEsg({ query });

        return {
          content: [{ type: 'text', text: result }],
          isError: false,
        };
      }
      default:
        throw new Error(`Unsupported tool: ${name}`);
    }
  } catch (error) {
    // Return error details in the response
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function runServer() {
  try {
    if (mode === 'rest') {
      const transport = new RestServerTransport({
        port,
        endpoint,
      });
      await server.connect(transport);

      await transport.startServer();

      return;
    }

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('TianGong AI MCP Server running on stdio with Ask, Research, and Reason tools');
  } catch (error) {
    console.error('Fatal error running server:', error);
    process.exit(1);
  }
}

// Start the server and catch any startup errors
runServer().catch((error) => {
  console.error('Fatal error running server:', error);
  process.exit(1);
});
