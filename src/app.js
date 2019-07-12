let mazeNodes = {};

function initMaze() {
	const wallSize = getInputIntVal( 'wall-size', 10 );
	const width = getInputIntVal( 'width', 20 );
	const height = getInputIntVal( 'height', 20 );
	const WallsRemove = getInputIntVal( 'remove_walls', 0 );

	let entryType = '';
	const entry = document.getElementById( 'entry' );
	if ( entry ) {
		entryType = entry.options[ entry.selectedIndex ].value;
	}

	let mazeBias = '';
	const bias = document.getElementById( 'bias' );
	if ( bias ) {
		mazeBias = bias.options[ bias.selectedIndex ].value;
	}

	const maze = new Maze( width, height, wallSize, entryType, mazeBias, WallsRemove );
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
	if(mazeNodes.wallsRemoved) {
		solver.drawAstarSolve();
	} else {
		solver.draw();
	}
	mazeNodes = {}

	const solveButton = document.getElementById( "solve" );
	if ( solveButton ) {
		solveButton.classList.toggle( "hide" );
	}
}