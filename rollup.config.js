import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';

const isProduction = process.env.BUILD === 'production';

const output = [
    {
        sourcemap: isProduction ? false : 'inline',
        dir: 'dist',
        format: 'esm',
    },
];

export default [
    {
        input: 'src/index.tsx',
        output: output,
        plugins: [
            commonjs(),
            json(),
            resolve(),
            copy({
                targets: [{ src: 'src/index.html', dest: 'dist' }],
            }),
            typescript({ tsconfig: './tsconfig.json' }),
            isProduction && terser(),
            postcss(),
        ]
    },
];
