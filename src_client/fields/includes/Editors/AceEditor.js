const jQuery = require('jquery');
const $ = jQuery;
const TextareaEditor = require('./TextareaEditor.js');

/**
 * AceEditor
 */
module.exports = class extends TextareaEditor {

	#$formElm;

	constructor(...args) {
		super(...args);
	}

	async initialize(){
		return new Promise((resolve, reject)=>{
			this.#$formElm = $('<div>')
				.css({
					'position': 'relative',
					'width': '100%',
					'height': 16 * this.rows,
					'border': '1px solid #ccc',
					'box-shadow': 'inset 0px 1px 1px rgba(0,0,0,0.075)',
					'border-radius': '4px',
					'overflow': 'hidden'
				})
			;
			this.$container.append( this.#$formElm );
			this.mod.aceEditor = ace.edit( this.#$formElm.get(0) );
			// Ace Snippets - https://ace.c9.io/build/kitchen-sink.html
			this.mod.aceEditor.setFontSize(16);
			this.mod.aceEditor.getSession().setUseWrapMode(true);// Ace 自然改行
			this.mod.aceEditor.setShowInvisibles(true);// Ace 不可視文字の可視化
			this.mod.aceEditor.$blockScrolling = Infinity;
			this.mod.aceEditor.setTheme("ace/theme/github");
			this.mod.aceEditor.getSession().setMode("ace/mode/html");

			resolve();
		});
	}

	async setValue(newVal) {
		return new Promise((resolve, reject)=>{
			this.mod.aceEditor.setValue( newVal );
			resolve();
		});
	}

	async getValue() {
		return new Promise((resolve, reject)=>{
			const returnVal = this.mod.aceEditor.getValue();
			resolve(returnVal);
		});
	}

	async setEditorType(editor) {
		return new Promise((resolve, reject)=>{
			if( editor == 'text' ){
				this.mod.aceEditor.setTheme("ace/theme/katzenmilch");
				this.mod.aceEditor.getSession().setMode("ace/mode/plain_text");
			}else if( editor == 'markdown' ){
				this.mod.aceEditor.setTheme("ace/theme/github");
				this.mod.aceEditor.getSession().setMode("ace/mode/markdown");
			}else{
				this.mod.aceEditor.setTheme("ace/theme/monokai");
				this.mod.aceEditor.getSession().setMode("ace/mode/html");
			}
			resolve();
		});
	}
}
