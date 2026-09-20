const { spawn } = require("child_process");
const path = require("path");

console.log("=== Testing Jev MCP Server StdIO Handshake ===");

const serverPath = path.resolve(__dirname, "../src/index.js");
const child = spawn("node", [serverPath], {
  stdio: ["pipe", "pipe", "pipe"],
  env: {
    ...process.env,
  },
});

const listToolsPayload =
  JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {},
  }) + "\n";

child.stdout.on("data", (data) => {
  const text = data.toString();
  try {
    const json = JSON.parse(text);
    if (json.result && json.result.tools) {
      console.log(`[PASS] Server responded with ${json.result.tools.length} tools:`);
      json.result.tools.forEach((t) => console.log(`  - ${t.name}: ${t.description.slice(0, 50)}...`));
      child.kill();
      process.exit(0);
    }
  } catch (e) {
    // wait for complete json
  }
});

child.stderr.on("data", (data) => {
  console.error("[Server STDERR]:", data.toString());
});

child.on("close", (code) => {
  if (code !== 0 && code !== null) {
    console.error(`[FAIL] Process exited with code ${code}`);
    process.exit(code);
  }
});

child.stdin.write(listToolsPayload);
setTimeout(() => {
  console.error("[FAIL] Timed out waiting for tools/list response");
  child.kill();
  process.exit(1);
}, 4000);
