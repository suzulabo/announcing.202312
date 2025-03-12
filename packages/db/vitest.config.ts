import dotenv from 'dotenv'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    env: dotenv.config({ path: '.env.test' }).parsed ?? {},
  },
})
