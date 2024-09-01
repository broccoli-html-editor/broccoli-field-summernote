window.initialize = async (options)=>{
	return new Promise((resolve, reject)=>{
		window.$formElm = $('.broccoli-field-summernote');

		function justifyEditorHeight(){
			const height = $('.note-editor').outerHeight();
			if( height > 0 ){
				options.setHeight(height);
			}
		}

		window.$formElm.summernote({
			placeholder: '',
			tabsize: 2,
			height: 90 + (18 * options.rows),
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
			],
			callbacks: {
				onInit: justifyEditorHeight,
				onChange: justifyEditorHeight,
				onFocus: justifyEditorHeight,
				onBlur: justifyEditorHeight,
				onResize: justifyEditorHeight,
			},
		});

		$(window)
			.on('keydown', function(event){
				const origEvent = event.originalEvent;
				if( (origEvent.metaKey || origEvent.ctrlKey) && origEvent.key == 's' ){
					origEvent.preventDefault();
					options.onkeydown(origEvent);
				}
			});

		const observer = new MutationObserver(justifyEditorHeight);
		observer.observe($('.note-editable').get(0), {
			attributes: true,
		});

		resolve();
	});
};
window.setValue = async (newVal)=>{
	return new Promise((resolve, reject)=>{
		window.$formElm.summernote('code', newVal);
		resolve();
	});
};
window.getValue = async ()=>{
	return new Promise((resolve, reject)=>{
		const returnVal = window.$formElm.summernote('code');
		resolve(returnVal);
	});
};
