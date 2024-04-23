import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';

const isProduction = process.env.BUILD === 'production';

const externalDeps = { 'react': 'React', 'react-dom': 'ReactDOM', '@fluentui/react': 'FluentUIReact' };

const plugins = [
    commonjs(),
    json(),
    resolve(),
    postcss(),
];

let output = [
    {
        sourcemap: 'inline',
        dir: 'dev',
        format: 'es',
        globals: externalDeps,
    },
];
if (isProduction) {
    plugins.push(terser());
    plugins.push(typescript({ tsconfig: './tsconfig.prod.json' }));
    plugins.push(
        copy({
            targets: [{ src: 'src/index.html', dest: 'dist' }, { src: 'src/favicon.ico', dest: 'dist' }],
        }),
    );
    output = [
        {
            sourcemap: false,
            dir: 'dist',
            format: 'es',
            globals: externalDeps,
        },
    ];
} else {
    plugins.push(typescript({ tsconfig: './tsconfig.dev.json' }));
    plugins.push(
        copy({
            targets: [{ src: 'src/index.html', dest: 'dev' }, { src: 'src/favicon.ico', dest: 'dev' }],
        }),
    );
}

export default [
    {
        external: externalDeps,
        input: 'src/index.tsx',
        output: output,
        plugins: plugins
    },
];