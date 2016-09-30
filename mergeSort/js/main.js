var OL;
var LI;
var timeout;

var canvas;
var ctx;


var WIDTH = 480;
var HEIGHT = 320;
var REC_WIDTH = 25;//矩形的宽
var REC_NUM = 8;//矩形的个数
var rectangles = [];
var startX = 110;
var maxHeight = 140;
var orderY = maxHeight+20;
var maxY = orderY+30;

var I;
var RANGE = 2;
var isSelect = false;
var temp;
var tempIndex;
var leftIndex;
var rightIndex;
var isNewRange;

var SPEED = 100;
var STATE;


window.onload = function(){
    canvas = document.getElementById("main");
    ctx = canvas.getContext("2d");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    init();
};
function init(){
	clearCanves();
	I = 0;
	J = I-1;
	temp = null;
	isSelect = false;
	isNewRange = true;
	tempIndex = 0;
	RANGE = 2;
	rectangles = [];
	drawOrder();
	newSort();
}
function newSort(){
	var x = startX;
	var y = maxHeight;
	for(var i = 0;i<REC_NUM;i++){
		var height = Math.floor(Math.random()*100+20); //20-120    
		rectangles[i] = {"x":x,"y":y-height,"val":height};
		fillRec(rectangles[i]);
		x = x+REC_WIDTH+5;
	}
	
}
//********************消息***********************
function initInfo(){
	//删除旧ol列表
	if(OL!=undefined){
		var ol = document.createElement('ol');
		var info = document.getElementById('info');
		info.removeChild(OL);
		info.appendChild(ol);
	}
	removeClass(document.getElementById('info'),'info'); //显示信息区域
	OL = document.getElementById('info').getElementsByTagName("ol")[0];//解答ol标签
}

function createInfo(info){
	var l = document.createElement('li');
	l.innerHTML = info;
	LI = l;
	OL.appendChild(LI);
	LI.scrollIntoView();
	
}
function insertInfo(info){
	LI.innerHTML += info;
	LI.scrollIntoView();
}
function getX(j){
	return startX+(REC_WIDTH+5)*j;
}

//********************绘图*********************
function fillRec(rectangle){
	ctx.save();
	ctx.fillStyle = "#999999";
	ctx.fillRect(rectangle.x,rectangle.y,REC_WIDTH,rectangle.val);
	ctx.restore();
	drawVal(rectangle);
}
function fillSortedRec(j){
	ctx.save();
	ctx.fillStyle = "#000000";
	ctx.fillRect(rectangles[j].x,rectangles[j].y,REC_WIDTH,rectangles[j].val);
	ctx.restore();
}
function drawVal(rectangle){
	ctx.save();
	ctx.fillStyle="#000000";
	ctx.font="20px";
	ctx.fillText(rectangle.val,rectangle.x+5,rectangle.y-2);
	ctx.restore();
}
function drawSelect(rectangle){
	ctx.save();
	ctx.strokeStyle = "#FF6600";
	ctx.strokeRect(rectangle.x-1,9,REC_WIDTH+2,maxHeight-8);
	ctx.restore();
}
function drawOrder(){
	var x = startX+5;
	var num = 1;
	ctx.save();
	ctx.fillStyle="#000000";
	ctx.font="20px Georgia";
	for(var i = 0;i<REC_NUM;i++){
		ctx.fillText(num++,x,orderY);
		x = x+REC_WIDTH+5;
	}
	ctx.restore();
}
function drawTemp(){
	var start = getX(I);
	var end = getX(I+RANGE);
	ctx.save();
	ctx.strokeStyle = "#FF3333";
	ctx.strokeRect(start-2,maxHeight+40,(end-start),maxHeight-10);
	ctx.restore();
}
function drawInTemp(rectangle,index){
	var x = getX(I)+getX(index)-startX;
	rectangle.x = x;
	var y = maxHeight+29+rectangle.y;
	ctx.save();
	ctx.fillStyle = "#000000";
	ctx.fillRect(x,y,REC_WIDTH,rectangle.val);
	
	ctx.fillStyle="#000000";
	ctx.font="20px";
	ctx.fillText(rectangle.val,x+5,y-2);
	ctx.restore();
	//clearTemp()
}
function drawReset(){
	for(var i = 0; i < temp.length;i++){
		fillRec(temp[i]);
		rectangles[I+i] = temp[i];
	}
}

function clearTemp(){
	ctx.clearRect(0,maxHeight+28,WIDTH,maxHeight+10);
}
function clearRec(rectangle){
	ctx.clearRect(rectangle.x-2,0,REC_WIDTH+4,maxHeight+2);
}

//求解一步
function solveByStep(){
	
	// while(RANGE<=rectangles.length){
	// 	for(var i = 0;i<rectangles.length;i+=RANGE){
	// 		var temp = [];
	// 		var l = 0;
	// 		var leftLimit = i+RANGE/2;
	// 		var rightLimit = i+RANGE;
	// 		var j = i;
	// 		var k = i+RANGE/2;
	// 		while(j<leftLimit&&k<rightLimit){
	// 			var left = rectangles[j];
	// 			var right = rectangles[k];
	// 			if(left.val<=right.val){
	// 				temp[l++] = left;
	// 				j++;
	// 			}else{
	// 				temp[l++] = right;
	// 				k++;
	// 			}
	// 		}
	// 		while(j<leftLimit){
	// 			temp[l++] = rectangles[j];
	// 			j++;
	// 		}
	// 		while(k<rightLimit){
	// 			temp[l++] = rectangles[k];
	// 			k++;
	// 		}
	// 		for(var o = 0;o<l;o++){
	// 			rectangles[i+o] = temp[o];
	// 		}
	// 	}
	// 	RANGE *= 2;
	// }
	var leftLimit = I+RANGE/2;
	var rightLimit = I+RANGE;
	if(isNewRange&&I<rectangles.length){
		temp = [];
		tempIndex = 0;
		leftIndex = I;
		rightIndex = I+RANGE/2;
		isNewRange = false;
		createInfo("排序"+(I+1)+"到"+(rightLimit)+"部分</br>")
		//画temp
		drawTemp();
	}else if(leftIndex<leftLimit && rightIndex<rightLimit){
		
		var left = rectangles[leftIndex];
		var right = rectangles[rightIndex];
		insertInfo("比较"+left.val+" 和 "+right.val+"</br>");
		if(left.val<=right.val){
			insertInfo("因为"+left.val+" <= "+right.val+",所以"+left.val+"加入已排序集合中</br>");
			temp[tempIndex] = left;
			//clearRec
			clearRec(left);
			//drawInTemp
			drawInTemp(left,tempIndex);
			leftIndex++;
			tempIndex++;
		}else{
			insertInfo("因为"+left.val+" > "+right.val+",所以"+right.val+"加入已排序集合中</br>");
			temp[tempIndex] = right;
			//clearRec
			clearRec(right);
			//drawInTemp
			drawInTemp(right,tempIndex);
			rightIndex++;
			tempIndex++;
		}
	}else if(leftIndex<leftLimit){
		insertInfo(rectangles[leftIndex].val+"加入已排序集合中</br>");
		temp[tempIndex] = rectangles[leftIndex];
		//clearRec
		clearRec(rectangles[leftIndex]);
		//drawInTemp
		drawInTemp(rectangles[leftIndex],tempIndex);
		leftIndex++;
		tempIndex++;
	}else if(rightIndex<rightLimit){
		insertInfo(rectangles[rightIndex].val+"加入已排序集合中</br>");
		temp[tempIndex] = rectangles[rightIndex];
		//clearRec
		clearRec(rectangles[rightIndex]);
		//drawInTemp
		drawInTemp(rectangles[rightIndex],tempIndex);
		rightIndex++;
		tempIndex++;
	}else if(I+RANGE<rectangles.length){
		clearTemp();
		drawReset();
		temp = [];
		tempIndex = 0;
		
		I += RANGE;
		leftIndex = I;
		rightIndex = I+RANGE/2;
		drawTemp();
		createInfo("排序"+(I+1)+"到"+(I+RANGE)+"部分</br>")
	}else{
		isNewRange = true;
		RANGE *= 2;
		
		clearTemp();
		drawReset();
		I = 0;
	}

}


function clearCanves(){
	ctx.clearRect(0,0,WIDTH,HEIGHT);
	initInfo();
	setState('new');
}

var sure = function(){
	setState('sure');
	initInfo();	
}

function star(){
	setState('star');
	solveByStep();
	if(RANGE<=rectangles.length)
		timeout = setTimeout(star,SPEED);
	else{
		end();
	}
}

function stop(){
	setState('stop');
	if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
}

function next(){
	solveByStep();
	if(RANGE<=rectangles.length){
		setState('next');
	}else{
		end();
	}
	
}
function end(){
	setState('end');
	for(var i = 0;i<REC_NUM;i++){
		fillSortedRec(i);
	}
	createInfo("归并排序结束");
}

function setState(newState){
	STATE = newState;
	//console.log(state);
	document.getElementById("new").disabled = STATE == 'sure' || STATE == 'star' || STATE == 'stop' || STATE=='next';
	document.getElementById("sure").disabled = STATE == 'sure' || STATE == 'end' || STATE == 'star' || STATE == 'stop' || STATE=='next';
	document.getElementById("star").disabled = STATE == 'new' || STATE == 'star' || STATE == 'end';
	document.getElementById("stop").disabled = STATE == 'new' || STATE == 'next' || STATE == 'sure' ||STATE == 'stop' || STATE == 'end';
	document.getElementById("next").disabled = STATE == 'new' || STATE == 'star' || STATE == 'end';
}

function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) {
        obj.className += " " + cls;
    }
}

function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}