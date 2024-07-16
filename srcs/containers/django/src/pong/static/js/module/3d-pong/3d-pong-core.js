import { scoreToWin, getRandomInt, paddleConf, ballConf} from './3d-pong-conf.js';
import { paddle_p1, paddle_p2, ball, field, keys } from './3d-app.js';
import { gameState } from './3d-game-state.js';
import { movePaddlesComputer } from './3d-pong-ai.js';
import { nextGame } from './3d-tournament.js';
import { endGame } from './3d-game.js';

function animateBall(){
	ball.position.x += ball.dx;
	ball.position.z += ball.dz;
}

function 	movePaddles(){
	if (paddle_p1.position.z - paddle_p1.geometry.parameters.depth / 2 >
			field.position.z - field.geometry.parameters.depth / 2 
			&& keys["w"]) {
				paddle_p1.position.z -= paddleConf.speed;
	}
	else if (paddle_p1.position.z + paddle_p1.geometry.parameters.depth / 2 <
			field.position.z + field.geometry.parameters.depth / 2 
			&& keys["s"]) {
				paddle_p1.position.z += paddleConf.speed;
	}
	if (gameState.mode === 'user-vs-computer') {
		movePaddlesComputer();
	}
	else
	{
		if (paddle_p2.position.z - paddle_p2.geometry.parameters.depth / 2 >
				field.position.z - field.geometry.parameters.depth / 2 
				&& keys["ArrowUp"]) {
					paddle_p2.position.z -= paddleConf.speed;
		}
		else if (paddle_p2.position.z + paddle_p2.geometry.parameters.depth / 2 <
				field.position.z + field.geometry.parameters.depth / 2 
				&& keys["ArrowDown"]) {
					paddle_p2.position.z += paddleConf.speed;
		}
	}
}

function checkCollisionPaddle(paddle){
	if (ball.position.x - ballConf.radius < paddle.position.x + paddle.geometry.parameters.width / 2 &&
			ball.position.x + ballConf.radius > paddle.position.x - paddle.geometry.parameters.width / 2 &&
			ball.position.z - ballConf.radius < paddle.position.z + paddle.geometry.parameters.depth / 2 &&
			ball.position.z + ballConf.radius > paddle.position.z - paddle.geometry.parameters.depth / 2) {
			ball.dz = (ball.position.z - (paddle.position.z)) * 0.15;
			ball.dx *= -1.03;
			// hit.play(); // uncomment to play sound on hit
		}
}

function checkCollisionField(){
	if (ball.position.x - ballConf.radius < field.position.x - field.geometry.parameters.width / 2 ||
			ball.position.x + ballConf.radius > field.position.x + field.geometry.parameters.width / 2) {
			ball.dx *= -1.03;
		}
	if (ball.position.z - ballConf.radius < field.position.z - field.geometry.parameters.depth / 2 ||
			ball.position.z + ballConf.radius > field.position.z + field.geometry.parameters.depth / 2) {
			ball.dz *= -1;
		}
}

function resetBall() {
	ball.position.x = 0;
	ball.position.z = 0;
	ball.dx = 0;
	ball.dz = 0;
}

function serveBall() {
	ball.position.x = 0;
	ball.position.z = 0;
	ball.serve *= -1;
	ball.dx = ballConf.speed * ball.serve;
	ball.dz = 0;
}

function displayWinMessage(message) {
	var announcement = document.getElementById('announcement');
	announcement.textContent = message;
	var menu = document.getElementById('menu');
	menu.style.display = 'block';
	menu.style.opacity = 1;

	const btn = document.getElementById('js-next-game-btn');
	btn.style.display = 'block';
	return new Promise((resolve) => {
		function onClick(event) {
			btn.removeEventListener('click', onClick);
			btn.style.display = 'none';
			resolve(event); 
		}
		document.addEventListener('click', onClick);
	});
}

async function updateScore() {
	if (ball.position.x < paddle_p1.position.x) {
		gameState.player2Score += 1;
		var p2Score = document.getElementById('player2-score');
		p2Score.textContent = gameState.player2Score;
		console.log("one point for player 2");
		serveBall();
	} else if (ball.position.x > paddle_p2.position.x) {
		gameState.player1Score += 1;
		var p1Score = document.getElementById('player1-score');
		p1Score.textContent = gameState.player1Score;
		console.log("one point for player 1");
		serveBall();
	}
	if (gameState.player1Score === scoreToWin) {
		gameState.running = false;
		resetBall();
		await displayWinMessage('Player 1 wins!');
		if (gameState.mode === 'tournament'){
			gameState.scoreBoard[gameState.matchOrder[gameState.currentGameIndex - 1][0]] += 1;
			console.log('number of victory player ' + gameState.matchOrder[gameState.currentGameIndex - 1][0] + ' :' + gameState.scoreBoard[gameState.matchOrder[gameState.currentGameIndex - 1][0]]);
			nextGame();
			return;
		}
		endGame();
		
	}
	else if (gameState.player2Score === scoreToWin){
		gameState.running = false;
		resetBall();
		await displayWinMessage('Player 2 wins!');
		if (gameState.mode === 'tournament'){
			gameState.scoreBoard[gameState.matchOrder[gameState.currentGameIndex - 1][1]] += 1;
			console.log('number of victory player ' + gameState.matchOrder[gameState.currentGameIndex - 1][1] + ' :' + gameState.scoreBoard[gameState.matchOrder[gameState.currentGameIndex - 1][1]]);
			nextGame();
			return;
		}
		endGame();
	}
}

export { animateBall, movePaddles, checkCollisionPaddle, checkCollisionField, resetBall, serveBall, updateScore };