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
                    `<iframe src="${this.__dirname}/editor/index.html"></iframe>`+
				'</div>'
			);

            const $iframe = window.jQuery(this.$container.get(0)).find('.broccoli-field-summernote__summernote iframe').eq(0);
            const iframeElement = $iframe.get(0);
            iframeElement.contentWindow.addEventListener('load', ()=>{
                const $iframeWindow = window.jQuery(iframeElement.contentWindow);
                const $iframeContent = window.jQuery(iframeElement.contentWindow.document);

                $('link').each((index, elm)=>{
                    const $link = $(elm);
                    if( $link.attr('rel') != "stylesheet" ){
                        return;
                    }
                    $iframeContent.find('head').append($link.clone());
                });

                this.#$formElm = window.jQuery('<div>');
                $iframeContent.find('body').append(this.#$formElm);

                function justifyEditorHeight(){
                    $iframe.css( {
                        height: $iframeContent.find('.note-editor').outerHeight(),
                    } );
                }

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
                    ],
                    callbacks: {
                        onInit: function(){ setTimeout(justifyEditorHeight, 1000); },
                        // onChange: function(){ setTimeout(justifyEditorHeight, 1000); },
                        onFocus: function(){ setTimeout(justifyEditorHeight, 1000); },
                        onBlur: function(){ setTimeout(justifyEditorHeight, 1000); },
                    },
                });

                $iframeWindow
                    .on('keydown', function(event){
                        const origEvent = event.originalEvent;
                        if( (origEvent.metaKey || origEvent.ctrlKey) && origEvent.key == 's' ){
                            origEvent.preventDefault();
                            const keyboardEvent = new KeyboardEvent('keydown', origEvent);
                            document.dispatchEvent(keyboardEvent);
                        }
                    })
                    // .on('load', function(event){
                    // 	setTimeout(justifyEditorHeight, 200);
                    // })
                    ;

                resolve();
            });
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
