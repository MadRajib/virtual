var img;
var path;
var selection;
var colr;
var drawSelect;
var im;
var selectArea,finishSelection,showHideSelectedArea,applyColor;
var selectAreaFlag;
var showHideSelectedAreaFlag;
var canvas;
var setImage;
var logo;
var galleryFlag = true;
var modelOpen = false;
var firsTime = true;

function preload() {
  img = loadImage("assets/room.jpg");
  logo = loadImage("assets/LOGOfinal.png");
}


function loadIm(image){
  img = loadImage(image);
  setImage = true;
  reset();
  imagePicker = false;
}
var fingers;

function setup(){
  canvas = createCanvas(840, 600, P2D);
  canvas.id("mycanvas");


  // Move the canvas so it's inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');
  path = [];
  selection = [];
  colr = color(255,255,255,1);
  drawSelect = false;
  setImage = false;
  //selectArea = createButton('Select Area');
  //selectArea.position(0,height+20);
  //selectArea.mousePressed(selectAreaF);
  selectAreaFlag = false;

  //finishSelection = createButton('Finish Selection');
  //finishSelection.position(selectArea.x+selectArea.width,height+20);
  //finishSelection.mousePressed(finishSelectionF);
  showHideSelectedAreaFlag = false;

  //showHideSelectedArea = createButton('Show/Hide Selection');
  //showHideSelectedArea.position(finishSelection.x+finishSelection.width,height+20);
  //showHideSelectedArea.mousePressed(showHideSelectedAreaF);

  //applyColor = createButton('Apply Color');
  //applyColor.position(showHideSelectedArea.x+showHideSelectedArea.width,height+20);
  //applyColor.mousePressed(applyColorF);
  //copy(img, 0,0, img.width, img.height, 0, 0, width, height);


}


function draw(){

if(setImage){
  copy(img, 0,0, img.width, img.height, 0, 0, width, height);
}
//when area is selecting show the path
if(selectAreaFlag){
  drawSelectingArea();
}

//when show hide button is clicked
if(showHideSelectedAreaFlag){
  drawOutlineSelection();
}

drawSelection();


}

function reset(){
  path = [];
  selection = [];
  colr = color(255,255,255,1);
  drawSelect = false;
  selectAreaFlag = false;
  showHideSelectedAreaFlag = false;
  modelOpen = false;
}

function setImagePicker(bol){
  firsTime = bol;
}


function mouseClicked() {
  if(modelOpen){
    return;
  }
  selectAreaF();
  if(!selectAreaFlag){
    return;
  }
  if(galleryFlag){
    return;
  }
  if(firsTime){
    firsTime = false;
    return;
  }
  if((mouseX > 0 && mouseX < width)&&(mouseY > 0 && mouseY < height) ){
    //ellipse(mouseX, mouseY, 5, 5);
    path.push(createVector(mouseX, mouseY));
    console.log("clicked");
  }

}


function drawSelectingArea(){
  noFill();
  stroke(0,0,150);
  for(var i =0; i<path.length;i++){
    ellipse(path[i].x,path[i].y,10,10);
  }

  if(path.length > 1){
    for(var i =1; i<path.length;i++){
      line(path[i-1].x,path[i-1].y,path[i].x,path[i].y);
    }
  }
}

function drawOutlineSelection(){
  noFill();
  stroke(0,0,200);
  for(var i = 0; i<selection.length;i++){
    var subSelection = selection[i].points;
    beginShape();
    for(var j =0 ; j <subSelection.length ; j++){
        vertex(subSelection[j].x,subSelection[j].y);
    }
    endShape(CLOSE);
  }

}

function selectAreaF(){
  selectAreaFlag = true;
  //drawSelect = true;
}


function finishSelectionF(){
  selection.push(new SelectedArea(path));
  showHideSelectedAreaFlag = true;
  path = [];
  selectAreaFlag = false;

}

function showHideSelectedAreaF(){
    showHideSelectedAreaFlag = (showHideSelectedAreaFlag)?false:true;
}


function applyColorF(pColor){

  var clr = pColor.substring(4, pColor.length-1).split(",");
  colr = color(clr[0],clr[1],clr[2]);
  console.log();
  selection[getNearerArea(getMouseCoordinates())].setcolor(colr);
}

function drawSelection(){

  noStroke();
  for(var i = 0; i<selection.length;i++){

    if(selection[i].colr != null){
      fill(selection[i].colr);
      var subSelection = selection[i].points;

      beginShape();
      for(var j =0 ; j <subSelection.length ; j++){
          vertex(subSelection[j].x,subSelection[j].y);
      }
      endShape(CLOSE);

    }
  }

}

function SelectedArea(points){
  this.points = points;
  this.colr;
  this.setcolor = function(clr){
    this.colr = clr;
  }
}

//calculation

function getMouseCoordinates(){
  return createVector(mouseX, mouseY);
}

function getNearerArea(point){
  var minNearArea = 0;
  var minDist = p5.Vector.dist(point,selection[minNearArea].points[0]);


  for(var i = 0; i<selection.length;i++){
    var subSelection = selection[i].points;
    for(var j =0 ; j <subSelection.length ; j++){
        var calDist = p5.Vector.dist(point,subSelection[j]);
        if(calDist< minDist){
          minDist = calDist;
          minNearArea = i;
        }
    }
  }

  return minNearArea;
}

function savecanvas(){
  copy(logo, 0,0, logo.width,logo.height,0,0, logo.width,logo.height);
  save(canvas,canvas.png);
}

var ctrlPressed = false;
function keyPressed(){
  if (keyCode === 17) {
     ctrlPressed = true;
  }
  if(ctrlPressed && keyCode === 90) {
    pathUndo();

  }
}

function keyReleased(){
  if (keyCode === 17) {
     ctrlPressed = false;
  }
}

function pathUndo(){
  path.pop();
}
