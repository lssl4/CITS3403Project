
//the game canvas
var gameCanvas = document.getElementById("myGame");

//Setting the 2D context
var canvasContext = gameCanvas.getContext("2d");


var canvasHeight = gameCanvas.height; //1800
var canvasWidth = gameCanvas.width; //2000
var raf;

//Helper functions
function drawRec(x,y,width,height,fillStyle,lineWidth){
    canvasContext.fillStyle = fillStyle;
    canvasContext.fillRect(x,y,width,height);

    if(lineWidth >0){
        canvasContext.strokeStyle = "black";
        canvasContext.lineWidth = lineWidth;
        canvasContext.strokeRect(x,y,width,height);
    }

}

function drawText(text, x,y,style,font){
    canvasContext.fillStyle = style;
    canvasContext.font = font;
    canvasContext.fillText(text, x , y);

}


//Building
var buildingX = 0.05*canvasWidth;
var buildingY= 0.05*canvasWidth;
var buildingWidth = canvasWidth-canvasWidth*0.05*2;
var buildingHeight = canvasHeight/2-canvasWidth*0.1;

//Conveyor global variables
var conWidth = (buildingWidth/3)/2;
var conHeight = (buildingWidth/3)/2;
var conFillStyle = "#D8D8D8";


function ConveyorBelt(x,y,width, height, style, type){
    this.x = x;
    this.y =y;
    this.width = width;
    this.height = height;
    this.style=style;
    this.type = type;

}


var leftConveyor = new ConveyorBelt(buildingX,buildingY+buildingHeight,conWidth,conHeight,conFillStyle,2);
var rightConveyor = new ConveyorBelt(buildingX+buildingWidth-conWidth,buildingY+buildingHeight,conWidth,conHeight,conFillStyle,0);
var middleConveyor = new ConveyorBelt((buildingX+buildingWidth/2) - conWidth/2,buildingY +buildingHeight,conWidth,conHeight,conFillStyle,1);



//Drawing score and time
var score =0;
var time =60;


//Drawing the cargo container
var cargoContainerX= middleConveyor.x;
var cargoContainerY= canvasHeight-conHeight;


//draw Packages functions
var packages = [
    [0.9*conWidth, 0.9*conHeight], //cubic
    [0.2*conWidth, 0.9*conHeight], //irreg
    [0.45*conWidth, 0.45*conHeight] //smalls

];



function PackageConstruction(type){


    this.x = cargoContainerX + conWidth/2 - packages[type][0]/2;
    this.y = cargoContainerY + conHeight/2 - packages[type][1]/2;
    this.type = type;
    this.width = packages[type][0];
    this.height = packages[type][1];
    this.fillStyle = "#bf8040";

}

var currPackage = new PackageConstruction(2);

function drawPackage(p){

    canvasContext.fillStyle = p.fillStyle;
    canvasContext.fillRect(p.x,p.y,p.width,p.height);

}


//Functions getMousePos were influenced from: (Html5canvastutorials.com 2016)

//helper mouse position function
function getMousePos(canvas, evt) {
    var elemDim = gameCanvas.getBoundingClientRect();
    return {
        x: Math.round((evt.clientX-elemDim.left)/(elemDim.right-elemDim.left)*gameCanvas.width),
        y: Math.round((evt.clientY-elemDim.top)/(elemDim.bottom-elemDim.top)*gameCanvas.height)
    };
}


//Defining mousemove listener
var draggable =false;



function mouseMoveHandler(e){
    var mousePos = getMousePos(gameCanvas,e);

    if(draggable){
        currPackage.x = mousePos.x-currPackage.width/2;
        currPackage.y = mousePos.y -currPackage.height/2;

    }

}


//Functions mouseDownHandler and mouseUpHandler were influenced from: (Html5.litten.com 2016)

//Defining mousedown listener
document.getElementById("myGame").addEventListener("mousedown", mouseDownHandler);

function mouseDownHandler(e) {

    var mousePos = getMousePos(gameCanvas, e);

    if(mousePos.x< (currPackage.x+currPackage.width) && mousePos.x >currPackage.x &&
        mousePos.y< (currPackage.y+currPackage.height) && mousePos.y >currPackage.y

    ){
    currPackage.x = mousePos.x-currPackage.width/2;
    currPackage.y = mousePos.y -currPackage.height/2;

        draggable = true;

        gameCanvas.onmousemove = mouseMoveHandler;


    }

}


//Adding mouseUp event listener
document.getElementById("myGame").addEventListener("mouseup",mouseUpHandler, false);

function mouseUpHandler(e){


    //For left conveyor belt checking
    if(currPackage.x +currPackage.width/2< (leftConveyor.x+conWidth) && currPackage.x+currPackage.width/2 >leftConveyor.x &&
        currPackage.y +currPackage.height/2< (leftConveyor.y+conHeight) && currPackage.y +currPackage.height/2 >leftConveyor.y

    ){
        if(currPackage.type === leftConveyor.type){score++;}

        //Get a new package when mouse is up
        getNewPackage();

        //Once you mouseUp on the rectangle area, reset the draggable and onmousemove property
        draggable = false;
        gameCanvas.onmousemove = null;




    //For right conveyor belt checking
    }else if(
        currPackage.x + currPackage.width/2< (rightConveyor.x+conWidth) && currPackage.x +currPackage.width/2 >rightConveyor.x &&
        currPackage.y + currPackage.height/2< (rightConveyor.y+conHeight) && currPackage.y +currPackage.height/2 >rightConveyor.y
    ){

        if(currPackage.type === rightConveyor.type){score++;}

        //Get a new package when mouse is up
        getNewPackage();

        //Once you mouseUp on the rectangle area, reset the draggable and onmousemove property
        draggable = false;
        gameCanvas.onmousemove = null;



    //For middle conveyor belt
    }else if(
        currPackage.x + currPackage.width/2< (middleConveyor.x+conWidth) && currPackage.x+ currPackage.width/2 >middleConveyor.x &&
        currPackage.y + currPackage.height/2< (middleConveyor.y+conHeight) && currPackage.y +currPackage.height/2 >middleConveyor.y
    ){
        if(currPackage.type === middleConveyor.type){score++;}

        //Get a new package when mouse is up
        getNewPackage();

        //Once you mouseUp on the rectangle area, reset the draggable and onmousemove property
        draggable = false;
        gameCanvas.onmousemove = null;


    }else{

        //Once you mouseUp on the rectangle area, reset the draggable and onmousemove property
        draggable = false;
        gameCanvas.onmousemove = null;
    }

}

function getNewPackage(){

    randNum = Math.floor(Math.random()*3);

    //pick a random package
    currPackage = new PackageConstruction(randNum);

}


//Timer

var myTimer;
function startTimer(){
 
	myTimer = setInterval(decreaseTime,1000);

   
}


function decreaseTime(){
 time--;
    if(time ===0){
        stopTimer();
        alert("You scored: "+ score+ "!");
        location.reload();
    }



}

function stopTimer(){
    clearInterval(myTimer);
}



function draw(){

    //clear
    canvasContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);


    //drawing building
    drawRec(buildingX,buildingY, buildingWidth,buildingHeight,'#666666',4);
    drawText("UPS Sorting Facility",buildingX+2*conWidth,buildingHeight/2,"white","80px Calibri");

    //Left conveyor
    drawRec(leftConveyor.x,leftConveyor.y,conWidth,conHeight,conFillStyle,4);

    //right conveyor
    drawRec(rightConveyor.x,rightConveyor.y,conWidth,conHeight,conFillStyle,4 );

    //Middle conveyor
    drawRec(middleConveyor.x,middleConveyor.y,conWidth,conHeight,conFillStyle,4);

    //Labels
    drawText("Smalls",leftConveyor.x,leftConveyor.y,"orange","80px Calibri");
    drawText("Irregs", middleConveyor.x,middleConveyor.y,"orange","80px Calibri");
    drawText("Cubic", rightConveyor.x,rightConveyor.y,"orange","80px Calibri");


    

    //Drawing cargo container
    drawRec(cargoContainerX,cargoContainerY,conWidth,conHeight, "#f2f2f2",4);

    //draw package
    drawPackage(currPackage);


	
	//drawing score and time
    drawText("Score: " +score,canvasWidth*0.05,canvasHeight*0.05,"black","70px Calibri");
    drawText("Timer: " +time,buildingWidth-conWidth,canvasHeight*0.05, "black","70px Calibri");


    requestAnimationFrame(draw);
}


function drawBeginning(){

    canvasContext.fillStyle = " #91623b";
    canvasContext.fillRect(0,0, gameCanvas.width, gameCanvas.height)

    //start button
    var startWidth = canvasWidth/4;
    var startHeight = canvasHeight/8;
    var startX = canvasWidth/2-startWidth/2;
    var startY =canvasHeight/2 - startHeight/2;

    canvasContext.fillStyle = "#6d492c";
    canvasContext.fillRect(startX,startY,startWidth,startHeight);

    //drawing border
    canvasContext.lineWidth = 10;
    canvasContext.strokeStyle = "#ffffff";
    canvasContext.strokeRect(startX,startY,startWidth,startHeight);


    //filling in text
    drawText("Play Game", startX +startWidth/11, startY +startHeight/1.75,"#FFFFFF","100px Calibri");


    //Declaring start click handler

    function startclick(e) {

        var mousePos = getMousePos(gameCanvas, e);

        if (mousePos.x < (startX+startWidth) && mousePos.x > startX &&
                mousePos.y < (startY + startHeight) && mousePos.y >startY)
        {
            gameCanvas.onclick = null;

            startTimer();
            draw();


        }
    }

    gameCanvas.onclick = startclick;

}


function main(){
    drawBeginning();

}

main();


