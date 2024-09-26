const jQuery = require('jquery');
const $ = jQuery;
const TextareaEditor = require('./TextareaEditor.js');

/**
 * SummernoteEditor
 */
module.exports = class extends TextareaEditor {

	#summernoteFrameWindow;

	constructor(...args) {
		super(...args);
	}

	async initialize(){
		return new Promise((resolve, reject)=>{
			this.$container.append(`
				<div class="broccoli-field-summernote__summernote">
					<iframe></iframe>
				</div>`);

			const $iframe = $(this.$container.get(0)).find('.broccoli-field-summernote__summernote iframe').eq(0);
			const iframeElement = $iframe.get(0);
			iframeElement.contentWindow.callbackOnStandby = async ()=>{
				await iframeElement.contentWindow.initialize({
					rows: this.rows,
					setHeight: (newHeight)=>{
						$iframe.css( {
							height: newHeight,
						} );
					},
					onkeydown: (event)=>{
						const keyboardEvent = new KeyboardEvent('keydown', event);
						document.dispatchEvent(keyboardEvent);
					},
				});
				this.#summernoteFrameWindow = iframeElement.contentWindow;

				resolve();
			};

			iframeElement.contentWindow.document.open();
			iframeElement.contentWindow.document.write(`<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<base href="${this.__dirname}/editor/index.html" />
		<title>Editor</title>
		<link rel="stylesheet" href="./index_files/bootstrap4/css/bootstrap.css" />
		<link rel="stylesheet" href="./index_files/summernote/summernote-lite.css" />

		<link rel="stylesheet" href="./index_files/styles.css" />

		<script src="./index_files/jQuery-v3.7.1.min.js"></script>
		<script src="./index_files/summernote/summernote-lite.js"></script>
		<script src="./index_files/script.js"></script>
	</head>
	<body>
		<div class="broccoli-field-summernote"></div>
		<script>
			$(window).on('load', ()=>{
				window.callbackOnStandby();
			});
		</script>
	</body>
</html>`);
			iframeElement.contentWindow.document.close();
		});
	}

	async setValue(newVal) {
		return this.#summernoteFrameWindow.setValue(newVal);
	}

	async getValue() {
		return this.#summernoteFrameWindow.getValue();
	}

}
