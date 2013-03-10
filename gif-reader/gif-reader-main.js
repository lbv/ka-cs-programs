var photoImg;
var pointerImg;
var logoImg;
var usePointer = false;

try {
	var gif = new GIFReader(new Base64Reader(pointerData));
	pointerImg = gif.readImages()[0];
	gif = new GIFReader(new Base64Reader(logoData));
	logoImg = gif.readImages()[0];

	gif = new GIFReader(new Base64Reader(photoData));
	photoImg = gif.readImages()[0];
}
catch (e) {
	println("Error: " + e);
}

var photoY = (height - photoImg.height) / 2;
var photoDir = 1;
var photoSpeed = 3;
var photoMoving = false;

var draw = function() {
	background(0xffeeeeec);
	image(photoImg, 0, photoY);
	image(logoImg, width - logoImg.width, 0);

	if (usePointer && mouseY >= photoY && mouseY <= photoY + photoImg.height) {
		noFill();
		stroke(0xffef2929);
		strokeWeight(2);
		rect(1, photoY + 1, width - 2, photoImg.height - 2);
	}
	if (photoMoving) {
		photoY += photoSpeed * photoDir;
		if (photoY > height - photoImg.height) {
			photoY = height - photoImg.height;
			photoDir = -1;
		}
		if (photoY < 0) {
			photoY = 0;
			photoDir = 1;
		}
	}

	if (usePointer) { image(pointerImg, mouseX, mouseY); }
};

var mouseOut = function() {
	usePointer = false;
};

var mouseOver = function() {
	usePointer = true;
	noCursor();
};

var mousePressed = function() {
	if (mouseY >= photoY && mouseY <= photoY + photoImg.height) {
		photoMoving = !photoMoving;
	}
};
