import type { Meta, StoryObj } from '@storybook/react'
import { Box } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import MemoryIcon from '@mui/icons-material/Memory'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { MetricCard } from './MetricCard.js'

const meta: Meta<typeof MetricCard> = {
  title: 'Components/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
  // Most stories supply their own wrapper width.
  decorators: [
    (Story) => (
      <Box width={320}>
        <Story />
      </Box>
    ),
  ],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof MetricCard>

// Primary KPI card — the shape every dashboard panel uses.
export const Default: Story = {
  args: {
    title: 'Total GPU Spend',
    value: '$12,480',
    icon: <AttachMoneyIcon />,
    color: 'primary',
  },
}

// Positive delta — subtitle doubles as the trending context line.
export const WithDeltaPositive: Story = {
  name: 'WithDelta — positive',
  args: {
    title: 'Model Calls (7d)',
    value: '1,024,309',
    icon: <TrendingUpIcon />,
    color: 'success',
    subtitle: '↑ 18% vs last week',
  },
}

// Negative delta — error color variant.
export const WithDeltaNegative: Story = {
  name: 'WithDelta — negative',
  args: {
    title: 'Cache Hit Rate',
    value: '61.2%',
    icon: <TrendingDownIcon />,
    color: 'error',
    subtitle: '↓ 4.3pp vs last week',
  },
}

// Warning color — GPU utilization is high.
export const Warning: Story = {
  args: {
    title: 'P100 Utilization',
    value: '94%',
    icon: <MemoryIcon />,
    color: 'warning',
    subtitle: 'Above 90% threshold',
  },
}

// Mini layout — narrow container to confirm the card doesn't overflow.
export const Mini: Story = {
  decorators: [
    (Story) => (
      <Box width={180}>
        <Story />
      </Box>
    ),
  ],
  args: {
    title: 'Requests',
    value: '48k',
    icon: <TrendingUpIcon />,
    color: 'secondary',
  },
}

// Custom hex color — exercises the COLOR_MAP fallback path.
export const CustomHexColor: Story = {
  args: {
    title: 'GPU Hours',
    value: '3,210 h',
    icon: <MemoryIcon />,
    color: '#8B5CF6',
    subtitle: 'Across 6 clusters',
  },
}
