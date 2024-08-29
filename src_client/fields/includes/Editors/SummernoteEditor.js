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
			this.$container.append(
				'<div class="broccoli-field-summernote__summernote">'+
                    `<iframe src="${this.__dirname}/editor/index.pass.html"></iframe>`+
				'</div>'
			);

            const $iframe = $(this.$container.get(0)).find('.broccoli-field-summernote__summernote iframe').eq(0);
            const iframeElement = $iframe.get(0);
            iframeElement.contentWindow.addEventListener('load', async ()=>{
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
            });
		});
	}

	async setValue(newVal) {
		return this.#summernoteFrameWindow.setValue(newVal);
	}

	async getValue() {
		return this.#summernoteFrameWindow.getValue();
	}

}
