/* Auth: Eric Lewantowicz
 * Course: CSE 5542 RT Rendering
 * Project 5
 * Description: Add 2D textures to OpenGL scene.
 * Note: Additional information and dependences available in README.txt
 * Date: 4/7/2017
 */

var gl;					// use standard OpenGL var name for function calls
var shaderProgram;		// initialized by initShaders() in webGLStart()

var tankVPB;  			// body vertex buffer
var turretVPB;			// turret vertex buffer
var barrelVPB;
var trackVPB;
var squareVPB;
var squareInvertVPB;
var shootVPB;			// tank gun explosion graphic vertex buffer
var smokeVPB;

var shootCtr = 0;		// tank shoot graphic saturating counter
var shoot = false;		// boolean activates when tank shoots
var viperCtr = 0;

var treeVPB;
var trunkVPB;

var cubeNormalBuffer;
var barrelNormalBuffer;
var poleNormalBuffer;
var trunkNormalBuffer;
var lampNormalBuffer;
var treeNormalBuffer;
var turretNormalBuffer;
var shootNormalBuffer;
var smokeNormalBuffer;
var squareNormalBuffer;
var squareInvertNormalBuffer;

var cubeTexCoordsBuffer;
var wallTexCoordsBuffer;
var buildingTexCoordsBuffer;
var poleTexCoordsBuffer;
var trunkTexCoordsBuffer;
var turretTexCoordsBuffer;
var lampTexCoordsBuffer;
var treeTexCoordsBuffer;
var barrelTexCoordsBuffer;
var shootTexCoordsBuffer;
var smokeTexCoordsBuffer;
var squareTexCoordsBuffer;
var squareTexRepeatCoordsBuffer;
var squareInvertTexCoordsBuffer;

var cubemapTexture;
var object1VertexPositionBuffer;
var object1VertexNormalBuffer;
var object1VertexTextureBuffer;
var object1VertexIndexBuffer;

var object2VertexPositionBuffer;
var object2VertexNormalBuffer;
var object2VertexTextureBuffer;
var object2VertexIndexBuffer;

var object3VertexPositionBuffer;
var object3VertexNormalBuffer;
var object3VertexTextureBuffer;
var object3VertexIndexBuffer;

	
var tankMat;			// root parent matrix for tank	
var turretMat;			// turret matrix
var shootMat;			// gun shoot graphic setup matrix
var smokeMat;
var viperMat;

var vertexArray = [];
var colorArray = [];
var normalArray = [];
var textureArray = [0.0,0.0, 1.0,0.0, 1.0,1.0, 0.0,1.0];	// region of texture image to use
var wallTextureArray =	[
		0,1, 0,0, 1,0,		0,1, 1,0, 1,1,					// top
		1,1, 0,1, 0,0,		1,1, 0,0, 1,0,					// right
		1,1, 1,0, 0,0,		1,1, 0,0, 1,0,					// bottom		
		1,0, 0,0, 0,1,		1,0, 0,1, 1,1,					// left
		0,0, 0,1, 10,1, 	0,0, 10,0, 10,1,				// back
		0,1, 10,1, 10,0,	0,1, 10,0, 0,0					// front
	];
var buildingTextureArray = [
		0,5, 0,0, 5,0,		0,5, 5,0, 5,5,					// top
		5,5, 0,5, 0,0,		5,5, 0,0, 5,0,					// right
		5,5, 5,0, 0,0,		5,5, 0,0, 5,0,					// bottom		
		5,0, 0,0, 0,5,		5,0, 0,5, 5,5,					// left
		0,0, 0,5, 5,5, 		0,0, 5,0, 5,5,					// back
		0,5, 5,5, 5,0,		0,5, 5,0, 0,0					// front
	];

var vMatrix;			// view matrix
var mMatrix;			// model matrix
var mvMatrix;			// model-view matrix
var pMatrix;			// projection matrix
var nMatrix;			// normals matrix
var viewToWorldMatrix;	// eyespace to world space matrix

var light_ambient = [0.01, 0.01, 0.01, 1];		// Ia: set ambient emission levels very low or zero
var light_diffuse = [0.8, 0.8, 0.8, 1];			// Id
var light_specular = [1, 1, 1, 1];				// Is
var light_posUniform;							// light position in WORLDSPACE
var colorOffset = [0, 0, 0, 1];
var dayOffset = [0, 0, 0];

var mat_ambient = [0, 0, 0, 1];
var mat_diffuse = [0.5, 0.5, 0.5, 1];
var mat_specular = [0.9, 0.9, 0.9, 1];			// keep constant for all draws
var mat_shine = [50];							// n exponent decay for specular lighting (R.V)^n

var panMatrix;
var rotXMatrix;
var rotYMatrix;
var rotZMatrix;

var bColorR;			// background colors (adjust with diffuse light intensity)
var bColorG;
var bColorB;
var bColorO;

var z_angle;		
var y_angle;
var x_angle;	
var x_coi;				// center of interest x-coord
var y_coi;				// center of interest y-coord
var z_coi;				// center of interest z-coord
var x_vup;
var y_vup;
var z_vup;

var x_cam;				// camera position x coord
var y_cam;				// camera position y coord
var z_cam;				// camera position z coord
var isTankCam;			// boolean toggle for first person camera
var camVec;				// camera position vector coordinate
var coiVec;				// COI vector coordinate
var zInterval;
var zDiff;

var isDaySim = false;

var useTexture = 0;
var textureArray = [];
var numImages = 19;		// texture images and cubemap images
var numWorldTextures = 13;	// textures not including six cubemap textures
var drawIsReady = 6;

var imageNames = [
	"desert.png",	// 0: desert
	"mountains.png",	// 1: mountain
	"beach.png",		// 2: beach
	"turbines.png", 	// 3: turbines
	"sky.png", 		// 4: sky
	"grass.png",		// 5: grass
	"bricks.png",	// 6: bricks
	"building1.png",	// 7: building
	"building2.png",	// 8: building
	"building3.png",	// 9: building
	"building4.png",	// 10: building
	"building5.png", // 11: building
	"building6.png", // 12: building
	"mountains2.png",// 13: mountains2 	cubemap
	"beach2.png",	// 14: beach2		cubemap
	"desert2.png",	// 15: desert2		cubemap
	"turbines2.png", // 16: turbines2	cubemap
	"sky.png", 		// 17: sky2			cubemap
	"grass2.png",	// 18: grass2		cubemap
	]		

// sound file variables
var backgroundSound;
var backgroundSoundObject;
var idleSound, moveSound, turretSound, fireSound;
var tankIdle, tankMove, tankTurret, tankFire;
var muteSounds = false;
var keyMap = new Map();
var locked = false;

function imageLoaded() {
	numImages--;
	if (numImages == 0) {	
		while (locked) {}
		locked = true;			
		loadTextures();		// bind textures only when all images completed loading
	}
}

function readyDraw() {
	drawIsReady--;
	if (drawIsReady == 0) {
		resetScreen();
	}
}

function initOBJ() {
	var request = new XMLHttpRequest();
	request.open("GET", "https://s3.us-east-2.amazonaws.com/porkchopsandwiches.club/liberty_statue.obj");
	request.setRequestHeader('Access-Control-Allow-Origin', '*');
	request.setRequestHeader('Access-Control-Allow-Methods', 'GET');	
	request.onreadystatechange = 
		function () {
			if (request.readyState == 4) {
				while (locked) {}
				locked = true;				
				console.log("state =" + request.readyState);			
				var mesh1 = new OBJ.Mesh(request.responseText);
				handleLoadedObject1(mesh1);				
			}
		}
	request.send();

	var request2 = new XMLHttpRequest();
	request2.open("GET", "https://s3.us-east-2.amazonaws.com/porkchopsandwiches.club/viper.obj");	
	request2.setRequestHeader('Access-Control-Allow-Origin', '*');
	request2.setRequestHeader('Access-Control-Allow-Methods', 'GET');
	request2.onreadystatechange = 
		function () {
			if (request2.readyState == 4) {
				while (locked) {}
				locked = true;
				console.log("state =" + request2.readyState);			
				var mesh2 = new OBJ.Mesh(request2.responseText);
				handleLoadedObject2(mesh2);

			}
		}
	request2.send();

	var request3 = new XMLHttpRequest();
	request3.open("GET", "https://s3.us-east-2.amazonaws.com/porkchopsandwiches.club/alliance_statue.obj");	
	request3.setRequestHeader('Access-Control-Allow-Origin', '*');
	request3.setRequestHeader('Access-Control-Allow-Methods', 'GET');
	request3.onreadystatechange = 
		function () {
			if (request3.readyState == 4) {
				while (locked) {}
				locked = true;				
				console.log("state =" + request3.readyState);			
				var mesh3 = new OBJ.Mesh(request3.responseText);
				handleLoadedObject3(mesh3);

			}
		}
	request3.send();		
}

function initTextures() {
	cubemapTexture = gl.createTexture();
	for (i = 0; i < imageNames.length; i++) {
		textureArray[i] = gl.createTexture();					
		textureArray[i].image = new Image();
		textureArray[i].image.crossOrigin = "anonymous";
		textureArray[i].image.onload = function() { imageLoaded(); }
		textureArray[i].image.src = imageNames[i];
	}
}

function handleLoadedObject1(mesh) {
	console.log("handleLoadedObject1 called...");

	object1VertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, object1VertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
	object1VertexPositionBuffer.itemSize = 3;
	object1VertexPositionBuffer.numItems = mesh.vertices.length / 3;

	object1VertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, object1VertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);
	object1VertexNormalBuffer.itemSize = 3;
	object1VertexNormalBuffer.numItems = mesh.vertexNormals.length / 3;	

	object1VertexTextureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, object1VertexTextureBuffer);	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.textures), gl.STATIC_DRAW);
	object1VertexTextureBuffer.itemSize = 2;
	object1VertexTextureBuffer.numItems = mesh.textures.length / 2;

	object1VertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object1VertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
	object1VertexIndexBuffer.itemSize = 1;
	object1VertexIndexBuffer.numItems = mesh.indices.length;

	locked = false;
	readyDraw();
}

function handleLoadedObject2(mesh) {
	console.log("handleLoadedObject2 called...");

	object2VertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, object2VertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
	object2VertexPositionBuffer.itemSize = 3;
	object2VertexPositionBuffer.numItems = mesh.vertices.length / 3;

	object2VertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, object2VertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);
	object2VertexNormalBuffer.itemSize = 3;
	object2VertexNormalBuffer.numItems = mesh.vertexNormals.length / 3;	

	object2VertexTextureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, object2VertexTextureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.textures), gl.STATIC_DRAW);
	object2VertexTextureBuffer.itemSize = 2;
	object2VertexTextureBuffer.numItems = mesh.textures.length / 2;	

	object2VertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object2VertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
	object2VertexIndexBuffer.itemSize = 1;
	object2VertexIndexBuffer.numItems = mesh.indices.length;		

	locked = false;
	readyDraw();
}

function handleLoadedObject3(mesh) {
	console.log("handleLoadedObject3 called...");

	object3VertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, object3VertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
	object3VertexPositionBuffer.itemSize = 3;
	object3VertexPositionBuffer.numItems = mesh.vertices.length / 3;

	object3VertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, object3VertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);
	object3VertexNormalBuffer.itemSize = 3;
	object3VertexNormalBuffer.numItems = mesh.vertexNormals.length / 3;	

	object3VertexTextureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, object3VertexTextureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.textures), gl.STATIC_DRAW);
	object3VertexTextureBuffer.itemSize = 2;
	object3VertexTextureBuffer.numItems = mesh.textures.length / 2;	

	object3VertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object3VertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
	object3VertexIndexBuffer.itemSize = 1;
	object3VertexIndexBuffer.numItems = mesh.indices.length;		

	locked = false;
	readyDraw();
}



function loadTextures() {			// called only after all images loaded
	for (i = 0;  i < numWorldTextures; i++) {
		if (i == 5 || i == 6) {		// grass and brick textures repeated (don't need this?...repeat is default)
			gl.bindTexture(gl.TEXTURE_2D, textureArray[i]);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureArray[i].image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);	
 			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);          
			gl.bindTexture(gl.TEXTURE_2D, null);
		} else {
			gl.bindTexture(gl.TEXTURE_2D, textureArray[i]);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureArray[i].image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);	        
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}
	var j = 0;
    	gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
    	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT); 
    	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
    	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.REPEAT);
    	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR); 	
	for (i = 0; i < 6; i++) {
		j = i + 13;		// image array index offset to cubemap images
    	//gl.bindTexture(gl.TEXTURE_CUBE_MAP, textureArray[j]);
    	switch(i) {
    		case 0:
    			gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureArray[j].image);    			
    			break;
    		case 1:
    			gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureArray[j].image);
    			break;
    		case 2:
    			gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureArray[j].image);
    			break;
    		case 3:
    			gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureArray[j].image);
    			break;
    		case 4:
    			gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureArray[j].image);
    			break;
    		case 5:
    			gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureArray[j].image); 
    			break;
    		default:
    			break;
    	}
	}	
	locked = false;
	readyDraw();
}

function webGLStart() {
	var canvas = document.getElementById("project-canvas");
	resize(canvas);							// check browser canvas dimensions and resize if necessary
	initializeGL(canvas);					// call function below to set viewport dimensions
	initShaders();							// initialize shader program; function in shaders_setup.js
	gl.enable(gl.DEPTH_TEST);
	
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.vertexTexCoordsAttribute = gl.getAttribLocation(shaderProgram, "aVertexTexCoords");
    gl.enableVertexAttribArray(shaderProgram.vertexTexCoordsAttribute);

    shaderProgram.textureUniform = gl.getUniformLocation(shaderProgram, "objectTexture");
    shaderProgram.useTextureUniform = gl.getUniformLocation(shaderProgram, "useTexture");
    shaderProgram.cube_map_textureUniform = gl.getUniformLocation(shaderProgram, "cubeMap");

	shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");	// model matrix	
	shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");	// view matrix	
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");	// model view matrix
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");	// projection matrix
	shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");	// normals matrix	
	shaderProgram.v2wMatrixUniform = gl.getUniformLocation(shaderProgram, "uV2WMatrix"); // eyespace to world space matrix

	shaderProgram.light_posUniform = gl.getUniformLocation(shaderProgram, "light_pos");				// light position
	shaderProgram.light_ambientUniform = gl.getUniformLocation(shaderProgram, "light_ambient");		// ambient light
	shaderProgram.light_diffuseUniform = gl.getUniformLocation(shaderProgram, "light_diffuse"); 	// diffuse light
	shaderProgram.light_specularUniform = gl.getUniformLocation(shaderProgram, "light_specular"); 	// specular light
    shaderProgram.ambient_coefUniform = gl.getUniformLocation(shaderProgram, "ambient_coef");	
    shaderProgram.diffuse_coefUniform = gl.getUniformLocation(shaderProgram, "diffuse_coef");
    shaderProgram.specular_coefUniform = gl.getUniformLocation(shaderProgram, "specular_coef");
    shaderProgram.shininess_coefUniform = gl.getUniformLocation(shaderProgram, "mat_shininess");	
    shaderProgram.colorOffset = gl.getUniformLocation(shaderProgram, "colorOffset");

	initializeBuffers();					// initialize buffer function below
	initTextures();
	initOBJ();
	// set up event listeners for keyboard input
	// parameters: event type, event handler function, useCapture boolean to specify execution in catpure or bubbling phase
	document.addEventListener('keydown', handleKeyPress, false);
	document.addEventListener('keyup', handleKeyUp, false);
	document.addEventListener('mousedown', handleMouseDown, false);
	document.getElementById("tankCam").addEventListener("click", tankCamera);
	document.getElementById("camZCW").addEventListener("mousedown", handleCameraZCW);	
	document.getElementById("camZCCW").addEventListener("mousedown", handleCameraZCCW);		
	document.getElementById("daySim").addEventListener("click", handleDaySimulation);	
	document.getElementById("reset").addEventListener("click", resetScreen);
	document.getElementById("muteBack").addEventListener("click", toggleBackgroundSound);

	// initial multiplication matrix set up
	vMatrix = mat4.create();
	mMatrix = mat4.create();
	mvMatrix = mat4.create();
	pMatrix = mat4.create();
	nMatrix = mat4.create();
	viewToWorldMatrix = mat4.create();

	panMatrix = mat4.create();
	rotXMatrix = mat4.create();
	rotYMatrix = mat4.create();
	rotZMatrix = mat4.create();
	tankMat = mat4.create();
	turretMat = mat4.create();
    shootMat = mat4.create();	   
    smokeMat = mat4.create(); 
    viperMat = mat4.create();
	console.log("Ignore the XMLHttpRequest console load error. It is related to the audio file:")
	// initialize background music
	idleSound = new Howl({											// background idle sound loops
		src: ['idle2.wav'],
		loop: true,
		volume: 0.3
	});
	//tankIdle = idleSound.play();
	moveSound = new Howl({
		src: ['engine2.wav'],
		volume: 1.0
	});
	tankMove = moveSound.play();									// initialize sound id's
	moveSound.stop(tankMove);
	fireSound = new Howl ({
		src: ['fire1.wav']
	});
	turretSound = new Howl({
		src: ['turret.wav'],
		volume: 1.0
	});
	tankTurret = turretSound.play();
	turretSound.stop(tankTurret);
	backgroundSound = new Howl({											// background music loops
		src: ['RunningWaters.mp3'],
		loop: true,
		volume: 0.4
	});
	backgroundSoundObject = backgroundSound.play();
	readyDraw();
}

function resetScreen() {
	resize(gl.canvas);							// check browser canvas dimensions and resize if necessary
	bColorR = 0.4;
	bColorG = 0.5;
	bColorB = 0.3;
	bColorO = 1.0;
	gl.clearColor(bColorR, bColorG, bColorB, bColorO);			// set background color
	x_angle = -15.0;
	y_angle = 0.0;
	z_angle = 0.0;	
	x_coi = 0.0;
	y_coi = 0.0;
	z_coi = 0.0;		
	x_cam = 0.0;
	y_cam = 0.0;
	z_cam = 50.0;
	x_vup = 0.0;
	y_vup = 1.0;
	z_vup = 0.0;	
	isTankCam = false;
	isCamZCW = false;
	isCamZCCW = false;
	isDaySim = false;
	shoot = false;
	viperCtr = 0;
	mat4.identity(tankMat);	
	mat4.identity(turretMat);	
	mat4.identity(shootMat);
	mat4.identity(smokeMat);
	mat4.identity(viperMat);
	mat4.translate(viperMat,[80, 0, 0]);
	isDaySim = false;
	light_ambient = [0.15, 0.15, 0.15, 1];
	light_diffuse = [0.8, 0.8, 0.8, 1];
	light_specular = [1, 1, 1, 1];
	light_pos = [0, 0, 20, 1];
	colorOffset = [0, 0, 0, 1];
	dayOffset = [0, 0, 0];
	mat_ambient = [0.05, 0.05, 0.05, 1];
	mat_diffuse = [0.5, 0.5, 0.5, 1];
	mat_specular = [0.9, 0.9, 0.9, 1];
	mat_shine = [50];
    console.log("x_angle: " + x_angle + "  y_angle: " + y_angle + "  z_angle:" + z_angle);  
    console.log("x_coi: " + x_coi + "  y_coi: " + y_coi + "  z_coi:" + z_coi);    
    console.log("x_cam: " + x_cam + "  y_cam: " + y_cam + "  z_cam: " + z_cam);  
	console.log("Light position: " + light_pos);	      	
	drawScene();
}

function initializeBuffers() {

	squareVPB = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVPB);
	setSquare();
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
	squareVPB.itemSize = 3;
	squareVPB.numItems = 6;	

	squareNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArray), gl.STATIC_DRAW);
	squareNormalBuffer.itemSize = 3;
	squareNormalBuffer.numItems = 6;

	squareTexCoordsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareTexCoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureArray), gl.STATIC_DRAW);
	squareTexCoordsBuffer.itemSize = 2;
	squareTexCoordsBuffer.numItems = 6;		

	squareInvertVPB = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareInvertVPB);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0,0, 1,0,0, 1,1,0, 0,0,0,   1,1,0, 0,1,0]), gl.STATIC_DRAW);
	squareInvertVPB.itemSize = 3;
	squareInvertVPB.numItems = 6;	

	squareInvertNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareInvertNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0,-1, 0,0,-1, 0,0,-1,    0,0,-1, 0,0,-1, 0,0,-1]), gl.STATIC_DRAW);
	squareInvertNormalBuffer.itemSize = 3;
	squareInvertNormalBuffer.numItems = 6;

	squareInvertTexCoordsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareInvertTexCoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 1,0, 1,1,  	0,0, 1,1, 0,1]), gl.STATIC_DRAW);
	squareInvertTexCoordsBuffer.itemSize = 2;
	squareInvertTexCoordsBuffer.numItems = 6;	

	squareTexRepeatCoordsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareTexRepeatCoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 50,0, 50,50,  	0,0, 50,50, 0,50]), gl.STATIC_DRAW);
	squareTexRepeatCoordsBuffer.itemSize = 2;
	squareTexRepeatCoordsBuffer.numItems = 6;		

	tankVPB = gl.createBuffer();											// set up vertex position buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, tankVPB);								// ARRAY_BUFFER: vertex attributes (coordinates)
	// cube params: (size, r, g, b, colorMix)
	setCube(1.0, 0.36, 0.50, 0.30, false);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
	tankVPB.itemSize = 3;													// 3 coords per vertex
	tankVPB.numItems = 36;													// 8 total coordinates used in cube

	cubeNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArray), gl.STATIC_DRAW);
	cubeNormalBuffer.itemSize = 3;
	cubeNormalBuffer.numItems = 36;

	cubeTexCoordsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexCoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wallTextureArray), gl.STATIC_DRAW);
	cubeTexCoordsBuffer.itemSize = 2;
	cubeTexCoordsBuffer.numItems = 36;	

	wallTexCoordsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, wallTexCoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wallTextureArray), gl.STATIC_DRAW);
	wallTexCoordsBuffer.itemSize = 2;
	wallTexCoordsBuffer.numItems = 36;	

	buildingTexCoordsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buildingTexCoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buildingTextureArray), gl.STATIC_DRAW);
	buildingTexCoordsBuffer.itemSize = 2;
	buildingTexCoordsBuffer.numItems = 36;			

	trackVPB = gl.createBuffer();											// set up vertex position buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, trackVPB);								// ARRAY_BUFFER: vertex attributes (coordinates)
	// cube params: (size, r, g, b, colorMix)
	setCube(1.0, 0.40, 0.40, 0.40, false);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
	trackVPB.itemSize = 3;													// 3 coords per vertex
	trackVPB.numItems = 36;													// 8 total coordinates used in cube
			
	turretVPB = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, turretVPB);
	// sphere params: (radius, number slices, number stacks, r, g, b, colorMix)	
	setSphere(0.5, 100, 10, 0.36, 0.50, 0.30, false);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
	turretVPB.itemSize = 3;
	turretVPB.numItems = 6 * 100 * 10;

	turretNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, turretNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArray), gl.STATIC_DRAW);
	turretNormalBuffer.itemSize = 3;
	turretNormalBuffer.numItems = 6 * 100 * 10;		

	turretTexCoordsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, turretTexCoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureArray), gl.STATIC_DRAW);
	turretTexCoordsBuffer.itemSize = 2;
	turretTexCoordsBuffer.numItems = 6 * 100 * 10;	

	barrelVPB = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, barrelVPB);
	// cylinder params: (base radius, top radius, height, number slices, number stacks, r, g, b, colorMix)
	setCylinder(0.1, 0.1, 1.2, 100, 10, 0.36, 0.50, 0.30, false);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
	barrelVPB.itemSize = 3;
	barrelVPB.numItems = 6 * 100 * 10 + 2 * 3 * 100;

	barrelNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, barrelNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArray), gl.STATIC_DRAW);
	barrelNormalBuffer.itemSize = 3;
	barrelNormalBuffer.numItems = 6 * 100 * 10 + 2 * 3 * 100;

	barrelTexCoordsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, barrelTexCoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureArray), gl.STATIC_DRAW);
	barrelTexCoordsBuffer.itemSize = 2;
	barrelTexCoordsBuffer.numItems = 6 * 100 * 10 + 2 * 3 * 100;	

	shootVPB = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, shootVPB);
	// cylinder params: (base radius, top radius, height, number slices, number stacks, r, g, b, colorMix)	
	setCylinder(0.01, 0.2, 2, 100, 10, 0.69, 0.42, 0.35, false);		
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
	shootVPB.itemSize = 3;
	shootVPB.numItems = 6 * 100 * 10 + 2 * 3 * 100;

	shootNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, shootNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArray), gl.STATIC_DRAW);
	shootNormalBuffer.itemSize = 3;
	shootNormalBuffer.numItems = 6 * 100 * 10 + 2 * 3 * 100;

	shootTexCoordsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, shootTexCoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureArray), gl.STATIC_DRAW);
	shootTexCoordsBuffer.itemSize = 2;
	shootTexCoordsBuffer.numItems = 6 * 100 * 10 + 2 * 3 * 100;

	smokeVPB = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, smokeVPB);
	// sphere params: (radius, number slices, number stacks, r, g, b, colorMix)
	setSmokeSpheres(0.2, 100, 50, 0.10, 0.76, 0.09, false);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
	smokeVPB.itemSize = 3;
	smokeVPB.numItems = 2 * 6 * 100 * 50;

	smokeNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, smokeNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArray), gl.STATIC_DRAW);
	smokeNormalBuffer.itemSize = 3;
	smokeNormalBuffer.numItems = 2 * 6 * 100 * 50;	

	smokeTexCoordsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, smokeTexCoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureArray), gl.STATIC_DRAW);
	smokeTexCoordsBuffer.itemSize = 2;
	smokeTexCoordsBuffer.numItems = 2 * 6 * 100 * 50;	

	trunkVPB = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, trunkVPB);
	// cylinder params: (base radius, top radius, height, number slices, number stacks, r, g, b, colorMix)
	setCylinder(0.2, 0.1, 2, 100, 10, 0.69, 0.42, 0.35, false);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
	trunkVPB.itemSize = 3;
	trunkVPB.numItems = 6 * 100 * 10 + 2 * 3 * 100;

	trunkNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, trunkNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArray), gl.STATIC_DRAW);
	trunkNormalBuffer.itemSize = 3;
	trunkNormalBuffer.numItems = 6 * 100 * 10 + 2 * 3 * 100;

	trunkTexCoordsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, trunkTexCoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureArray), gl.STATIC_DRAW);
	trunkTexCoordsBuffer.itemSize = 2;
	trunkTexCoordsBuffer.numItems = 6 * 100 * 10 + 2 * 3 * 100;		

	treeVPB = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, treeVPB);
	// sphere params: (radius, number slices, number stacks, r, g, b, colorMix)
	setSphere(1.0, 100, 50, 0.10, 0.76, 0.09, false);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
	treeVPB.itemSize = 3;
	treeVPB.numItems = 6 * 100 * 50;

	treeNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, treeNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArray), gl.STATIC_DRAW);
	treeNormalBuffer.itemSize = 3;
	treeNormalBuffer.numItems = 6 * 100 * 50;	

	treeTexCoordsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, treeTexCoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureArray), gl.STATIC_DRAW);
	treeTexCoordsBuffer.itemSize = 2;
	treeTexCoordsBuffer.numItems = 6 * 100 * 50;		

	readyDraw();
}

function initializeGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
 		gl.viewportWidth = canvas.width;
 		gl.viewportHeight = canvas.height;
 		console.log("canvas width: " + canvas.width);
 		console.log("canvas height: " + canvas.height);
 		console.log("viewport width: " + gl.viewportWidth);
 		console.log("viewport height: " + gl.viewportHeight);
 	} catch (e) {
 	}
 	if (!gl) {
 		alert("Error initializing WebGL in initializeGL function.");
 	}
}

function drawScene() {
	resize(gl.canvas);	// adjust canvas width/height if browser changed
	gl.viewportWidth = gl.canvas.width;	// update viewport width/height if canvas changed
	gl.viewportHeight = gl.canvas.height;
	// (Imin x origin, Jmin y origin, width pixels, height pixels); viewport is in screen coord system in pixels
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.clearColor(bColorR, bColorG, bColorB, bColorO);			// set background color    
    // perspective matrix params: (FOV, aspect ratio, near plane distance, far plane distance)
    mat4.perspective(60, 1.0, 0.1, 400.0, pMatrix);	
    if (isTankCam) {
    	camVec = [0, 0, 1.5, 1];
    	coiVec = [0, 10, 0.5, 1];
    	mat4.multiplyVec4(tankMat, camVec, camVec);    	
    	mat4.multiplyVec4(tankMat, coiVec, coiVec);	
    	x_cam = camVec[0];
    	y_cam = camVec[1];
    	z_cam = camVec[2];
    	x_coi = coiVec[0];
    	y_coi = coiVec[1];
    	z_coi = coiVec[2];
    	x_angle = 0;
    	y_angle = 0;
    	z_angle = 0;
    	x_vup = 0.0;
    	y_vup = 0.0;
    	z_vup = 1.0;
    }
    // view matrix params: (camera position, COI, view_up vector, updates: vMatrix)    
    mat4.lookAt([x_cam, y_cam, z_cam], [x_coi, y_coi, z_coi], [x_vup, y_vup, z_vup], vMatrix);
    var invVMatrix = mat4.create;
    mat4.inverse(vMatrix, invVMatrix);
    // pan camera around z-axis
    mat4.identity(panMatrix);
    mat4.rotate(panMatrix, degToRad(z_angle), [0, 0, 1]);
 	mat4.identity(rotXMatrix);
    mat4.rotate(rotXMatrix, degToRad(x_angle), [1, 0, 0]); 	
    mat4.identity(rotYMatrix);
    mat4.rotate(rotYMatrix, degToRad(y_angle), [0, 1, 0]);
    vMatrix = mat4.multiply(vMatrix, panMatrix);   
    vMatrix = mat4.multiply(vMatrix, rotXMatrix);
    vMatrix = mat4.multiply(vMatrix, rotYMatrix);   

    var xTrans = 0;
    var yTrans = 0;
    var zTrans = 0;

    mat4.identity(mMatrix);
    mat4.multiply(mMatrix, tankMat, mMatrix);    
    mat4.scale(mMatrix, [1.2, 2.0, 0.5], mMatrix);    
    mat4.translate(mMatrix, [0.0, 0.0, 0.8]);    
    mat4.multiply(vMatrix, mMatrix, mvMatrix);    	
	mat4.identity(nMatrix);
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);    
    drawTank();

    // scenery backdrops with textures
    mat4.identity(mMatrix);							// desert front
    mat4.translate(mMatrix, [-75, 70, 100]);        
    mat4.rotate(mMatrix, degToRad(-90), [1, 0, 0]);    
    mat4.scale(mMatrix, [150, 100, 1]);   
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
   	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);      
    drawSquareInvert(0);

    mat4.identity(mMatrix);							// mountains right
    mat4.translate(mMatrix, [75, -50, 100]);      
    mat4.rotate(mMatrix, degToRad(-90), [0, 1, 0]);
    mat4.rotate(mMatrix, degToRad(90), [0, 0, 1]);       
    mat4.scale(mMatrix, [150, 100, 1]);   
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
   	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);      
    drawSquare(1);

    mat4.identity(mMatrix);							// beach left
    mat4.translate(mMatrix, [-75, -50, 100]);      
    mat4.rotate(mMatrix, degToRad(-90), [0, 1, 0]);
    mat4.rotate(mMatrix, degToRad(90), [0, 0, 1]);        
    mat4.scale(mMatrix, [150, 100, 1]);   
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
   	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);      
    drawSquareInvert(2);    

    mat4.identity(mMatrix);							// grass
    mat4.translate(mMatrix, [-75, -75, 0]);      
    //mat4.rotate(mMatrix, degToRad(-90), [0, 1, 0]);
    //mat4.rotate(mMatrix, degToRad(90), [0, 0, 1]);        
    mat4.scale(mMatrix, [150, 150, 1]);   
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
   	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);      
    drawSquare(3);      

    mat4.identity(mMatrix);							// sky
    mat4.translate(mMatrix, [-75, -75, 100]);            
    mat4.scale(mMatrix, [150, 150, 1]);   
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
   	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);      
    drawSquareInvert(4);      

    mat4.identity(mMatrix);
    mat4.multiply(mMatrix, tankMat, mMatrix);  
    mat4.scale(mMatrix, [0.4, 2.2, 0.8]);
    mat4.translate(mMatrix, [-2.0, 0.0, 0.6]);
    mat4.multiply(vMatrix, mMatrix, mvMatrix);    	// mvMatrix = vMatrix * mMatrix  
	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);         
    drawTrack();

    mat4.identity(mMatrix);
    mat4.multiply(mMatrix, tankMat, mMatrix);       
    mat4.scale(mMatrix, [0.4, 2.2, 0.8]);
    mat4.translate(mMatrix, [2.0, 0.0, 0.6]);
    mat4.multiply(vMatrix, mMatrix, mvMatrix);    // mvMatrix = vMatrix * mMatrix  
	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);         
    drawTrack();    

    mat4.identity(mMatrix);
    mat4.multiply(mMatrix, tankMat, mMatrix); 
    mat4.multiply(mMatrix, turretMat, mMatrix);
    mat4.translate(mMatrix, [0.0, 0.0, 0.9]);
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
	mat4.identity(nMatrix);        
	nMatrix = mat4.multiply(nMatrix, vMatrix);  
	nMatrix = mat4.multiply(nMatrix, mMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);  
    drawTurret();

    mat4.identity(mMatrix);
    mat4.multiply(mMatrix, tankMat, mMatrix);  
    mat4.multiply(mMatrix, turretMat, mMatrix);         
    mat4.rotate(mMatrix, degToRad(-90), [1, 0, 0]);
    mat4.translate(mMatrix, [0.0, -1.0, 0.48]);
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);       
    drawBarrel();

    // statue liberty object
    mat4.identity(mMatrix);
    mat4.translate(mMatrix, [20.0, 0.0, 0.0]);     
    mat4.scale(mMatrix, [10, 10, 10]);
    mat4.rotate(mMatrix, degToRad(90), [1, 0, 0]);  
    mat4.multiply(vMatrix, mMatrix, mvMatrix);    
	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);  
	mat4.identity(viewToWorldMatrix);
	mat4.multiply(viewToWorldMatrix, vMatrix, viewToWorldMatrix);
	//viewToWorldMatrix = mat4.inverse(viewToWorldMatrix);			// TODO: inverse not used in instructor code
	viewToWorldMatrix = mat4.transpose(viewToWorldMatrix);	    
	drawObject1();

    // viper ship object
    viperCtr++;
    if (viperCtr > 400) {
    	viperCtr = 0;
 		mat4.identity(viperMat);
		mat4.translate(viperMat,[80, 0, 0]);   	
    }
 	mat4.translate(viperMat,[-.6, 0, 0]);    
    mat4.identity(mMatrix);
    //mat4.scale(mMatrix, [.3, .3, .3]);
    mat4.rotate(mMatrix, degToRad(90), [1, 0, 0]);    
    mat4.rotate(mMatrix, degToRad(-10), [0, 0, 1]);     
    mat4.translate(mMatrix, [-10.0, 18.0, 0.0]);  
    mat4.multiply(mMatrix, viperMat, mMatrix);  
    mat4.multiply(vMatrix, mMatrix, mvMatrix);    
	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);  
	mat4.identity(viewToWorldMatrix);
	mat4.multiply(viewToWorldMatrix, vMatrix, viewToWorldMatrix);
	//viewToWorldMatrix = mat4.inverse(viewToWorldMatrix);			// TODO: inverse not used in instructor code
	viewToWorldMatrix = mat4.transpose(viewToWorldMatrix);	    
	drawObject2();	

    // alliance statue object
    mat4.identity(mMatrix);
    mat4.translate(mMatrix, [-17.0, 0.0, 0.0]);      
    mat4.scale(mMatrix, [.01, .01, .01]);
    mat4.rotate(mMatrix, degToRad(90), [1, 0, 0]);    
    mat4.rotate(mMatrix, degToRad(180), [0, 1, 0]);     
    mat4.multiply(vMatrix, mMatrix, mvMatrix);    
	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);  
	mat4.identity(viewToWorldMatrix);
	mat4.multiply(viewToWorldMatrix, vMatrix, viewToWorldMatrix);
	//viewToWorldMatrix = mat4.inverse(viewToWorldMatrix);			// TODO: inverse not used in instructor code
	viewToWorldMatrix = mat4.transpose(viewToWorldMatrix);	    
	drawObject3();		


    if (shoot) {
    	mat4.identity(mMatrix);
    	mat4.multiply(mMatrix, tankMat, mMatrix);
    	mat4.multiply(mMatrix, turretMat, mMatrix);   
    	mat4.rotate(mMatrix, degToRad(-90), [1, 0, 0]);
    	mat4.translate(mMatrix, [0.0, -1.0, 2.0]); 
    	mat4.multiply(mMatrix, shootMat, mMatrix);
   	
    	mat4.multiply(vMatrix, mMatrix, mvMatrix); 
		mat4.identity(nMatrix);    
		nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
		nMatrix = mat4.multiply(nMatrix, mMatrix);
		nMatrix = mat4.inverse(nMatrix);
		nMatrix = mat4.transpose(nMatrix);      	   	
    	drawShoot();

    	mat4.identity(mMatrix);
    	mat4.multiply(mMatrix, tankMat, mMatrix);
    	mat4.multiply(mMatrix, turretMat, mMatrix);   
    	mat4.rotate(mMatrix, degToRad(-90), [1, 0, 0]);
    	mat4.translate(mMatrix, [0.0, -1.0, 2.0]); 
    	mat4.multiply(mMatrix, smokeMat, mMatrix);
   	
    	mat4.multiply(vMatrix, mMatrix, mvMatrix); 
		mat4.identity(nMatrix);    
		nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
		nMatrix = mat4.multiply(nMatrix, mMatrix);
		nMatrix = mat4.inverse(nMatrix);
		nMatrix = mat4.transpose(nMatrix);      
    	drawSmoke();
    	updateShoot();
    }

    // draw "sun" light source
    mat4.identity(mMatrix);
    mat4.translate(mMatrix, [light_pos[0], light_pos[1], light_pos[2]+5]);
    mat4.scale(mMatrix, [1.6, 1.6, 1.6]);  
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
    mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);      
	drawSun();

    for (i = 0; i < 2; i++) {
    	xTrans = i == 0 ? -3 : 3
    	yTrans = i == 0 ? -36 : -34    	
    	for (j = 0; j < 13; j++) {
    		mat4.identity(mMatrix);     
    		mat4.translate(mMatrix, [xTrans, yTrans, 0.0]);
    		mat4.multiply(vMatrix, mMatrix, mvMatrix);
			mat4.identity(nMatrix);    
			nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
			nMatrix = mat4.multiply(nMatrix, mMatrix);
			nMatrix = mat4.inverse(nMatrix);
			nMatrix = mat4.transpose(nMatrix);       		
    		drawTrunk();
    		mat4.identity(mMatrix);      
    		mat4.translate(mMatrix, [xTrans, yTrans, 3.0]);
    		mat4.multiply(vMatrix, mMatrix, mvMatrix);
    		mat4.identity(nMatrix);    
			nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
			nMatrix = mat4.multiply(nMatrix, mMatrix);
			nMatrix = mat4.inverse(nMatrix);
			nMatrix = mat4.transpose(nMatrix); 
    		drawTree();
    		if (j == 2 || j == 9) {
    			yTrans += 5;
    		}
    		yTrans += 5;
    	}
	}  
	for (i = 0; i < 2; i++) {
    	xTrans = i == 0 ? -2.3 : 2.3;
    	yTrans = i == 0 ? -38 : -36;    	
    	for (j = 0; j < 8; j++) {
    		mat4.identity(mMatrix);     
    		mat4.translate(mMatrix, [xTrans, yTrans, 0.0]);
    		mat4.scale(mMatrix, [0.6, 0.6, 1.0]);     		
    		mat4.multiply(vMatrix, mMatrix, mvMatrix);
    		mat4.identity(nMatrix);    
			nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
			nMatrix = mat4.multiply(nMatrix, mMatrix);
			nMatrix = mat4.inverse(nMatrix);
			nMatrix = mat4.transpose(nMatrix); 		
    		drawPole();
    		mat4.identity(mMatrix);      
    		mat4.translate(mMatrix, [xTrans, yTrans, 1.5]);
    		mat4.scale(mMatrix, [0.3, 0.3, 0.3]);    		
    		mat4.multiply(vMatrix, mMatrix, mvMatrix);
    		mat4.identity(nMatrix);    
			nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
			nMatrix = mat4.multiply(nMatrix, mMatrix);
			nMatrix = mat4.inverse(nMatrix);
			nMatrix = mat4.transpose(nMatrix); 		
    		drawLamp();
    		if (j == 1 && i == 0) {
    			yTrans += 1;
    		}
    		yTrans += 10;
    	}
	}  
	for (i = 0; i < 2; i++) {
    	xTrans = -28;
    	yTrans = i == 0 ? -26 : 14;
    	var zScale = 1;
    	var buildingNum = 1;
		for (j = 1; j <= 4; j++) {
			switch (j) {
				case 1:
					if (i == 0) {
						buildingNum = 1;
						zScale = 8;
					} else {
						buildingNum = 3;	
						zScale = 4;
					}
					break;
				case 2:
					if (i == 0) {
						buildingNum = 2;
						zScale = 12;
					} else {
						buildingNum = 4;	
						zScale = 16;
					}					
					break;
				case 3:
					if (i == 0) {
						buildingNum = 3;
						zScale = 10;
					} else {
						buildingNum = 1;	
						zScale = 20;
					}					
					break;
				case 4:
					if (i == 0) {
						buildingNum = 4;
						zScale = 12;
					} else {
						buildingNum = 2;	
						zScale = 8;
					}					
					break;
			}
    		mat4.identity(mMatrix);     
    		mat4.translate(mMatrix, [xTrans, yTrans, zScale/2]);
    		mat4.scale(mMatrix, [6.0, 6.0, zScale]);     		
    		mat4.multiply(vMatrix, mMatrix, mvMatrix);
    		mat4.identity(nMatrix);    
			nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
			nMatrix = mat4.multiply(nMatrix, mMatrix);
			nMatrix = mat4.inverse(nMatrix);
			nMatrix = mat4.transpose(nMatrix); 	
    		drawBuilding(i, buildingNum);
    		for (k = 1; k <= 4; k++) {					// wall
    			for (m = 1; m <= zScale/4; m++) { 		// building level
    				for (n = 0; n < 2; n++) {			// left/right side of wall
    					mat4.identity(mMatrix);     
    					switch (k) {
    						case 1: 	// front wall
    							mat4.translate(mMatrix, [xTrans-1+(2*n), yTrans-0.5, 0.0 + 3*m]);    						
    						    mat4.translate(mMatrix, [0, -2.6, 0]);
    							break;
    						case 2: 	// back wall
    							mat4.translate(mMatrix, [xTrans-1+(2*n), yTrans-0.5, 0.0 + 3*m]);    						
    						    mat4.translate(mMatrix, [0, 3.6, 0]);    						
    							break;
    						case 3: 	// left wall
    							mat4.translate(mMatrix, [xTrans-1, yTrans-1+(2*n), 0.0 + 3*m]);    						
    						    mat4.translate(mMatrix, [-2, 0, 0]);    						
    							break;
    						case 4: 	// right wall
    							mat4.translate(mMatrix, [xTrans+1, yTrans-1+(2*n), 0.0 + 3*m]);    						
    						    mat4.translate(mMatrix, [2, 0, 0]);       						
    							break;
    					}
    					if (k == 1 || k == 2) {			// forward/back wall
    						mat4.scale(mMatrix, [1.5, 0.3, 1.0]);
    					} else {						// left/right wall
    						mat4.scale(mMatrix, [0.3, 1.5, 1.0]);
    					}
    					mat4.multiply(vMatrix, mMatrix, mvMatrix);
    					mat4.identity(nMatrix);    
						nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
						nMatrix = mat4.multiply(nMatrix, mMatrix);
						nMatrix = mat4.inverse(nMatrix);
						nMatrix = mat4.transpose(nMatrix); 
						mat4.identity(viewToWorldMatrix);
						mat4.multiply(viewToWorldMatrix, vMatrix, viewToWorldMatrix);
						//viewToWorldMatrix = mat4.inverse(viewToWorldMatrix);			// TODO: inverse not used in instructor code
						viewToWorldMatrix = mat4.transpose(viewToWorldMatrix);	  
    					drawWindow();
    				}
    			}
    		}
    		xTrans += 20;
		}
	}

    mat4.identity(mMatrix);
    mat4.translate(mMatrix, [-22.0, 23.0, 1]);    
    mat4.scale(mMatrix, [34, 0.6, 2]);
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
   	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);  
    drawWall();	

	mat4.identity(mMatrix);
    mat4.translate(mMatrix, [-22.0, 23.0, 2]);    
    mat4.scale(mMatrix, [34.1, 0.8, 0.1]);
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
   	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);      
    drawWallTop();	

    mat4.identity(mMatrix);
    mat4.translate(mMatrix, [22.0, 23.0, 1]);    
    mat4.scale(mMatrix, [34, 0.6, 2]);
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
   	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);      
    drawWall();	

	mat4.identity(mMatrix);
    mat4.translate(mMatrix, [22.0, 23.0, 2]);    
    mat4.scale(mMatrix, [34.1, 0.8, 0.1]);
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
   	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);      
    drawWallTop();	    

    mat4.identity(mMatrix);
    mat4.translate(mMatrix, [-22.0, -17.0, 1]);    
    mat4.scale(mMatrix, [34, 0.6, 2]);
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
   	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);      
    drawWall();

	mat4.identity(mMatrix);
    mat4.translate(mMatrix, [-22.0, -17.0, 2]);    
    mat4.scale(mMatrix, [34.1, 0.8, 0.1]);
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
   	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);      
    drawWallTop();	    	  

    mat4.identity(mMatrix);
    mat4.translate(mMatrix, [22.0, -17.0, 1]);    
    mat4.scale(mMatrix, [34, 0.6, 2]);
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
   	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);      
    drawWall();	 

	mat4.identity(mMatrix);
    mat4.translate(mMatrix, [22.0, -17.0, 2]);    
    mat4.scale(mMatrix, [34.1, 0.8, 0.1]);
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
   	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);      
    drawWallTop();	          

    mat4.identity(mMatrix);
    mat4.scale(mMatrix, [4.0, 80, 0.1]);
    mat4.translate(mMatrix, [0.0, 0.0, 0.0]);
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
   	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);      
    drawRoad();

    mat4.identity(mMatrix);
    mat4.rotate(mMatrix, degToRad(90), [0, 0, 1]);        
    mat4.scale(mMatrix, [4.0, 80, 0.1]);
    mat4.translate(mMatrix, [5.0, 0.0, 0.0]);
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
   	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);      
    drawRoad();

    mat4.identity(mMatrix);
    mat4.rotate(mMatrix, degToRad(90), [0, 0, 1]);        
    mat4.scale(mMatrix, [4.0, 80, 0.1]);
    mat4.translate(mMatrix, [-5.0, 0.0, 0.0]);
    mat4.multiply(vMatrix, mMatrix, mvMatrix);
   	mat4.identity(nMatrix);    
	nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
	nMatrix = mat4.multiply(nMatrix, mMatrix);
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix);      
    drawRoad();    

    xTrans = 0;
    yTrans = -39;
    for (i = 0; i < 40; i++) {
    	mat4.identity(mMatrix);
    	mat4.scale(mMatrix, [0.2, 1.0, 0.1]);
    	mat4.translate(mMatrix, [0.0, yTrans, 0.1]);
    	mat4.multiply(vMatrix, mMatrix, mvMatrix);
       	mat4.identity(nMatrix);    
		nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
		nMatrix = mat4.multiply(nMatrix, mMatrix);
		nMatrix = mat4.inverse(nMatrix);
		nMatrix = mat4.transpose(nMatrix);  	
    	drawStripe();
    	yTrans += 2;
    }
    yTrans = -39;
    for (i = 0; i < 40; i++) {
    	mat4.identity(mMatrix);
    	mat4.rotate(mMatrix, degToRad(90), [0, 0, 1]);        	
    	mat4.scale(mMatrix, [0.2, 1.0, 0.1]);
    	mat4.translate(mMatrix, [100.0, yTrans, 0.1]);
    	mat4.multiply(vMatrix, mMatrix, mvMatrix);
       	mat4.identity(nMatrix);    
		nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
		nMatrix = mat4.multiply(nMatrix, mMatrix);
		nMatrix = mat4.inverse(nMatrix);
		nMatrix = mat4.transpose(nMatrix);  	
    	drawStripe();
    	yTrans += 2;
    }
    yTrans = -39;
    for (i = 0; i < 40; i++) {
    	mat4.identity(mMatrix);
    	mat4.rotate(mMatrix, degToRad(90), [0, 0, 1]);        	
    	mat4.scale(mMatrix, [0.2, 1.0, 0.1]);
    	mat4.translate(mMatrix, [-100.0, yTrans, 0.1]);
    	mat4.multiply(vMatrix, mMatrix, mvMatrix);
       	mat4.identity(nMatrix);    
		nMatrix = mat4.multiply(nMatrix, vMatrix);		// normal matrix = (modelview^-1)^T (inverse->transpose)
		nMatrix = mat4.multiply(nMatrix, mMatrix);
		nMatrix = mat4.inverse(nMatrix);
		nMatrix = mat4.transpose(nMatrix);  	
    	drawStripe();
    	yTrans += 2;
    }    
}

function updateShoot() {
	if (shoot && shootCtr < 40) {
		shootCtr++;
	  	if (shootCtr < 20) {		// grow shoot graphic
	  		shootMat = mat4.scale(shootMat, [1.06, 1.08, 1.06]);
	  		shootMat = mat4.translate(shootMat, [0.0, 0.0, 0.0]);
			smokeMat = mat4.scale(smokeMat, [1.08, 1.08, 1.06]);
			smokeMat = mat4.translate(smokeMat, [0.0, 0.0, 0.01]);	  		
	  	} else {					// shrink shoot graphic
	  		shootMat = mat4.scale(shootMat, [0.95, 0.98, 0.95]);
	  		shootMat = mat4.translate(shootMat, [0.0, 0.0, 0.0]);
			smokeMat = mat4.scale(smokeMat, [1.08, 1.08, 1.06]);
			smokeMat = mat4.translate(smokeMat, [0.0, 0.0, 0.01]);	  		
	  	}		
	} else if (shoot && shootCtr >= 40) {
		shoot = false;
		shootCtr = 0;
		mat4.identity(shootMat);		
		mat4.identity(smokeMat);
	}
}

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);	
	gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);	
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);	
	gl.uniformMatrix4fv(shaderProgram.v2wMatrixUniform, false, viewToWorldMatrix);
}

function setLightUniforms() {
	gl.uniform4f(shaderProgram.light_posUniform, light_pos[0], light_pos[1], light_pos[2], light_pos[3]); 	
	gl.uniform4f(shaderProgram.ambient_coefUniform, mat_ambient[0], mat_ambient[1], mat_ambient[2], 1.0); 
	gl.uniform4f(shaderProgram.diffuse_coefUniform, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2], 1.0); 
	gl.uniform4f(shaderProgram.specular_coefUniform, mat_specular[0], mat_specular[1], mat_specular[2],1.0); 
	gl.uniform1f(shaderProgram.shininess_coefUniform, mat_shine[0]); 
	gl.uniform4f(shaderProgram.light_ambientUniform, light_ambient[0], light_ambient[1], light_ambient[2], 1.0); 
	gl.uniform4f(shaderProgram.light_diffuseUniform, light_diffuse[0], light_diffuse[1], light_diffuse[2], 1.0); 
	gl.uniform4f(shaderProgram.light_specularUniform, light_specular[0], light_specular[1], light_specular[2],1.0);	
	gl.uniform4f(shaderProgram.colorOffset, colorOffset[0], colorOffset[1], colorOffset[2], 1.0);
}

function drawSquare(scene) {
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVPB);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, squareNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, squareNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, squareTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, squareTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);
	light_ambient = [.01, .01, .01, 1];	
	mat_ambient = [.01, .01, .01, 1.0];	
	mat_diffuse = [1, 1, 1, 1.0];
	mat_shine = [50];	
	useTexture = 1;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);							// assign active texture unit [texturei]
	if (scene == 0) {
		gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);		// desert; bind texture object to the texture unit
	} else if (scene == 1) {
		gl.bindTexture(gl.TEXTURE_2D, textureArray[1]);		// mountain
	} else if (scene == 2) {
		gl.bindTexture(gl.TEXTURE_2D, textureArray[2]);		// beach
	} else if (scene == 3) {
		gl.bindTexture(gl.TEXTURE_2D, textureArray[5]);		// grass
		gl.bindBuffer(gl.ARRAY_BUFFER, squareTexRepeatCoordsBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, squareTexRepeatCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	} else if (scene == 4) {
		gl.bindTexture(gl.TEXTURE_2D, textureArray[4]);		// sky
	}
	setMatrixUniforms();		
	setLightUniforms();	
	gl.uniform1i(shaderProgram.textureUniform, 0);			// pass the texture unit to the shader
	gl.drawArrays(gl.TRIANGLES, 0, squareVPB.numItems);
	var light_ambient = [0.01, 0.01, 0.01, 1];				// reset ambient light emission levels
	useTexture = 0;	
}

function drawSquareInvert(scene) {
	gl.bindBuffer(gl.ARRAY_BUFFER, squareInvertVPB);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareInvertVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, squareInvertNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, squareInvertNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	gl.bindBuffer(gl.ARRAY_BUFFER, squareInvertTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, squareInvertTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	setMatrixUniforms();		
	light_ambient = [.01, .01, .01, 1];	
	mat_ambient = [.01, .01, .01, 1.0];			
	mat_diffuse = [1, 1, 1, 1.0];
	mat_shine = [50];	
	useTexture = 1;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);							// assign active texture unit [texturei]
	if (scene == 0) {
		gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);		// bind texture object to the texture unit
	} else if (scene == 1) {
		gl.bindTexture(gl.TEXTURE_2D, textureArray[1]);		// mountain	
	} else if (scene == 2) {
		gl.bindTexture(gl.TEXTURE_2D, textureArray[2]);		// beach	
	} else if (scene == 3) {
		gl.bindTexture(gl.TEXTURE_2D, textureArray[5]);		// grass
	} else if (scene == 4) {
		gl.bindTexture(gl.TEXTURE_2D, textureArray[4]);		// sky
	}
	setLightUniforms();	
	gl.uniform1i(shaderProgram.textureUniform, 0);			// pass the texture unit to the shader
	gl.drawArrays(gl.TRIANGLES, 0, squareInvertVPB.numItems);
	var light_ambient = [0.01, 0.01, 0.01, 1];				// reset ambient light emission levels
	useTexture = 0;	
}

function drawObject1() {	// statue of liberty
	gl.bindBuffer(gl.ARRAY_BUFFER, object1VertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, object1VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, object1VertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, object1VertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, object1VertexTextureBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, object1VertexTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object1VertexIndexBuffer);
	setMatrixUniforms();
	mat_ambient = [0.1, 0.1, 0.1, 1.0];
	mat_diffuse = [1, 1, 1, 1.0];
	mat_shine = [20];
	colorOffset = [-0.3 + dayOffset[0], -0.1 + dayOffset[1], -0.3 + dayOffset[2], 1.0];
	console.log("liberty color offset: " + colorOffset);
	setLightUniforms();
	useTexture = 3;	
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE1);								// set gpu hardware texture unit 1 for cubemap texture
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
	gl.uniform1i(shaderProgram.cube_map_textureUniform, 1);		// pass texture unit to shader
	gl.drawElements(gl.TRIANGLES, object1VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	colorOffset = [0.0, 0.0, 0.0, 1.0];	
	useTexture = 0;
}

function drawObject2() {	// viper ship
	gl.bindBuffer(gl.ARRAY_BUFFER, object2VertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, object2VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, object2VertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, object2VertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, object2VertexTextureBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, object2VertexTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object2VertexIndexBuffer);	
	setMatrixUniforms();
	mat_ambient = [0.1, 0.1, 0.1, 1.0];
	mat_diffuse = [1, 1, 1, 1.0];
	mat_shine = [20];
	colorOffset = [0.0 + dayOffset[0], 0.0 + dayOffset[1], 0.0 + dayOffset[2], 1.0];	
	console.log("viper color offset: " + colorOffset);	
	setLightUniforms();
	useTexture = 3;	
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE1);								// set gpu hardware texture unit 1 for cubemap texture
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
	gl.uniform1i(shaderProgram.cube_map_textureUniform, 1);		// pass texture unit to shader
	//gl.drawArrays(gl.TRIANGLES, 0, object2VertexPositionBuffer.numItems);
	gl.drawElements(gl.TRIANGLES, object2VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);	
	useTexture = 0;	
}

function drawObject3() {	// warrior statue
	gl.bindBuffer(gl.ARRAY_BUFFER, object3VertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, object3VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, object3VertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, object3VertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, object3VertexTextureBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, object3VertexTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object3VertexIndexBuffer);	
	setMatrixUniforms();
	mat_ambient = [0.1, 0.1, 0.1, 1.0];
	mat_diffuse = [1, .1, .1, 1.0];
	mat_shine = [20];
	colorOffset = [-0.2 + dayOffset[0], -0.2 + dayOffset[1], -0.2 + dayOffset[2], 1.0];
	console.log("warrior color offset: " + colorOffset);	
	setLightUniforms();
	useTexture = 3;	
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE1);								// set gpu hardware texture unit 1 for cubemap texture
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
	gl.uniform1i(shaderProgram.cube_map_textureUniform, 1);		// pass texture unit to shader
	//gl.drawArrays(gl.TRIANGLES, 0, object2VertexPositionBuffer.numItems);
	gl.drawElements(gl.TRIANGLES, object3VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);	
	useTexture = 0;	
	colorOffset = [0.0, 0.0, 0.0, 1.0];	
}

function drawTank() {
	gl.bindBuffer(gl.ARRAY_BUFFER, tankVPB);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, tankVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, cubeTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	setMatrixUniforms();		
	mat_ambient = [0.36, 0.50, 0.30, 1.0];
	mat_diffuse = [0.36, 0.50, 0.30, 1.0];
	mat_shine = [200];	
	setLightUniforms();
	useTexture = 0;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);			// assign active texture [texturei]
	gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);
	gl.uniform1i(shaderProgram.textureUniform, 0);
	gl.drawArrays(gl.TRIANGLES, 0, tankVPB.numItems);
}

function drawTrack() {
	gl.bindBuffer(gl.ARRAY_BUFFER, trackVPB);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, trackVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, cubeTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);		
	setMatrixUniforms();		
	mat_ambient = [0.40, 0.40, 0.40, 1.0];
	mat_diffuse = [0.40, 0.40, 0.40, 1.0];
	mat_shine = [50];	
	setLightUniforms();	
	useTexture = 0;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);			// assign active texture [texturei]
	gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);
	gl.uniform1i(shaderProgram.textureUniform, 0);
	gl.drawArrays(gl.TRIANGLES, 0, trackVPB.numItems);
}

function drawBuilding(i, bNum) {
	gl.bindBuffer(gl.ARRAY_BUFFER, trackVPB);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, trackVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.activeTexture(gl.TEXTURE0);			// assign active texture [texturei]	
	if (bNum == 1) {
		if (i == 0) {
			gl.bindTexture(gl.TEXTURE_2D, textureArray[7]);			
		} else {
			gl.bindTexture(gl.TEXTURE_2D, textureArray[11]);				
		}
	} else if (bNum == 2) {
		if (i == 0) {
			gl.bindTexture(gl.TEXTURE_2D, textureArray[8]);			
		} else {
			gl.bindTexture(gl.TEXTURE_2D, textureArray[12]);				
		}			
	} else if (bNum == 3) {
		if (i == 0) {
			gl.bindTexture(gl.TEXTURE_2D, textureArray[9]);			
		} else {
			gl.bindTexture(gl.TEXTURE_2D, textureArray[12]);				
		}		
	} else {
		if (i == 0) {
			gl.bindTexture(gl.TEXTURE_2D, textureArray[10]);			
		} else {
			gl.bindTexture(gl.TEXTURE_2D, textureArray[8]);				
		}		
	}	
	light_ambient = [.2, .2, .2, 1];	
	mat_ambient = [.2, .2, .2, 1.0];			
	mat_diffuse = [1, 1, 1, 1.0];
	mat_shine = [50];		
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	gl.bindBuffer(gl.ARRAY_BUFFER, buildingTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, buildingTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	mat_shine = [100];	
	setLightUniforms();				
	setMatrixUniforms();	
	useTexture = 1;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.uniform1i(shaderProgram.textureUniform, 0);
	gl.drawArrays(gl.TRIANGLES, 0, trackVPB.numItems);
	useTexture = 0;	
}

function drawWall() {
	gl.bindBuffer(gl.ARRAY_BUFFER, trackVPB);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, trackVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);		
	gl.bindBuffer(gl.ARRAY_BUFFER, wallTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, wallTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);
	setMatrixUniforms();		
	light_ambient = [.2, .2, .2, 1];	
	mat_ambient = [.2, .2, .2, 1.0];			
	mat_diffuse = [1, 1, 1, 1.0];
	mat_shine = [50];	
	useTexture = 1;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);			// assign active texture [texturei]
	gl.bindTexture(gl.TEXTURE_2D, textureArray[6]);
	setLightUniforms();			
	gl.uniform1i(shaderProgram.textureUniform, 0);
	gl.drawArrays(gl.TRIANGLES, 0, trackVPB.numItems);
	useTexture = 0;
}

function drawWallTop() {
	gl.bindBuffer(gl.ARRAY_BUFFER, trackVPB);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, trackVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, cubeTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);			
	setMatrixUniforms();	
	mat_ambient = [0.8, 0.8, 0.8, 1.0];
	mat_diffuse = [0.8, 0.8, 0.8, 1.0];
	mat_shine = [100];	
	setLightUniforms();		
	useTexture = 0;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);			// assign active texture [texturei]
	gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);
	gl.uniform1i(shaderProgram.textureUniform, 0);
	gl.drawArrays(gl.TRIANGLES, 0, trackVPB.numItems);
}

function drawWindow() {
	gl.bindBuffer(gl.ARRAY_BUFFER, trackVPB);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, trackVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, cubeTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);		
	setMatrixUniforms();	
	mat_ambient = [0.64, 0.77, 0.92, 1.0];
	mat_diffuse = [0.64, 0.77, 0.92, 1.0];
	mat_shine = [5];	
	colorOffset = [0.0 + dayOffset[0], 0.0 + dayOffset[1], 0.0 + dayOffset[2], 1.0];		
	setLightUniforms();	
	/*
	useTexture = 0;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);			// assign active texture [texturei]
	gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);
	gl.uniform1i(shaderProgram.textureUniform, 0);
*/

	useTexture = 3;	
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE1);								// set gpu hardware texture unit 1 for cubemap texture
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
	gl.uniform1i(shaderProgram.cube_map_textureUniform, 1);		// pass texture unit to shader

	gl.drawArrays(gl.TRIANGLES, 0, trackVPB.numItems);
}

function drawRoad() {
	gl.bindBuffer(gl.ARRAY_BUFFER, trackVPB);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, trackVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, cubeTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);		
	setMatrixUniforms();	
	mat_ambient = [0.15, 0.15, 0.15, 1.0];
	mat_diffuse = [0.15, 0.15, 0.15, 1.0];
	mat_shine = [200];	
	setLightUniforms();		
	useTexture = 0;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);			// assign active texture [texturei]
	gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);
	gl.uniform1i(shaderProgram.textureUniform, 0);
	gl.drawArrays(gl.TRIANGLES, 0, trackVPB.numItems);
}

function drawStripe() {
	gl.bindBuffer(gl.ARRAY_BUFFER, trackVPB);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, trackVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, cubeTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);		
	setMatrixUniforms();	
	mat_ambient = [1.0, 0.95, 0.20, 1.0];
	mat_diffuse = [1.0, 0.95, 0.20, 1.0];
	mat_shine = [50];	
	setLightUniforms();		
	useTexture = 0;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);			// assign active texture [texturei]
	gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);
	gl.uniform1i(shaderProgram.textureUniform, 0);
	gl.drawArrays(gl.TRIANGLES, 0, trackVPB.numItems);
}

function drawTurret() {
	gl.bindBuffer(gl.ARRAY_BUFFER, turretVPB);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, turretVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, turretNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, turretNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, turretTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, turretTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);			
	setMatrixUniforms();	
	mat_ambient = [0.36, 0.50, 0.30, 1.0];
	mat_diffuse = [0.36, 0.50, 0.30, 1.0];
	mat_shine = [100];	
	setLightUniforms();			
	useTexture = 0;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);			// assign active texture [texturei]
	gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);
	gl.uniform1i(shaderProgram.textureUniform, 0);
	gl.drawArrays(gl.TRIANGLES, 0, turretVPB.numItems);		
}

function drawBarrel() {
	gl.bindBuffer(gl.ARRAY_BUFFER, barrelVPB);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, barrelVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, barrelNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, barrelNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	gl.bindBuffer(gl.ARRAY_BUFFER, barrelTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, barrelTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	setMatrixUniforms();
	mat_ambient = [0.36, 0.50, 0.30, 1.0];
	mat_diffuse = [0.36, 0.50, 0.30, 1.0];
	mat_shine = [80];	
	setLightUniforms();			
	useTexture = 0;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);			// assign active texture [texturei]
	gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);
	gl.uniform1i(shaderProgram.textureUniform, 0);
	gl.drawArrays(gl.TRIANGLES, 0, barrelVPB.numItems);
}

function drawShoot() { 
	gl.bindBuffer(gl.ARRAY_BUFFER, shootVPB);	// fire object
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, shootVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, shootNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, shootNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	gl.bindBuffer(gl.ARRAY_BUFFER, shootTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, shootTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	setMatrixUniforms();
	mat_ambient = [1.0, 0.8, 0.0, 1.0];
	mat_diffuse = [1.0, 0.8, 0.0, 1.0];
	mat_shine = [800];	
	setLightUniforms();			
	useTexture = 0;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);			// assign active texture [texturei]
	gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);
	gl.uniform1i(shaderProgram.textureUniform, 0);
	gl.drawArrays(gl.TRIANGLES, 0, shootVPB.numItems);	
}

function drawSmoke() {
	gl.bindBuffer(gl.ARRAY_BUFFER, smokeVPB);	// smoke object
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, smokeVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, smokeNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, smokeNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	gl.bindBuffer(gl.ARRAY_BUFFER, smokeTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, smokeTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	setMatrixUniforms();
	mat_ambient = [0.3, 0.3, 0.3, 1.0];
	mat_diffuse = [0.5, 0.5, 0.5, 1.0];
	mat_shine = [800];	
	setLightUniforms();			
	useTexture = 0;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);			// assign active texture [texturei]
	gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);
	gl.uniform1i(shaderProgram.textureUniform, 0);
	gl.drawArrays(gl.TRIANGLES, 0, smokeVPB.numItems);		
}

function drawTrunk() {
	gl.bindBuffer(gl.ARRAY_BUFFER, trunkVPB);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, trunkVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, trunkNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, trunkNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, trunkTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, trunkTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);			
	setMatrixUniforms();	
	mat_ambient = [0.69, 0.42, 0.35, 1.0];
	mat_diffuse = [0.69, 0.42, 0.35, 1.0];
	mat_shine = [500];	
	setLightUniforms();		
	useTexture = 0;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);			// assign active texture [texturei]
	gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);
	gl.uniform1i(shaderProgram.textureUniform, 0);
	gl.drawArrays(gl.TRIANGLES, 0, trunkVPB.numItems);
}

function drawPole() {
	gl.bindBuffer(gl.ARRAY_BUFFER, barrelVPB);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, barrelVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, barrelNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, barrelNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, barrelTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, barrelTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);			
	setMatrixUniforms();	
	mat_ambient = [0.30, 0.30, 0.30, 1.0];
	mat_diffuse = [0.30, 0.30, 0.30, 1.0];
	mat_shine = [10];	
	setLightUniforms();		
	useTexture = 0;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);			// assign active texture [texturei]
	gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);
	gl.uniform1i(shaderProgram.textureUniform, 0);
	gl.drawArrays(gl.TRIANGLES, 0, barrelVPB.numItems);
}

function drawLamp() {
	gl.bindBuffer(gl.ARRAY_BUFFER, treeVPB);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, treeVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, treeNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, treeNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	gl.bindBuffer(gl.ARRAY_BUFFER, treeTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, treeTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);		
	setMatrixUniforms();	
	mat_ambient = [1.0, 0.95, 0.30, 1.0];
	mat_diffuse = [1.0, 0.95, 0.30, 1.0];
	mat_shine = [10];		
	setLightUniforms();		
	useTexture = 0;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);			// assign active texture [texturei]
	gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);
	gl.uniform1i(shaderProgram.textureUniform, 0);
	gl.drawArrays(gl.TRIANGLES, 0, treeVPB.numItems);
}

function drawSun() {
	gl.bindBuffer(gl.ARRAY_BUFFER, treeVPB);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, treeVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, treeNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, treeNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	gl.bindBuffer(gl.ARRAY_BUFFER, treeTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, treeTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);		
	setMatrixUniforms();	
	mat_ambient = [1.0, 0.95, 0.40, 1.0];
	mat_diffuse = [1.0, 0.95, 0.40, 1.0];
	mat_shine = [1];	
	setLightUniforms();		
	useTexture = 0;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);			// assign active texture [texturei]
	gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);
	gl.uniform1i(shaderProgram.textureUniform, 0);
	gl.drawArrays(gl.TRIANGLES, 0, treeVPB.numItems);
}

function drawTree() {
	gl.bindBuffer(gl.ARRAY_BUFFER, treeVPB);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, treeVPB.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, treeNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, treeNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	gl.bindBuffer(gl.ARRAY_BUFFER, treeTexCoordsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordsAttribute, treeTexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);		
	setMatrixUniforms();
	mat_ambient = [0.10, 0.76, 0.09, 1.0];
	mat_diffuse = [0.10, 0.76, 0.09, 1.0];
	mat_shine = [500];
	setLightUniforms();		
	useTexture = 0;
	gl.uniform1i(shaderProgram.useTextureUniform, useTexture);
	gl.activeTexture(gl.TEXTURE0);			// assign active texture [texturei]
	gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);
	gl.uniform1i(shaderProgram.textureUniform, 0);
	gl.drawArrays(gl.TRIANGLES, 0, treeVPB.numItems);	
}

function PushMat(stack, mat) {
  var matCopy = mat4.create();
  mat4.set(mat, matCopy);
  stack.push(matCopy);
}

function setSquare() {
	vertexArray = [
		0,0,0, 1,0,0, 1,1,0,
		0,0,0, 1,1,0, 0,1,0
	];
	normalArray = [
		0,0,1, 0,0,1, 0,0,1,
		0,0,1, 0,0,1, 0,0,1
	];
	textureArray = [
		0,0, 1,0, 1,1,
		0,0, 1,1, 0,1
	];	
}

function setCube(size, r, g, b, colorMix) {
	var v = 0.5 * size;
	vertexArray = [];
	normalArray = [];
	vertexArray = [
		-v,v,v,  -v,-v,v,  v,-v,v,		-v,v,v,  v,-v,v,   v,v,v,			// top
		v,v,v,   v,-v,v,   v,-v,-v,		v,v,v,   v,-v,-v,  v,v,-v,			// right
		v,v,-v,  v,-v,-v,  -v,-v,-v,	v,v,-v,  -v,-v,-v, -v,v,-v,			// bottom
		-v,v,-v, -v,-v,-v, -v,-v,v,		-v,v,-v, -v,-v,v,  -v,v,v,			// left
		-v,v,-v, -v,v,v,   v,v,v,		-v,v,-v, v,v,-v,   v,v,v,			// back
		-v,-v,v, v,-v,v,   v,-v,-v,		-v,-v,v, v,-v,-v,  -v,-v,-v   		// front
	];
	normalArray = [
		0,0,1, 0,0,1, 0,0,1,			0,0,1, 0,0,1, 0,0,1,				// 
		1,0,0, 1,0,0, 1,0,0,			1,0,0, 1,0,0, 1,0,0,				// 
		0,0,-1, 0,0,-1, 0,0,-1,			0,0,-1, 0,0,-1, 0,0,-1,				// 
		-1,0,0, -1,0,0, -1,0,0,			-1,0,0, -1,0,0, -1,0,0,				// 	
		0,1,0, 0,1,0, 0,1,0,			0,1,0, 0,1,0, 0,1,0,				// 
		0,-1,0, 0,-1,0, 0,-1,0,			0,-1,0, 0,-1,0, 0,-1,0				// 
	];
}

// cylinder params: (base radius, top radius, height, number slices, number stacks, r, g, b, colorMix)
function setCylinder(baseRad, topRad, height, numSlices, numStacks, r, g, b, colorMix) {
	var x = 0.0;
	var y = 0.0;
	var z = 0.0;
	vertexArray = [];
	normalArray = [];
	for (i = 0; i < numStacks; i++) {
		var bRad = baseRad - (i / numStacks) * (baseRad - topRad);
		var tRad = baseRad - ((i+1) / numStacks) * (baseRad - topRad);
		var bHeight = height * (i / numStacks);
		var tHeight = height * ((i+1) / numStacks);
		// outer edges
		for (j = 0; j < numSlices; j++) {
			x = bRad * Math.cos(2 * Math.PI * j / numSlices);
			y = bRad * Math.sin(2 * Math.PI * j / numSlices);
			z = bHeight;
			vertexArray.push(x, y, z);
			normalArray.push(x, y, 0.0);
			x = tRad * Math.cos(2 * Math.PI * j / numSlices);
			y = tRad * Math.sin(2 * Math.PI * j / numSlices);
			z = tHeight;
			vertexArray.push(x, y, z);
			normalArray.push(x, y, 0.0);				
			x = bRad * Math.cos(2 * Math.PI * (j+1) / numSlices);
			y = bRad * Math.sin(2 * Math.PI * (j+1) / numSlices);	
			z = bHeight;				
			vertexArray.push(x, y, z);
			normalArray.push(x, y, 0.0);			
	
			x = bRad * Math.cos(2 * Math.PI * (j+1) / numSlices);
			y = bRad * Math.sin(2 * Math.PI * (j+1) / numSlices);
			z = bHeight;
			vertexArray.push(x, y, z);
			normalArray.push(x, y, 0.0);	
			x = tRad * Math.cos(2 * Math.PI * j / numSlices);
			y = tRad * Math.sin(2 * Math.PI * j / numSlices);
			z = tHeight;			
			vertexArray.push(x, y, z);	
			normalArray.push(x, y, 0.0);							
			x = tRad * Math.cos(2 * Math.PI * (j+1) / numSlices);
			y = tRad * Math.sin(2 * Math.PI * (j+1) / numSlices);
			z = tHeight;			
			vertexArray.push(x, y, z);
			normalArray.push(x, y, 0.0);							
		}
	}
	// top and bottom cap discs
	for (k = 0; k < numSlices; k++) {
		vertexArray.push(0.0, 0.0, 0.0);
		normalArray.push(0.0 ,0.0, -1.0);
		x = baseRad * Math.cos(2 * Math.PI * k / numSlices);
		y = baseRad * Math.sin(2 * Math.PI * k / numSlices);
		vertexArray.push(x, y, 0.0);
		normalArray.push(0.0 ,0.0, -1.0);
		x = baseRad * Math.cos(2 * Math.PI * (k+1) / numSlices);
		y = baseRad * Math.sin(2 * Math.PI * (k+1) / numSlices);
		vertexArray.push(x, y, 0.0);
		normalArray.push(0.0 ,0.0, -1.0);				
	}	
	for (k = 0; k < numSlices; k++) {
		vertexArray.push(0.0, 0.0, height);
		normalArray.push(0.0 ,0.0, 1.0);			
		x = topRad * Math.cos(2 * Math.PI * k / numSlices);
		y = topRad * Math.sin(2 * Math.PI * k / numSlices);
		vertexArray.push(x, y, height);
		normalArray.push(0.0 ,0.0, 1.0);			
		x = topRad * Math.cos(2 * Math.PI * (k+1) / numSlices);
		y = topRad * Math.sin(2 * Math.PI * (k+1) / numSlices);
		vertexArray.push(x, y, height);
		normalArray.push(0.0 ,0.0, 1.0);			
	}		
	// color
	colorArray = [];
	textureArray = [];
	var numVertices = (6 * numStacks * numSlices) + (2 * 3 * numSlices);	// outer trunk plus bottom/top discs
	for (i = 0; i < numVertices; i++) {
		if (i % 4 == 0) {
			textureArray.push(0.0, 0.0);
		} else if (i % 4 == 1) {
			textureArray.push(1.0, 0.0);
		} else if (i % 2 == 2) {
			textureArray.push(1.0, 1.0);
		} else {
			textureArray.push(0.0, 1.0);
		}		
	}
}

// sphere params: (radius, number slices, number stacks, r, g, b, colorMix)
function setSphere(radius, numSlices, numStacks, r, g, b, colorMix) {
	var x = 0.0;
	var y = 0.0;
	var z = 0.0;
	var rad = radius;
	vertexArray = [];
	normalArray = [];
	for (i = 0; i < numStacks; i++) {
		for (j = 0; j < numSlices; j++) {
			x = rad * Math.cos(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			y = rad * Math.sin(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			z = rad * Math.cos(Math.PI * (i / numStacks));
			vertexArray.push(x, y, z);
			normalArray.push(x, y, z);
			x = rad * Math.cos(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			y = rad * Math.sin(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			vertexArray.push(x, y, z);		
			normalArray.push(x, y, z);			
			x = rad * Math.cos(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			y = rad * Math.sin(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			z = rad * Math.cos(Math.PI * ((i+1) / numStacks));
			vertexArray.push(x, y, z);
			normalArray.push(x, y, z);				
			x = rad * Math.cos(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			y = rad * Math.sin(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			z = rad * Math.cos(Math.PI * (i / numStacks));			
			vertexArray.push(x, y, z);
			normalArray.push(x, y, z);					
			x = rad * Math.cos(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			y = rad * Math.sin(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			z = rad * Math.cos(Math.PI * ((i+1) / numStacks));
			vertexArray.push(x, y, z);
			normalArray.push(x, y, z);				
			x = rad * Math.cos(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			y = rad * Math.sin(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			vertexArray.push(x, y, z);
			normalArray.push(x, y, z);															
		}
	}
	// color
	textureArray = [];
	var numVertices = (6 * numStacks * numSlices);
	for (i = 0; i < numVertices; i++) {
		if (i % 4 == 0) {
			textureArray.push(0.0, 0.0);
		} else if (i % 4 == 1) {
			textureArray.push(1.0, 0.0);
		} else if (i % 2 == 2) {
			textureArray.push(1.0, 1.0);
		} else {
			textureArray.push(0.0, 1.0);
		}
	}
}

// sphere params: (radius, number slices, number stacks, r, g, b, colorMix)
function setSmokeSpheres(radius, numSlices, numStacks, r, g, b, colorMix) {
	var x = 0.0;
	var y = 0.0;
	var z = 0.0;
	var rad = radius;
	vertexArray = [];
	normalArray = [];
	for (i = 0; i < numStacks; i++) {
		for (j = 0; j < numSlices; j++) {
			x = rad * Math.cos(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			y = rad * Math.sin(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			z = rad * Math.cos(Math.PI * (i / numStacks));
			vertexArray.push(0.1+x, y, z);
			normalArray.push(x, y, z);
			x = rad * Math.cos(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			y = rad * Math.sin(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			vertexArray.push(0.1+x, y, z);		
			normalArray.push(x, y, z);			
			x = rad * Math.cos(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			y = rad * Math.sin(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			z = rad * Math.cos(Math.PI * ((i+1) / numStacks));
			vertexArray.push(0.1+x, y, z);
			normalArray.push(x, y, z);				
			x = rad * Math.cos(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			y = rad * Math.sin(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			z = rad * Math.cos(Math.PI * (i / numStacks));			
			vertexArray.push(0.1+x, y, z);
			normalArray.push(x, y, z);					
			x = rad * Math.cos(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			y = rad * Math.sin(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			z = rad * Math.cos(Math.PI * ((i+1) / numStacks));
			vertexArray.push(0.1+x, y, z);
			normalArray.push(x, y, z);				
			x = rad * Math.cos(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			y = rad * Math.sin(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			vertexArray.push(0.1+x, y, z);
			normalArray.push(x, y, z);															
		}
	}
	for (i = 0; i < numStacks; i++) {
		for (j = 0; j < numSlices; j++) {
			x = rad * Math.cos(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			y = rad * Math.sin(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			z = rad * Math.cos(Math.PI * (i / numStacks));
			vertexArray.push(-0.1+x, y, z);
			normalArray.push(x, y, z);
			x = rad * Math.cos(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			y = rad * Math.sin(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			vertexArray.push(-0.1+x, y, z);		
			normalArray.push(x, y, z);			
			x = rad * Math.cos(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			y = rad * Math.sin(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			z = rad * Math.cos(Math.PI * ((i+1) / numStacks));
			vertexArray.push(-0.1+x, y, z);
			normalArray.push(x, y, z);				
			x = rad * Math.cos(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			y = rad * Math.sin(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * (i / numStacks));
			z = rad * Math.cos(Math.PI * (i / numStacks));			
			vertexArray.push(-0.1+x, y, z);
			normalArray.push(x, y, z);					
			x = rad * Math.cos(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			y = rad * Math.sin(2*Math.PI * (j / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			z = rad * Math.cos(Math.PI * ((i+1) / numStacks));
			vertexArray.push(-0.1+x, y, z);
			normalArray.push(x, y, z);				
			x = rad * Math.cos(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			y = rad * Math.sin(2*Math.PI * ((j+1) / numSlices)) * Math.sin(Math.PI * ((i+1) / numStacks));
			vertexArray.push(-0.1+x, y, z);
			normalArray.push(x, y, z);															
		}
	}	
	textureArray = [];
	var numVertices = (6 * numStacks * numSlices);
	for (k = 0; k < 2; k++) {
		for (i = 0; i < numVertices; i++) {
			if (i % 4 == 0) {
				textureArray.push(0.0, 0.0);
			} else if (i % 4 == 1) {
				textureArray.push(1.0, 0.0);
			} else if (i % 2 == 2) {
				textureArray.push(1.0, 1.0);
			} else {
				textureArray.push(0.0, 1.0);
			}
		}
	}
}

var lastMouseX;
var lastMouseY;

function handleMouseDown(event) {
	event.preventDefault();
	document.addEventListener('mousemove', handleMouseMove, false);
	document.addEventListener('mouseup', handleMouseUp, false);
	document.addEventListener('mouseout', handleMouseOut, false);
	lastMouseX = event.clientX;
	lastMouseY = event.clientY;
}

function handleMouseMove(event) {
	var diffX = event.clientX - lastMouseX;
	var diffY = event.clientY - lastMouseY;
	y_angle += diffX / 4;
	x_angle += diffY / 4;
	lastMouseX = event.clientX;
	lastMouseY = event.clientY;
    //console.log("x_angle: " + x_angle + "  y_angle: " + y_angle + "  z_angle:" + z_angle);  	
	drawScene(); 
}

function handleCameraZCW(event) {
	document.addEventListener('mouseup', handleMouseUp, false);
	document.addEventListener('mouseout', handleMouseOut, false);	
	zDiff = 3;
	zInterval = setInterval(zControl, 50);
}

function handleCameraZCCW(event) {
	document.addEventListener('mouseup', handleMouseUp, false);
	document.addEventListener('mouseout', handleMouseOut, false);	
	zDiff = -3;
	zInterval = setInterval(zControl, 50);
}

var sunX;
var sunZ;
var sunSteps;
var intervalTimer;
function handleDaySimulation(event) {
	isDaySim = !isDaySim;
	if (isDaySim) {
		x_angle = -80.0;
		y_angle = 0.0;
		z_angle = 0.0;	
		x_coi = 0.0;
		y_coi = 0.0;
		z_coi = 0.0;		
		x_cam = 0.0;
		y_cam = 0.0;
		z_cam = 100.0;
		x_vup = 0.0;
		y_vup = 1.0;
		z_vup = 0.0;		
		sunX = -60;
		sunZ = 0;
		sunSteps = -0.2;
		light_ambient = [0.15, 0.15, 0.15, 1];
		light_diffuse = [0.8, 0.4, 0.2, 1];
		light_specular = [1, 1, 1, 1];
		light_pos = [sunX, 0, sunZ, 1];		
		intervalTimer = setInterval(function(){ updateDaySimulation() }, 10);
	} else {
		clearInterval(intervalTimer);
		light_ambient = [0.15, 0.15, 0.15, 1];
		light_diffuse = [0.8, 0.8, 0.8, 1];
		light_specular = [1, 1, 1, 1];
		light_pos = [0, 0, 20, 1];	
		colorOffset = [0, 0, 0, 1];
		dayOffset = [0, 0, 0];
		bColorR = 0.4;
		bColorG = 0.5;
		bColorB = 0.3;
		bColorO = 1.0;
		gl.clearColor(bColorR, bColorG, bColorB, bColorO);			// set background color
		x_angle = -15.0;
		y_angle = 0.0;
		z_angle = 0.0;	
		x_coi = 0.0;
		y_coi = 0.0;
		z_coi = 0.0;		
		x_cam = 0.0;
		y_cam = 0.0;
		z_cam = 50.0;
		x_vup = 0.0;
		y_vup = 1.0;
		z_vup = 0.0;	
		drawScene();			
	}
}

function updateDaySimulation() {
	sunX = -60 * Math.cos(Math.PI * sunSteps);
	sunZ = 60 * Math.sin(Math.PI * sunSteps);
	var sDiffX = 0.6 + 1.0 * Math.sin(Math.PI * sunSteps); 
	var sDiffY = 0.2 + 1.4 * Math.sin(Math.PI * sunSteps); 
	var sDiffZ = 0.0 + 1.6 * Math.sin(Math.PI * sunSteps); 		
	bColorR = 0.05 + 0.5 * Math.sin(Math.PI * sunSteps); 
	bColorG = 0.08 + 0.6 * Math.sin(Math.PI * sunSteps); 
	bColorB = 0.02 + 0.4 * Math.sin(Math.PI * sunSteps); 
	dayOffset[0] = -0.4 + 0.8*Math.sin(Math.PI * sunSteps); 
	dayOffset[1] = -0.4 + 0.8*Math.sin(Math.PI * sunSteps); 
	dayOffset[2] = -0.4 + 0.8*Math.sin(Math.PI * sunSteps); 		
	light_diffuse = [sDiffX, sDiffY, sDiffZ, 1];
	light_pos = [sunX, 0, sunZ, 1];		
	sunSteps += .0003;
	if (sunSteps >= 1.2 || !isDaySim) {
		clearInterval(intervalTimer);
		light_ambient = [0.15, 0.15, 0.15, 1];
		light_diffuse = [0.8, 0.8, 0.8, 1];
		light_specular = [1, 1, 1, 1];
		light_pos = [0, 0, 20, 1];	
		light_ambient = [0.15, 0.15, 0.15, 1];
		light_diffuse = [0.8, 0.8, 0.8, 1];
		light_specular = [1, 1, 1, 1];
		light_pos = [0, 0, 20, 1];	
		dayOffset = [0, 0, 0];		
		bColorR = 0.4;
		bColorG = 0.5;
		bColorB = 0.3;
		bColorO = 1.0;
		x_angle = -15.0;
		y_angle = 0.0;
		z_angle = 0.0;	
		x_coi = 0.0;
		y_coi = 0.0;
		z_coi = 0.0;		
		x_cam = 0.0;
		y_cam = 0.0;
		z_cam = 50.0;
		x_vup = 0.0;
		y_vup = 1.0;
		z_vup = 0.0;	
		isDaySim = false;				
	}
	gl.clearColor(bColorR, bColorG, bColorB, bColorO);			// set background color	
	drawScene();
}

function zControl() {
	z_angle += zDiff;
	drawScene();
}

function handleMouseUp(event) {
	clearInterval(zInterval);
	document.removeEventListener('mousemove', handleMouseMove, false);
	document.removeEventListener('mouseup', handleMouseUp, false);
	document.removeEventListener('mouseout', handleMouseOut, false);
}

function handleMouseOut(event) {
	clearInterval(zInterval);	
	document.removeEventListener('mousemove', handleMouseMove, false);
	document.removeEventListener('mouseup', handleMouseUp, false);
	document.removeEventListener('mouseout', handleMouseOut, false);
}

function handleKeyPress(event) {
	keyMap.set(event.keyCode, true);	// update keypress to map for multiple simultaneous key press tracking
	// if else structure used instead of switch so can check multiple map key presses for player 1 and 2
	// tank 1
    if (keyMap.get(87) == true) {
		console.log("Key pressed: w");												// tank forward
		tankMat = mat4.translate(tankMat, [0.0, 0.15, 0.0]);
		if (!moveSound.playing(tankMove) && !muteSounds) {
			moveSound.play(tankMove);
		}		
    } 
    if (keyMap.get(83) == true) {													// tank backward
		console.log("Key pressed: s");
		tankMat = mat4.translate(tankMat, [0.0, -0.15, 0.0]);
		if (!moveSound.playing(tankMove) && !muteSounds) {
			moveSound.play(tankMove);
		}			
    } 
    if (keyMap.get(65) == true) {													// tank rotate left
		console.log("Key pressed: a");
		tankMat = mat4.rotate(tankMat, degToRad(2.0), [0, 0, 1]);					// rotate around z axis
		if (!moveSound.playing(tankMove) && !muteSounds) {
			moveSound.play(tankMove);
		}		
    } 
    if (keyMap.get(68) == true) {													// tank rotate right
		console.log("Key pressed: d");
		tankMat = mat4.rotate(tankMat, degToRad(-2.0), [0, 0, 1]);					// rotate around z axis	
		if (!moveSound.playing(tankMove) && !muteSounds) {
			moveSound.play(tankMove);
		}		
    }
    if (keyMap.get(81) == true) {													// turret rotate left
		console.log("Key pressed: q");
		turretMat = mat4.rotate(turretMat, degToRad(1.4), [0, 0, 1]);				// rotate around z axis
		if (!turretSound.playing(tankTurret) && !muteSounds) {
			turretSound.play(tankTurret);
		}	
    } 
    if (keyMap.get(69) == true) {													// turret rotate right
		console.log("Key pressed: e");
		turretMat = mat4.rotate(turretMat, degToRad(-1.4), [0, 0, 1]);				// rotate around z axis
		if (!turretSound.playing(tankTurret) && !muteSounds) {
			turretSound.play(tankTurret);
		}			
    }    
    if (keyMap.get(90) == true) {
		console.log("Key pressed: z");
		tankMat = mat4.translate(tankMat, [0.0, -0.25, 0.0]);					// firing throws tank backward
		shootMat = mat4.scale(shootMat, [1.1, 1.1, 1.1]);						// grows shoot explosion
		smokeMat = mat4.scale(smokeMat, [1, 1.1, 1.1]);
		shoot = true;
		if (!muteSounds) {
			fireSound.play();													// play main gun sound effect
		}
    } 
    // coi control
    if (keyMap.get(73) == true) {													// coi up
		console.log("Key pressed: i");
		y_coi += 1;
    	console.log("x_coi: " + x_coi + "  y_coi: " + y_coi + "  z_coi:" + z_coi);
  		
    }
    if (keyMap.get(75) == true) {													// coi down
		console.log("Key pressed: k");
		y_coi -= 1;
    	console.log("x_coi: " + x_coi + "  y_coi: " + y_coi + "  z_coi:" + z_coi);		
    }
    if (keyMap.get(74) == true) {													// coi left
		console.log("Key pressed: j");
		x_coi -= 1;
    	console.log("x_coi: " + x_coi + "  y_coi: " + y_coi + "  z_coi:" + z_coi);		
    }
    if (keyMap.get(76) == true) {													// coi right
		console.log("Key pressed: l");
		x_coi += 1;		
    	console.log("x_coi: " + x_coi + "  y_coi: " + y_coi + "  z_coi:" + z_coi);		
    }
    if (keyMap.get(85) == true) {													// coi forward
		console.log("Key pressed: u");
		//z_coi += 0.1;	
    }
    if (keyMap.get(79) == true) {													// coi back
		console.log("Key pressed: o");
		//z_coi -= 0.1;
    }        
    // camera control
    if (keyMap.get(84) == true) {													// camera up
		console.log("Key pressed: t");
		y_cam += 2;
    	console.log("x_cam: " + x_cam + "  y_cam: " + y_cam + "  z_cam: " + z_cam); 		
    }
    if (keyMap.get(71) == true) {													// camera down
		console.log("Key pressed: g");
		y_cam -= 2;
    	console.log("x_cam: " + x_cam + "  y_cam: " + y_cam + "  z_cam: " + z_cam);		
    }
    if (keyMap.get(70) == true) {													// camera left
		console.log("Key pressed: f");
		x_cam -= 2;	
    	console.log("x_cam: " + x_cam + "  y_cam: " + y_cam + "  z_cam: " + z_cam);		
    }
    if (keyMap.get(72) == true) {													// camera right
		console.log("Key pressed: h");
		x_cam += 2;	
    	console.log("x_cam: " + x_cam + "  y_cam: " + y_cam + "  z_cam: " + z_cam);		
    }
    if (keyMap.get(82) == true) {													// camera forward
		console.log("Key pressed: r");
		z_cam -= 1;	
    	console.log("x_cam: " + x_cam + "  y_cam: " + y_cam + "  z_cam: " + z_cam);		
    }
    if (keyMap.get(89) == true) {													// camera back
		console.log("Key pressed: y");
		z_cam += 1;	
    	console.log("x_cam: " + x_cam + "  y_cam: " + y_cam + "  z_cam: " + z_cam);		
    }
    if (keyMap.get(49) == true) {													// light up
		console.log("Key pressed: 1");
		light_pos[2] += 0.5;		
		console.log("Light position: " + light_pos);		
    }    
    if (keyMap.get(50) == true) {													// light down
		console.log("Key pressed: 2");
		light_pos[2] -= 0.5;		
		console.log("Light position: " + light_pos);		
    }    
    if (keyMap.get(51) == true) {													// light left
		console.log("Key pressed: 3");
		light_pos[0] -= 0.8;
		console.log("Light position: " + light_pos);				
    }    
    if (keyMap.get(52) == true) {													// light right
		console.log("Key pressed: 4");
		light_pos[0] += 0.8;
		console.log("Light position: " + light_pos);				
    }    
    if (keyMap.get(53) == true) {													// light forward
		console.log("Key pressed: 5");
		light_pos[1] += 0.8;		
		console.log("Light position: " + light_pos);				
    }    
    if (keyMap.get(54) == true) {													// light back
		console.log("Key pressed: 6");
		light_pos[1] -= 0.8;
		console.log("Light position: " + light_pos);				
    }    
    if (keyMap.get(55) == true) {													// light intensity +
		console.log("Key pressed: 7");
		light_diffuse[0] += .05;
		light_diffuse[1] += .05;
		light_diffuse[2] += .05;
		light_specular[0] += .05;
		light_specular[1] += .05;
		light_specular[2] += .05;		
		bColorR += .015;
		bColorG += .015;
		bColorB += .015;
		bColorO += 0;		
		console.log("Diffuse light: " + light_diffuse);
		console.log("Background color: " + bColorR + " " + bColorG + " " + bColorB + " " + bColorO);		
	}    
    if (keyMap.get(56) == true) {													// light intensity -
		console.log("Key pressed: 8");
		light_diffuse[0] -= .05;
		light_diffuse[1] -= .05;
		light_diffuse[2] -= .05;	
		light_specular[0] -= .05;
		light_specular[1] -= .05;
		light_specular[2] -= .05;			
		bColorR -= .015;
		bColorG -= .015;
		bColorB -= .015;
		bColorO -= 0;			
		console.log("Diffuse light: " + light_diffuse);		
		console.log("Background color: " + bColorR + " " + bColorG + " " + bColorB + " " + bColorO);			
    }                                    
	drawScene();
}

function handleKeyUp(event) {
	console.log("Key up: " + event.keyCode);
	keyMap.set(event.keyCode, false);

	switch(event.keyCode) {
		case 87: 	// 'w' 87 key up
			if (moveSound.playing(tankMove)) {
				moveSound.stop(tankMove);
			}		
			break;
		case 83: 	// 's' 83 key up
			if (moveSound.playing(tankMove)) {
				moveSound.stop(tankMove);
			}		
			break;
		case 65: 	// 'a' 65 key up
			if (moveSound.playing(tankMove)) {
				moveSound.stop(tankMove);
			}		
			break;
		case 68: 	// 'd' 68 key up
			if (moveSound.playing(tankMove)) {
				moveSound.stop(tankMove);
			}		
			break;
		case 81: 	// 'q' 81 key up
			if (turretSound.playing(tankTurret)) {
				turretSound.stop(tankTurret);
			break;		
			}
		case 69: 	// 'e' 69 key up
			if (turretSound.playing(tankTurret)) {
				turretSound.stop(tankTurret);
			}
			break;							
	}
	handleKeyPress(0);
}

function degToRad(degrees) {
	return degrees * Math.PI / 180;		// convert degrees to radians
}

function tankCamera() {
	console.log("Toggle tank camera POV");	
	if (!isTankCam) {
		isTankCam = true;
	} else {
		isTankCam = false;
		x_cam = 0.0;
		y_cam = 0.0;
		z_cam = 70.0;
		x_coi = 0.0;
		y_coi = 0.0;
		z_coi = 0.0;
		x_vup = 0.0;
		y_vup = 1.0;
		z_vup = 0.0;			
	}
	drawScene();
}

function toggleBackgroundSound() {
		console.log("Background sound mute.");
		muteSounds = !muteSounds;
		if (muteSounds) {
			backgroundSound.stop(backgroundSoundObject);
			idleSound.stop(tankIdle);
		} else {
			backgroundSound.play(backgroundSoundObject);
		}
}

function resize(canvas) {
	// compare size browser is displaying the canvas, and if different, update the canvas settings
	if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		//canvas.width = window.innerWidth;
		//canvas.height = window.innerHeight;		
	}
}
