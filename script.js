var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 3;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

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


function handleMouseClick(evt) {
	if(showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
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

	canvas.addEventListener('mousedown', handleMouseClick);
	document.addEventListener('keydown', function (e) {  //right paddle
	     if (e.keyCode == 38 || e.which == 38) { // up arrow
				paddle2Y -= 35;
	     }
	     else if (e.keyCode == 40 || e.which == 40) { // down arrow
	      paddle2Y += 35;
	     }
	}, false);

	document.addEventListener('keydown', function (e) {  //left paddle
			 if (e.keyCode == 87 || e.which == 87) { // W key
	      paddle1Y -= 35;
	     }
	     if (e.keyCode == 83 || e.which == 83) { // S Key
				paddle1Y += 35;
	     }
	}, false);
}

function ballReset() {
	if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
		showingWinScreen = true;
		BACKGRND.pause();
		WINSND.play();
	}

	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function moveEverything() {
	if(showingWinScreen) {
		return;
	}
    BACKGRND.play();
    
	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;

	if(ballY<0 || ballY>canvas.height){
		WALL.play();
	}

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

function player1(ele)
{
    
    document.querySelector('.content').style.display = 'block';
    document.querySelector('.content').style.backgroundPosition='fixed';
    document.querySelector('.content').style.zIndex='2';
    document.querySelector('.final-score').innerHTML=ele;
}


function player2(ele2)
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
            var won = "Player1 you won the game <br> Player2 better luck next time";
            player1(won);
        } else if(player2Score >= WINNING_SCORE) {
            var lost = "Player2 you won the game <br> Player1 better luck next time";
            player2(lost);
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
	canvasContext.font="30px Black Ops One";
	canvasContext.fillText(player1Score, 250, 100);
	canvasContext.fillText("Player1", 250, 300);
	canvasContext.fillText(player2Score, canvas.width-250, 100);
	canvasContext.fillText("Player2", canvas.width-250, 300);
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