import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MarkdownBody } from "./MarkdownBody.js";

const meta: Meta<typeof MarkdownBody> = {
  title: "Marketing/MarkdownBody",
  component: MarkdownBody,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof MarkdownBody>;

const SAMPLE_MD = `
## Why TensorCost

TensorCost routes each inference call to **the cheapest model** that meets your latency SLA.

- No code changes required
- Works with OpenAI, Anthropic, Mistral, and self-hosted models
- Savings verified on-chain via [SHA-256 ledger](https://tensorcost.com/proof)

### Getting started

Run \`npm install @tensorcost/sdk\` then call \`tc.complete()\` instead of \`openai.chat.completions.create()\`.
`;

export const Default: Story = {
  args: { children: SAMPLE_MD },
};

export const WithCustomLinkColor: Story = {
  args: {
    children: "Visit [our docs](https://tensorcost.com/docs) for more detail.",
    components: {
      a: ({ node: _node, ...p }: Record<string, unknown>) => (
        <a
          style={{ color: "#f59e0b", fontWeight: 600 }}
          {...(p as React.ComponentPropsWithoutRef<"a">)}
        />
      ),
    },
  },
};
