import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Use styled-components instead of emotion (project already has styled-components)
      '@mui/styled-engine': '@mui/styled-engine-sc'
    }
  }
})
