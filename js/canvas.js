var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

var mousePressed = false;
var isEraser = false;
var lastX, lastY;

var eraser = document.getElementById('eraser');
var pencil = document.getElementById('pencil');

eraser.addEventListener('click', function(){isEraser = true;});
pencil.addEventListener('click', function(){isEraser = false;});


function draw(x, y, isDown) {
    if (isDown) {
        context.beginPath();
        if (!isEraser) {
        	context.strokeStyle = document.getElementById('selColor').value;
        } else {
        	context.strokeStyle = 'white';
        }
        context.lineWidth = document.getElementById('selWidth').value;
        context.lineJoin = 'round';
        context.moveTo(lastX, lastY);
        context.lineTo(x, y);
        context.closePath();
        context.stroke();
    }
    lastX = x;
    lastY = y;
}

function onMouseDown(e) {
	mousePressed = true;
	let x, y;
	x = e.clientX - this.offsetLeft;
	y = e.clientY - this.offsetTop;
	draw(x,y,false);
}

function onMouseMove(e) {
	if (mousePressed) {
		let x, y;
		x = e.clientX - this.offsetLeft;
		y = e.clientY - this.offsetTop;
        draw(x, y, true);
    }
} 

function stopDrawing(e) {
	mousePressed = false;
}


/*****************************/
/*CLEAR*/
var clearButton = document.getElementById('clear');
clearButton.addEventListener('click', clearArea);

function clearArea() {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

/*****************************/
/*LOAD IMAGES*/

var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', loadImageonPage, false);

function loadImageonPage(e) {
    var reader = new FileReader();
    reader.onload = function(event){
        var image = new Image();
        image.onload = function(){
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image,0,0);
        }
        image.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);   
}

/*****************************/
/*SAVE*/
var save = document.getElementById('save');

save.addEventListener('click', function(e) {
    this.href = canvas.toDataURL();
    this.download = 'mypainting.png';
}, false);
