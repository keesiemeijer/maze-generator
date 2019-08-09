// Global variables
let mazeNodes = {};

// Check if globals are defined
if (typeof maxMaze === 'undefined') {
	maxMaze = 0;
}

if (typeof maxSolve === 'undefined') {
	maxSolve = 0;
}

if (typeof maxCanvas === 'undefined') {
	maxCanvas = 0;
}

if (typeof maxCanvasDimension === 'undefined') {
	maxCanvasDimension = 0;
}

if (typeof maxWallsRemove === 'undefined') {
	maxWallsRemove = 300;
}

// Update remove max walls html
const removeMaxWallsText = document.querySelector('.desc span');
if (removeMaxWallsText) {
	removeMaxWallsText.innerHTML = maxWallsRemove;
}

const removeWallsInput = document.getElementById('remove_walls');
if (removeWallsInput) {
	removeWallsInput.max = maxWallsRemove;
}

function initMaze() {
	const settings = {
		width: getInputIntVal('width', 20),
		height: getInputIntVal('height', 20),
		wallSize: getInputIntVal('wall-size', 10),
		removeWalls: getInputIntVal('remove_walls', 0),
		entryType: '',
		bias: '',
		color: '#000000',
		backgroudColor: '#FFFFFF',
		solveColor: '#cc3737',

		// restrictions
		maxMaze: maxMaze,
		maxCanvas: maxCanvas,
		maxCanvasDimension: maxCanvasDimension,
		maxSolve: maxSolve,
		maxWallsRemove: maxWallsRemove,
	}

	const colors = ['color', 'backgroundColor', 'solveColor'];
	for (let i = 0; i < colors.length; i++) {
		const colorInput = document.getElementById(colors[i]);
		settings[colors[i]] = colorInput.value
		if (!isValidHex(settings[colors[i]])) {
			let defaultColor = colorInput.parentNode.dataset.default;
			colorInput.value = defaultColor;
			settings[colors[i]] = defaultColor;
		}

		const colorSample = colorInput.parentNode.querySelector('.color-sample');
		colorSample.style = 'background-color: ' + settings[colors[i]] + ';';
	}

	if (settings['removeWalls'] > maxWallsRemove) {
		settings['removeWalls'] = maxWallsRemove;
		if (removeWallsInput) {
			removeWallsInput.value = maxWallsRemove;
		}
	}

	const entry = document.getElementById('entry');
	if (entry) {
		settings['entryType'] = entry.options[entry.selectedIndex].value;
	}

	const bias = document.getElementById('bias');
	if (bias) {
		settings['bias'] = bias.options[bias.selectedIndex].value;
	}

	const maze = new Maze(settings);
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