import type { Meta, StoryObj } from '@storybook/react'
import { Box, Stack, Typography } from '@mui/material'
import { StatusBadge, type StatusBadgeKind } from './StatusBadge.js'

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof StatusBadge>

// Default — single pill controlled via controls panel.
export const Default: Story = {
  args: {
    kind: 'ok',
    text: 'Healthy',
  },
}

// All four tones in one canvas — the most useful visual reference.
const ALL_TONES: { kind: StatusBadgeKind; text: string }[] = [
  { kind: 'ok',     text: 'Healthy' },
  { kind: 'warn',   text: 'High Latency' },
  { kind: 'danger', text: 'Degraded' },
  { kind: 'info',   text: 'Deploying' },
]

export const AllTones: Story = {
  render: () => (
    <Stack direction="row" flexWrap="wrap" gap={1.5}>
      {ALL_TONES.map(({ kind, text }) => (
        <StatusBadge key={kind} kind={kind} text={text} />
      ))}
    </Stack>
  ),
}

// All tones labeled — pairs each pill with its kind name for quick reference.
export const AllTonesLabeled: Story = {
  render: () => (
    <Stack spacing={1.5}>
      {ALL_TONES.map(({ kind, text }) => (
        <Box key={kind} display="flex" alignItems="center" gap={2}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', width: 56, color: 'text.secondary' }}>
            {kind}
          </Typography>
          <StatusBadge kind={kind} text={text} />
        </Box>
      ))}
    </Stack>
  ),
}

// Individual kind stories for focused visual QA.
export const Ok: Story = {
  args: { kind: 'ok', text: 'Healthy' },
}

export const Warn: Story = {
  args: { kind: 'warn', text: 'High Latency' },
}

export const Danger: Story = {
  args: { kind: 'danger', text: 'Degraded' },
}

export const Info: Story = {
  args: { kind: 'info', text: 'Deploying' },
}
