import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    format: 'es',
    sourcemap: true,
    file: 'dist/index.js',
  },
  plugins: [typescript(), dts()],

})
