<?php
require_once ('../../vendor/autoload.php');

$fs = new tomk79\filesystem();

// モジュールセットを組成
$modules = array();
foreach( $fs->ls(__DIR__.'/../testdata/standard/px-files/modules/') as $tmp_basename ){
	if($tmp_basename == '.' || $tmp_basename == '..'){continue;}
	if($tmp_basename == 'info.json'){continue;}
	$modules[$tmp_basename] = realpath(__DIR__.'/../testdata/standard/px-files/modules/'.urlencode($tmp_basename)).'/';
}


// カスタムフィールドを組成
$customFields = array();
$customFields['broccoli-field-summernote'] = 'broccoliHtmlEditor\\broccoliFieldSummernote\\summernote';



$broccoli = new broccoliHtmlEditor\broccoliHtmlEditor();
$broccoli->init(array(
	'appMode' => 'web', // 'web' or 'desktop'. default to 'web'
	'paths_module_template' => $modules,
	'documentRoot' => __DIR__.'/../../', // realpath
	'pathHtml' => '/tests/server/contents/index.html',
	'pathResourceDir' => '/tests/server/contents/index_files/resources/',
	'realpathDataDir' => __DIR__.'/contents/index_files/guieditor.ignore/',
	'customFields' => $customFields,
	'bindTemplate' => function($htmls){
		$fin = '';
		$fin .= '<!DOCTYPE html>' . "\n";
		$fin .= '<html>' . "\n";
		$fin .= '<head>' . "\n";
		$fin .= '<title>Broccoli TEST</title>' . "\n";
		$fin .= '</head>' . "\n";
		$fin .= '<body>' . "\n";
		$fin .= '<div class="contents" data-contents="main">' . "\n";
		$fin .= $htmls['main'] . "\n";
		$fin .= '</div><!-- /main -->' . "\n";
		$fin .= '</body>' . "\n";
		$fin .= '</html>' . "\n";
		$fin .= '<script data-broccoli-receive-message="yes">' . "\n";
		$fin .= 'window.addEventListener(\'message\',(function() {' . "\n";
		$fin .= 'return function f(event) {' . "\n";
		$fin .= 'if(!event.data.scriptUrl){return;}' . "\n";
		$fin .= 'var s=document.createElement(\'script\');' . "\n";
		$fin .= 'document.querySelector(\'body\').appendChild(s);s.src=event.data.scriptUrl;' . "\n";
		$fin .= 'window.removeEventListener(\'message\', f, false);' . "\n";
		$fin .= '}' . "\n";
		$fin .= '})(),false);' . "\n";
		$fin .= '</script>' . "\n";
		return $fin;
	},
	'log' => function ($msg) {
		// エラー発生時にコールされます。
		// msg を受け取り、適切なファイルへ出力するように実装してください。
	}
));

// Broccoliの処理を実行
$rtn = $broccoli->gpi($_REQUEST['api'], json_decode($_REQUEST['options'], true));
echo json_encode($rtn);
exit();
