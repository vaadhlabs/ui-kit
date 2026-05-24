import type { Meta, StoryObj } from '@storybook/react'
import { Box } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import MemoryIcon from '@mui/icons-material/Memory'
import BarChartIcon from '@mui/icons-material/BarChart'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SettingsIcon from '@mui/icons-material/Settings'
import { RailSidebar, type NavItem, type RailSidebarUser } from './RailSidebar.js'

const SAMPLE_ITEMS: NavItem[] = [
  { key: 'home',       label: 'Home',       icon: HomeIcon,          path: '/' },
  { key: 'costs',      label: 'Costs',      icon: AttachMoneyIcon,   path: '/costs' },
  { key: 'gpu',        label: 'GPU',         icon: MemoryIcon,        path: '/gpu' },
  { key: 'reports',    label: 'Reports',    icon: BarChartIcon,      path: '/reports' },
  { key: 'alerts',     label: 'Alerts',     icon: NotificationsIcon, path: '/alerts' },
  { key: 'settings',   label: 'Settings',   icon: SettingsIcon,      path: '/settings' },
]

const SAMPLE_USER: RailSidebarUser = {
  email: 'alice@acme.io',
  role: 'admin',
}

// The sidebar expects to fill its parent's height. Wrap in a fixed-height
// container so it renders sensibly in Storybook's padded layout.
const SidebarWrapper = ({ children }: { children: React.ReactNode }) => (
  <Box height={600} display="flex" overflow="hidden" border="1px solid" borderColor="divider" borderRadius={2}>
    {children}
  </Box>
)

const meta: Meta<typeof RailSidebar> = {
  title: 'Navigation/RailSidebar',
  component: RailSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <SidebarWrapper>
        <Story />
      </SidebarWrapper>
    ),
  ],
  // Default args shared across most stories.
  args: {
    active: 'costs',
    items: SAMPLE_ITEMS,
    tenant: 'Acme Corp',
    env: 'production',
    user: SAMPLE_USER,
    alertsCount: 0,
  },
}

export default meta
type Story = StoryObj<typeof RailSidebar>

// Default — collapsed icon-rail (the user-override default).
export const Default: Story = {
  args: {
    defaultCollapsed: true,
  },
}

// Pinned open — sidebar starts expanded and stays that way.
export const PinnedOpen: Story = {
  args: {
    defaultCollapsed: false,
    pinned: true,
  },
}

// With unread alerts badge — the alerts item gets a danger count dot.
export const WithAlertsBadge: Story = {
  args: {
    alertsCount: 7,
    active: 'alerts',
    pinned: true,
    defaultCollapsed: false,
  },
}

// With a custom per-item badge kind on a non-alerts item.
export const WithItemBadge: Story = {
  args: {
    pinned: true,
    defaultCollapsed: false,
    items: SAMPLE_ITEMS.map((item) =>
      item.key === 'reports'
        ? { ...item, badge: { kind: 'warn' as const, count: 2 } }
        : item
    ),
  },
}

// Env click split-mode — both tenant and env zones are independently clickable.
export const WithEnvClick: Story = {
  args: {
    pinned: true,
    defaultCollapsed: false,
    tenant: 'Vaadh Labs',
    env: 'staging',
    onTenantClick: () => alert('Switch tenant'),
    onEnvClick: () => alert('Switch env'),
  },
}

// Different active item — visual check that the highlight moves correctly.
export const ActiveHome: Story = {
  args: {
    active: 'home',
    pinned: true,
    defaultCollapsed: false,
  },
}
