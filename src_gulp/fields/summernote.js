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

	var lastEditorType = '';
	var templates = {
		"frame": require('./templates/frame.twig'),
	};

	function htmlspecialchars(text){
		text = text.split(/\&/g).join('&amp;');
		text = text.split(/\</g).join('&lt;');
		text = text.split(/\>/g).join('&gt;');
		text = text.split(/\"/g).join('&quot;');
		return text;
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
	this.mkEditor = function( mod, data, elm, callback ){
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

		var $div = $(templates.frame());
		$(elm).html('').append( $div );
		var $htmlEditor = $div.find('.broccoli-field-summernote__html'); // HTML(=Summernote) または 1行のとき
		var $noHtmlTypeEditor = $div.find('.broccoli-field-summernote__other'); // 複数行のテキスト、Markdownのとき
		var $ctrls = $div.find('.broccoli-field-summernote__ctrls');


		// --------------------------------------
		// エディターを初期化
		if( rows == 1 ){
			var $formElm = $('<input type="text" class="px2-input">')
				.attr({
					"name": mod.name
				})
				.val(data.src)
				.css({'width':'100%'})
			;
			$htmlEditor.append( $formElm );
		}else{

			$htmlEditor.append(
				'<div class="broccoli-field-summernote__summernote">'+
				'</div>'
			);

			if( isGlobalJQuery ){
				// jQuery がある場合
				var $targetElm = window.jQuery(elm).find('.broccoli-field-summernote__summernote').eq(0);
				$targetElm.summernote({
					// TODO: 隠蔽したい。
					placeholder: '',
					tabsize: 2,
					height: 90 + (18 * rows),
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
				$targetElm.summernote('code', data.src);
			}else{
				// jQuery がない場合
				console.error('broccoli-field-summernoteフィールドで Summernote (WYSIWYG)を利用するには、グローバルスコープに jQuery がロードされている必要があります。');
				$(elm).find('.broccoli-field-summernote').append( $('<textarea class="form-control">')
					.val(data.src)
					.attr({
						"rows": rows
					})
				);
			}

			if( editorLib == 'codemirror' ){
				$formElm = $('<textarea>')
					.attr({
						"name": mod.name,
						"rows": rows,
					})
					.css({
						'width':'100%',
						'height':'auto'
					})
					.val(data.src)
				;
				$noHtmlTypeEditor.append( $formElm );

				// CodeMirror は、 textarea が DOMツリーに配置されたあとに初期化する。
				// なので、ここではまだ初期化しない。

			}else if( editorLib == 'ace' ){
				$formElm = $('<div>')
					.text(data.src)
					.css({
						'position': 'relative',
						'width': '100%',
						'height': 16 * rows,
						'border': '1px solid #ccc',
						'box-shadow': 'inset 0px 1px 1px rgba(0,0,0,0.075)',
						'border-radius': '4px',
						'overflow': 'hidden'
					})
				;
				$noHtmlTypeEditor.append( $formElm );
				mod.aceEditor = ace.edit( $formElm.get(0) );
				// Ace Snippets - https://ace.c9.io/build/kitchen-sink.html
				mod.aceEditor.setFontSize(16);
				mod.aceEditor.getSession().setUseWrapMode(true);// Ace 自然改行
				mod.aceEditor.setShowInvisibles(true);// Ace 不可視文字の可視化
				mod.aceEditor.$blockScrolling = Infinity;
				mod.aceEditor.setTheme("ace/theme/github");
				mod.aceEditor.getSession().setMode("ace/mode/html");

				if( data.editor == 'text' ){
					mod.aceEditor.setTheme("ace/theme/katzenmilch");
					mod.aceEditor.getSession().setMode("ace/mode/plain_text");
				}else if( data.editor == 'markdown' ){
					mod.aceEditor.setTheme("ace/theme/github");
					mod.aceEditor.getSession().setMode("ace/mode/markdown");
				}else{
					mod.aceEditor.setTheme("ace/theme/monokai");
					mod.aceEditor.getSession().setMode("ace/mode/html");
				}

				// 編集中のコンテンツ量に合わせて、
				// AceEditor編集欄のサイズを広げる
				var updateAceHeight = function() {
					var h =
						mod.aceEditor.getSession().getScreenLength()
						* mod.aceEditor.renderer.lineHeight
						+ mod.aceEditor.renderer.scrollBar.getWidth()
					;
					if( h < mod.aceEditor.renderer.lineHeight * rows ){
						h = mod.aceEditor.renderer.lineHeight * rows;
					}
					$formElm.eq(0).height(h.toString() + "px");
					mod.aceEditor.resize();
				};

				// スクロール位置の調整
				var updateAceScroll = function() {
					var $lightbox = $formElm.closest('.broccoli__lightbox-inner-body');
					var lightbox_scrollTop = $lightbox.scrollTop();
					var lightbox_offsetTop = $lightbox.offset().top;
					var lightbox_height = $lightbox.height();
					var form_offsetTop = $formElm.offset().top;
					var selection = mod.aceEditor.getSelection();
					var cursorRow = selection.getSelectionAnchor().row;
					var cursorTop = mod.aceEditor.renderer.lineHeight * cursorRow;
					var cursorOffsetTop = form_offsetTop + cursorTop;
					var form_position_top = lightbox_scrollTop - lightbox_offsetTop + form_offsetTop;
					var focusBuffer = 120;
					if( cursorOffsetTop < 60 ){
						// 上へ行きすぎた
						$lightbox.scrollTop( form_position_top + cursorTop - focusBuffer );
					}else if( cursorOffsetTop > lightbox_height - 40 ){
						// 下へ行きすぎた
						$lightbox.scrollTop( form_position_top + cursorTop - lightbox_height + focusBuffer + 100 );
					}
				};
				mod.aceEditor.getSession().on('change', function(){
					updateAceHeight();
					updateAceScroll();
				});
				mod.aceEditor.getSelection().on('changeCursor', function(){
					updateAceHeight();
					updateAceScroll();
				});
				setTimeout(updateAceHeight, 200);

			}else{
				$formElm = $('<textarea class="px2-input px2-input--block">')
					.attr({
						"name": mod.name,
						"rows": rows
					})
					.css({
						'width':'100%',
						'height':'auto',
					})
					.val(data.src)
				;
				$noHtmlTypeEditor.append( $formElm );
			}
		}


		// --------------------------------------
		// エディター設定の調整
		if( editorLib == 'codemirror' && rows > 1 ){
			// CodeMirror は、 textarea が DOMツリーに配置されたあとに初期化する。
			mod.codeMirror = CodeMirror.fromTextArea(
				$formElm.get(0),
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
					lineWrapping : (data.editor=='markdown' ? true : false),

					extraKeys: {
						"Ctrl-E": "autocomplete",
						"Ctrl-S": function(){
							mod.codeMirror.save();
						},
						"Cmd-S": function(){
							mod.codeMirror.save();
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
			mod.codeMirror.on('blur',function(){
				mod.codeMirror.save();
			});
			mod.codeMirror.setSize('100%', rows * mod.codeMirror.defaultTextHeight());

			// 編集中のコンテンツ量に合わせて、
			// CodeMirror編集欄のサイズを広げる
			var updateCodeMirrorHeight = function() {
				var h = (function(){
					var h = 0;
					for(var line = 0; line < mod.codeMirror.getDoc().lineCount(); line ++){
						h += mod.codeMirror.getDoc().getLineHandle(line).height;
					}
					return h + 20;
				})();
				if( h < mod.codeMirror.defaultTextHeight() * rows ){
					h = mod.codeMirror.defaultTextHeight() * rows;
				}
				mod.codeMirror.setSize(null, h);
				mod.codeMirror.refresh();
			};

			// スクロール位置の調整
			var updateCodeMirrorScroll = function() {
				var $lightbox = $formElm.closest('.broccoli__lightbox-inner-body');
				var lightbox_scrollTop = $lightbox.scrollTop();
				var lightbox_offsetTop = $lightbox.offset().top;
				var lightbox_height = $lightbox.height();
				var form_offsetTop = $formElm.offset().top;
				var cursorTop = mod.codeMirror.cursorCoords().top;
				var cursorOffsetTop = form_offsetTop + cursorTop;
				var form_position_top = lightbox_scrollTop - lightbox_offsetTop + form_offsetTop;
				var focusBuffer = 120;
				if( cursorOffsetTop < 60 ){
					// 上へ行きすぎた
					$lightbox.scrollTop( form_position_top + cursorTop - focusBuffer );
				}else if( cursorOffsetTop > lightbox_height - 60 ){
					// 下へ行きすぎた
					$lightbox.scrollTop( form_position_top + cursorTop - lightbox_height + focusBuffer + 120 );
				}
			};
			var timerUpdateCodeMirror;
			mod.codeMirror.on('change', function(){
				mod.codeMirror.save();
				clearTimeout(timerUpdateCodeMirror);
				timerUpdateCodeMirror = setTimeout(function(){
					updateCodeMirrorHeight();
					updateCodeMirrorScroll();
				}, 100);
			});
			mod.codeMirror.on('cursorActivity', function(){
				clearTimeout(timerUpdateCodeMirror);
				timerUpdateCodeMirror = setTimeout(function(){
					updateCodeMirrorHeight();
					updateCodeMirrorScroll();
				}, 5);
			});
			timerUpdateCodeMirror = setTimeout(function(){
				updateCodeMirrorHeight();
				updateCodeMirrorScroll();
			}, 200);
		}

		// --------------------------------------
		// コントロールを配置
		$ctrls
			.append( $('<p>')
				.append($('<span style="margin-right: 10px;"><label><input type="radio" name="editor-'+htmlspecialchars(mod.name)+'" value="" /> HTML</label></span>'))
				.append($('<span style="margin-right: 10px;"><label><input type="radio" name="editor-'+htmlspecialchars(mod.name)+'" value="text" /> テキスト</label></span>'))
				.append($('<span style="margin-right: 10px;"><label><input type="radio" name="editor-'+htmlspecialchars(mod.name)+'" value="markdown" /> Markdown</label></span>'))
			)
		;
		$ctrls.find('input[type=radio][name=editor-'+mod.name+'][value="'+data.editor+'"]').attr({'checked':'checked'});

		$ctrls.find('input[type=radio][name=editor-'+mod.name+']').on('change', function(){
			var $this = $(this);
			var newEditorType = $this.val();

			if( rows > 1 ){
				// --------------------------------------
				// editor 変更前の値を取得する
				var currentValue = '';
				if( isGlobalJQuery ){
					// jQuery がある場合
					var $targetElm = window.jQuery(elm).find('.broccoli-field-summernote__summernote').eq(0);
						// TODO: 隠蔽したい。

					currentValue = $targetElm.summernote('code');

				}else{
					// jQuery がない場合
					currentValue = $htmlEditor.find('textarea').val();
				}
				if( lastEditorType ){
					if( editorLib == 'codemirror' && mod.codeMirror ){
						currentValue = $noHtmlTypeEditor.find('textarea').val();
					}else if( editorLib == 'ace' && mod.aceEditor ){
						currentValue = mod.aceEditor.getValue();
					}else{
						currentValue = $noHtmlTypeEditor.find('textarea').val();
					}
				}
				// --------------------------------------
				// すべての入力欄の値を同期する
				if( isGlobalJQuery ){
					// jQuery がある場合
					var $targetElm = window.jQuery(elm).find('.broccoli-field-summernote__summernote').eq(0);
						// TODO: 隠蔽したい。

					$targetElm.summernote('code', currentValue);

				}else{
					// jQuery がない場合
					$htmlEditor.find('textarea').val( currentValue );
				}
				if( !lastEditorType ){
					if( editorLib == 'codemirror' && mod.codeMirror ){
						$noHtmlTypeEditor.find('textarea').val( currentValue );
					}else if( editorLib == 'ace' && mod.aceEditor ){
						mod.aceEditor.setValue( currentValue );
					}else{
						$noHtmlTypeEditor.find('textarea').val( currentValue );
					}
				}
			}

			if( !newEditorType || rows == 1 ){
				$htmlEditor.show();
				$noHtmlTypeEditor.hide();
			}else{

				// --------------------------------------
				// editor 変更
				if( editorLib == 'codemirror' ){
					if( newEditorType == 'text' ){
						mod.codeMirror.setOption("theme", "default");
						mod.codeMirror.setOption("mode", "text");
					}else if( newEditorType == 'markdown' ){
						mod.codeMirror.setOption("theme", "mdn-like");
						mod.codeMirror.setOption("mode", "markdown");
					}else{
						mod.codeMirror.setOption("theme", "monokai");
						mod.codeMirror.setOption("mode", "htmlmixed");
					}
					updateCodeMirrorHeight();
				}else if( editorLib == 'ace' && mod.aceEditor ){
					if( newEditorType == 'text' ){
						mod.aceEditor.setTheme("ace/theme/katzenmilch");
						mod.aceEditor.getSession().setMode("ace/mode/plain_text");
					}else if( newEditorType == 'markdown' ){
						mod.aceEditor.setTheme("ace/theme/github");
						mod.aceEditor.getSession().setMode("ace/mode/markdown");
					}else{
						mod.aceEditor.setTheme("ace/theme/monokai");
						mod.aceEditor.getSession().setMode("ace/mode/html");
					}
				}

				$htmlEditor.hide();
				$noHtmlTypeEditor.show();
			}

			lastEditorType = newEditorType;
		});

		if( !data.editor || rows == 1 ){
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
	this.saveEditorContent = function( elm, data, mod, callback, options ){
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

		var $htmlEditor = $dom.find('.broccoli-field-summernote__html'); // HTML(=Summernote) または 1行のとき
		var $noHtmlTypeEditor = $dom.find('.broccoli-field-summernote__other'); // 複数行のテキスト、Markdownのとき
		var $ctrls = $dom.find('.broccoli-field-summernote__ctrls');

		if( rows == 1 && $htmlEditor.find('input[type=text]').length ){
			rtn.src = $htmlEditor.find('input[type=text]').val();

		}else{
			if( !data.editor || data.editor == 'html' ){
				if( isGlobalJQuery ){
					// jQuery がある場合
					var $targetElm = window.jQuery(elm).find('.broccoli-field-summernote__summernote').eq(0);
						// TODO: 隠蔽したい。

					rtn.src = $targetElm.summernote('code');

				}else{
					// jQuery がない場合
					rtn.src = $htmlEditor.find('textarea').val();
				}
			}else if( editorLib == 'codemirror' && mod.codeMirror ){
				rtn.src = $noHtmlTypeEditor.find('textarea').val();
			}else if( editorLib == 'ace' && mod.aceEditor ){
				rtn.src = mod.aceEditor.getValue();
			}else{
				rtn.src = $noHtmlTypeEditor.find('textarea').val();
			}
		}

		rtn.editor = $ctrls.find('input[type=radio][name=editor-'+mod.name+']:checked').val();

		rtn = JSON.parse( JSON.stringify(rtn) );

		new Promise(function(rlv){rlv();}).then(function(){ return new Promise(function(rlv, rjt){
			callback(rtn);
		}); });
		return;
	}

}
