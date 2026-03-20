import {QueryCache, QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {ApiError} from './api/api'
import {App} from './App'
import './i18n'
import './index.css'
import { HTTP_STATUS } from '@shared/sharedConstants'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof ApiError && error.status === HTTP_STATUS.UNAUTHORIZED) {
        queryClient.clear()
        window.location.href = '/auth'
      }
    },
  }),
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
