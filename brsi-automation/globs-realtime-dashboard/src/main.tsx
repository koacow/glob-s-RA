import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles'
import './index.css'
import App from './App.tsx'
import { Analytics } from '@vercel/analytics/react'

const queryClient = new QueryClient()

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Analytics />
    <ThemeProvider theme={responsiveFontSizes(theme)}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
