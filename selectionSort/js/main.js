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
var maxY = orderY+30;
var MAX_J = 0;

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
	MAX_J = 0;
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
	ctx.fillStyle="#000000";
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
function drawMax(){
	drawSelect(rectangles[MAX_J]);
	ctx.save();
	ctx.fillStyle="#FF3333";
	ctx.font="20px";
	ctx.fillText("MAX",rectangles[MAX_J].x+5,maxY);
	ctx.restore();
	//clearMaxText(rectangle);
}
function clearMaxText(){
	ctx.clearRect(rectangles[MAX_J].x+5,maxY-15,REC_WIDTH+4,15);
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
	if(J==0){
		createInfo("更新最大值");
		MAX_J = J;
		drawMax();
		J++;
	}else if(J<rectangles.length-I){
		if(isSelect==false){
			createInfo("比较最大值"+rectangles[MAX_J].val+"和"+rectangles[J].val+"</br>")
			drawSelect(rectangles[J]);
			isSelect = true;
			return;
		}
		
		if(rectangles[J].val>rectangles[MAX_J].val){
			insertInfo("因为"+rectangles[J].val+">"+rectangles[MAX_J].val+", 所以更新最大值");
			clearMaxText();
			clearRec(rectangles[MAX_J]);
			fillRec(rectangles[MAX_J]);
			MAX_J = J;
			drawMax();
			
		}else{
			insertInfo("因为"+rectangles[J].val+"<="+rectangles[MAX_J].val+", 所以进行下一步");
			clearRec(rectangles[J]);
			fillRec(rectangles[J]);
		}
		
		isSelect = false;
		J++;
	}else if(I<rectangles.length-1){
		createInfo("交换最大值和最后一个, 进行下一轮排序");
		J--;
		//交换最大值和最后一个
		var temp = rectangles[J];
		rectangles[J] = rectangles[MAX_J];
		rectangles[MAX_J] = temp;

		//交换x
		var tempx = rectangles[J].x;
		rectangles[J].x = rectangles[MAX_J].x;
		rectangles[MAX_J].x = tempx;
		//清除最大和最后一个
		clearMaxText();
		clearRec(rectangles[MAX_J]);
		clearRec(rectangles[J]);
		//画最大和最后一个
		fillRec(rectangles[J]);
		fillRec(rectangles[MAX_J]);
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
	createInfo("选择排序结束");
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