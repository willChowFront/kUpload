/*-----------------------------------------------------
* @Description:     简单文件上传前端组件，具体参考功能有多个文件，拖拽文件，进度条，大小预读
* @Version:         1.0.0
* @author:          willChow(zhaokaikangwill@foxmail.com) 
* @name:			赵凯康
* @date             2016.05.12
* ==NOTES:=============================================
* v1.0.0(2016.05.12):
     初始生成
* -----------------------------------------------------*/
function kUpload (config) {
	var
		dropId,//可拖放区域的id
		uploadListId,//上传列表id
		toUploadId,//上传按钮id
		fileInputId,//文件表单元素id
		cancelUploadId,//取消上传按钮id
		uploadFiles = [],//待上传文件
		currentXHR ,//当前xhr对象
		isCancel = false,//是否取消上传
		fileParaName = config.fileParaName ? config.fileParaName : -1,//后台接收文件上传时的参数名
		uploadAreaId = config.uploadAreaId ? config.uploadAreaId : -1,//包含上传组件的DOM元素id
		cssUrl = config.cssUrl ? config.cssUrl : -1,//组件样式的url
		uploadUrl = config.uploadUrl ? config.uploadUrl : -1,//接收上传元素的url
		selectNums = config.selectNums ? config.selectNums : 200,//单次可选择的元素
		maxFileSize = config.maxFileSize ? config.maxFileSize : 1024,//允许上传元素大小的最大值
		acceptFormat = config.acceptFormat ? config.acceptFormat : [];//允许上传的格式
	if(!fileParaName){
		console.log('未传入后台接收文件的参数!');
		return -1;
	}
	if(!uploadAreaId){
		console.log('未传入包含上传组件的DOM元素id！');
		return -1;
	}
	if(!cssUrl){
		console.log('未传入组件样式的url！');
		return -1;
	}
	if(!uploadUrl){
		console.log('未传入接收上传元素的url！');
		return -1;
	}
	/**
	 * [on 为dom元素绑定事件处理程序，事件代理]
	 * @param  {[string]} 		eleId        	[元素Id]
	 * @param  {[string]} 		eventType    	[事件类型]
	 * @param  {[function]} 	eventHandler 	[事件处理函数]
	 */
	function on(eleId, eventType, eventHandler){
		var
			ele = document.getElementById(eleId);
		if(ele.addEventListener){
			ele.addEventListener(eventType, eventHandler, false);
		}else if(ele.attachEvent){
			ele.addEvent("on"+eventType, eventHandler);
		}else{
			ele["on"+eventType] = eventHandler;
		}
	}

	/**
	 * [preventDefault 阻止默认事件]
	 * @param  {[object]} event [事件对象]
	 */
	function preventDefault(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
	}
	/**
	 * [dropHandleEvent 处理文件拖放事件]
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	function dropHandleEvent(event){
		preventDefault(event);
		var 
			files = event.dataTransfer.files;
		if(files.length == 0){
			alert("抱歉,暂不支持文件夹上传");
		}else if(files.length > selectNums){
			alert("抱歉,单此可选"+selectNums+"份文件");
		}else{
			createFileHtml(files);
		}
	}

	/**
	 * [createFileHtml 生成要上传的文件在页面中的html表示]
	 * @param  {[type]} event [description]
	 */
	function createFileHtml(files){
		 var
			liEle, spanEle, strongEle, aEle, buttonEle,ulEle,
			isRepeat, isValid, suffix, strTemp, fileName, nameTextNode, fileSize, sizeTextNode,
			uploadArea = document.getElementById(uploadAreaId),
			toUpload = document.getElementById('J_toUpload'),
			i = 0,
			len = files.length;

		if(document.getElementById('J_upLoadList')){
			ulEle = document.getElementById('J_upLoadList');
		}else{
			ulEle = document.createElement('ul');
			ulEle.id = 'J_upLoadList';
			ulEle.className = 'k-upload-list';
		}
		
		while(i<len){
			strTemp = files[i].name.split('.');
			suffix = strTemp[strTemp.length-1];
			fileName = files[i].name;
			fileSize = parseInt(files[i].size , 10) / (1024*1024);
			if(fileSize >　maxFileSize){
				alert(fileName+'的文件大小为'+fileSize.toFixed(2)+'M大于文件上传的最大限制'+maxFileSize+'M');
				i++;
				continue;
			}
			if(acceptFormat.length == 0){
				isValid = true;
			}else{
				isValid = acceptFormat.some(function(item,index,array){
					return suffix.toLowerCase() === item.toLowerCase();
				});
			}
			if(!isValid){
				alert("抱歉暂不支持"+suffix+"格式，支持的格式为 "+acceptFormat.join(',')+"请重新选择上传文件");
				i++;
				continue;
			}
			if(uploadFiles.length != 0){
				isRepeat = uploadFiles.some( function(element, index) {
							return element.name === files[i].name;
						  });
				if(isRepeat){
					i++;
					continue;
				}
			}
			
			liEle = document.createElement('li');
			spanEle = document.createElement('span');
			strongEle = document.createElement('strong');
			aEle = document.createElement('a');
			
			if(fileName.length >　20){
				fileName = "..."+fileName.substring(fileName.length-20, fileName.length);
			}
			nameTextNode = document.createTextNode(fileName);
			strongEle.appendChild(nameTextNode);

			sizeTextNode = document.createTextNode(fileSize.toFixed(2)+'M');
			spanEle.appendChild(sizeTextNode);

			aEle.appendChild(document.createTextNode("删除"));
			aEle.setAttribute('index', i);
			aEle.href = 'javascript:;';

			liEle.appendChild(strongEle);
			liEle.appendChild(spanEle);
			liEle.appendChild(aEle);

			ulEle.appendChild(liEle);

			uploadFiles.push(files[i]);
			i++;
		}
		if(!toUpload){
			uploadArea.insertBefore(ulEle, toUpload);
		}
	}
	/**
	 * [createStatic 生成静态Html元素]
	 */
	function createStatic(){
		var
			divEle, pEle,ulEle,
			uploadArea = document.getElementById(uploadAreaId),
			buttonEle = document.createElement('button'),
			inputEle = document.createElement('input');
		
		if(uploadArea.style.position == 'static' || uploadArea.style.position == ''){
			uploadArea.style.position = 'relative';
		}

		if(uploadArea.className.search('k-upload-area') == -1){
			uploadArea.className = uploadArea.className + ' k-upload-area';
		}

		divEle = document.createElement('div'),
		divEle.className = 'k-upload-header';
		uploadArea.appendChild(divEle);

		divEle = document.createElement('div'),
		divEle.className = 'k-upload-body';
		dropId  = 'J_drop';
		divEle.id = 'J_drop';

		if(acceptFormat.length != 0){
			pEle = document.createElement('p');
			pEle.appendChild(document.createTextNode('允许上传的文件格式为'+acceptFormat.join(',')));
			divEle.appendChild(pEle);
		}
		pEle = document.createElement('p');
		pEle.appendChild(document.createTextNode('可将文件拖到这里，暂不支持拖曳文件夹'));
		divEle.appendChild(pEle);
		pEle = document.createElement('p');
		pEle.appendChild(document.createTextNode('单个文件最大'+maxFileSize+'MB，单次最多可选'+selectNums+'份'));
		divEle.appendChild(pEle);

		inputEle.type = 'file';
		inputEle.multiple = true;
		inputEle.id = 'J_fileInput';
		fileInputId = 'J_fileInput';
		inputEle.className = 'k-file-input';
		buttonEle.className = 'k-file-button';
		buttonEle.appendChild(document.createTextNode('点此选择文件'));
		divEle.appendChild(inputEle);
		divEle.appendChild(buttonEle);

		ulEle = document.createElement('ul');
		ulEle.id = 'J_upLoadList';
		uploadListId = 'J_upLoadList';
		ulEle.className = 'k-upload-list';

		buttonEle = document.createElement('button');
		buttonEle.type = 'button';
		buttonEle.appendChild(document.createTextNode('上传文件'));
		buttonEle.id = 'J_toUpload';
		toUploadId = 'J_toUpload';
		buttonEle.className = 'k-upload-button';
		uploadArea.appendChild(buttonEle);

		buttonEle = document.createElement('button');
		buttonEle.type = 'button';
		buttonEle.appendChild(document.createTextNode('取消上传'));
		buttonEle.id = 'J_cancel';
		cancelUploadId = 'J_cancel';
		buttonEle.className = 'k-cancel-button';
		uploadArea.appendChild(buttonEle);
		
		uploadArea.appendChild(divEle);
		uploadArea.appendChild(ulEle);
	}
	/**
	 * [ajaxUpload 通过ajax上传文件]
	 * @param  {[string]} url  [上传地址]
	 * @param  {[object]} file [文件对象]
	 * @param  {[number]} index [第几个元素正在上传]
	 * @return {[type]}      [description]
	 */
	function ajaxUpload(url, file, index){
		var
			jsonObject,percent,
			emEle = document.createElement('em'),
			formData = new FormData();
			uploadList = document.getElementById(uploadListId).childNodes,
			xhr = new XMLHttpRequest();
		emEle.className = 'k-progress';
		uploadList[index].appendChild(emEle);
		formData.append(fileParaName, file);
		xhr.open('post',url,true);
		xhr.send(formData);
		xhrList.push(xhr);
		xhr.onload = function(event){
			if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
				jsonObject = JSON.parse(xhr.responseText);
				if(jsonObject.code === 0){
					emEle.appendChild(document.createTextNode('上传成功'));
				}
			}
		};
		xhr.upload.onprogress = function(event){
			if(event.lengthComputable){
				percent = Math.floor(event.loaded/event.total)*100;
				emEle.style.width = percent + 'px';	
			}
		};
	}
	/**
	 * [addHandler 添加事件处理器]
	 */
	function addHandler(){
		var 
			tempArray, indexOfaEle, target, files;
		on(dropId, "dragover" , function(event){
			preventDefault(event);
		});

		on(dropId, "dragenter", function(event){
			preventDefault(event);
		});

		on(dropId, "drop", dropHandleEvent);

		on(uploadListId, 'click', function(event) {
			target = event.target ? event.target : event.srcElement;
			tempArray = [];
			if(target.nodeName.toLowerCase() === 'a'){
				indexOfaEle = target.getAttribute('index');
				uploadFiles.forEach( function(element, index) {
					if(indexOfaEle != index){
						tempArray.push(element);
					}
				});
				console.log(tempArray);
				uploadFiles = tempArray;
				target.parentNode.parentNode.removeChild(target.parentNode);
			}
		});

		on(fileInputId, 'change', function(event){
			files = document.getElementById('J_fileInput').files;
			if(files.length > selectNums){
				alert("抱歉,单此可选"+selectNums+"份文件");
			}else{
				createFileHtml(files);
			}
		});

		on(toUploadId, 'click', function(ev){
			uploadFiles.forEach(function(item,index){
				if(!isCancel){
					ajaxUpload(uploadUrl,item,index);
				}
			});
		});

		on(cancelUploadId, 'click', function (ev) {
			currentXHR.abort();
			isCancel = false;
		});
	}
	/**
	 * [getCss 获取样式表]
	 * @param  {[string]} url [样式地址]
	 * @return {[type]}     [description]
	 */
	function getCss(url){
		var
			link = document.createElement('link'),
			head = document.getElementsByTagName('head')[0];
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = url;
		head.appendChild(link);
	}

	(function init(){
		createStatic();
		addHandler();
		getCss(cssUrl);
	})();
}