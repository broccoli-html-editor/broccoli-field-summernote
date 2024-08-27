const jQuery = require('jquery');
const $ = jQuery;
const TextareaEditor = require('./TextareaEditor.js');

/**
 * CodemirrorEditor
 */
module.exports = class extends TextareaEditor {

	#$formElm;

	constructor(...args) {
		super(...args);
	}

	async initialize(){
		return new Promise((resolve, reject)=>{

			this.#$formElm = $('<textarea class="px2-input px2-input--block">')
				.attr({
					"name": this.mod.name,
					"rows": this.rows || 7,
				})
				.css({
					'width':'100%',
					'height':'auto',
				})
			;
			this.$container.append( this.#$formElm );

// TODO: ダミー
const data = {
	editor: 'markdown',
};
			this.mod.codeMirror = CodeMirror.fromTextArea(
				this.#$formElm.get(0),
				{
					lineNumbers: true,
					mode: (function(ext){
						switch(ext){
							case 'text': return 'text'; break;
							case 'markdown': return 'markdown'; break;
						}
						return 'htmlmixed';
					})(data.editor),
					tabSize: 4,
					indentUnit: 4,
					indentWithTabs: true,
					styleActiveLine: true,
					showCursorWhenSelecting: true,
					lineWrapping : true,

					extraKeys: {
						"Ctrl-E": "autocomplete",
						"Ctrl-S": ()=>{
							this.mod.codeMirror.save();
						},
						"Cmd-S": ()=>{
							this.mod.codeMirror.save();
						},
					},

					theme: (function(ext){
						switch(ext){
							case 'text': return 'default';break;
							case 'markdown': return 'mdn-like';break;
						}
						return 'monokai';
					})(data.editor),
				}
			);
			this.mod.codeMirror.on('blur', ()=>{
				this.mod.codeMirror.save();
			});
			this.mod.codeMirror.setSize('100%', this.rows * this.mod.codeMirror.defaultTextHeight());

			resolve();
		});
	}

	async setValue(newVal) {
		return new Promise((resolve, reject)=>{
			this.mod.codeMirror.getDoc().setValue( newVal );
			this.mod.codeMirror.save();
			resolve();
		});
	}

	async getValue() {
		return new Promise((resolve, reject)=>{
			const returnVal = this.#$formElm.val();
			resolve(returnVal);
		});
	}

	async setEditorType(editor) {
		return new Promise((resolve, reject)=>{
			if( editor == 'text' ){
				this.mod.codeMirror.setOption("theme", "default");
				this.mod.codeMirror.setOption("mode", "text");
			}else if( editor == 'markdown' ){
				this.mod.codeMirror.setOption("theme", "mdn-like");
				this.mod.codeMirror.setOption("mode", "markdown");
			}else{
				this.mod.codeMirror.setOption("theme", "monokai");
				this.mod.codeMirror.setOption("mode", "htmlmixed");
			}
			resolve();
		});
	}
}
