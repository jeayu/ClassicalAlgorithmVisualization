// 求解LCS
function solve(i,j){

	//选择比较的字符
	addClass(TBODY.rows[1].cells[j+2],'select-char');//列
	var l = document.createElement('li');

	if (A[i - 1] == B[j - 1]){
		//两个字符相同 左上角+1
		L[i][j] = L[i - 1][j - 1] + 1;
		
		l.innerHTML = A[i - 1]+' == '+B[j - 1]+': 左上角的值+1设为当前的值';
		TBODY.rows[i+2].cells[j+2].innerHTML='↖'+L[i][j];
		addClass(TBODY.rows[i+2].cells[j+2],'current-td');
		addClass(TBODY.rows[i+2-1].cells[j+2-1],'select-td');
	}
	else {
		//两个字符不相等
		if(L[i][j - 1] > L[i - 1][j]){
			L[i][j] =  L[i][j - 1];//左侧的大
			l.innerHTML = A[i - 1]+' != '+B[j - 1]+': 因为 '+L[i][j - 1] +' > '+L[i - 1][j]+' 所以左侧的值设为当前的值';
			TBODY.rows[i+2].cells[j+2].innerHTML='←'+L[i][j];

		}else{
			L[i][j] =  L[i - 1][j];//取上方
			l.innerHTML = A[i - 1]+' != '+B[j - 1]+': 因为 '+L[i][j - 1] +' <= '+L[i - 1][j]+' 所以上方的值设为当前的值';
			TBODY.rows[i+2].cells[j+2].innerHTML='↑ '+L[i][j];
		}
		addClass(TBODY.rows[i+2].cells[j+2],'current-td');
		addClass(TBODY.rows[i+2-1].cells[j+2],'select-td');//上方
		addClass(TBODY.rows[i+2].cells[j+2-1],'select-td');//左侧

	}
	OL.appendChild(l);
	l.scrollIntoView();

}
//求解下一步
function afterStep(){
	J++;
	if(J>=L[0].length){
		J = 1;
		I++;
	}
	if(I>=L.length){
		var l = document.createElement('li');
		l.innerHTML = '完成填表！';
		OL.appendChild(l);
		l.scrollIntoView();
		if(state!='next'){
			setTimeout(function(){
				removeSelect(lasti,lastj);
				findLCS();
			},500);
		}

	}
}

//找到最长公共子序列
function findLCS(){

	var i = L.length-1;
	var j = L[0].length-1;
	while(i>0&&j>0){
		if (A[i - 1] == B[j - 1]){
			//两个字符相同 左上角+1
			addClass(TBODY.rows[i+2].cells[j+2],'current-td');
			result = A[i-1]+result;
			j--;
			i--;
		}
		else {
			//两个字符不相等
			if(L[i][j - 1] > L[i - 1][j]){
				//左边大
				addClass(TBODY.rows[i+2].cells[j+2],'select-td');
				j--;
				

			}else{
				addClass(TBODY.rows[i+2].cells[j+2],'select-td');
				i--;
			}
			
		}

	}

	var l = document.createElement('li');
	l.innerHTML = '最长公共子序列为: '+result;
	OL.appendChild(l);
	l.scrollIntoView();
	setState('end');

}
