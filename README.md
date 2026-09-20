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

## Quick Start (Zero-Install / No Clone Required) 🚀

You can run this MCP directly from GitHub without cloning or manual installs!

### 1. Get your API Key
Obtain an API key with access to Jev models via [OpenRouter](https://openrouter.ai/keys).

### 2. Configure Your Client

#### A. Claude Desktop
Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "jev": {
      "command": "npx",
      "args": ["-y", "github:miaopj0325-collab/jev_mcp"],
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
      "args": ["-y", "github:miaopj0325-collab/jev_mcp"],
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
      "args": ["-y", "github:miaopj0325-collab/jev_mcp"],
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
## 简体中文说明

传统的对话大模型（LLM）专注于文本生成。当 AI Agent 仅仅需要裁决 **“这行代码是否有 Bug？”** 或 **“工单归属于哪个模块？”** 时，耗费数秒逐字生成 Token 既昂贵又容易产生格式幻觉。

**Jev**（由前 OpenAI RLHF 联合发明人创立的 TypeSafe AI 研发）是业内首个专注于“系统一（快思考）”的非生成式决策模型：
* **毫秒级极速响应**：典型时延在 **70ms ~ 300ms** 之间；
* **颠覆性成本**：输入仅 **$0.042 / 百万 Token**，**输出 Token 完全免费（$0）**；
* **严格机器原生**：不输出废话文本，直接返回高精度的校准概率与强类型判定。

本项目是 **Jev 的标准 MCP（Model Context Protocol）服务**，可让各大 AI 助手（Claude Desktop、Cursor、反重力 IDE、Windsurf 等）瞬间拥有毫秒级快速决断能力！

---

### 快速接入（免克隆 / 零安装）🚀

借助 `npx`，你**完全不需要 `git clone` 任何代码**，直接在各客户端配置文件中添加几行 JSON 即可瞬间启动！

#### 1. 准备工作：获取 API Key
访问 [OpenRouter Keys](https://openrouter.ai/keys) 创建一个 API Key（Jev 当前按超低费率计费，输出免费）。

#### 2. 在你常用的 AI 工具中配置

##### A. Claude Desktop
在配置文件 `claude_desktop_config.json`（Mac 路径：`~/Library/Application Support/Claude/`，Windows 路径：`%APPDATA%\Claude\`）的 `mcpServers` 下添加：

```json
{
  "mcpServers": {
    "jev": {
      "command": "npx",
      "args": ["-y", "github:miaopj0325-collab/jev_mcp"],
      "env": {
        "OPENROUTER_API_KEY": "你的_OPENROUTER_API_KEY"
      }
    }
  }
}
```

##### B. 反重力 IDE (Antigravity IDE)
在全局配置 `.gemini/config/mcp_config.json` 的 `mcpServers` 下添加：

```json
{
  "mcpServers": {
    "jev": {
      "command": "npx",
      "args": ["-y", "github:miaopj0325-collab/jev_mcp"],
      "env": {
        "OPENROUTER_API_KEY": "你的_OPENROUTER_API_KEY"
      }
    }
  }
}
```

##### C. Cursor
在项目的 `.cursor/mcp.json` 中配置：

```json
{
  "mcpServers": {
    "jev": {
      "command": "npx",
      "args": ["-y", "github:miaopj0325-collab/jev_mcp"],
      "env": {
        "OPENROUTER_API_KEY": "你的_OPENROUTER_API_KEY"
      }
    }
  }
}
```

---

### 提供的决策工具清单

| 工具名称 | 原语类型 | 说明 | 推荐落地场景 |
| :--- | :--- | :--- | :--- |
| `jev_noul` | 是非判定 (True/False) | 快速评估命题真伪，输出校准概率及布尔结论 | 代码断言、Bug 拦截、CI/CD 提交门禁 |
| `jev_choice` | 类别单选 (Choice) | 从自定义选项集合中做出最合理的单项选择 | 意图识别、日志错误归因、故障分类分流 |
| `jev_score` | 梯级打分 (Score) | 依据递进标准打出量化分级与置信度 | 风险评级、代码异味评分、紧急度分级 |
| `jev_batch_decisions` | 批量并行决策 | 单次网络请求并发执行多个决策问题 | 大批量数据/状态快速联合判定 |

---

### 环境变量说明

| 环境变量名 | 是否必填 | 默认值 | 作用描述 |
| :--- | :---: | :--- | :--- |
| `OPENROUTER_API_KEY` | **是** | - | 你的 OpenRouter API 密钥 |
| `JEV_MODEL` | 否 | `typesafe/jev-1.13` | 指定调用的 Jev 决策模型版本（可选） |

---

### 本地二次开发

如果你想本地运行或修改源码：

```bash
git clone https://github.com/miaopj0325-collab/jev_mcp.git
cd jev_mcp
npm install

# 设置环境变量后启动
export OPENROUTER_API_KEY="你的_KEY"   # Windows PowerShell: $env:OPENROUTER_API_KEY="你的_KEY"
npm start
```

---

## License

本项目遵循 [MIT License](LICENSE) 开源协议。
