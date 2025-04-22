# TianGong-AI-MCP

[中文](./README.md) | [English](./README_EN.md)

TianGong AI Model Context Protocol (MCP) Server supports both STDIO and SSE protocols.

## Starting MCP Server

### Client STDIO Server

```bash
npm install -g @tiangong-ai/mcp-server

npx dotenv -e .env -- \
npx @tiangong-ai/mcp-server
```

### Remote SSE Server

```bash
npm install -g @tiangong-ai/mcp-server
npm install -g supergateway

npx dotenv -e .env -- \
npx -y supergateway \
    --stdio "npx -y @tiangong-ai/mcp-server" \
    --port 3001 \
    --ssePath /sse --messagePath /message
```

### Using Docker

```bash
# Build MCP server image using Dockerfile (optional)
docker build -t linancn/tiangong-ai-mcp-server:0.0.10 .

# Pull MCP server image
docker pull linancn/tiangong-ai-mcp-server:0.0.10

# Start MCP server using Docker
docker run -d -i \
    --name tiangong-ai-mcp-server \
    --publish 3001:9593 \
    --env-file .env \
    linancn/tiangong-ai-mcp-server:0.0.10
```

## Development

### Environment Setup

```bash
# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
nvm install 22
nvm use

# Install dependencies
npm install

# Update dependencies
npm update && npm ci
```

### Code Formatting

```bash
# Format code using the linter
npm run lint
```

### Local Testing

#### STDIO Server

```bash
# Launch the STDIO Server using MCP Inspector
npm start
```

#### SSE Server

```bash
# Build and package the project
npm run build && npm pack

# Optionally, install supergateway globally
npm install -g supergateway

# Launch the SSE Server (If the parameter --baseUrl is configured, it should be set to a valid IP address or domain name)
npx dotenv -e .env -- \
npx -y supergateway \
    --stdio "npx -y tiangong-ai-mcp-server-0.0.10.tgz" \
    --port 3001 \
    --ssePath /sse \
    --messagePath /message

# Launch MCP Inspector
npx @modelcontextprotocol/inspector
```

### Publishing

```bash
npm login

npm run build && npm publish
```
