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
var maxHeight = 140;
var orderY = maxHeight+20;
var maxY = orderY+30;

var I;
var J;
var isSelect = false;
var temp;

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
	J = I-1;
	temp = null;
	isSelect = false;
	rectangles = [];
	drawOrder();
	drawTemp();
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
function drawTemp(){
	ctx.save();
	ctx.strokeStyle = "#FF3333";
	ctx.strokeRect(WIDTH/2-(REC_WIDTH+2)/2,maxHeight+30,REC_WIDTH+2,maxHeight-10);
	ctx.fillStyle="#FF3333";
	ctx.font="10px Georgia";
	ctx.fillText("temp",WIDTH/2-(REC_WIDTH+2)/2,maxHeight*2+35);
	ctx.restore();
}
function drawInTemp(rectangle){
	var x = WIDTH/2-(REC_WIDTH+2)/2+1;
	var y = maxHeight+19+rectangle.y;
	ctx.save();
	ctx.fillStyle = "#999";//黑色
	ctx.fillRect(x,y,REC_WIDTH,rectangle.val);
	
	ctx.fillStyle="#000000";
	ctx.font="20px";
	ctx.fillText(rectangle.val,x+5,y-2);
	ctx.restore();
	//clearTemp()
}

function clearTemp(){
	ctx.clearRect(WIDTH/2-(REC_WIDTH+2)/2,maxHeight+30+1,REC_WIDTH+1,maxHeight-12);
}
function clearRec(rectangle){
	ctx.clearRect(rectangle.x-2,0,REC_WIDTH+4,maxHeight+2);
}

//求解一步
function solveByStep(){
	// for(var i = 1;i<rectangles.length;i++){
	// 	temp = rectangles[i];
	// 	var j = i-1
	// 	for(;j>=0&&rectangles[j].val>temp.val;j--){
	// 		rectangles[j+1] = rectangles[j];
	// 	}
	// 	rectangles[j+1] = temp;
	// }
	if(temp==null){
		temp = rectangles[I];
		createInfo("插入"+temp.val+"</br>")
		clearRec(temp);//清除当前
		drawInTemp(temp);
		J = I-1;
	}else if(J>=-1){
		if(J>=0){
			if(isSelect==false){
				insertInfo("比较"+temp.val+" 和 "+rectangles[J].val+"</br>");
				drawSelect(rectangles[J]);
				isSelect = true;
				return;
			}
			clearRec(rectangles[J]);//清除选择
			isSelect = false;
		}
		
		if(J>=0&&rectangles[J].val>temp.val){
			insertInfo("因为"+rectangles[J].val+">"+temp.val+", "+rectangles[J].val+"向后移动</br>");
			rectangles[J+1] = rectangles[J];
			rectangles[J+1].x =  getX(J+1);
			
			clearRec(rectangles[J+1]);
			fillRec(rectangles[J+1]);
			J--;
		}else{
			if(J<0){
				insertInfo("没有可比较的矩阵，插入当前位置</br>");
			}else{
				insertInfo("因为"+rectangles[J].val+"<="+temp.val+", 插入当前位置</br>");
				fillRec(rectangles[J]);
			}
			rectangles[J+1] = temp;
			rectangles[J+1].x = getX(J+1);;
			
			clearTemp();
			fillRec(rectangles[J+1]);
			temp = null;
			I++;
		}
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
	if(I<rectangles.length)
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
	if(I<rectangles.length){
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
	createInfo("插入排序结束");
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