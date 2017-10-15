function Solver( maze ) {
	this.maze = maze;
	this.start = false;
	this.finish = false;
	this.solved = false;
	this.path = false;
}

Solver.prototype.solve = function() {
	const startPosition = getEntryNode( this.maze.entryNodes, 'start' );
	const endPosition = getEntryNode( this.maze.entryNodes, 'end' );
	const nodes = this.generateSolveNodes( startPosition, endPosition );
	const connected = this.connectSolveNodes( nodes );
	this.path = this.walkMaze( connected );
}

Solver.prototype.generateSolveNodes = function( start, end ) {
	const matrix = this.maze.matrix;
	const nodes = [];

	const rowCount = matrix.length;
	for ( let y = 0; y < rowCount; y++ ) {

		if ( y === 0 || y === ( rowCount - 1 ) || ( 0 === ( y % 2 ) ) ) {
			// First and last rows are walls only.
			// Even rows don't have any connections
			continue;
		}

		let rowLength = matrix[ y ].length;
		for ( var x = 0; x < rowLength; x++ ) {
			if ( stringVal( matrix[ y ], x ) ) {
				// Walls don't have connections.
				continue;
			}

			const nswe = {
				'n': ( 0 < y ) && stringVal( matrix[ y - 1 ], x ),
				's': ( rowCount > y ) && stringVal( matrix[ y + 1 ], x ),
				'w': ( 0 < x ) && stringVal( matrix[ y ], ( x - 1 ) ),
				'e': ( rowLength > x ) && stringVal( matrix[ y ], ( x + 1 ) )
			}

			let count = 4 - ( Object.keys( nswe )
				.map( key => !nswe[ key ] ? 0 : 1 )
				.reduce( ( a, b ) => a + b, 0 ) );

			if ( start && end ) {
				if ( ( x === start.x ) && ( y === start.y ) ) {
					this.start = nodes.length;
					nodes.push( { x, y, nswe, count } );
					continue;
				}

				if ( ( x === end.x ) && ( y === end.y ) ) {
					this.finish = nodes.length;
					nodes.push( { x, y, nswe, count } );
					continue;
				}
			}

			// Walls left or right
			if ( nswe[ 'w' ] || nswe[ 'e' ] ) {
				// left or right direction possible
				if ( !nswe[ 'w' ] || !nswe[ 'e' ] ) {
					nodes.push( { x, y, nswe, count } );
					continue;

				} else {
					// Up or down direction possible.
					if ( ( !nswe[ 'n' ] && nswe[ 's' ] ) || ( nswe[ 'n' ] && !nswe[ 's' ] ) ) {
						nodes.push( { x, y, nswe, count } );
						continue;
					}
				}
			} else {
				// All directions possible
				if ( !nswe[ 'n' ] && !nswe[ 's' ] && !nswe[ 'w' ] && !nswe[ 'e' ] ) {
					nodes.push( { x, y, nswe, count } );
					continue;
				} else {
					// Up or down direction possible.
					if ( ( !nswe[ 'n' ] && nswe[ 's' ] ) || ( nswe[ 'n' ] && !nswe[ 's' ] ) ) {
						nodes.push( { x, y, nswe, count } );
						continue;
					}
				}
			}
		} // x loop
	} // y loop

	return nodes;
}

Solver.prototype.connectSolveNodes = function( nodes ) {
	const y_nodes = {};
	const nodes_length = nodes.length;

	for ( let i = 0; i < nodes_length; i++ ) {
		nodes[ i ][ 'connected' ] = {};
		let x = nodes[ i ][ 'x' ];
		let y = nodes[ i ][ 'y' ];

		if ( !nodes[ i ][ 'nswe' ][ 'w' ] ) {
			nodes[ i ][ 'connected' ][ 'w' ] = i - 1;
		}

		if ( !nodes[ i ][ 'nswe' ][ 'e' ] ) {
			nodes[ i ][ 'connected' ][ 'e' ] = i + 1;
		}

		if ( !nodes[ i ][ 'nswe' ][ 'n' ] && y_nodes.hasOwnProperty( x ) ) {
			nodes[ i ][ 'connected' ][ 'n' ] = y_nodes[ x ];

			if ( nodes.hasOwnProperty( y_nodes[ x ] ) ) {
				nodes[ y_nodes[ x ] ][ 'connected' ][ 's' ] = i;
				delete y_nodes[ x ];
			}
		}

		if ( !nodes[ i ][ 'nswe' ][ 's' ] ) {
			y_nodes[ x ] = i;
		}
	}

	return nodes;
}

Solver.prototype.walkMaze = function( nodes ) {
	this.solved = false;

	if ( !nodes.length ) {
		return;
	}

	let startNode = 0;
	let endNode = nodes.length - 1;
	if ( ( false !== this.start ) && ( false !== this.finish ) ) {
		startNode = this.start;
		endNode = this.finish;
	}

	let i = 0;
	let node = false;
	let from = false;
	const multi_nodes = [];
	const opposite = { 'n': 's', 's': 'n', 'w': 'e', 'e': 'w' };

	while ( this.solved === false ) {

		if ( !node ) {
			i = startNode;
			node = nodes[ i ];
		}

		if ( i === endNode ) {
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
			nodes[ i ] = node;
		}

		if ( 0 === node.count ) {
			from = false;

			if ( !multi_nodes.length ) {
				// Jump back to start.
				i = startNode;
				node = nodes[ startNode ];
				continue;
			}

			// Jump back to multiple directions node
			i = multi_nodes.pop();
			node = nodes[ i ];

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
			nodes[ i ] = node;
		}

		if ( node[ 'connected' ].hasOwnProperty( direction ) ) {
			i = node[ 'connected' ][ direction ];
			node = nodes[ i ];
		} else {
			// Error: Node is not connected to direction
			break;
		}
	}

	return nodes;
}

Solver.prototype.draw = function() {
	const nodes = this.path;
	const wallSize = this.maze.wallSize;

	const canvas = document.getElementById( 'maze' );
	if ( !canvas || !nodes.length || !this.solved ) {
		return;
	}

	const canvas_width = ( ( this.maze.width * 2 ) + 1 ) * wallSize;
	const canvas_height = ( ( this.maze.height * 2 ) + 1 ) * wallSize;

	if ( !( ( canvas.width === canvas_width ) && ( canvas.height === canvas_height ) ) ) {
		// Error: Not the expected canvas size.
		return;
	}

	const ctx = canvas.getContext( '2d' );
	ctx.fillStyle = "#cc3737";

	let i;
	let startNode = 0;
	let endNode = nodes.length - 1;
	let finished = false
	let node = false;

	const hasGates = ( false !== this.start ) && ( false !== this.finish );
	if ( hasGates ) {
		startNode = this.start;
		endNode = this.finish;
		const gateEntry = getEntryNode( this.maze.entryNodes, 'start', true );

		ctx.fillRect( ( gateEntry.x * wallSize ), ( gateEntry.y * wallSize ), wallSize, wallSize );
	}

	while ( finished === false ) {

		if ( !node ) {
			node = nodes[ startNode ];
		}

		if ( i === endNode ) {
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
		let connected_node = nodes[ i ];

		if ( -1 !== [ 'w', 'e' ].indexOf( node.last_step ) ) {
			let start = node.x
			let to_x = ( ( connected_node.x - start ) * wallSize ) + wallSize;

			if ( 'w' === node.last_step ) {
				start = connected_node.x
				to_x = ( ( node.x - connected_node.x ) * wallSize ) + wallSize;
			}

			ctx.fillRect( ( start * wallSize ), ( node.y * wallSize ), to_x, wallSize );
		}

		if ( -1 !== [ 'n', 's' ].indexOf( node.last_step ) ) {
			let start = node.y;
			let to_y = ( ( connected_node.y - start ) * wallSize ) + wallSize;

			if ( 'n' === node.last_step ) {
				start = connected_node.y
				to_y = ( ( node.y - connected_node.y ) * wallSize ) + wallSize;
			}

			ctx.fillRect( ( node.x * wallSize ), ( start * wallSize ), wallSize, to_y );
		}

		node = nodes[ i ];
	}

	if ( hasGates ) {
		const gateExit = getEntryNode( this.maze.entryNodes, 'end', true );
		ctx.fillRect( ( gateExit.x * wallSize ), ( gateExit.y * wallSize ), wallSize, wallSize );
	}
}