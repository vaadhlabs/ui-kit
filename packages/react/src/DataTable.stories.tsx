import type { Meta, StoryObj } from '@storybook/react'
import { Paper } from '@mui/material'
import { DataTable, type DataTableColumn } from './DataTable.js'

// Sample row shape used across stories.
interface ModelRow {
  id: string
  model: string
  provider: string
  requests: number
  costUsd: string
  status: 'ok' | 'warn' | 'error'
}

const COLUMNS: readonly DataTableColumn<ModelRow>[] = [
  { key: 'model',    header: 'Model',     width: '35%' },
  { key: 'provider', header: 'Provider',  width: '20%' },
  { key: 'requests', header: 'Requests',  align: 'right', width: '15%',
    render: (row) => row.requests.toLocaleString() },
  { key: 'costUsd',  header: 'Cost (USD)', align: 'right', width: '15%' },
  { key: 'status',   header: 'Status',    width: '15%' },
]

const SAMPLE_ROWS: ModelRow[] = [
  { id: '1', model: 'claude-sonnet-4-6',  provider: 'Anthropic', requests: 124_800, costUsd: '$3,120.00', status: 'ok' },
  { id: '2', model: 'gpt-4o',             provider: 'OpenAI',    requests:  88_400, costUsd: '$2,652.00', status: 'ok' },
  { id: '3', model: 'llama-3.1-70b',      provider: 'Together',  requests:  54_200, costUsd: '$   541.20', status: 'warn' },
  { id: '4', model: 'gemini-1.5-pro',     provider: 'Google',    requests:  31_000, costUsd: '$   620.00', status: 'ok' },
  { id: '5', model: 'mixtral-8x7b-32768', provider: 'Groq',      requests:  18_700, costUsd: '$    56.10', status: 'error' },
]

const meta: Meta<typeof DataTable<ModelRow>> = {
  title: 'Components/DataTable',
  // DataTable is generic so we can't use `component:` directly with the
  // generic version. Point at DataTable and let args provide type context.
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  // Wrap in a Paper to give the borderless-table something to sit on.
  decorators: [
    (Story) => (
      <Paper elevation={0} sx={{ overflow: 'hidden' }}>
        <Story />
      </Paper>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof DataTable<ModelRow>>

// Populated table — the default useful state.
export const WithRows: Story = {
  args: {
    rows: SAMPLE_ROWS,
    columns: COLUMNS,
    getRowKey: (row: ModelRow) => row.id,
  },
}

// Empty state — exercises the emptyMessage slot.
export const Empty: Story = {
  args: {
    rows: [],
    columns: COLUMNS,
    getRowKey: (row: ModelRow) => row.id,
    emptyMessage: 'No model usage data for the selected period.',
  },
}

// Loading skeleton — 5 placeholder rows.
export const Loading: Story = {
  args: {
    rows: [],
    columns: COLUMNS,
    getRowKey: (row: ModelRow) => row.id,
    loading: true,
    skeletonRows: 5,
  },
}

// Error state — shows the error Typography path.
export const WithError: Story = {
  args: {
    rows: [],
    columns: COLUMNS,
    getRowKey: (row: ModelRow) => row.id,
    error: 'Failed to load usage data. Check your API credentials.',
  },
}

// Clickable rows — onRowClick wires up the hover + pointer cursor.
export const ClickableRows: Story = {
  args: {
    rows: SAMPLE_ROWS,
    columns: COLUMNS,
    getRowKey: (row: ModelRow) => row.id,
    onRowClick: (row: ModelRow) => alert(`Clicked: ${row.model}`),
  },
}
