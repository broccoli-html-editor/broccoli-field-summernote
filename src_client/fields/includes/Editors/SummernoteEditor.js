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

            // const $iframe = window.jQuery(elm).find('.broccoli-field-summernote__summernote iframe').eq(0);
            // const iframeElement = $iframe.get(0);
            // const $iframeWindow = window.jQuery(iframeElement.contentWindow);
            // const $iframeContent = window.jQuery(iframeElement.contentWindow.document);

            // iframeElement.contentWindow.document.write(`<!DOCTYPE html>
            // <html>
            //     <head>
            //         <style>html, body {padding: 0; margin: 0;}</style>
            //     </head>
            //     <body class="broccoli-field-summernote">
            //         <div></div>
            //     </body>
            // </html>`);

            // $('link').each((index, elm)=>{
            //     const $link = $(elm);
            //     if( $link.attr('rel') != "stylesheet" ){
            //         return;
            //     }
            //     $iframeContent.find('head').append($link.clone());
            // });

            // $summernoteEditorElement = window.jQuery('<div>');
            // $iframeContent.find('body').append($summernoteEditorElement);

            // function justifyEditorHeight(){
            //     $iframe.css( {
            //         height: $iframeContent.find('.note-editor').outerHeight(),
            //     } );
            // }

            // $summernoteEditorElement.summernote({
            //     placeholder: '',
            //     tabsize: 2,
            //     height: 90 + (18 * rows),
            //     toolbar: [
            //         ['style', [
            //             'style',
            //         ]],
            //         ['font', [
            //             'bold',
            //             'underline',
            //             'clear',
            //         ]],
            //         ['color', [
            //             'color',
            //         ]],
            //         ['para', [
            //             'ul',
            //             'ol',
            //             'paragraph',
            //         ]],
            //         ['table', [
            //             'table',
            //         ]],
            //         ['insert', [
            //             'link',
            //             // 'picture',
            //             // 'video',
            //         ]],
            //         ['view', [
            //             'fullscreen',
            //             'codeview',
            //             // 'help',
            //         ]],
            //     ],
            //     callbacks: {
            //         onInit: function(){ setTimeout(justifyEditorHeight, 1000); },
            //         // onChange: function(){ setTimeout(justifyEditorHeight, 1000); },
            //         onFocus: function(){ setTimeout(justifyEditorHeight, 1000); },
            //         onBlur: function(){ setTimeout(justifyEditorHeight, 1000); },
            //     },
            // });
            // $summernoteEditorElement.summernote('code', data.src);

            // $iframeWindow
            //     .on('keydown', function(event){
            //         const origEvent = event.originalEvent;
            //         if( (origEvent.metaKey || origEvent.ctrlKey) && origEvent.key == 's' ){
            //             origEvent.preventDefault();
            //             const keyboardEvent = new KeyboardEvent('keydown', origEvent);
            //             document.dispatchEvent(keyboardEvent);
            //         }
            //     })
            //     // .on('load', function(event){
            //     // 	setTimeout(justifyEditorHeight, 200);
            //     // })
            //     ;

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
