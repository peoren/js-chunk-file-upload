import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { eslint } from 'rollup-plugin-eslint';
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
// 处理node的内置模块,发布node的第三方{builtins, globals}
// import builtins from 'rollup-plugin-node-builtins';
// import globals from 'rollup-plugin-node-globals';

import pkg from './package.json';

const isDev = process.env.NODE_ENV !== 'production';

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: {
			file: pkg.browser,
			format: 'umd',
			name:'ChunkUploadFile',
			sourcemap: true  //生成bundle.map.js文件，方便调试
		},
		plugins: [
			resolve(),  // 这样 Rollup 能找到 `ms`
			commonjs(), // 这样 Rollup 能转换 `ms` 为一个ES模块
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
			livereload(),
			serve({
				open:true,
				port:8805,
				// 静态资源
				contentBase: [resolveFile('dist')],
			}),
			!isDev && terser()
		],
		external: []
	}
];
