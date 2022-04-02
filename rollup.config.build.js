import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { eslint } from 'rollup-plugin-eslint';

// 处理node的内置模块,发布node的第三方{builtins, globals}
// import builtins from 'rollup-plugin-node-builtins';
// import globals from 'rollup-plugin-node-globals';

import pkg from './package.json';

const isDev = process.env.NODE_ENV !== 'production';
// 一段自定义的内容，以下内容会添加到打包结果中
const footer = `
if(typeof window !== 'undefined') {
  window._VERSION_ = '${pkg.version}'
}`
export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: [{
			file: pkg.main,
			format: 'cjs',
			footer,
		},
		{
			file: pkg.module,
			format: 'esm',
			footer,
		},
		{
			file: pkg.browser,
			format: 'umd',
			name: 'ChunkUploadFile',
			footer,
		}],
		plugins: [
			resolve(),  // 这样 Rollup 能找到 `ms`
			commonjs(), // 这样 Rollup 能转换 `ms` 为一个ES模块
			// 压缩代码
			uglify(),
			eslint({
				throwOnError: true,
				throwOnWarning: true,
				include: ['src/**'],
				exclude: ['node_modules/**']
			}),
			babel({
				exclude: 'node_modules/**',
				// 使plugin-transform-runtime生效
				runtimeHelpers: true,
			}),
			!isDev && terser()
		],
		external: []
	}
];
