# broccoli-field-summernote

[Broccoli](https://github.com/broccoli-html-editor/broccoli-html-editor)に、 WYSIWYGエディタ "[summernote](https://summernote.org/)" によるフィールド機能を追加します。


## インストール - Installation

```bash
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
            'summernote.js'
        ),
        'function' => 'window.BroccoliFieldSummernote'
    ),
);
```

`broccoli-field-summernote` フィールドは、`multitext` フィールドのHTML編集モードと同じ形式のデータを保存します。


## 更新履歴 - Change log

### broccoli-field-summernote v0.4.1 (2024年11月1日)

- リソースの読み込みに関する不具合を修正した。

### broccoli-field-summernote v0.4.0 (2024年9月10日)

- HTMLモードで編集したコンテンツの文法を修復するようになった。
- エディタの名前空間を分離するようになった。
- 内部コードの構成を変更、その他、細かいUIの改善。

### broccoli-field-summernote v0.3.2 (2023年11月13日)

- Bootstrap, summernote が提供するCSSの影響範囲を制限した。

### broccoli-field-summernote v0.3.1 (2023年5月4日)

- 初期設置直後に Markdown で編集すると、編集内容が正しく保存されない不具合を修正した。
- CodeMirror, Ace Editor 利用時に、エディタの高さを内容に合わせて自動調整する機能を削除した。(パフォーマンスに問題があったため)

### broccoli-field-summernote v0.3.0 (2022年12月29日)

- プレーンテキスト、Markdown と切り替えて使えるようになった。
- 内部コードの構成を変更、その他、細かいUIの改善。

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
