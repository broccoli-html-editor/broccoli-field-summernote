const jQuery = require('jquery');
const $ = jQuery;
const TextareaEditor = require('./TextareaEditor.js');

/**
 * SummernoteEditor
 */
module.exports = class extends TextareaEditor {

    #$formElm;

    constructor(...args) {
        super(...args);
    }

	async initialize(){
		return new Promise((resolve, reject)=>{
			this.$container.append(
				'<div class="broccoli-field-summernote__summernote">'+
				'</div>'
			);

            this.#$formElm = window.jQuery(this.$container.get(0)).find('.broccoli-field-summernote__summernote').eq(0);
            this.#$formElm.summernote({
                placeholder: '',
                tabsize: 2,
                height: 90 + (18 * this.rows),
                toolbar: [
                    ['style', [
                        'style',
                    ]],
                    ['font', [
                        'bold',
                        'underline',
                        'clear',
                    ]],
                    ['color', [
                        'color',
                    ]],
                    ['para', [
                        'ul',
                        'ol',
                        'paragraph',
                    ]],
                    ['table', [
                        'table',
                    ]],
                    ['insert', [
                        'link',
                        // 'picture',
                        // 'video',
                    ]],
                    ['view', [
                        'fullscreen',
                        'codeview',
                        // 'help',
                    ]],
                ]
            });

			resolve();
		});
	}

	async setValue(newVal) {
		return new Promise((resolve, reject)=>{
			this.#$formElm.summernote('code', newVal);
			resolve();
		});
	}

	async getValue() {
		return new Promise((resolve, reject)=>{
			const returnVal = this.#$formElm.summernote('code');
			resolve(returnVal);
		});
	}

}
