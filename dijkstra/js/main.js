var OL;
var LI;
var timeout;

var canvas;
var ctx;


var WIDTH = 460;
var HEIGHT = 320;
var NODE_RADIUS = 17;
var NODE_NAMES = ["A","B","C","D","E","F","G","H","I","J","K","L","N","M","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var NODE_NUM;
var LINE_NUM;
var INDEX;
var START_NODE;
var END_NODE;

var STATE;

var V;//结点集合
var E;//边 二维数组
var Vnew;
var visit;
var total;//已经在最小生成树中的结点数量

var costs;//辅助数组，存储从顶点start到顶点end的最短路径的开销

// 算法步骤如下：
// G={V,E}
// 1. 初始时令 S={V0},T=V-S={其余顶点}，T中顶点对应的距离值
// 若存在<V0,Vi>，d(V0,Vi)为<V0,Vi>弧上的权值
// 若不存在<V0,Vi>，d(V0,Vi)为∞
// 2. 从T中选取一个与S中顶点有关联边且权值最小的顶点W，加入到S中
// 3. 对其余T中顶点的距离值进行修改：若加进W作中间顶点，从V0到Vi的距离值缩短，则修改此距离值
// 重复上述步骤2、3，直到S中包含所有顶点，即W=Vi为止

window.onload = function(){
    
    canvas = document.getElementById("main");
    ctx = canvas.getContext("2d");


    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    //画布点击事件
    canvas.onmousedown = function(e){
        e.preventDefault();
	    var loc = getLoc(e);
		    
	    if(STATE=='node'&&isInCanves(loc)&&getNode(loc.x,loc.y)==null){
	    	if(NODE_NUM>=NODE_NAMES.length){
	    		line();
	    		return;
	    	}
	    	//添加结点
	    	addNode(loc.x,loc.y);
	    	//画结点
	    	drawNode(loc.x,loc.y);
	    }else if(STATE=='line'){
	    	// console.dir(V);
	    	START_NODE = getNode(loc.x,loc.y);    	
	    }
    };
    //画布点击完后
    canvas.onmouseup = function(e){
        e.preventDefault();
        if(STATE=='line'){
        	if(START_NODE!=null){
			    var loc = getLoc(e);
			    END_NODE = getNode(loc.x,loc.y);
			    if(END_NODE!=null && !hasLine()){
			    	var dis = Math.ceil(Math.sqrt(Math.pow(START_NODE.x-END_NODE.x,2)+Math.pow(START_NODE.y-END_NODE.y,2)));
					addLine(dis);
		    		drawLine();
		    		drawDis(dis);
		   		}
			}
		    
	    }
    };

    init();

};
function init(){
    clearCanves();
    V = [];//结点集合
	Vnew = [];
	NODE_NUM = 0;
	LINE_NUM = 0;
	INDEX = 0;
	total = 0;
	setState('node');

	//initInfo();
    
}
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

	//createInfo("点击画布生成结点");
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

//初始化邻接矩阵
function initE(){
	E = new Array(NODE_NUM);
	visit = new Array(NODE_NUM);
	costs = new Array(NODE_NUM);
	for(var i = 0;i<NODE_NUM;i++){
		E[i] = new Array(NODE_NUM);
		for(var j = 0;j<NODE_NUM;j++){
			E[i][j] = 0;
		}
		visit[i] = false;
		costs[i] = 10000000;
	}
	costs[0] = 0;
}
function getLoc(e){
	var rect = canvas.getBoundingClientRect(); 
   	var x = e.clientX - rect.left * (canvas.width / rect.width);
    var y = e.clientY - rect.top * (canvas.height / rect.height);
    return {"x":x,"y":y};
}
function drawNode(x,y,name,color){
	//ctx.save();
	ctx.beginPath();
    ctx.arc(x, y, NODE_RADIUS, 0, 2 * Math.PI);
    ctx.strokeStyle = color == undefined ? "#000000" : color;//黑色
    ctx.fillStyle = color == undefined ? "#000000" : color;//黑色
    //ctx.fill();
    ctx.closePath();
    ctx.stroke();
    //ctx.fillStyle="#FFFFFF";//白色
    ctx.font="20px Georgia";
    name = name==undefined?NODE_NAMES[NODE_NUM++]:name;
    ctx.fillText(name,x-7,y+7);
    //ctx.restore();
    
}
function drawLine(){
	ctx.save();
	ctx.beginPath();

	ctx.moveTo(START_NODE.x,START_NODE.y);
	ctx.lineTo(END_NODE.x,END_NODE.y);
	ctx.closePath();
	ctx.stroke();
	
	clearNode(START_NODE.x,START_NODE.y);
	drawNode(START_NODE.x,START_NODE.y,START_NODE.name);

	clearNode(END_NODE.x,END_NODE.y);
	drawNode(END_NODE.x,END_NODE.y,END_NODE.name);
	ctx.restore();
}
function drawHighlight(){
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle="#FF9933";
	ctx.lineWidth=3;
	ctx.moveTo(START_NODE.x,START_NODE.y);
	ctx.lineTo(END_NODE.x,END_NODE.y);
	ctx.closePath();
	ctx.stroke();
	

	clearNode(START_NODE.x,START_NODE.y);
	drawNode(START_NODE.x,START_NODE.y,START_NODE.name,"#FF9933");

	
	clearNode(END_NODE.x,END_NODE.y);
	drawNode(END_NODE.x,END_NODE.y,END_NODE.name,"#FF9933");
	ctx.restore();
}
function drawDis(dis){
	ctx.save();
	ctx.fillStyle="#000000";//黑色
	ctx.font="20px Georgia";
	ctx.fillText(dis,(END_NODE.x+START_NODE.x)/2,(END_NODE.y+START_NODE.y)/2 );
	ctx.stroke();
	ctx.restore();
}
//判断点击位置是否走某个结点里
function getNode(x,y){
	//遍历所有结点
	for(var item in V){
		node = V[item];
		//判断x,y是否在某个结点里
		if(x>=node.x-NODE_RADIUS&&x<=node.x+NODE_RADIUS
			&& y>=node.y-NODE_RADIUS&&y<=node.y+NODE_RADIUS){
			return node;
		}
	}
	return null;
}

function addNode(x,y){
	V[NODE_NUM] = {"index":NODE_NUM,"name":NODE_NAMES[NODE_NUM],"x":x,"y":y};
}
function addLine(dis){
	E[START_NODE.index][END_NODE.index] = dis;
	E[END_NODE.index][START_NODE.index] = dis;
}

function clearNode(x,y){
	var flag = Math.round(Math.PI * NODE_RADIUS);
	for(var i=0; i< flag; i++){
		var angle = (i / Math.round(Math.PI * NODE_RADIUS)) * 360;//我们数学中常用到的四舍五入取整。
		ctx.clearRect(x, y, Math.sin(angle * (Math.PI / 180)) * NODE_RADIUS , Math.cos(angle * (Math.PI / 180)) * NODE_RADIUS);
	}
}
function getAngle(){
    var diff_x = END_NODE.x - START_NODE.x;
    var diff_y = END_NODE.y - START_NODE.y;
    //返回角度,不是弧度
    return 360*Math.atan(diff_y/diff_x)/(2*Math.PI);
}
function hasLine(){
	if(START_NODE.index==END_NODE.index)
		return true;
	if(E[START_NODE.index][END_NODE.index]>0&&E[END_NODE.index][START_NODE.index]>0)
		return true;
	return false;
}
function isInCanves(loc){
	if(loc.x-NODE_RADIUS>0&&loc.x+NODE_RADIUS<WIDTH
		&&loc.y-NODE_RADIUS>0&&loc.y+NODE_RADIUS<HEIGHT)
		return true;
	return false;
}

//求解一步
function solveByStep(){
	if(total==0){
		Vnew[INDEX++] = V[0];//将第一结点设为起始点
		total = 1;
		visit[0] = true;
		createInfo("A设为起始点");
		ctx.save();
		ctx.lineWidth=3;
		drawNode(V[0].x,V[0].y,V[0].name,"#FF9933");
		ctx.restore();
	}else if(total<NODE_NUM){
		var mincost = 10000000;
		var start = 0;
		var end = 0;

		for(var i = 0;i<NODE_NUM;i++){
			//找到在路径中的结点
			if(visit[i]){
				//找到花费最小的结点
				for(var j = 0;j<NODE_NUM;j++){
					if(!visit[j]&&E[i][j]>0&&E[i][j]+costs[i]<mincost){
						mincost = E[i][j]+costs[i];
						start = i;
						end = j;
						
					}
				}
				//insertInfo(V[start].name+" 距离 "+ V[end].name + "花费为 "+mincost+"</br>");

			}
			
		}

		//找到了
		//console.log("连接 "+V[start].name+" -- "+ V[end].name + "花费为 "+mincost);
		createInfo("因为 "+V[end].name+" 距离起始点"+ V[0].name + "花费最少,花费为: "+mincost+"。所以加入最短路径中</br>");
		visit[end] = true;
		//更新辅助数组
		costs[end] = mincost;

		Vnew[INDEX++] = V[end];
		START_NODE = V[start];
		END_NODE = V[end];
		drawHighlight();
		total++;
		
	}
}

function isMap(){
	var v = new Array(NODE_NUM);
	var i;
	v[0] = true;
	var count = 1;
	for(i = 1;i<NODE_NUM;i++){
		v[i] = false;
	}
	DFT(0,v);
	// console.log(v);
	for(i = 0;i<NODE_NUM;i++){
		if(v[i] == false){
			return false;
		}
	}
	return true;

}

function DFT(j,v){
	v[j] = true;
	for(var i = 0;i<NODE_NUM;i++){
		if(E[j][i]!=0&&!v[i]){
			DFT(i,v);
		}
	}
}
function line(){
	if(NODE_NUM<2){
		alert("最少两个结点");
	}else{
		setState('line');
		initE();
	}
}

function clearCanves(){
	ctx.clearRect(0,0,WIDTH,HEIGHT);
	initInfo();
	setState('clear');
}

var sure = function(){
	if(isMap()){
		setState('sure');
		initInfo();
	}else{
		alert("输入有误，请完善图");
	}
}

function star(){
	setState('star');
	solveByStep();
	if(total<NODE_NUM)
		timeout = setTimeout(star,1000);
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
	if(total<NODE_NUM){
		setState('next');
	}else{
		end();
	}
	
}
function end(){
	setState('end');
	createInfo("最短路径生成完成");
}
function setState(newState){
	STATE = newState;
	//console.log(state);
	//document.getElementById("clear").disabled = STATE != 'node';
	document.getElementById("line").disabled = STATE != 'node';
	document.getElementById("sure").disabled = STATE == 'node' || STATE == 'sure' || STATE == 'end' || STATE == 'star' || STATE == 'stop' || STATE=='next';
	document.getElementById("star").disabled = STATE == 'node' || STATE == 'line' || STATE == 'star' || STATE == 'end';
	document.getElementById("stop").disabled = STATE == 'node' || STATE == 'line' || STATE == 'next' || STATE == 'sure' ||STATE == 'stop' || STATE == 'end';
	document.getElementById("next").disabled = STATE == 'node' || STATE == 'line' || STATE == 'star' || STATE == 'end';
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