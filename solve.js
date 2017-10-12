function initSolve() {
	if ( ( typeof mazeNodes.matrix === 'undefined' ) || !mazeNodes.matrix.length ) {
		return;
	}

	solve = new Solve( mazeNodes );
	solve.generateSolveNodes();
	solve.connectSolveNodes();
	solve.solveMaze();
	solve.draw();

	let solve_button = document.getElementById( "solve" );
	if ( solve_button ) {
		solve_button.classList.toggle( "hide" );
	}
}

function Solve( nodes ) {
	this.matrix = nodes.matrix;
	this.nodes = [];
	this.width = nodes.width;
	this.height = nodes.height;
	this.wall_size = nodes.wall_size;
	this.solved = false;
}

Solve.prototype.generateSolveNodes = function() {
	solve.nodes = [];

	if ( !this.matrix.length ) {
		return;
	}
	let nodes = [];
	let row_count = this.matrix.length;
	for ( var y = 0; y < row_count; y++ ) {

		if ( y === 0 || y === (row_count-1) || ( 0 === ( y % 2 ) ) ) {
			// First and last rows are walls only.
			// Even rows don't have any connections
			continue;
		}

		let row_length = this.matrix[ y ].length;
		for ( var x = 0; x < row_length; x++ ) {
			if ( stringVal( this.matrix[ y ], x ) ) {
				// Walls don't have connections.
				continue;
			}

			nswe = {
				'n': ( 0 < y ) && stringVal( this.matrix[ y - 1 ], x ),
				's': ( row_count > y ) && stringVal( this.matrix[ y + 1 ], x ),
				'w': ( 0 < x ) && stringVal( this.matrix[ y ], ( x - 1 ) ),
				'e': ( row_length > x ) && stringVal( this.matrix[ y ], ( x + 1 ) )
			}

			let count = 4 - ( Object.keys( nswe )
				.map( key => !nswe[ key ] ? 0 : 1 )
				.reduce( ( a, b ) => a + b, 0 ) );

			// Walls left or right
			if ( nswe[ 'w' ] || nswe[ 'e' ] ) {
				// left or right direction possible
				if ( !nswe[ 'w' ] || !nswe[ 'e' ] ) {
					solve.nodes.push( { x, y, nswe, count } );
					continue;

				} else {
					// Up or down direction possible.
					if ( ( !nswe[ 'n' ] && nswe[ 's' ] ) || ( nswe[ 'n' ] && !nswe[ 's' ] ) ) {
						solve.nodes.push( { x, y, nswe, count } );
						continue;
					}
				}
			} else {
				// All directions possible
				if ( !nswe[ 'n' ] && !nswe[ 's' ] && !nswe[ 'w' ] && !nswe[ 'e' ] ) {
					solve.nodes.push( { x, y, nswe, count } );
					continue;
				} else {
					// Up or down direction possible.
					if ( ( !nswe[ 'n' ] && nswe[ 's' ] ) || ( nswe[ 'n' ] && !nswe[ 's' ] ) ) {
						solve.nodes.push( { x, y, nswe, count } );
						continue;
					}
				}
			}
		} // x loop
	} // y loop
}

Solve.prototype.connectSolveNodes = function() {
	let y_nodes = {};

	nodes_length = this.nodes.length;
	for ( var i = 0; i < nodes_length; i++ ) {
		this.nodes[ i ][ 'connected' ] = {};
		let x = this.nodes[ i ][ 'x' ];

		if ( !this.nodes[ i ][ 'nswe' ][ 'w' ] ) {
			this.nodes[ i ][ 'connected' ][ 'w' ] = i - 1;
		}

		if ( !this.nodes[ i ][ 'nswe' ][ 'e' ] ) {
			this.nodes[ i ][ 'connected' ][ 'e' ] = i + 1;
		}

		if ( !this.nodes[ i ][ 'nswe' ][ 'n' ] && y_nodes.hasOwnProperty( x ) ) {
			this.nodes[ i ][ 'connected' ][ 'n' ] = y_nodes[ x ];

			if ( this.nodes.hasOwnProperty( y_nodes[ x ] ) ) {
				this.nodes[ y_nodes[ x ] ][ 'connected' ][ 's' ] = i;
				delete y_nodes[ x ];
			}
		}

		if ( !this.nodes[ i ][ 'nswe' ][ 's' ] ) {
			y_nodes[ x ] = i;
		}
	}
}

Solve.prototype.solveMaze = function() {
	this.solved = false;

	if ( !this.nodes.length ) {
		return;
	}

	let max = 0;
	let i = 0;
	let node = false;
	let from = false;
	let multi_nodes = [];
	let start_node = 0;
	let end_node = this.nodes.length - 1;
	let opposite = { 'n': 's', 's': 'n', 'w': 'e', 'e': 'w' };

	while ( this.solved === false ) {
		max++
		if ( 30000 < max ) {
			alert( 'Solving maze took too long. Please try again or use smaller maze dimensions' );
			mazeNodes = {};
			break
		}

		if ( !node ) {
			i = start_node;
			node = this.nodes[ i ];
		}

		if ( i === end_node ) {
			// Found the end node.
			this.solved = true;
			break
		}

		if ( node.count > 2 ) {
			if ( -1 === multi_nodes.indexOf( i ) ) {
				multi_nodes.push( i );
			}
		}

		if ( false !== from ) {
			node[ 'nswe' ][ from ] = 1;
			node.count--;
			this.nodes[ i ] = node;
		}

		if ( 0 === node.count ) {
			from = false;

			if ( !multi_nodes.length ) {
				// Jump back to start.
				i = start_node;
				node = this.nodes[ start_node ];
				continue;
			}

			// Jump back to multiple directions node
			i = multi_nodes.pop();
			node = this.nodes[ i ];

			if ( node.count > 1 ) {
				// Add multi node back if more than one option left
				multi_nodes.push( i );
			}
			continue;
		}

		let directions = Object.keys( node[ 'nswe' ] ).filter( key => !node[ 'nswe' ][ key ] ? true : false );
		let direction = directions[ Math.floor( Math.random() * directions.length ) ];

		if ( node.count >= 1 ) {
			node.count--;
			from = opposite[ direction ];
			node[ 'nswe' ][ direction ] = 1;
			node[ 'last_step' ] = direction;
			this.nodes[ i ] = node;
		}

		if ( node[ 'connected' ].hasOwnProperty( direction ) ) {
			i = node[ 'connected' ][ direction ];
			node = this.nodes[ i ];
		} else {
			// Error: Node is not connected to direction
			break;
		}
	}
}

Solve.prototype.draw = function() {
	canvas = document.getElementById( 'maze' );
	if ( !canvas || !this.nodes.length || !this.solved ) {
		return;
	}

	let canvas_width = ( ( this.width * 2 ) + 1 ) * this.wall_size;
	let canvas_height = ( ( this.height * 2 ) + 1 ) * this.wall_size;

	if ( !( ( canvas.width === canvas_width ) && ( canvas.height === canvas_height ) ) ) {
		// Error: Not the expected canvas size.
		return;
	}

	var ctx = canvas.getContext( '2d' );
	ctx.fillStyle = "#cc3737";

	let max = 0;
	let i;
	let start_node = 0;
	let end_node = this.nodes.length - 1;
	let finished = false
	let node = false;
	while ( finished === false ) {
		max++;
		if ( 30000 < max ) {
			alert( 'Solving maze took too long. Please try again or use smaller maze dimensions' );
			break;
		}

		if ( !node ) {
			node = this.nodes[ start_node ];
		}

		if ( i === end_node ) {
			finished = true;
			break
		}

		if ( node.last_step === "undefined" || node.connected === "undefined" ) {
			// Error: Last step or connected nodes doesn't exist.
			break;
		}

		if ( !node.connected.hasOwnProperty( node.last_step ) ) {
			// Error: Connected direction doesnt exist.
			break;
		}

		i = node.connected[ node.last_step ];
		let connected_node = this.nodes[ i ];

		if ( -1 !== [ 'w', 'e' ].indexOf( node.last_step ) ) {
			let start = node.x
			let to_x = ( ( connected_node.x - start ) * this.wall_size ) + this.wall_size;

			if ( 'w' === node.last_step ) {
				start = connected_node.x
				to_x = ( ( node.x - connected_node.x ) * this.wall_size ) + this.wall_size;
			}

			ctx.fillRect( ( start * this.wall_size ), ( node.y * this.wall_size ), to_x, this.wall_size );
		}

		if ( -1 !== [ 'n', 's' ].indexOf( node.last_step ) ) {
			let start = node.y;
			let to_y = ( ( connected_node.y - start ) * this.wall_size ) + this.wall_size;

			if ( 'n' === node.last_step ) {
				start = connected_node.y
				to_y = ( ( node.y - connected_node.y ) * this.wall_size ) + this.wall_size;
			}

			ctx.fillRect( ( node.x * this.wall_size ), ( start * this.wall_size ), this.wall_size, to_y );
		}

		node = this.nodes[ i ];
	}
}