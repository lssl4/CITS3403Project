//Some code, setting out, and function names taken from 
//Game Tutorial.(n.d). retrieved from http://www.w3schools.com/games/
//more specifically http://www.w3schools.com/games/tryit.asp?filename=trygame_default_gravity

//initialize variables
var player;
var items = [];
var obstacles = [];

var canvasWidth = 720;
var canvasHeight = 480;
var numLanes = 5;
var multiplier = 1;
var multiplierCap = 10;
var collision = false;
var gameOver = false;
var laneHeight = Math.floor(canvasHeight/numLanes);

var score;
var pressText = "Press the ~ key to Start";
var pressFont = "30px Arial";
var scoreFont = "20px Arial";

var obstacleInterval = 1000;
var itemInterval = 5;
var itemTimmer;
var obstacleTimmer;

var mail = new Image();
mail.src = 'images/mail.png';
var van = new Image();
//OpenClipartVectors(2016),Black and White icon Monochrome Truck
van.src = "https://pixabay.com/static/uploads/photo/2016/04/01/10/09/black-and-white-1299789_960_720.png";
var obsImg = new Image();
//Sangjun Oh(2016),Manhole Cover
obsImg.src = "https://pixabay.com/static/uploads/photo/2016/01/14/11/04/manhole-1139689_960_720.png";

var gameStarted = false;
var difSpeed = 15;
var difColor = "blue";
var canvas;
var wait;
//function to start game loop and initialize canvas;
var domScore;
var domDiff;

wait = setTimeout(startGame,1);
function startGame(){
	clearTimeout(wait);
	domScore = document.getElementById("gameScore");
	domDiff = document.getElementById("gameDiff");
	domDiff.value = "Normal";
	domScore.value = 0;
	canvas = document.getElementById("myGame");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	setInterval(updateScreen, 1000/60);
}

function clearDisp(){
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,canvasWidth,canvasHeight);
}

//initializes game after title screen/game over.
function beginGame(){
	domScore.value = 0;
	player = new playerObj(10, (numLanes-1)/2, "player",van);
	items = [];
	collision = false;
	gameOver = false;
	obstacles = [];
	score = 0;
	multiplier = 1;
	itemTimmer = setInterval(generateFirstItem, obstacleInterval*1.5);
	obstacleTimmer = setInterval(generateObstacles, obstacleInterval);
}

//function to create a new game object
//"Game Tutorial,"(n.d)
function gameObject(x, lane, type, img){
	this.type = type;
	this.x = x;
	this.lane = lane;
	this.img = img;
	this.speed = difSpeed * -1;
	//adjust object position based on speed
	this.updatePos = function(){
		this.x += this.speed;
	}
	//display the object
	this.draw = function(){
		var myx = this.x;
		var myLane = this.lane;
		var myheight = laneHeight;
		var mywidth = laneHeight;
		var ctx = canvas.getContext("2d");
		if(this.img!=undefined){
			ctx.drawImage(this.img, myx, myLane*myheight,mywidth,myheight);
		}else{
			ctx.fillStyle = "blue";
			ctx.fillRect(myx,myLane*myheight,mywidth,myheight);
		}
	}
}

//creates player object of prototype gameObject
function playerObj(x,lane,type,img){
	this.type = type;
	this.x = x;
	this.lane = lane;
	this.img = img;
	this.speed = 0;
}
playerObj.prototype = new gameObject();
playerObj.prototype.checkCollision = function(otherObject){
	var myLane = this.lane;
	var myx = this.x;
	var myxEnd = this.x + laneHeight;
	var otherLane = otherObject.lane;
	var otherx = otherObject.x;
	var otherxEnd = otherObject.x + laneHeight;
	var crash = false;
	if(myLane == otherLane){
		if(myx>=otherx){
			if(myx<=otherxEnd){
				crash = true;
			}
		}else{
			if(myxEnd>=otherx){
				crash = true;
			}
		}
	}
	return crash;
}

//event handler for game
keyboardDown = function(e){
	if(gameStarted){
		switch(e.keyCode){
			case 87:
				if(player.lane != 0){
					player.lane -= 1;
				}
				break;
			case 83:
				if(player.lane != numLanes-1){
					player.lane += 1;
				}
				break;
		}
	}else{
		switch(e.keyCode){
			case 49:
				difColor = "green";
				difSpeed = 10;
				domDiff.value = "Easy";
				obstacleInterval = 2000;
				break;
			case 50:
				difColor = "blue";
				difSpeed = 15;
				domDiff.value = "Normal";
				obstacleInterval = 1000;
				break;
			case 51:
				difColor = "red";
				difSpeed = 20;
				domDiff.value = "Hard";
				obstacleInterval = 1000;
				break;
			case 192:
				gameStarted = true;
				beginGame();
				break;
		}
		
	}
}

document.addEventListener("keydown", keyboardDown);


//generate the first item then adjust interval so that items are spread out from obstacles
function generateFirstItem(){
	generateItems();
	clearInterval(itemTimmer);
	itemTimmer = setInterval(generateItems,obstacleInterval*itemInterval);
}
function generateItems(){
	items.push(new gameObject(canvasWidth,Math.floor(Math.random()*numLanes) , "mail",mail));
}

//generate new obstacles
function generateObstacles(){
	var takenLane = [];
	var obsLane;
	var match = false;
	var numObs = Math.floor(Math.random()*(numLanes-1) + 1);
	for(var i=0;i<numObs;i++){
		obsLane = Math.floor(Math.random()*numLanes);
		while(true){
			match = false;
			for(var j = 0; j<takenLane.length;j++){
				if(takenLane[j] == obsLane){
					match = true;
					break;
				}
			}
			if(match){
				obsLane = Math.floor(Math.random()*numLanes);
			}else{
				break;
			}
		}
		takenLane.push(obsLane);
		obstacles.push(new gameObject(canvasWidth, obsLane, "obstacle",obsImg));
	}
}

//displays start screen
function drawStartScreen(){
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, 720, 480);
	ctx.textAlign= "center"; 
	ctx.fillStyle = "white";
	ctx.font = pressFont;
	ctx.fillText("DELIVERY",canvasWidth/2,canvasHeight/4);
	ctx.fillText(pressText,canvasWidth/2,canvasHeight/2);
	ctx.fillText("Press 1, 2, or 3 to select difficulty",canvasWidth/2,canvasHeight/4*3);
	drawDifficulty();
}

//draws lines on canvas
//currently not being used
function drawBackground(){
	var ctx = canvas.getContext("2d");
	var laneHeight = Math.floor(canvasHeight/numLanes);
	for(var i = 0; i<numLanes+1;i++){
		ctx.beginPath();
		ctx.moveTo(0,laneHeight*i);
		ctx.lineTo(canvasWidth,laneHeight*i);
		ctx.stroke();
	}
}

//draws the game over screen
function drawGameOverScreen(){
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, 720, 480);
	ctx.textAlign= "center"; 
	ctx.fillStyle = "red";
	ctx.font = pressFont;
	ctx.fillText("Game Over",canvasWidth/2,canvasHeight/4);
	ctx.fillText(score,canvasWidth/2,canvasHeight/2);
	ctx.fillText(pressText,canvasWidth/2,canvasHeight/4*3);
	ctx.fillText("Press 1, 2, or 3 to select difficulty",canvasWidth/2,canvasHeight/8*7);
	drawDifficulty();
}

//draws score in top of screen while game is running
function drawScore(){
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "black";
	ctx.font = scoreFont;
	ctx.textAlign = "start";  
	ctx.fillText("multiplier: " + multiplier,0,20);
	ctx.textAlign = "end";
	ctx.fillText("score: " + score,canvasWidth,20);
	
}

//draw difficulty circle
function drawDifficulty(){
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = difColor;
	ctx.arc(canvasWidth-25,canvasHeight-25,25,0,2 * Math.PI);
	ctx.fill();
}

//updates objects and canvas at regular interval to display the game
function updateScreen() {
	clearDisp();
	if(!gameStarted){
		if(gameOver){
			drawGameOverScreen()
		}else{
			drawStartScreen()
		}
	}else {
		for(var i = 0; i < items.length;i++){
			items[i].updatePos();
			items[i].draw();
			if(items[i].x + laneHeight <=0){
				items.splice(i,1);
				i-=1;
				multiplier = 1;
			}
			else if(player.checkCollision(items[i])){
				items.splice(i,1);
				i-=1;
				score += 100 * multiplier;
				if(multiplier < multiplierCap){
					multiplier++;
				}
			}
		}
		for(var i = 0; i < obstacles.length;i++){
			obstacles[i].updatePos();
			obstacles[i].draw();
			if(obstacles[i].x + laneHeight <=0){
				obstacles.splice(i,1);
				i-=1;
			}
			else if(player.checkCollision(obstacles[i])){
				collision = true;
			}
		}
		player.draw();
		drawScore();
		//handle collision after displaying all objects
		if(collision){
			gameStarted = false;
			gameOver = true;
			clearInterval(itemTimmer);
			clearInterval(obstacleTimmer);
			domScore.value = score;
			return;
		}
	}
}
