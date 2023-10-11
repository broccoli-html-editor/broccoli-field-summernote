const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
	.webpackConfig({
		module: {
			rules:[
				{
					test:/\.twig$/,
					use:['twig-loader'],
				},
			]
		},
		resolve: {
			fallback: {
				"fs": false,
				"path": false,
				"crypto": false
			}
		}
	})


	// --------------------------------------
	// Summernote Field
	.js('src_client/fields/summernote.js', 'fields/')
	.sass('src_client/fields/summernote.scss', 'fields/')

	.sass('src_client/fields/bootstrap4/css/bootstrap.scss', 'fields/bootstrap4/css/bootstrap.css')
	.sass('src_client/fields/summernote/summernote-lite.scss', 'fields/summernote/summernote-lite.css')

	// --------------------------------------
	// libs
	.copyDirectory('node_modules/px2style/dist/', 'tests/server/editor_files/libs/px2style/dist/')
;
