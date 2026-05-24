import type { Meta, StoryObj } from '@storybook/react'
import { Box, Typography } from '@mui/material'
import { WorkflowCard } from './WorkflowCard.js'

const meta: Meta<typeof WorkflowCard> = {
  title: 'Components/WorkflowCard',
  component: WorkflowCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <Box maxWidth={600}>
        <Story />
      </Box>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof WorkflowCard>

const BodyContent = () => (
  <Typography variant="body2" color="text.secondary">
    Inference pipeline running on 4× A100 80 GB. Last completed run: 2 minutes ago.
    Average latency p95: 280 ms.
  </Typography>
)

// Neutral card — no status badge, no accent stripe.
export const Default: Story = {
  args: {
    title: 'Llama 3.1 70B Inference',
    subtitle: 'us-east-1 · cluster-prod-01',
    children: <BodyContent />,
  },
}

// Card with a status badge and left-edge accent stripe.
export const WithStatusOk: Story = {
  name: 'WithStatus — ok',
  args: {
    title: 'Batch Embedding Job',
    subtitle: 'Nightly · us-west-2',
    status: { kind: 'ok', text: 'Healthy' },
    children: <BodyContent />,
  },
}

export const WithStatusWarn: Story = {
  name: 'WithStatus — warn',
  args: {
    title: 'Fine-Tune Mixtral 8×7B',
    subtitle: 'us-central1 · spot instance',
    status: { kind: 'warn', text: 'High Latency' },
    children: <BodyContent />,
  },
}

export const WithStatusDanger: Story = {
  name: 'WithStatus — danger',
  args: {
    title: 'GPT-4 Proxy Router',
    subtitle: 'us-east-1 · gateway-prod',
    status: { kind: 'danger', text: 'Degraded' },
    children: <BodyContent />,
  },
}

export const WithStatusInfo: Story = {
  name: 'WithStatus — info',
  args: {
    title: 'Claude Sonnet 4 Pipeline',
    subtitle: 'us-east-1 · staging',
    status: { kind: 'info', text: 'Deploying' },
    children: <BodyContent />,
  },
}

// Focus ring — exercises the ringVisible / idle-fade logic.
export const WithFocusRing: Story = {
  args: {
    title: 'Focused Workflow Card',
    subtitle: 'The focus ring should be visible on mount',
    focus: true,
    children: <BodyContent />,
  },
}

// Anchor slot — renders the hidden anchor element used by hash navigation.
export const WithAnchor: Story = {
  args: {
    anchor: 'llm-pipeline-01',
    title: 'Anchored Card',
    subtitle: 'Scroll target for deep-link navigation',
    children: <BodyContent />,
  },
}
