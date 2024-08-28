window.initialize = async (options)=>{
	return new Promise((resolve, reject)=>{
		window.$formElm = $('.broccoli-field-summernote');

		function justifyEditorHeight(){
			options.setHeight($('.note-editor').outerHeight());
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
				onInit: function(){ setTimeout(justifyEditorHeight, 1000); },
				// onChange: function(){ setTimeout(justifyEditorHeight, 1000); },
				onFocus: function(){ setTimeout(justifyEditorHeight, 1000); },
				onBlur: function(){ setTimeout(justifyEditorHeight, 1000); },
			},
		});

		$(window)
			.on('keydown', function(event){
				const origEvent = event.originalEvent;
				if( (origEvent.metaKey || origEvent.ctrlKey) && origEvent.key == 's' ){
					origEvent.preventDefault();
					options.onkeydown(origEvent);
				}
			})
			// .on('load', function(event){
			// 	setTimeout(justifyEditorHeight, 200);
			// })
			;

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
