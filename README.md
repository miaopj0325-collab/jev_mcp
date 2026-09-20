# Jev MCP Server ⚡

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-green.svg)](https://modelcontextprotocol.io)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)

> **Model Context Protocol (MCP) server for TypeSafe AI's Jev** — The ultra-fast, machine-native "System 1" decision model.

[English](#english) | [简体中文](#简体中文)

---

<a name="english"></a>
## Overview

Traditional LLMs are designed for slow, generative prose. When an AI Agent only needs to know **"Is this a bug?"** or **"Which module should handle this ticket?"**, generating markdown tokens is expensive and slow.

**Jev** (by TypeSafe AI) is a non-generative **System 1 decision model** trained via RLCD (Reinforcement Learning for Calibrated Decisions). It returns typed, calibrated probabilities and decisions directly in **70ms–300ms**, with **$0 output cost**.

This MCP server brings Jev's high-speed decision primitives into your favorite AI environments (**Claude Desktop, Cursor, Antigravity IDE, Windsurf, Continue**).

### Key Primitives
* **`jev_noul`**: Calibrated boolean proposition evaluation (True/False).
* **`jev_choice`**: Ultra-fast single-choice selection from candidate categories.
* **`jev_score`**: Calibrated ranking along an ordered scale of criteria.
* **`jev_batch_decisions`**: Concurrent evaluation of multiple questions in a single low-latency roundtrip.

---

## Quick Start

### 1. Get your API Key
Obtain an API key with access to Jev models via [OpenRouter](https://openrouter.ai/keys).

### 2. Configure Your Client

#### A. Claude Desktop
Add this to your `claude_desktop_config.json` (Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`, Windows: `%APPDATA%\Claude\claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "jev": {
      "command": "npx",
      "args": ["-y", "jev-mcp"],
      "env": {
        "OPENROUTER_API_KEY": "sk-or-v1-xxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

#### B. Antigravity IDE
Add to your `.gemini/config/mcp_config.json`:

```json
{
  "mcpServers": {
    "jev": {
      "command": "npx",
      "args": ["-y", "jev-mcp"],
      "env": {
        "OPENROUTER_API_KEY": "sk-or-v1-xxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

#### C. Cursor (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "jev": {
      "command": "npx",
      "args": ["-y", "jev-mcp"],
      "env": {
        "OPENROUTER_API_KEY": "sk-or-v1-xxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

---

## Local Development

```bash
git clone https://github.com/miaopj0325-collab/jev_mcp.git
cd jev_mcp
npm install

# Test with your OpenRouter key
export OPENROUTER_API_KEY="sk-or-v1-xxxxxxxx" # or $env:OPENROUTER_API_KEY in PowerShell
npm start
```

---

<a name="简体中文"></a>
## 中文说明

传统的对话大模型（LLM）专注于文本生成，当 AI Agent 仅仅需要裁决 **“这行代码是否有 Bug？”** 或 **“工单归属于哪个模块？”** 时，耗费数秒逐字生成 Token 既昂贵又容易出现格式幻觉。

**Jev**（由 TypeSafe AI 研发）是业内首个专注于“系统一（快思考）”的非生成式决策模型：
* **毫秒级极速响应**：典型时延在 **70ms ~ 300ms** 之间；
* **颠覆性成本**：输入仅 **$0.042 / 百万 Token**，**输出 Token 完全免费（$0）**；
* **严格机器原生**：不输出废话文本，直接返回高精度的校准概率与强类型判定。

本项目是 **Jev 的标准 MCP（Model Context Protocol）服务**，可让各大 AI 助手（Claude Desktop、Cursor、反重力 IDE、Windsurf 等）瞬间拥有毫秒级快速决断能力！

---

### 工具说明

| 工具名称 | 原语类型 | 说明 | 适用场景 |
| :--- | :--- | :--- | :--- |
| `jev_noul` | 是非判定 (True/False) | 快速评估命题真伪，输出校准概率及布尔结论 | 代码断言、Bug 拦截、CI/CD 门禁验证 |
| `jev_choice` | 类别单选 (Choice) | 从自定义选项集合中做出最合理的单项选择 | 意图识别、日志归类、工单路由 |
| `jev_score` | 梯级打分 (Score) | 依据递进标准打出量化分级与置信度 | 风险评级、代码异味评分、紧急度分级 |
| `jev_batch_decisions` | 批量并行决策 | 单次请求并发执行多个决策问题 | 大批量数据/状态快速联合判定 |

---

### 环境变量

| 变量名 | 必填 | 默认值 | 描述 |
| :--- | :---: | :--- | :--- |
| `OPENROUTER_API_KEY` | 是 | - | OpenRouter 提供的 API Key |
| `JEV_MODEL` | 否 | `typesafe/jev-1.13` | 指定调用的 Jev 决策模型版本 |

---

## License

MIT © [miaopj0325-collab](https://github.com/miaopj0325-collab)
