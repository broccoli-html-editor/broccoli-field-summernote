module.exports = function(broccoli){
	var utils79 = require('utils79');

	/**
	 * データをバインドする
	 */
	this.bind = function( fieldData, mode, mod, callback ){
		var rtn = '';
		if(typeof(fieldData)===typeof({}) && typeof(fieldData.src)===typeof('')){
			rtn = utils79.toStr(fieldData.src);

			switch( fieldData.editor ){
				case 'text':
					rtn = php.htmlspecialchars( rtn ); // ←HTML特殊文字変換
					rtn = rtn.replace(new RegExp('\r\n|\r|\n','g'), '<br />'); // ← 改行コードは改行タグに変換
					break;
				case 'markdown':
					var marked = require('marked');
					marked.setOptions({
						renderer: new marked.Renderer(),
						gfm: true,
						tables: true,
						breaks: false,
						pedantic: false,
						sanitize: false,
						smartLists: true,
						smartypants: false
					});
					rtn = marked(rtn);
					break;
				case 'html':
				default:
					break;
			}
		}
		if( mode == 'canvas' && !rtn.length ){
			rtn = '<span style="color:#999;background-color:#ddd;font-size:10px;padding:0 1em;max-width:100%;overflow:hidden;white-space:nowrap;">('+broccoli.lb().get('ui_message.double_click_to_edit_text')+')</span>';
		}

		callback(rtn);
		return;
	}

}
