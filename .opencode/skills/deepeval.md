---
name: deepeval
description: Use when discussing or working with DeepEval, the Python AI evaluation framework for testing LLM applications. Covers RAG evaluation, conversational AI, agents, safety metrics, and CI/CD integration.
---

# DeepEval

## Overview

DeepEval is a pytest-based framework for testing LLM applications. It provides 50+ evaluation metrics covering RAG pipelines, conversational AI, agents, safety, and custom criteria.

**Repository:** https://github.com/confident-ai/deepeval  
**Documentation:** https://deepeval.com

## Installation

```bash
pip install -U deepeval
```

Requires Python 3.9+.

## Quick Start

```python
import pytest
from deepeval import assert_test
from deepeval.test_case import LLMTestCase
from deepeval.metrics import AnswerRelevancyMetric

def test_chatbot():
    metric = AnswerRelevancyMetric(threshold=0.7, model="anthropic-claude-sonnet-4-5")
    test_case = LLMTestCase(
        input="What if these shoes don't fit?",
        actual_output="You have 30 days for full refund"
    )
    assert_test(test_case, [metric])
```

Run with: `deepeval test run test_chatbot.py`

## Core Workflows

### RAG Evaluation

```python
from deepeval.metrics import (
    ContextualPrecisionMetric,
    ContextualRecallMetric,
    ContextualRelevancyMetric,
    AnswerRelevancyMetric,
    FaithfulnessMetric
)

test_case = LLMTestCase(
    input="What are the side effects of aspirin?",
    actual_output="Common side effects include stomach upset and nausea.",
    expected_output="Aspirin side effects include gastrointestinal issues.",
    retrieval_context=[
        "Aspirin common side effects: stomach upset, nausea, vomiting.",
        "Serious aspirin side effects: gastrointestinal bleeding.",
    ]
)

evaluate(test_cases=[test_case], metrics=[
    contextual_precision, contextual_recall, contextual_relevancy,
    answer_relevancy, faithfulness
])
```

**Component-level tracing:**

```python
from deepeval.tracing import observe, update_current_span

@observe(metrics=[contextual_relevancy])
def retriever(query: str):
    chunks = your_vector_db.search(query)
    update_current_span(
        test_case=LLMTestCase(input=query, retrieval_context=chunks)
    )
    return chunks
```

### Conversational AI Evaluation

```python
from deepeval.test_case import Turn, ConversationalTestCase
from deepeval.metrics import RoleAdherenceMetric, KnowledgeRetentionMetric

convo_test_case = ConversationalTestCase(
    chatbot_role="professional, empathetic medical assistant",
    turns=[
        Turn(role="user", content="I have a persistent cough"),
        Turn(role="assistant", content="How long have you had this cough?"),
        Turn(role="user", content="About a week now"),
        Turn(role="assistant", content="A week-long cough should be evaluated.")
    ]
)

evaluate(test_cases=[convo_test_case], metrics=[
    RoleAdherenceMetric(threshold=0.7),
    KnowledgeRetentionMetric(threshold=0.7),
])
```

### Agent Evaluation

```python
from deepeval.test_case import ToolCall
from deepeval.metrics import TaskCompletionMetric, ToolUseMetric

agent_test_case = ConversationalTestCase(
    turns=[
        Turn(role="user", content="When did Trump first raise tariffs?"),
        Turn(
            role="assistant",
            content="Let me search for that information.",
            tools_called=[
                ToolCall(name="WebSearch", arguments={"query": "Trump first raised tariffs year"})
            ]
        ),
        Turn(role="assistant", content="Trump first raised tariffs in 2018.")
    ]
)
```

### Safety Evaluation

```python
from deepeval.metrics import ToxicityMetric, BiasMetric, PIILeakageMetric

def safety_gate(output: str, input: str) -> tuple[bool, list]:
    test_case = LLMTestCase(input=input, actual_output=output)
    safety_metrics = [
        ToxicityMetric(threshold=0.5),
        BiasMetric(threshold=0.5),
        PIILeakageMetric(threshold=0.5)
    ]
    failures = []
    for metric in safety_metrics:
        metric.measure(test_case)
        if not metric.is_successful():
            failures.append(f"{metric.name}: {metric.reason}")
    return len(failures) == 0, failures
```

## Metric Selection Guide

### RAG Metrics
- `ContextualPrecisionMetric` — Relevant chunks ranked higher than irrelevant ones
- `ContextualRecallMetric` — All necessary information retrieved
- `ContextualRelevancyMetric` — Retrieved chunks relevant to input
- `AnswerRelevancyMetric` — Output addresses the input query
- `FaithfulnessMetric` — Output grounded in retrieval context

### Conversational Metrics
- `TurnRelevancyMetric`, `KnowledgeRetentionMetric`, `ConversationCompletenessMetric`
- `RoleAdherenceMetric`, `TopicAdherenceMetric`

### Agent Metrics
- `TaskCompletionMetric`, `ToolUseMetric`, `ArgumentCorrectnessMetric`, `MCPUseMetric`

### Safety Metrics
- `ToxicityMetric`, `BiasMetric`, `HallucinationMetric`, `PIILeakageMetric`

### Custom Metrics (G-Eval)
```python
from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCaseParams

custom_metric = GEval(
    name="Professional Tone",
    criteria="Determine if response maintains professional, empathetic tone",
    evaluation_params=[LLMTestCaseParams.ACTUAL_OUTPUT],
    threshold=0.7,
    model="anthropic-claude-sonnet-4-5"
)
```

## Configuration

### LLM Provider Setup (Python)
```python
from deepeval.models import AnthropicModel

anthropic_model = AnthropicModel(
    model_id=settings.anthropic_model_id,
    client_args={"api_key": settings.anthropic_api_key},
    temperature=settings.agent_temperature
)

metric = AnswerRelevancyMetric(model=anthropic_model)
```

### Performance Optimisation
```python
from deepeval import evaluate, AsyncConfig, CacheConfig

evaluate(
    test_cases=[...],
    metrics=[...],
    async_config=AsyncConfig(run_async=True, max_concurrent=20, throttle_value=0),
    cache_config=CacheConfig(use_cache=True, write_cache=True)
)
```

CLI parallelisation:
```bash
deepeval test run -n 4 -c -i  # 4 processes, cached, ignore errors
```

**Best practices:**
- Limit to 5 metrics maximum (2-3 generic + 1-2 custom)
- Use the latest available Anthropic Claude Sonnet or Haiku models
- Reduce `max_concurrent` to 5 if hitting rate limits

## Dataset Management

```python
from deepeval.dataset import EvaluationDataset

dataset = EvaluationDataset()
dataset.add_goldens_from_csv_file(
    file_path="./test_data.csv",
    input_col_name="question",
    expected_output_col_name="answer",
)
```

**Synthetic generation:**
```python
from deepeval.synthesizer import Synthesizer

synthesizer = Synthesizer()
goldens = synthesizer.generate_goldens_from_docs(
    document_paths=["./docs/knowledge_base.pdf"],
    max_goldens_per_document=10,
    evolution_types=["REASONING", "MULTICONTEXT", "COMPARATIVE"]
)
```

## CI/CD Integration

```yaml
name: LLM Tests
on: [push, pull_request]

jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Install dependencies
        run: pip install deepeval
      - name: Run evaluations
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: deepeval test run tests/
```

## Best Practices

- Match metrics to use case (RAG needs retrieval + generation metrics)
- Start with 2-3 essential metrics, expand as needed
- Use appropriate thresholds (0.7-0.8 for production, 0.5-0.6 for development)
- Use `@observe` for component-level tests during development
- Run end-to-end validation before deployment
- Test edge cases and failure modes, not just happy paths
- Read and analyse metric reasons — don't just check pass/fail
