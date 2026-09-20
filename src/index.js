const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");

const DECISION_URL = "https://openrouter.ai/api/alpha/decisions";
const DEFAULT_MODEL = "typesafe/jev-1.13";

/**
 * Executes a structured decision query against Jev via OpenRouter Decisions API
 * @param {string|object} state Context/input state to evaluate
 * @param {object} questions Definition of questions conforming to OpenRouter decision spec
 * @returns {Promise<object>}
 */
async function callJevDecisions(state, questions) {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.JEV_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing OPENROUTER_API_KEY (or JEV_API_KEY). Please set the environment variable with your API key from https://openrouter.ai/keys"
    );
  }

  const model = process.env.JEV_MODEL || DEFAULT_MODEL;

  const payload = {
    model: model,
    state: state,
    questions: questions,
  };

  const response = await fetch(DECISION_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/miaopj0325-collab/jev_mcp",
      "X-Title": "Jev Decision MCP Server",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter Jev API responded with status ${response.status}: ${errorText}`);
  }

  return await response.json();
}

const server = new Server(
  {
    name: "jev-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register MCP tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "jev_noul",
        description:
          "Fast boolean proposition evaluation (True/False) using Jev's Noul decision primitive. Returns calibrated truth probability and boolean verdict. Ideal for verification, assertions, bug detection, and criteria checks.",
        inputSchema: {
          type: "object",
          properties: {
            context: {
              type: "string",
              description: "The state, log, code snippet, or text context to analyze.",
            },
            instruction: {
              type: "string",
              description: "The proposition or yes/no question to evaluate (e.g. 'Does this log indicate an unrecoverable database crash?').",
            },
            true_criteria: {
              type: "string",
              description: "Specific condition/criteria for evaluating to True (optional).",
            },
            false_criteria: {
              type: "string",
              description: "Specific condition/criteria for evaluating to False (optional).",
            },
          },
          required: ["context", "instruction"],
        },
      },
      {
        name: "jev_choice",
        description:
          "Ultra-fast single-choice classification using Jev's Choice primitive. Evaluates context against predefined options and returns the winning selection with confidence distribution.",
        inputSchema: {
          type: "object",
          properties: {
            context: {
              type: "string",
              description: "The context, text, or state to classify.",
            },
            instruction: {
              type: "string",
              description: "The routing or classification question.",
            },
            options: {
              type: "object",
              description:
                "Key-value dictionary of candidates where key is the option ID and value is the criteria description. Example: {\"db\": \"Database failure\", \"network\": \"Connection timeout\", \"auth\": \"401 Unauthorized\"}",
            },
          },
          required: ["context", "instruction", "options"],
        },
      },
      {
        name: "jev_score",
        description:
          "Calibrated hierarchical scoring using Jev's Score primitive. Rates context against an ordered progression of criteria levels (returns weighted score & distribution).",
        inputSchema: {
          type: "object",
          properties: {
            context: {
              type: "string",
              description: "The context or text content to score.",
            },
            instruction: {
              type: "string",
              description: "The scoring guidance or dimension (e.g. 'Assess the security severity level').",
            },
            criteria: {
              type: "array",
              items: { type: "string" },
              description:
                "Ordered list of benchmark levels from lowest to highest. Example: [\"Informational\", \"Low priority\", \"Urgent block\"]",
            },
          },
          required: ["context", "instruction", "criteria"],
        },
      },
      {
        name: "jev_batch_decisions",
        description:
          "Submit multiple decision tasks in a single request (combining noul, choice, and score). Evaluates concurrently with ultra-low latency.",
        inputSchema: {
          type: "object",
          properties: {
            context: {
              type: "string",
              description: "The context or state to analyze.",
            },
            questions: {
              type: "object",
              description:
                "Questions map matching OpenRouter Jev decision schema.",
            },
          },
          required: ["context", "questions"],
        },
      },
    ],
  };
});

// Handle tool executions
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "jev_noul") {
      const { context, instruction, true_criteria, false_criteria } = args;
      const questions = {
        decision: {
          type: "noul",
          instructions: instruction,
          criteria: {
            true: true_criteria || "The condition or proposition holds true.",
            false: false_criteria || "The condition or proposition is false.",
          },
        },
      };

      const result = await callJevDecisions(context, questions);
      const answer = result.answers?.decision;
      const probability = answer?.noul ?? 0.5;
      const verdict = probability >= 0.5;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                verdict: verdict,
                probability: probability,
                confidence_pct: `${(probability * 100).toFixed(1)}%`,
                usage: result.usage,
                raw_answer: answer,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === "jev_choice") {
      const { context, instruction, options } = args;
      const questions = {
        decision: {
          type: "choice",
          instructions: instruction,
          criteria: options,
        },
      };

      const result = await callJevDecisions(context, questions);
      const answer = result.answers?.decision;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                result: answer,
                usage: result.usage,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === "jev_score") {
      const { context, instruction, criteria } = args;
      const questions = {
        decision: {
          type: "score",
          instructions: instruction,
          criteria: criteria,
        },
      };

      const result = await callJevDecisions(context, questions);
      const answer = result.answers?.decision;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                result: answer,
                usage: result.usage,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === "jev_batch_decisions") {
      const { context, questions } = args;
      const result = await callJevDecisions(context, questions);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unsupported tool: ${name}`);
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `[Jev MCP Error] ${error.message}`,
        },
      ],
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch((err) => {
  console.error("Fatal error running Jev MCP server:", err);
  process.exit(1);
});
