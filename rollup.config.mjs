let input = './index.js';
import terser from '@rollup/plugin-terser';
export default [
    // ES Module (ESM) 构建
    {
        input,
        output: {
            file: './dist/index.js',
            format: 'esm'
        }
    },
    // UMD 构建
    {
        input,
        output: {
            file: './dist/index.umd.js',
            format: 'umd',
            name: 'html2ast'
        },
        plugins: [terser()]
    },
    // iife 构建
    {
        input,
        output: {
            file: './dist/index.iife.js',
            format: 'iife',
            name: 'html2ast'
        },
        plugins: [terser()]
    }
]