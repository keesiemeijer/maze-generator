// Global variables
let mazeNodes = {};

// Maze Restrictions.
//
// Set values to 0 for no restriction.
//
// Be aware that the larger the maze, the more memory is consumed.
// With recursive backtracking the whole maze is stored in memory.

const maxMaze = 75000;
const maxSolve = 30000;
const maxCanvas = 16080100;
const maxCanvasDimension = 32760;

// Maximum walls you can remove
const maxRemoveWalls = 300;

// Update remove max walls html
const removeMaxWallsText = document.querySelector('.desc span');
if (removeMaxWallsText) {
	removeMaxWallsText.innerHTML = maxRemoveWalls;
}

const removeWallsInput = document.getElementById('remove_walls');
if (removeWallsInput) {
	removeWallsInput.max = maxRemoveWalls;
}

function initMaze() {
	const wallSize = getInputIntVal('wall-size', 10);
	const width = getInputIntVal('width', 20);
	const height = getInputIntVal('height', 20);

	let WallsRemove = getInputIntVal('remove_walls', 0);
	if (WallsRemove > maxRemoveWalls) {
		WallsRemove = maxRemoveWalls;
		if (removeWallsInput) {
			removeWallsInput.value = maxRemoveWalls;
		}
	}

	let entryType = '';
	const entry = document.getElementById('entry');
	if (entry) {
		entryType = entry.options[entry.selectedIndex].value;
	}

	let mazeBias = '';
	const bias = document.getElementById('bias');
	if (bias) {
		mazeBias = bias.options[bias.selectedIndex].value;
	}

	const maze = new Maze(width, height, wallSize, entryType, mazeBias, WallsRemove);
	maze.generate();
	maze.draw();

	mazeNodes = {}
	if (maze.matrix.length) {
		mazeNodes = maze;
	}

	const solveButton = document.getElementById("solve");
	if (solveButton && solveButton.classList.contains('hide')) {
		solveButton.classList.toggle("hide");
	}
}

function initSolve() {
	if ((typeof mazeNodes.matrix === 'undefined') || !mazeNodes.matrix.length) {
		return;
	}

	const solver = new Solver(mazeNodes);
	solver.solve();
	if (mazeNodes.wallsRemoved) {
		solver.drawAstarSolve();
	} else {
		solver.draw();
	}
	mazeNodes = {}

	const solveButton = document.getElementById("solve");
	if (solveButton) {
		solveButton.classList.toggle("hide");
	}
}