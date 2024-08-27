const jQuery = require('jquery');
const $ = jQuery;
const TextareaEditor = require('./TextareaEditor.js');

/**
 * InputTextEditor
 */
module.exports = class extends TextareaEditor {

	#$formElm;

	constructor(...args) {
		super(...args);
	}

	async initialize(){
		return new Promise((resolve, reject)=>{
			this.#$formElm = $('<input type="text" class="px2-input">')
				.attr({
					"name": this.mod.name
				})
				.css({'width':'100%'})
			;
			this.$container.append( this.#$formElm );
			resolve();
		});
	}

	async setValue(newVal) {
		return new Promise((resolve, reject)=>{
			this.#$formElm.val(newVal);
			resolve();
		});
	}

	async getValue() {
		return new Promise((resolve, reject)=>{
			const returnVal = this.#$formElm.val();
			resolve(returnVal);
		});
	}
}
