import { Client } from '@langchain/langgraph-sdk';
import { RemoteGraph } from '@langchain/langgraph/remote';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { remote_deployment_url, remote_langsmith_api_key } from '../_shared/config.js';

const input_schema = {
  type: 'object' as const,
  properties: {
    input: {
      type: 'string',
      minLength: 1,
      description: 'Requirements or questions from the user.',
    },
  },
};
const client = new Client({ apiUrl: remote_deployment_url, apiKey: remote_langsmith_api_key });
const remoteGraph = new RemoteGraph({
  graphId: 'elle_agent',
  url: remote_deployment_url,
  apiKey: remote_langsmith_api_key,
});

export async function elleAgent(input: { input?: string }): Promise<any> {
  try {
    const thread = await client.threads.create();
    const config = { configurable: { thread_id: thread.thread_id } };
    const response = await remoteGraph.invoke({
      messages: [{ role: 'human', content: input.input || '' }],
      config,
    });
    console.error('response', response);
    return JSON.stringify([
      {
        answer: JSON.stringify(response.answers[response.answers.length - 1]),
      },
    ]);
  } catch (error) {
    console.error('Error making the request:', error);
    throw error;
  }
}

export const ElleAgentTool: Tool = {
  name: 'Elle_Agent_Tool',
  description:
    'Let two agents answer a question from the user separately, give a score and a suggestion.',
  inputSchema: input_schema,
};
