let mazeNodes = {};

function initMaze() {
	const wallSize = getInputIntVal( 'wall-size', 10 );
	const width = getInputIntVal( 'width', 20 );
	const height = getInputIntVal( 'height', 20 );

	let entryType = '';
	const entry = document.getElementById('entry');
	if(entry) {
		entryType = entry.options[entry.selectedIndex].value;
	}

	const maze = new Maze( width, height, wallSize, entryType );
	maze.generate();
	maze.draw();

	mazeNodes = {}
	if ( maze.matrix.length ) {
		mazeNodes = maze;
	}

	const solveButton = document.getElementById( "solve" );
	if ( solveButton && solveButton.classList.contains( 'hide' ) ) {
		solveButton.classList.toggle( "hide" );
	}
}

function initSolve() {
	if ( ( typeof mazeNodes.matrix === 'undefined' ) || !mazeNodes.matrix.length ) {
		return;
	}

	const solver = new Solver( mazeNodes );
	solver.solve();
	solver.draw();
	mazeNodes = {}

	const solveButton = document.getElementById( "solve" );
	if ( solveButton ) {
		solveButton.classList.toggle( "hide" );
	}
}