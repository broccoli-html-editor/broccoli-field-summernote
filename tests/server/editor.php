<?php
require_once ('../../vendor/autoload.php');
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Broccoli HTML Editor</title>

<!-- jQuery -->
<script src="./editor_files/libs/jquery-3.4.1.min.js"></script>

<!-- Bootstrap -->
<script src="./editor_files/libs/bootstrap/js/bootstrap.min.js"></script>
<link rel="stylesheet" href="./editor_files/libs/bootstrap/css/bootstrap.min.css" />

<!-- px2style -->
<script src="./editor_files/libs/px2style/dist/scripts.js"></script>
<link rel="stylesheet" href="./editor_files/libs/px2style/dist/styles.css" />

<!-- broccoli -->
<script src="../../vendor/broccoli-html-editor/broccoli-html-editor/client/dist/broccoli.min.js"></script>
<link rel="stylesheet" href="../../vendor/broccoli-html-editor/broccoli-html-editor/client/dist/broccoli.min.css" />

<!-- broccoli - custom fields -->
<link rel="stylesheet" href="../../fields/summernote.css" />
<script src="../../fields/summernote.js"></script>
<link rel="stylesheet" href="../../fields/summernote/summernote.min.css" />
<script src="../../fields/summernote/summernote.min.js"></script>
<script src="../../fields/plugins/summernote-cleaner.js"></script>

<!-- local -->
<link rel="stylesheet" href="./editor_files/styles.css" />
<script src="./editor_files/script.js"></script>

</head>
<body>
	<div class="editor-frame">
		<div class="editor-frame__main-block">
			<div id="instanceTreeView"></div>
			<div class="editor-frame__canvas-wrap">
				<div id="broccoliCanvas" data-broccoli-preview="/tests/server/contents/index.html"></div>
			</div>
				
			<div id="modulePalette"></div>
		</div>
		<div class="editor-frame__statusbar">
			<div id="instancePathView"></div>
		</div>

	</div>


<script>
var broccoli = new Broccoli();
broccoli.init(
	{
		'elmCanvas': document.getElementById('broccoliCanvas'),
		'elmModulePalette': document.getElementById('modulePalette'),
		'elmInstanceTreeView': document.getElementById('instanceTreeView'),
		'elmInstancePathView': document.getElementById('instancePathView'),
		'lang': 'ja', // language
		'contents_area_selector': '[data-contents]',
			// ↑編集可能領域を探すためのクエリを設定します。
			// 　この例では、data-contents属性が付いている要素が編集可能領域として認識されます。
		'contents_bowl_name_by': 'data-contents',
			// ↑bowlの名称を、data-contents属性値から取得します。
		'customFields': {
			'broccoli-field-summernote': window.BroccoliFieldSummernote
		},
		'gpiBridge': function(api, options, callback){
			// GPI(General Purpose Interface) Bridge
			// broccoliは、バックグラウンドで様々なデータ通信を行います。
			// GPIは、これらのデータ通信を行うための汎用的なAPIです。
			$.ajax({
				url: "./_api.php",
				type: 'post',
				data: {
					api: api ,
					options: JSON.stringify(options)
				},
				success: function(data){
					var json;
					try{
						json = JSON.parse(data);
					}catch(e){
						console.error(e, data);
						json = false;
					}
					// console.log(json);
					callback(json);
				}
			});
			return;
		},
		'onClickContentsLink': function( uri, data ){
			console.log(data);
			return false;
		},
		'onMessage': function( message ){
			// ユーザーへ知らせるメッセージを表示する
			window.px2style.flashMessage(message)
		},
		'enableModuleDec': false
	} ,
	function(){
		// 初期化が完了すると呼びだされるコールバック関数です。

		$(window).on('resize', function(){
			// このメソッドは、canvasの再描画を行います。
			// ウィンドウサイズが変更された際に、UIを再描画するよう命令しています。
			broccoli.redraw();
		});

	}
);
</script>
</body>
</html>
