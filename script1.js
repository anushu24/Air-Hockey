var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;
var firsttime=true;
var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

//audios

const PING = new Audio();  //when ball touches the paddle
PING.src = "audios/ping.mp3";
const WALL = new Audio(); //when wall toches the upa and down walls
WALL.src = "audios/wall.m4a";
const SCORE_S = new Audio(); //when a player misses the ball
SCORE_S.src = "audios/sfx_point.wav";
const WINSND = new Audio(); //when you win
WINSND.src = "audios/win.mp3";
const BACKGRND = new Audio(); //background song
BACKGRND.src = "audios/backgrnd.mp3";
const LOSESND = new Audio(); //when you lose
LOSESND.src = "audios/lose.mp3";


function calculateMousePos(evt) {			//evt is for every event
	var rect = canvas.getBoundingClientRect();  //this give the coordinates of the canvas
	var root = document.documentElement;		//this gives the information about the html element
	var mouseX = evt.clientX - rect.left - root.scrollLeft;	//these two gives the mouse positions
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick_exit(evt) {
	if(showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}
function handleMouseClick_start(evt) {
	if(firsttime) {
		firsttime=false;
	}
}
window.onload = function() {  //window.onload  loads the code inside it only when the whole code of the script is loaded
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');


	var framesPerSecond = 30;
	//setInterval method calls the functions continuosly with 1000/30 until the window is closed
	setInterval(function() {
			moveEverything();
			drawEverything();
		}, 1000/framesPerSecond);

	canvas.addEventListener('mousedown', function(){
		handleMouseClick_start();
		handleMouseClick_exit();
	});

//everytime when mouse move, send the event details to calculateMousePos() which will return the mouse coordinate everytime
	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);  //this substraction will center the mouse to the left paddle
		});
}

function ballReset() {
	if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
		showingWinScreen = true;
		BACKGRND.pause();
		if(player1Score >= WINNING_SCORE){
			WINSND.play();
		} else if(player2Score >= WINNING_SCORE){
			LOSESND.play();
		}
	}

	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function computerMovement() {
	BACKGRND.play();
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	if(paddle2YCenter < ballY - 35) {
		paddle2Y = paddle2Y + 6;
	} else if(paddle2YCenter > ballY + 35) {
		paddle2Y = paddle2Y - 6;
	}
}

function moveEverything() {
	if(showingWinScreen) {
		return;
	}

	computerMovement();
	BACKGRND.play();

	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;

	if(ballX < 0) {
		if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
			PING.play();

			var deltaY = ballY	-(paddle1Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		}
		else {
			SCORE_S.play();
			player2Score++; // must be BEFORE ballReset()
				ballReset();
		}
	}
	if(ballX > canvas.width) {
		if(ballY > paddle2Y &&
			ballY < paddle2Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
            PING.play();
			var deltaY = ballY
					-(paddle2Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			SCORE_S.play();
			player1Score++; // must be BEFORE ballReset()
			ballReset();
		}
	}
	if(ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
	if(ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet() {
	for(var i=0;i<canvas.height;i+=40) {
		colorRect(canvas.width/2-1,i,2,20,'#158467');
	}
}

function winner(ele)
{
    
    document.querySelector('.content').style.display = 'block';
    document.querySelector('.content').style.backgroundPosition='fixed';
    document.querySelector('.content').style.zIndex='2';
    document.querySelector('.final-score').innerHTML=ele;
}

function loss(ele2)
{
    
    document.querySelector('.content-f').style.display = 'block';
    document.querySelector('.content-f').style.backgroundPosition='fixed';
    document.querySelector('.content-f').style.zIndex='2';
    document.querySelector('.final-score-f').innerHTML=ele2;
}

function drawEverything() {
    // next line blanks out the screen with black
    

    if(showingWinScreen) {
        canvasContext.clearRect(0,0,canvas.width,canvas.height);


        if(player1Score >= WINNING_SCORE) {
            var won = "Yippie, you won the game";
            winner(won);
        } else if(player2Score >= WINNING_SCORE) {
            var lost = "Sorry, you lost the game.<br>Better luck next time";
            loss(lost);
        }
        
        return;
    }
	colorRect(0,0,canvas.width,canvas.height, '#bfdcae');
	drawNet();

	// this is left player paddle
	colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'#158467');

	// this is right computer paddle
	colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'#158467');

	// next line draws the ball
	colorCircle(ballX, ballY, 10, '#158467');
	canvasContext.font="30px fantasy";
	canvasContext.fillText(player1Score, 250, 100);
	canvasContext.fillText(player2Score, canvas.width-250, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;  //specifies the colour
	canvasContext.beginPath(); //beginpath defines a shape in which we will fill in
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2,true); // for the circle
	canvasContext.fill();   //just like fillRect function , it requires beginPath()
}

function colorRect(leftX,topY, width,height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY, width,height);
}