var OL;
var LI;
var timeout;

var canvas;
var ctx;


var WIDTH = 460;
var HEIGHT = 320;
var REC_WIDTH = 25;//矩形的宽
var REC_NUM = 15;//矩形的个数
var rectangles = [];
var startX = 8;
var maxHeight = 200;
var orderY = maxHeight+20;

var I = 0;
var J = 0;
var isSelect = false;

var SPEED = 50;
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
	J = 0;
	isSelect = false;
	rectangles = [];
	drawOrder();
	newSort();
}
function newSort(){
	var x = startX;
	var y = maxHeight;
	for(var i = 0;i<REC_NUM;i++){
		var height = Math.floor(Math.random()*120+20); //20-130    
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
	//OL.appendChild(LI);
	LI.scrollIntoView();
}

//********************绘图*********************
function fillRec(rectangle){
	ctx.save();
	ctx.fillStyle = "#999";//黑色
	ctx.fillRect(rectangle.x,rectangle.y,REC_WIDTH,rectangle.val);
	ctx.restore();
	drawVal(rectangle);
}
function fillSortedRec(j){
	ctx.save();
	ctx.fillStyle = "#000";//黑色
	ctx.fillRect(rectangles[j].x,rectangles[j].y,REC_WIDTH,rectangles[j].val);
	ctx.restore();
}
function drawVal(rectangle){
	ctx.save();
	ctx.fillStyle="#000000";//黑色
	ctx.font="20px";
	ctx.fillText(rectangle.val,rectangle.x+5,rectangle.y-2);
	ctx.restore();
}
function drawSelect(rectangle){
	ctx.save();
	ctx.strokeStyle = "#FF6600";
	ctx.strokeRect(rectangle.x-1,9,REC_WIDTH+2,maxHeight-8);
	//ctx.stroke();
	ctx.restore();
}
function drawOrder(){
	var x = startX+5;
	var num = 1;
	ctx.save();
	ctx.fillStyle="#000000";//黑色
	ctx.font="20px Georgia";
	for(var i = 0;i<REC_NUM;i++){
		ctx.fillText(num++,x,orderY);
		x = x+REC_WIDTH+5;
	}
	ctx.restore();
}
function drawTemp(rectangle){
	ctx.save();
	ctx.fillStyle = "#999";//黑色
	ctx.fillRect(WIDTH/2-rectangle.x,300-rectangle.y,REC_WIDTH,rectangle.val);
	ctx.restore();
	drawVal(rectangle);
}
function clearRec(rectangle){
	ctx.clearRect(rectangle.x-2,0,REC_WIDTH+4,maxHeight+2);
}

//求解一步
function solveByStep(){
	
	// for(var i = 0;i<rectangles.length-1;i++){
	// 	for(var j = 0;j<rectangles.length-i-1;j++){

			// if(rectangles[j].val>rectangles[j+1].val){
			// 	var temp = rectangles[j];
			// 	rectangles[j] = rectangles[j+1];
			// 	rectangles[j+1] = temp;

			// 	//交换x
			// 	var tempx = rectangles[j].x;
			// 	rectangles[j].x = rectangles[j+1].x;
			// 	rectangles[j+1].x = tempx;
			// }
		// }
	// }
	 
	if(J<rectangles.length-I-1){
		if(isSelect==false){
			createInfo("比较"+rectangles[J].val+"和"+rectangles[J+1].val+"</br>")
			drawSelect(rectangles[J]);
			drawSelect(rectangles[J+1]);
			isSelect = true;
			return;
		}
		
		if(rectangles[J].val>rectangles[J+1].val){
			insertInfo("因为"+rectangles[J].val+">"+rectangles[J+1].val+", 所以交换位置");
			var temp = rectangles[J];
			rectangles[J] = rectangles[J+1];
			rectangles[J+1] = temp;

			//交换x
			var tempx = rectangles[J].x;
			rectangles[J].x = rectangles[J+1].x;
			rectangles[J+1].x = tempx;
		}else{
			insertInfo("因为"+rectangles[J].val+"<="+rectangles[J+1].val+", 所以不交换位置");
		}
		clearRec(rectangles[J]);
		clearRec(rectangles[J+1]);

		fillRec(rectangles[J]);
		fillRec(rectangles[J+1]);
		isSelect = false;
		J++;
	}else if(I<rectangles.length-1){
		createInfo("进行下一轮排序");
		fillSortedRec(J);
		I++;
		J=0;
	}else{
		end();
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
	if(I<rectangles.length-1)
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
	if(I<rectangles.length-1){
		setState('next');
	}else{
		end();
	}
	
}
function end(){
	setState('end');
	fillSortedRec(J);
	createInfo("冒泡排序结束");
}

function setState(newState){
	STATE = newState;
	//console.log(state);
	document.getElementById("new").disabled = STATE == 'sure' || STATE == 'star' || STATE == 'stop' || STATE=='next';
	// document.getElementById("new").disabled = STATE != 'new' || STATE == 'end';
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