var I;//i下标 行
var J;//j下标 列
var L;//二维数组
var A;
var B;
var TBODY;
var OL;
var state;
var timeout;
var lasti;
var lastj;
var restar=-1;
var result;

var sure = function(){
	
	//获取字符串
	var str1 = document.getElementById('str1').value;
	var str2 = document.getElementById('str2').value;
	if(str1==''||str2==''){
		addClass(document.getElementById('str1').parentNode,'has-error');
		addClass(document.getElementById('str2').parentNode,'has-error');
		return;
	}else{
		removeClass(document.getElementById('str1').parentNode,'has-error');
		removeClass(document.getElementById('str2').parentNode,'has-error');
	}
	//获取行数值
	var row = str1.length;
	//获取列数值
	var col = str2.length;
	//创建table表格
	creatTable(row,col,str1,str2);

	A = [];
	B = [];
	var i;
	var j;
	for(i = 0;i<row;i++){
		A.push(str1.substring(i,i+1))
	}
	for(i = 0;i<col;i++){
		B.push(str2.substring(i,i+1))
	}
	L = new Array(row+1);
	for(i = 0;i<row+1;i++){
		L[i] = new Array(col+1);
		L[i][0] = 0;
	}
	for(i = 0;i<col+1;i++){
		L[0][i] = 0;
	}
	I = 1;
	J = 1;
	result = '';
	setState('sure');
	
}

function star(){
	if(I>=L.length){
		removeSelect(lasti,lastj);
		findLCS();
		return;
	}
	if(state=='stop'&&restar==-1)
		return;
	if(state=='star'||restar==1){
		removeSelect(lasti,lastj);
	}
	restar = -1;
	setState('star');
	setp();
	lasti = I;
	lastj = J;
	afterStep();
	if(I<L.length)
		timeout = setTimeout(star,500);
}

function stop(){
	//timeout = null;
	setState('stop');
	restar = 1;
	if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
}

function next(){
	//afterStep();
	if(I>=L.length){
		removeSelect(lasti,lastj);
		findLCS();
		return;
	}
	if(state=='stop'){
		removeSelect(lasti,lastj);
	}
	
	if(state=='next'){
		removeSelect(lasti,lastj);
		afterStep();
	}
	setp();
	lasti = I;
	lastj = J;
	setState('next');
}

function setp(){
	addClass(TBODY.rows[I+2].cells[1],'select-char');//添加行颜色
	solve(I,J);
}

function setState(newState){
	state = newState;
	//console.log(state);
	document.getElementById("sure").disabled = state == 'star' || state == 'stop' || state=='next';
	document.getElementById("star").disabled = state == 'star' || state == 'end';
	document.getElementById("stop").disabled = state == 'next' || state == 'sure' ||state == 'stop' || state == 'end';
	document.getElementById("next").disabled = state == 'star' || state == 'end';
}

function creatTable(row,col,str1,str2){
	//删除旧表格
	if(document.getElementById('lcs')!=null){
		document.getElementById('table').removeChild(document.getElementById('lcs'));
	}
	//删除旧ol列表
	if(OL!=undefined){
		var ol = document.createElement('ol');
		var info = document.getElementById('info');
		info.removeChild(OL);
		info.appendChild(ol);
	}
	removeClass(document.getElementById('info'),'info'); //显示信息区域
	OL = document.getElementById('info').getElementsByTagName("ol")[0];//解答ol标签

	//开始创建table
	var table=document.createElement("table");
	table.setAttribute("cellspacing","0");
	table.setAttribute("id","lcs");
	var tbody=document.createElement("tbody");
	var r = 0;
	var c = 0;

	//创建表格
	for(var i=0-3;i<row;i++){
		//创建tr
		var tr=document.createElement("tr");
		for(var j=0-3;j<col;j++){

			var td=document.createElement("td");
			td.innerHTML='&nbsp';
			tr.appendChild(td);
			if(i>=0&&j>=0){
				td.setAttribute("class","base-td")
			}
		}
		tbody.appendChild(tr); 
	}
	table.appendChild(tbody);

	document.getElementById('table').appendChild(table);

	//初始化第一、二行
	for(i=2;i<col+3;i++){
		tbody.rows[0].cells[i].innerHTML=i-2;
		tbody.rows[0].cells[i].setAttribute("class","index-td");
		if(i>2){
			tbody.rows[1].cells[i].innerHTML=str2.substring(i-3,i-2);
			tbody.rows[1].cells[i].setAttribute("class","char-td");
		}
	}

	//初始化第一、二列
	for(i=2;i<row+3;i++){
		tbody.rows[i].cells[0].innerHTML=i-2;
		tbody.rows[i].cells[0].setAttribute("class","index-td");
		if(i>2){
			tbody.rows[i].cells[1].innerHTML=str1.substring(i-3,i-2);
			tbody.rows[i].cells[1].setAttribute("class","char-td");
		}
	}

	//初始化第三行
	for(i=2;i<col+3;i++){
		tbody.rows[2].cells[i].innerHTML='X&nbsp;0';
		addClass(tbody.rows[2].cells[i],'base-td top-td');
		if(i==2)
			addClass(tbody.rows[2].cells[i],'left-td');
	}
	
	//初始化第三列
	for(i=3;i<row+3;i++){
		tbody.rows[i].cells[2].innerHTML='X&nbsp;0';
		addClass(tbody.rows[i].cells[2],'base-td left-td');
	}
	TBODY = tbody;
	document.getElementById('info').style.height = document.getElementById('table').offsetHeight-75+'px';

}

function removeSelect(i,j){
	removeClass(TBODY.rows[1].cells[j+2],'select-char');//列
	if(j+1>=L[0].length)
		removeClass(TBODY.rows[i+2].cells[1],'select-char');//行
	removeClass(TBODY.rows[i+2].cells[j+2],'current-td');
	removeClass(TBODY.rows[i+2-1].cells[j+2-1],'select-td');
	removeClass(TBODY.rows[i+2-1].cells[j+2],'select-td');
	removeClass(TBODY.rows[i+2].cells[j+2-1],'select-td');
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