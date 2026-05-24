import React from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import type { Preview, Decorator } from '@storybook/react'
import { createTensorTheme } from '@tensorcost/ui-kit'

// Light/dark toolbar toggle — picks up context.globals.theme.
const withTensorTheme: Decorator = (Story, context) => {
  const mode = context.globals['theme'] === 'dark' ? 'dark' : 'light'
  const theme = createTensorTheme(mode)
  return React.createElement(
    ThemeProvider,
    { theme },
    React.createElement(CssBaseline),
    React.createElement(Story),
  )
}

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'MUI palette mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        showName: true,
      },
    },
  },
  decorators: [withTensorTheme],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
