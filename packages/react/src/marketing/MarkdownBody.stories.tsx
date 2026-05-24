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
## Why Acme

Acme automates the repetitive parts of your workflow so your team can **ship faster** without adding headcount.

- No infrastructure changes required
- Integrates with the tools you already use
- Full audit trail available via [the reporting dashboard](https://example.com/reports)

### Getting started

Run \`npm install @acme/sdk\` then call \`acme.run()\` instead of wiring up each integration by hand.
`;

export const Default: Story = {
  args: { children: SAMPLE_MD },
};

export const WithCustomLinkColor: Story = {
  args: {
    children: "Visit [our docs](https://example.com/docs) for more detail.",
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
