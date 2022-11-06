# broccoli-field-summernote

[Broccoli](https://github.com/broccoli-html-editor/broccoli-html-editor)に、 WYSIWYGエディタ "[summernote](https://summernote.org/)" によるフィールド機能を追加します。


## インストール - Installation

```
$ composer require broccoli-html-editor/broccoli-field-summernote;
```

## 使い方 - Usage

### Pickles 2 で `multitext` フィールドを置き換える


`broccoli-field-summernote` が生成するデータは、 `multitext` フィールドと互換します。
`multitext` を置き換えることで、既存の Pickles 2 プロジェクトにそのまま導入することができます。

Pickles 2 の設定ファイル `config.php` に次のような設定を追加します。
(`$path_to_vendor` には、お使いの Composer の vendor ディレクトリのパスをセットしてください)

```php
$path_to_vendor = 'path/to/vendor/';
@$conf->plugins->px2dt->guieditor->custom_fields['multitext'] = array(
    'backend'=>array(
        'class' => 'broccoliHtmlEditor\\broccoliFieldSummernote\\summernote',
        'require' => $path_to_vendor.'broccoli-html-editor/broccoli-field-summernote/node/summernote.js',
    ),
    'frontend'=>array(
        'dir' => $path_to_vendor.'broccoli-html-editor/broccoli-field-summernote/fields/',
        'file' => array(
            'summernote.css',
            'summernote.js',
            "summernote/summernote-bs4.min.css",
            "summernote/summernote-bs4.min.js",
            "bootstrap4/css/bootstrap.min.css",
            "bootstrap4/js/bootstrap.min.js"
        ),
        'function' => 'window.BroccoliFieldSummernote'
    ),
);
```

`broccoli-field-summernote` フィールドは、`multitext` フィールドのHTML編集モードと同じ形式のデータを保存します。

既存のインスタンスが Markdown モード または テキストモード の場合、 HTMLに変換して扱われます。保存後の形式はHTMLモードに変換されます。



## 更新履歴 - Change log

### broccoli-field-summernote v0.3.0 (リリース日未定)

- 内部コードの構成を変更。
- その他、細かいUIの改善。

### broccoli-field-summernote v0.2.0 (2022年6月5日)

- サポートするPHPのバージョンを `>=7.3.0` に変更。
- データに不備がある場合に起きるエラーを修正。
- WYSIWYG内での見出しスタイルの干渉を解決した。

### broccoli-field-summernote v0.1.2 (2020年8月12日)

- Update Summernote: v0.8.16 to v0.8.18
- `rows` オプションを追加。

### broccoli-field-summernote v0.1.1 (2020年6月6日)

- クライアント側リソースのパスが合わない不具合を修正。

### broccoli-field-summernote v0.1.0 (2020年6月6日)

- Initial release.


## ライセンス - License

MIT License


## 作者 - Author

- Tomoya Koyanagi <tomk79@gmail.com>
- website: <https://www.pxt.jp/>
- Twitter: @tomk79 <https://twitter.com/tomk79/>
