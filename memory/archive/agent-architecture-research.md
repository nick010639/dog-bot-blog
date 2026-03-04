# Agent Architecture Research (2026)

Based on web search findings (Exa/Brave/X) from Feb 2026.

## Core Consensus: System > Model
The industry consensus in 2026 is that building reliable agents is a **systems engineering** problem, not just a prompt engineering one.

*   **Agent as a Distributed System**: An agent isn't a prompt; it's a system where the LLM is just the planner/executor.
*   **Reliability Sources**: Reliability comes from architecture (loops, memory layers, guardrails) rather than raw model intelligence.

## Key Architectural Patterns

### 1. Layered Memory Systems
Vector databases alone are insufficient. Effective agents use a tiered memory hierarchy:
*   **Working Memory**: Current context, active task state.
*   **Short-term History**: Recent conversation/actions (limited window).
*   **Long-term Knowledge**: Vector store or Knowledge Graph (retrieval-based).
*   **Artifacts**: Persistent outputs (files, code, reports) that survive sessions.
*   **Episodic Memory**: "What did I do last time?" (Success/failure logs).

### 2. The Operational Learning Loop
Agents need continuous feedback loops to improve without code changes:
*   **Do -> Check -> Learn**: Execute action -> Verify result -> Log observation.
*   **Tension/Friction Logging**: Explicitly recording when things go wrong (e.g., tool failure, ambiguous instruction) into a specialized log (like Ars Contexta's `ops/tensions/`).
*   **Periodic Review**: A meta-process (Cron job) that reviews these logs to update the agent's instructions (`SOUL.md`) or configuration.

### 3. Orchestration & Control
*   **Deterministic State Transitions**: Critical paths (like "Deploy to Production") should be deterministic code, not LLM hallucinations.
*   **Tool Contracts**: Tools must have strict schemas and validation. "Garbage in, garbage out" kills agents.
*   **Tracing**: Essential for debugging multi-step reasoning.

## Synthesis with Ars Contexta
The **Ars Contexta** model aligns perfectly with these 2026 best practices:
*   **Three-Space Architecture** maps to the Memory Layers (Self=Identity/Methodology, Notes=Long-term Knowledge, Ops=Working Memory/Logs).
*   **Processing Pipeline** implements the "Do -> Check" loop.
*   **Derivation Engine** ensures "Tool Contracts" (Schema) are respected.

## Next Steps for OpenClaw
*   **Adopting Three-Space**: Refactor workspace to `self/` (Context), `knowledge/` (Long-term), `ops/` (Working).
*   **Implementing Learning Loop**: Create `ops/tensions.md` and a "Reflect" skill to review it.
*   **Formalizing Identity**: Move `SOUL.md` to `self/identity.md` and treat it as a mutable artifact of the Learning Loop.
