# kUpload
###在页面中引入kUpload.js，并调用kUpload(config)函数即可,config为参数对象，如下所示
`
	kUpload({
			uploadAreaId : "J_uploadArea",//包含上传组件的DOM元素id,必需项
			acceptFormat : ["jpg","zip","pdf"],//允许上传的格式,可选项,不填为允许任何格式
			cssUrl : './kUpload.css',//组件样式的url,必需项
			uploadUrl : './upload',//接收上传文件的url,必需项
			maxFileSize　: '1000',//允许上传元素大小的最大值,单位为M,可选项，默认为1024M
			selectNums : '3',//单次可选择的元素,可选项,默认为100个
			fileParaName : 'fileData'//后台接收文件上传时的参数名,必需项
		});
`
###上传进度条效果需选择文件后，点击上传按钮，可以看到一条蓝色的进度条，目前，在没有后台支持下，他的效果是暂时用css展示，在文件上传成功时，进度条的长度实际为em元素的width,他将随着已上传文件部分的大小增加而增加，从而达到进度条移动的效果