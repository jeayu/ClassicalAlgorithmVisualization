var I;
var J;
var K;
var L;//循环的次数
var C;//二维矩阵
var M;
var TBODY;
var TBODY2;
var lasti;
var lastj;
var lastk;
var state;
var restar=-1;
var timeout;
var OL;
var lI;

function sure(){
	M = document.getElementById('matrix').value.split(",");
	if(M.length<=1){
		// alert('请定义矩阵');
		addClass(document.getElementById('matrix').parentNode,'has-error');
		return;
	}else{
		removeClass(document.getElementById('matrix').parentNode,'has-error');
	}
	var len = M.length;
	C = new Array(len);
	

	var i;
	var j;
	
	for(i = 0;i<len;i++){
		C[i] = new Array(len);
	}
	for(i = 0;i<len;i++){
		for(j = 0;j<len;j++){
			C[i][j] = 0;
		}
	}
	creatTable(len);
	L = 2;
	I = 0;
	J = I+L;
	K = I+1;
	C[I][J] = 10000000;
	setState('sure');

}

function setState(newState){
	state = newState;
	//console.log(state);
	document.getElementById("sure").disabled = state == 'star' || state == 'stop' || state=='next';
	document.getElementById("star").disabled = state == 'star' || state == 'end';
	document.getElementById("stop").disabled = state == 'next' || state == 'sure' ||state == 'stop' || state == 'end';
	document.getElementById("next").disabled = state == 'star' || state == 'end';
}
function star(){
	if(L>=M.length){
		removeSelect();
		setState('end');
		return;
	}
	if(state=='stop'&&restar==-1)
		return;
	if(state=='star'||restar==1||state=='next'){
		removeSelect();
	}
	restar = -1;
	setState('star');
	setp();
	afterStep();
	if(L<M.length)
		timeout = setTimeout(star,1000);
}

function stop(){
	setState('stop');
	restar = 1;
	if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
}

function next(){
	if(L>=M.length){
		removeSelect();
		var li = document.createElement('li');
		li.innerHTML = '完成填表！';
		OL.appendChild(li);
		li.scrollIntoView();
		setState('end');
		return;
	}
	if(state=='stop'){
		removeSelect();
	}
	
	if(state=='next'){
		removeSelect();
	}
	setp();
	afterStep();
	if(state!='end'){
		setState('next');
	}
}

function setp () {
	solve();
}

function creatTable(len){
	//删除旧表格
	if(document.getElementById('row')!=null){
		document.getElementById('table').removeChild(document.getElementById('row'));
	}
	//删除旧ol列表
	if(OL!=undefined){
		var ol = document.createElement('ol');
		var info = document.getElementById('info');
		info.removeChild(OL);
		info.appendChild(ol);
	}
	removeClass(document.getElementById('info'),'info'); //显示信息区域
	OL = document.getElementById('info').getElementsByTagName("ol")[0];//回答ol标签

	//开始创建table
	var table=document.createElement("table");
	table.setAttribute("cellspacing","0");
	table.setAttribute("id","m");
	var tbody=document.createElement("tbody");
	var i;
	var j;

	//创建表格
	for(i=0;i<len;i++){
		//创建tr
		var tr=document.createElement("tr");
		for(j=0;j<len;j++){

			var td=document.createElement("td");
			td.innerHTML='&nbsp';
			tr.appendChild(td);
			if(i>=1&&j>=1){
				td.setAttribute("class","base-td")
			}
			if(i==1){
				addClass(td,'top-td');
			}
			if(j==1){
				addClass(td,'left-td');
			}
		}
		tbody.appendChild(tr); 
	}
	table.appendChild(tbody);
	TBODY = tbody;
	

	//初始化第一行
	for(i=1;i<len;i++){
		tbody.rows[0].cells[i].innerHTML=i;
		tbody.rows[0].cells[i].setAttribute("class","index-td");
	}
	
	//初始化第一列
	for(i=1;i<len;i++){
		tbody.rows[i].cells[0].innerHTML=i;
		tbody.rows[i].cells[0].setAttribute("class","index-td");
	}

	// 把没用的地方涂上颜色
	for(i = 2;i<len;i++){
		for(j = 1;j<=i-1;j++){
			addClass(tbody.rows[i].cells[j],'none-td');
		}
	}
	//初始化对角线
	for(i = 1;i<len;i++){
		tbody.rows[i].cells[i].innerHTML='0';
		C[i][i] = 0;
	}

	// 建第二个表
	
	var table2=document.createElement("table");
	table2.setAttribute("cellspacing","0");
	table2.setAttribute("id","dim");
	var tbody=document.createElement("tbody");

	//创建表格
	for(i=0;i<3;i++){
		//创建tr
		var tr=document.createElement("tr");
		for(j=0;j<len;j++){

			var td=document.createElement("td");
			td.innerHTML='&nbsp';
			tr.appendChild(td);
			if(i==0){
				addClass(td,'index-td');
				td.innerHTML=j+1;
			}
			if(i==1){
				addClass(td,'top-td base-td');
				td.innerHTML=M[j];
			}
			if(i==1&&j==0){
				addClass(td,'left-td');
			}
		}
		tbody.appendChild(tr); 
	}
	table2.appendChild(tbody);
	TBODY2 = tbody;

	var row  = document.createElement('div');
	row.setAttribute('id','row')
	addClass(row,'row');
	var div2 = document.createElement('div');
	addClass(div2,'col-md-6');
	div2.appendChild(table2);
	row.appendChild(div2);

	div2 = document.createElement('div');
	addClass(div2,'col-md-6');
	div2.appendChild(table);
	row.appendChild(div2);
	document.getElementById('table').appendChild(row);
	document.getElementById('info').style.height = document.getElementById('table').offsetHeight-1+'px';
	
}


function removeSelect () {
	removeClass(TBODY.rows[lasti+1].cells[lastk],'select-td');
	removeClass(TBODY.rows[lastk+1].cells[lastj],'select-td');
	removeClass(TBODY.rows[lasti+1].cells[lastj],'current-td');

	TBODY2.rows[2].cells[lasti].innerHTML = '&nbsp;';//I
	TBODY2.rows[2].cells[lastj].innerHTML = '&nbsp;';;//J
	TBODY2.rows[2].cells[lastk].innerHTML = '&nbsp;';//K
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