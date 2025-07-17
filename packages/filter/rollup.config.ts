import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'

const input = './src/index.ts'

export default defineConfig([
  // 用于打包 JavaScript 代码
  {
    input,
    output: {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      // Allows us to consume libraries that are CommonJS.
      commonjs(),
      nodeResolve(), // 解析 node_modules 中的模块,
      typescript(),
    ],
    external: ['react', 'react-dom'],
  },

  // 用于生成类型声明文件 .d.ts
  {
    input,
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      dts(), // 打包成一个单独的 index.d.ts 文件
    ],
  },
])
