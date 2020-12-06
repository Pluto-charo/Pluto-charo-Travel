var loadingLayer,backLayer,graphicsMap,nextLayer;
var imglist = {};
var imgData = [{name:"backImage",path:"./images/backImage.png"},
	{name:"r1",path:"./images/r1.png"},
	{name:"r2",path:"./images/r2.png"},
	{name:"r3",path:"./images/r3.png"},
	{name:"r4",path:"./images/r4.png"}];

var BOX;
var pointBox={x:0,y:0};
var nowBox,nextBox;
var map;
var nodeList;
var bitmapdataList;
var point=0,pointText;
var del=0,delText;
var speed=15,speedMax=15,speedText,speedIndex = 0;
var START_X1=15,START_Y1=20,START_X2=228,START_Y2=65;
var myKey = {
	keyControl:null,
	step:1,
	stepindex:0,
	isTouchDown:false,
	touchX:0,
	touchY:0,
	touchMove:false
};

function main(){
	BOX = new Box();
	map=[
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0]
	];

	backLayer = new LSprite();
	backLayer.graphics.drawRect(1,"#000000",[0,0,320,480],true,"#000000");
	addChild(backLayer);
	loadingLayer = new LoadingSample1();
	backLayer.addChild(loadingLayer);
	LLoadManage.load(
		imgData,
		function(progress){
			loadingLayer.setProgress(progress);
		},
		gameInit
	);
}

function gameInit(result){
	imglist = result;
	backLayer.removeChild(loadingLayer);
	loadingLayer = null;
	var title = new LTextField();
	title.x = 50;
	title.y = 100;
	title.size = 30;
	title.color = "#ffffff";
	title.text = "俄罗斯方块";
	backLayer.addChild(title);
	backLayer.graphics.drawRect(1,"#ffffff",[50,240,220,40]);
	var txtClick = new LTextField();
	txtClick.size = 18;
	txtClick.color = "#ffffff";
	txtClick.text = "点击页面开始游戏";
	txtClick.x = (LGlobal.width - txtClick.getWidth())/2;
	txtClick.y = 245;
	backLayer.addChild(txtClick);
	backLayer.addEventListener(LMouseEvent.MOUSE_UP,gameToStart);
}

function gameToStart(){
	backLayer.die();
	backLayer.removeAllChild();
	var bitmap = new LBitmap(new LBitmapData(imglist["backImage"]));
	backLayer.addChild(bitmap);
	pointText = new LTextField();
	pointText.x = 240;
	pointText.y = 200;
	pointText.size = 20;
	backLayer.addChild(pointText);
	delText = new LTextField();
	delText.x = 240;
	delText.y = 290;
	delText.size = 20;
	backLayer.addChild(delText);
	speedText = new LTextField();
	speedText.x = 240;
	speedText.y = 385;
	speedText.size = 20;
	backLayer.addChild(speedText);
	showText();
	graphicsMap = new LSprite();
	backLayer.addChild(graphicsMap);
	nextLayer = new LSprite();
	backLayer.addChild(nextLayer);
	bitmapdataList = [
		new LBitmapData(imglist["r1"]),
		new LBitmapData(imglist["r2"]),
		new LBitmapData(imglist["r3"]),
		new LBitmapData(imglist["r4"])
	];
	nodeList = [];
	var i,j,nArr,bitmap;
	for(i=0;i<map.length;i++){
		nArr = [];
		for(j=0;j<map[0].length;j++){
			bitmap = new LBitmap(bitmapdataList[0]);
			bitmap.x = bitmap.getWidth()*j+START_X1;
			bitmap.y = bitmap.getHeight()*i+START_Y1;
			graphicsMap.addChild(bitmap);
			nArr[j] = {"index":-1,"value":0,"bitmap":bitmap};
		}
		nodeList[i] = nArr;
	}
	getNewBox();
	plusBox();
	backLayer.addEventListener(LEvent.ENTER_FRAME, onframe);
	backLayer.addEventListener(LMouseEvent.MOUSE_DOWN,touchDown);
	backLayer.addEventListener(LMouseEvent.MOUSE_UP,touchUp);
	backLayer.addEventListener(LMouseEvent.MOUSE_MOVE,touchMove);
	if(!LGlobal.canTouch){
		LEvent.addEventListener(LGlobal.window,LKeyboardEvent.KEY_DOWN,onkeydown);
		LEvent.addEventListener(LGlobal.window,LKeyboardEvent.KEY_UP,onkeyup);
	}
}

function showText(){
	pointText.text = point;
	delText.text = del;
	speedText.text = speedMax - speed + 1;
}

function onkeydown(event){
	if(myKey.keyControl != null)return;
	if(event.keyCode == 37){//left
		myKey.keyControl = "left";
	}else if(event.keyCode == 38){//up
		myKey.keyControl = "up";
	}else if(event.keyCode == 39){//right
		myKey.keyControl = "right";
	}else if(event.keyCode == 40){//down
		myKey.keyControl = "down";
	}
}

function onkeyup(event){
	myKey.keyControl = null;
	myKey.stepindex = 0;
}

function touchDown(event){
	myKey.isTouchDown = true;
	myKey.touchX = Math.floor(event.selfX / 20);
	myKey.touchY = Math.floor(event.selfY / 20);
	myKey.touchMove = false;
	myKey.keyControl = null;
}

function touchUp(event){
	myKey.isTouchDown = false;
	if(!myKey.touchMove)myKey.keyControl = "up";
}

function touchMove(event){
	if(!myKey.isTouchDown)return;
	var mx = Math.floor(event.selfX / 20);
	if(myKey.touchX == 0){
		myKey.touchX = mx;
		myKey.touchY = Math.floor(event.selfY / 20);
	}
	if(mx > myKey.touchX){
		myKey.keyControl = "right";
	}else if(mx < myKey.touchX){
		myKey.keyControl = "left";
	}
	if(Math.floor(event.selfY / 20) > myKey.touchY){
		myKey.keyControl = "down";
	}
}

function onframe(){
	minusBox();
	if(myKey.keyControl != null && myKey.stepindex-- < 0){
		myKey.stepindex = myKey.step;
		switch(myKey.keyControl){
			case "left":
				if(checkPlus(-1,0)){
					pointBox.x -= 1;
					if(LGlobal.canTouch || true){
						myKey.keyControl = null;
						myKey.touchMove = true;
						myKey.touchX = 0;
					}
				}
				break;
			case "right":
				if(checkPlus(1,0)){
					pointBox.x += 1;
					if(LGlobal.canTouch || true){
						myKey.keyControl = null;
						myKey.touchMove = true;
						myKey.touchX = 0;
					}
				}
				break;
			case "down":
				if(checkPlus(0,1)){
					pointBox.y += 1;
					if(LGlobal.canTouch || true){
						myKey.keyControl = null;
						myKey.touchMove = true;
						myKey.touchY = 0;
					}
				}
				break;
			case "up":
				changeBox();
				if(LGlobal.canTouch || true){
					myKey.keyControl = null;
					myKey.stepindex = 0;
				}
				break;
		}
	}
	if(speedIndex++ > speed){
		speedIndex = 0;
		if (checkPlus(0,1)){
			pointBox.y++;
		}else{
			plusBox();
			if(pointBox.y < 0){
				gameOver();
				return;
			}
			removeBox();
			getNewBox();
		}
	}
	plusBox();
	drawMap();
}

function gameOver(){
	backLayer.die();
	var txt = new LTextField();
	txt.color = "#ff0000";
	txt.size = 40;
	txt.text = "游戏结束";
	txt.x = (LGlobal.width - txt.getWidth())*0.5;
	txt.y = 200;
	backLayer.addChild(txt);
}

function drawMap(){
	var i,j,boxl = 15;
	for(i=0;i<map.length;i++){
		for(j=0;j<map[0].length;j++){
			if(nodeList[i][j]["index"] >= 0){
				nodeList[i][j]["bitmap"].bitmapData = bitmapdataList[nodeList[i][j]["index"]];
			}else{
				nodeList[i][j]["bitmap"].bitmapData = null;
			}
		}
	}
}

function changeBox(){
	var saveBox = nowBox;
	nowBox = [
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0]
	];
	var i,j;
	for(i=0;i<saveBox.length;i++){
		for(j=0;j<saveBox[1].length;j++){
			nowBox[i][j]=saveBox[(3-j)][i];
		}
	}
	if (!checkPlus(0,0)){
		nowBox = saveBox;
	}
}

function moveLine(line){
	var i;
	for(i=line;i>1 ;i--){
		for(j=0;j<map[0].length;j++){
			 map[i][j]=map[i-1][j];
			 nodeList[i][j].index=nodeList[i-1][j].index;
		}
	}
	for(j=0;j<map[0].length;j++){
		 map[0][j]=0;
		 nodeList[0][j].index=-1;
	}
}

function removeBox(){
	var i,j,count = 0;
	for(i=pointBox.y;i<(pointBox.y+4);i++){
		if(i < 0 || i >= map.length)continue;
		for(j=0;j<map[0].length;j++){
			if(map[i][j]==0){
				break;
			}
			if(j==map[0].length - 1){
				moveLine(i);
				count++;
			}
		}
	}
	if(count == 0)return;
	del += count;
	if(count == 1){
		point += 1;
	}else if(count == 2){
		point += 3;
	}else if(count == 3){
		point += 6;
	}else if(count == 4){
		point += 10;
	}
	if(speed > 1 && del / 100 >= (speedMax - speed + 1)){
		speed--;
	}
	showText();
}

function checkPlus(nx,ny){
	var i,j;
	if(pointBox.y < 0){
		if(pointBox.x + nx < 0 || pointBox.x + nx > map[0].length - 4){
			return false;
		}
	}
	for(i=0;i<nowBox.length;i++){
		for(j=0;j<nowBox[i].length;j++){
			if(i+pointBox.y + ny < 0){
				continue;
			}else if(i+pointBox.y + ny >= map.length || j+pointBox.x + nx < 0 || j+pointBox.x + nx >= map[0].length){
				if(nowBox[i][j] == 0){
					continue;
				}else{
					return false;
				}
			}
			if(nowBox[i][j] > 0 && map[i+pointBox.y + ny][j+pointBox.x + nx] > 0){
				return false;
			}
		}			
	}
	return true;
}

function minusBox(){
	var i,j;
	for(i=0;i<nowBox.length;i++){
		for(j=0;j<nowBox[i].length;j++){
			if(i+pointBox.y < 0 || i+pointBox.y >= map.length || j+pointBox.x < 0 || j+pointBox.x >= map[0].length){
				continue;
			}
			map[i+pointBox.y][j+pointBox.x]=map[i+pointBox.y][j+pointBox.x]-nowBox[i][j];
			nodeList[i+pointBox.y][j+pointBox.x]["index"] = map[i+pointBox.y][j+pointBox.x] - 1;
		}
	}
}

function plusBox(){
	var i,j;
	for(i=0;i<nowBox.length;i++){
		for(j=0;j<nowBox[i].length;j++){
			if(i+pointBox.y < 0 || i+pointBox.y >= map.length || j+pointBox.x < 0 || j+pointBox.x >= map[0].length){
				continue;
			}
			map[i+pointBox.y][j+pointBox.x]=nowBox[i][j]+map[i+pointBox.y][j+pointBox.x];
			nodeList[i+pointBox.y][j+pointBox.x]["index"] = map[i+pointBox.y][j+pointBox.x] - 1;
		}			
	}
}

function getNewBox(){
	if (nextBox==null){
		nextBox=BOX.getBox();
	}
	nowBox=nextBox;
	pointBox.x=3;
	pointBox.y=-4;
	nextBox=BOX.getBox();
	
	nextLayer.removeAllChild();
	var i,j,bitmap;
	for(i=0;i<nextBox.length;i++){
		for(j=0;j<nextBox[0].length;j++){
			if(nextBox[i][j] == 0){
				continue;
			}
			bitmap = new LBitmap(bitmapdataList[nextBox[i][j] - 1]);
			bitmap.x = bitmap.getWidth()*j+START_X2;
			bitmap.y = bitmap.getHeight()*i+START_Y2;
			nextLayer.addChild(bitmap);
		}
	}
}