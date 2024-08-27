const jQuery = require('jquery');
const $ = jQuery;

/**
 * TextareaEditor
 */
module.exports = class {
	__dirname;
	mod;
	$container;
	rows;

    #$formElm;

	constructor(conditions){
		this.__dirname = conditions.__dirname;
		this.mod = conditions.mod;
		this.$container = conditions.$container;
		this.rows = conditions.rows;
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

	async setEditorType(editor) {
		return new Promise((resolve, reject)=>{
			resolve();
		});
	}
}
