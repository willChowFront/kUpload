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
		uploadfiles = [],//待上传文件
		uploadAreaId = config.uploadAreaId ? config.uploadAreaId : -1,
		progessEleId = config.progessEleId ? config.progessEleId : -1,
		acceptFormat = config.acceptFormat ? config.acceptFormat : -1,
		dropId = config.dropId ? config.dropId : -1;
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
			liEle,spanEle,strongEle,labelEle,emEle,
			isValid,suffix,strTemp,nameTextNode,fileSize,sizeTextNode,
			ulEle = document.createElement('ul'),
			files = event.dataTransfer.files,
			i = 0,
			len = files.length;
		while(i<len){
			strTemp = files[i].name.split('.');
			suffix = strTemp[strTemp.length-1];
			isValid = acceptFormat.some(function(item,index,array){
				return suffix.toLowerCase() === item.toLowerCase();
			});
			if(!isValid){
				alert("文件格式不支持，支持的格式为 "+acceptFormat.join(',')+"请重新选择上传文件");
				break;
			}
			
			liEle = document.createElement('li');
			spanEle = document.createElement('span');
			strongEle = document.createElement('strong');
			labelEle = document.createElement('label');
			emEle = document.createElement('em');
			
			fileSize = files.size / (1024*1024);
			nameTextNode = document.createTextNode("'"+files[i].name+"'");
			strongEle.appendChild(nameTextNode);
			uploadfiles.push(files[i]);
			i++;
		}
	}
	/**
	 * [ajaxUpload 通过ajax上传文件]
	 * @param  {[string]} url  [上传地址]
	 * @param  {[object]} file [文件对象]
	 * @param  {[string]} progessEleId [进度条元素id]
	 * @return {[type]}      [description]
	 */
	function ajaxUpload(url, file, progessEleId){
		var
			jsonObject,
			percent,
			progessEle = document.getElementById(progessEleId),
			xhr = new XMLHttpRequest();
		xhr.open('post',url,false);
		xhr.send(file);
		xhr.onload = function(event){
			if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
				jsonObject = JSON.parse(xhr.responseText);
				if(jsonObject.code === 0){

				}
			}
		};
		xhr.upload.onprogress = function(event){
			if(event.lengthComputable){
				percent = Math.floor(event.loaded/event.total)*100 + '%';	
			}
		};
	}
	/**
	 * [addHandler 添加事件处理器]
	 */
	function addHandler(){
		on(dropId, "dragover" , function(event){
			preventDefault(event);
		});

		on(dropId, "dragenter", function(event){
			preventDefault(event);
		});

		on(dropId, "drop", dropHandleEvent);
	}
}