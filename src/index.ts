#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
// import { regESGTool } from './tools/esg.js';
import { regSciTool } from './tools/sci.js'; // Ensure to import the sci tool if needed
import { regWeaviateTool } from './tools/weaviate.js';

const server = new McpServer({
  name: 'TianGong-MCP-Server',
  version: '1.0.0',
});

regWeaviateTool(server);
// regESGTool(server);
regSciTool(server);

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch((error) => {
  console.error('Fatal error running server:', error);
  process.exit(1);
});
