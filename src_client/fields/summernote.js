(()=>{
var __dirname = (function() {
	if (document.currentScript) {
		return document.currentScript.src;
	} else {
		var scripts = document.getElementsByTagName('script'),
			script = scripts[scripts.length-1];
		if (script.src) {
			return script.src;
		}
	}
})().replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');

window.BroccoliFieldSummernote = function(broccoli){

	var jQuery = require('jquery');
	var $ = jQuery;
	var isGlobalJQuery = ( window.jQuery ? true : false );
	var editorLib = null;
	try {
		if(window.CodeMirror){
			editorLib = 'codemirror';
		}
		else if(window.ace){
			editorLib = 'ace';
		}
	} catch (e) {
	}

	var htmlEditor;
	var textEditor;

	var lastEditorType = '';
	var templates = {
		"frame": require('./templates/frame.twig'),
	};

	/**
	 * HTMLエスケープ
	 */
	function htmlspecialchars(text){
		text = text.split(/\&/g).join('&amp;');
		text = text.split(/\</g).join('&lt;');
		text = text.split(/\>/g).join('&gt;');
		text = text.split(/\"/g).join('&quot;');
		return text;
	}

	/**
	 * HTMLの不整合を吸収する
	 */
	function sanitizeHtml(src){
		const $tmpElement = document.createElement('div');
		$tmpElement.innerHTML = src;
		return $tmpElement.innerHTML;
	}

	/**
	 * テキストエディタオブジェクトを生成する
	 */
	function generateTextEditor(conditions){
		const TextareaEditor = require('./includes/Editors/TextareaEditor.js');
		const InputTextEditor = require('./includes/Editors/InputTextEditor.js');
		const CodemirrorEditor = require('./includes/Editors/CodemirrorEditor.js');
		const AceEditor = require('./includes/Editors/AceEditor.js');
		const SummernoteEditor = require('./includes/Editors/SummernoteEditor.js');

		const editor = (function(){
			if( conditions.rows <= 1 ){
				return new InputTextEditor(conditions);
			}

			if( conditions.target == 'html' ){
				if( isGlobalJQuery ){
					return new SummernoteEditor(conditions);
				}else{
					console.error('broccoli-field-summernoteフィールドで Summernote (WYSIWYG)を利用するには、グローバルスコープに jQuery がロードされている必要があります。');
				}
			}else{
				if( editorLib == 'codemirror' ){
					return new CodemirrorEditor(conditions);
				}else if( editorLib == 'ace' ){
					return new AceEditor(conditions);
				}
			}
			return new TextareaEditor(conditions);
		})();

		return editor;
	}

	/**
	 * データを正規化する (Client Side)
	 * このメソッドは、同期的に振る舞います。
	 */
	this.normalizeData = function( fieldData, mode ){
		// 編集画面用にデータを初期化。
		var rtn = fieldData;
		if(!rtn || typeof(rtn) != typeof({})){
			data = {
				src: '',
				editor: ''
			};
		}
		if(typeof(rtn.src) != typeof('')){
			rtn.src = '';
		}
		if(typeof(rtn.editor) != typeof('')){
			rtn.editor = '';
		}
		return rtn;
	}

	/**
	 * プレビュー用の簡易なHTMLを生成する (Client Side)
	 * InstanceTreeViewで利用する。
	 */
	this.mkPreviewHtml = function( fieldData, mod, callback ){
		var rtn = '';
		new Promise(function(rlv){rlv();})
			.then(function(){ return new Promise(function(rlv, rjt){
				if( fieldData && typeof(fieldData.src) == typeof('') ){
					rtn += fieldData.src;
				}
				rlv();

			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				callback( rtn );
			}); })
		;
		return;
	}

	/**
	 * エディタUIを生成 (Client Side)
	 */
	this.mkEditor = async function( mod, data, elm, callback ){
		if(!data || typeof(data) != typeof({})){
			data = {
				src: '',
				editor: ''
			};
		}

		var rows = 12;
		if( mod.rows ){
			rows = mod.rows;
		}

		if(typeof(data.src) != typeof('')){
			data.src = '';
		}
		if(typeof(data.editor) != typeof('')){
			data.editor = '';
		}
		lastEditorType = data.editor;

		var $div = $(templates.frame({
			broccoli: broccoli,
			mod: mod,
			data: data,
		}));
		$(elm).html('').append( $div );

		var $htmlEditor = $div.find('.broccoli-field-summernote__html'); // HTML(=Summernote) または 1行のとき
		var $noHtmlTypeEditor = $div.find('.broccoli-field-summernote__other'); // 複数行のテキスト、Markdownのとき
		var $ctrls = $div.find('.broccoli-field-summernote__ctrls');

		htmlEditor = generateTextEditor({
			__dirname: __dirname,
			target: 'html',
			mod: mod,
			$container: $htmlEditor,
			rows: rows,
		});
		textEditor = generateTextEditor({
			__dirname: __dirname,
			target: 'other',
			mod: mod,
			$container: $noHtmlTypeEditor,
			rows: rows,
		});

		await htmlEditor.initialize($htmlEditor)
			.then(()=>htmlEditor.setValue(data.src))
			.then(()=>htmlEditor.setEditorType(data.editor));
		await textEditor.initialize($noHtmlTypeEditor)
			.then(()=>textEditor.setValue(data.src))
			.then(()=>textEditor.setEditorType(data.editor));

		// --------------------------------------
		// コントロール
		$ctrls.find('input[type=radio][name=editor-'+htmlspecialchars(mod.name)+'][value="'+htmlspecialchars(data.editor)+'"]').attr({'checked':'checked'});
		const $ctrlsEditorSwitch = $ctrls.find('input[type=radio][name=editor-'+htmlspecialchars(mod.name)+']');
		$ctrlsEditorSwitch
			.on('change', async function(){
				var $this = $(this);
				var newEditorType = $this.val();

				// --------------------------------------
				// editor 変更前の値を取得する
				var currentValue = await htmlEditor.getValue();
				if( lastEditorType ){
					currentValue = await textEditor.getValue();
				}

				// --------------------------------------
				// すべての入力欄の値を同期する
				await htmlEditor.setValue(currentValue);
				await textEditor.setValue(currentValue);

				if( !newEditorType || newEditorType == 'html' ){
					$htmlEditor.show();
					$noHtmlTypeEditor.hide();
				}else{
					$htmlEditor.hide();
					$noHtmlTypeEditor.show();

				}
				await htmlEditor.setEditorType(newEditorType);
				await textEditor.setEditorType(newEditorType);

				lastEditorType = newEditorType;
			});

		if( !data.editor || data.editor == 'html' ){
			$htmlEditor.show();
			$noHtmlTypeEditor.hide();
		}else{
			$htmlEditor.hide();
			$noHtmlTypeEditor.show();
		}

		new Promise(function(rlv){rlv();}).then(function(){ return new Promise(function(rlv, rjt){
			callback();
		}); });
		return;
	}

	// /**
	//  * エディタUIで編集した内容を検証する (Client Side)
	//  */
	// this.validateEditorContent = function( elm, mod, callback ){
	// 	var errorMsgs = [];
	// 	// errorMsgs.push('エラーがあります。');
	// 	new Promise(function(rlv){rlv();}).then(function(){ return new Promise(function(rlv, rjt){
	// 		callback( errorMsgs );
	// 	}); });
	// 	return;
	// }

	/**
	 * エディタUIで編集した内容を保存 (Client Side)
	 */
	this.saveEditorContent = async function( elm, data, mod, callback, options ){
		options = options || {};
		options.message = options.message || function(msg){};//ユーザーへのメッセージテキストを送信
		var rtn = {};
		var $dom = $(elm);

		var rows = 12;
		if( mod.rows ){
			rows = mod.rows;
		}

		rtn.src = '';
		rtn.editor = '';

		var $ctrls = $dom.find('.broccoli-field-summernote__ctrls');

		rtn.editor = $ctrls.find('input[type=radio][name=editor-'+htmlspecialchars(mod.name)+']:checked').val();

		if( !rtn.editor || rtn.editor == 'html' ){
			rtn.src = await htmlEditor.getValue();
			rtn.src = sanitizeHtml(rtn.src);
		}else{
			rtn.src = await textEditor.getValue();
		}

		rtn = JSON.parse( JSON.stringify(rtn) );

		new Promise(function(rlv){rlv();}).then(function(){ return new Promise(function(rlv, rjt){
			callback(rtn);
		}); });
		return;
	}

}
})();
