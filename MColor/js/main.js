var OL;
var LI;
var timeout;

var canvas;
var ctx;


var WIDTH = 460;
var HEIGHT = 320;
var NODE_RADIUS = 17;
var NODE_NAMES = ["A","B","C","D","E","F","G"];
var COLORS = ["#ff3333","#ff9933","#ffff33","#00ff33","#3399ff","#990099","#660000"];
var COLOR_INDEX;
var NODE_NUM;
var LINE_NUM;
var INDEX;
var START_NODE;
var END_NODE;
var CUR_NODE;

var STATE;

var V;//结点集合
var E;//边 二维数组
var visit;
var total;//已经在最小生成树中的结点数量
var arr;//辅助数组，记录同一种颜色的结点  

// 算法大致如下：
// 1.把一个图中的顶点按度数减小的次序排列
// 2.用第一种颜色对第一点着色，并且按排列次序，对前面着色点不相邻的每一点着上同样的颜色
// 3.把第二种颜色对尚未着色的点重复（2），用第三种颜色继续，直到所有点全部上色为止
// G為平面圖（Planar Graph）：χ(G) ≤ 4（四色定理）
// G為完全圖（Complete Graph）：χ(G) = V

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
	    	//console.dir(V);
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
		    		//drawDis(dis);
		   		}
			}
		    
	    }
    };

    init();

};
function init(){
    clearCanves();
    V = [];//结点集合
	NODE_NUM = 0;
	LINE_NUM = 0;
	COLOR_INDEX = 0;
	CUR_NODE = null;
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
function getSameNode(){
	//createInfo("未找到和结点"+CUR_NODE.name+"不相邻的结点"+"</br>");
	//var info = '未找到和 ';
	// console.log("当前颜色 "+COLOR_INDEX);
	// console.log(arr);
	var info = ' ';
	for(var i = 0;i<NODE_NUM;i++){
		if(COLOR_INDEX==arr[V[i].arrIndex]){
			// console.log("找到 结点"+V[i].name+" color is "+arr[V[i].arrIndex]);
			info += "结点"+V[i].name+" ";
		}
	}
	return info
	//createInfo(info+'不相邻的结点</br>');
}
//初始化邻接矩阵
function initE(){
	E = new Array(NODE_NUM);
	visit = new Array(NODE_NUM);
	arr = new Array(NODE_NUM);
	for(var i = 0;i<NODE_NUM;i++){
		E[i] = new Array(NODE_NUM);
		for(var j = 0;j<NODE_NUM;j++){
			E[i][j] = 0;
		}
		visit[i] = false;
		arr[i] = i+10;
	}

}
function getLoc(e){
	var rect = canvas.getBoundingClientRect(); 
   	var x = e.clientX - rect.left * (canvas.width / rect.width);
    var y = e.clientY - rect.top * (canvas.height / rect.height);
    return {"x":x,"y":y};
}
//**************绘图*************************
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
function fillNode(x,y,name){
	ctx.save();
	ctx.beginPath();
    ctx.arc(x, y, NODE_RADIUS, 0, 2 * Math.PI);
    ctx.strokeStyle = COLORS[COLOR_INDEX];//黑色
    ctx.fillStyle = COLORS[COLOR_INDEX];//黑色
    //ctx.fill();
    ctx.closePath();
    ctx.fill();
    //ctx.fillStyle="#FFFFFF";//白色
    ctx.font="20px Georgia";
    ctx.fillStyle = "#000000";//黑色
    name = name==undefined?NODE_NAMES[NODE_NUM++]:name;
    ctx.fillText(name,x-7,y+7);
    ctx.restore();
    
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
	V[NODE_NUM] = {"index":NODE_NUM,"arrIndex":NODE_NUM,"name":NODE_NAMES[NODE_NUM],"x":x,"y":y,"du":0};
}
function addLine(dis){
	START_NODE.du = START_NODE.du+1;
	END_NODE.du = END_NODE.du+1;
	E[START_NODE.index][END_NODE.index] = dis;
	E[END_NODE.index][START_NODE.index] = dis;
	//Edge[LINE_NUM++] = {"start":START_NODE,"end":END_NODE,"dis":dis};
}
function sortNode(){
	//顶点按度数减小的次序排列
	V.sort(function (a, b) {
　　	return b.du - a.du;
	}); 
	for(var i = 0;i<NODE_NUM;i++){
		V[i].arrIndex = i;
	}
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
	
	if(total<NODE_NUM){
		if(CUR_NODE==null){
			//获取度数最大一个结点
			CUR_NODE = V[INDEX++];
			while(visit[CUR_NODE.index]){
				
				if(total>=NODE_NUM){
					return;
				}
				CUR_NODE = V[INDEX++];
			}
			visit[CUR_NODE.index] = true;
			arr[CUR_NODE.arrIndex] = COLOR_INDEX;
			createInfo("获取度数最大的结点"+ CUR_NODE.name+", 度数为: "+CUR_NODE.du+"</br>");
			//用第当前颜色对CUR_NODE着色，
			fillNode(CUR_NODE.x,CUR_NODE.y,CUR_NODE.name);
			insertInfo("用第"+(COLOR_INDEX+1)+"颜色对结点"+ CUR_NODE.name+"上色"+"</br>");
			total++;
		}else{
			//并且按排列次序，对CUR_NODE不相邻的每一点着上同样的颜色
			//找到对CUR_NODE不相邻的结点
			for(var j = 0;j<NODE_NUM;j++){
				var node = V[j];
				var flag = false;
				if(!visit[node.index]){
					flag = true;
					for(var i = 0;i<NODE_NUM;i++){
						var arrIndex = V[i].arrIndex;
						//找到同一种颜色的结点，并判断是否与node相领
						if(COLOR_INDEX==arr[arrIndex]){
							//arr[i] i==6 是G 但是V[6] 不是G
							var temp = V[i];
							if(E[temp.index][node.index]!=0){
								// console.log("结点"+temp.name+"和结点"+node.name+"相邻");
								//相邻 不可以着色
								flag = false;
								break;
							}
						}
					}			
				}
				if(flag){
					createInfo("找到和"+getSameNode()+"不相邻的结点"+ node.name+"上同一种颜色</br>");
					insertInfo("用第"+(COLOR_INDEX+1)+"颜色对结点"+ node.name+"上色"+"</br>");
					visit[node.index] = true;
					arr[node.arrIndex] = COLOR_INDEX;
					fillNode(node.x,node.y,node.name);
					
					
					total++;
					return;
				}
			}
			createInfo("未找到和"+getSameNode()+"不相邻的结点"+"</br>");
			//displaySameNode();
			COLOR_INDEX++;
			CUR_NODE = null;
			
		}
		
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
		sortNode();
		initInfo();
		//loop();
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
	createInfo("着色完成！ 总共使用了: "+(COLOR_INDEX+1)+"颜色</br>");
	// if(COLOR_INDEX>3){
	// 	insertInfo("根据欧拉不等式m<=3n-6可得出"+LINE_NUM+">3*"+NODE_NUM+"-6="+(3*NODE_NUM-6)+"，所以不是平面图，达不到四色定理的要求");
	// }
}

function setState(newState){
	STATE = newState;
	//console.log(state);
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