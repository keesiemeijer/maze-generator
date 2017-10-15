function Maze( width, height, wallSize, entryType ) {
	this.matrix = [];
	this.width = parseInt( width, 10 );
	this.height = parseInt( height, 10 );
	this.wallSize = parseInt( wallSize, 10 );
	this.entryNodes = this.getEntryNodes( entryType );
}

Maze.prototype.generate = function() {
	let nodes = this.generateNodes();
	nodes = this.parseMaze( nodes );
	this.getMatrix( nodes );
}

Maze.prototype.generateNodes = function() {
	const count = this.width * this.height;
	let nodes = [];

	for ( let i = 0; i < count; i++ ) {
		// visited, nswe
		nodes[ i ] = "01111";
	}

	return nodes;
}

Maze.prototype.parseMaze = function( nodes ) {

	const mazeSize = nodes.length;
	const positionIndex = { 'n': 1, 's': 2, 'w': 3, 'e': 4, };
	const oppositeIndex = { 'n': 2, 's': 1, 'w': 4, 'e': 3 };

	if ( !mazeSize ) {
		return;
	}

	let moveNodes = [];
	let visited = 0;
	let position = parseInt( Math.floor( Math.random() * nodes.length ), 10 );

	// Set start node visited.
	nodes[ position ] = replaceAt( nodes[ position ], 0, 1 );

	while ( visited < ( mazeSize - 1 ) ) {

		let next = this.getNeighbours( position );
		let directions = Object.keys( next ).filter( function( key ) {
			return ( -1 !== next[ key ] ) && !stringVal( this[ next[ key ] ], 0 );
		}, nodes );

		if ( directions.length ) {
			++visited;

			if ( 1 < directions.length ) {
				moveNodes.push( position );
			}

			let direction = directions[ Math.floor( Math.random() * directions.length ) ];

			// Update current position
			nodes[ position ] = replaceAt( nodes[ position ], positionIndex[ direction ], 0 );
			// Set new position
			position = next[ direction ];

			// Update next position
			nodes[ position ] = replaceAt( nodes[ position ], oppositeIndex[ direction ], 0 );
			nodes[ position ] = replaceAt( nodes[ position ], 0, 1 );
		} else {
			if ( !moveNodes.length ) {
				break;
			}

			position = moveNodes.pop();
		}
	}

	return nodes;
}


Maze.prototype.getMatrix = function( nodes ) {
	const mazeSize = this.width * this.height;

	// Add the complete maze in a matrix
	// where 1 is a wall and 0 is a corridor.

	let row1 = '';
	let row2 = '';

	if ( nodes.length !== mazeSize ) {
		return;
	}

	for ( let i = 0; i < mazeSize; i++ ) {
		row1 += !row1.length ? '1' : '';
		row2 += !row2.length ? '1' : '';

		if ( stringVal( nodes[ i ], 1 ) ) {
			row1 += '11';
			if ( stringVal( nodes[ i ], 4 ) ) {
				row2 += '01';
			} else {
				row2 += '00';
			}
		} else {
			let hasAbove = nodes.hasOwnProperty( i - this.width );
			let above = hasAbove && stringVal( nodes[ i - this.width ], 4 );
			let hasNext = nodes.hasOwnProperty( i + 1 );
			let next = hasNext && stringVal( nodes[ i + 1 ], 1 );

			if ( stringVal( nodes[ i ], 4 ) ) {
				row1 += '01';
				row2 += '01';
			} else if ( next || above ) {
				row1 += '01';
				row2 += '00';
			} else {
				row1 += '00';
				row2 += '00';
			}
		}

		if ( 0 === ( ( i + 1 ) % this.width ) ) {
			this.matrix.push( row1 );
			this.matrix.push( row2 );
			row1 = '';
			row2 = '';
		}
	}

	// Add closing row
	this.matrix.push( '1'.repeat( ( this.width * 2 ) + 1 ) );
}

Maze.prototype.getEntryNodes = function( access ) {
	const y = ( ( this.width * 2 ) + 1 ) - 2;
	const x = ( ( this.height * 2 ) + 1 ) - 2;

	let entryNodes = {};

	if ( 'diagonal' === access ) {
		entryNodes.start = { 'x': 1, 'y': 1, 'gate': { 'x': 0, 'y': 1 } };
		entryNodes.end = { 'x': x, 'y': y, 'gate': { 'x': x + 1, 'y': y } };
	}

	if ( 'horizontal' === access || 'vertical' === access ) {
		let xy = ( 'horizontal' === access ) ? y : x;
		xy = ( ( xy - 1 ) / 2 );
		let odd = ( xy % 2 );
		xy = odd ? xy : xy + 1;

		let start_x = ( 'horizontal' === access ) ? 1 : xy;
		let start_y = ( 'horizontal' === access ) ? xy : 1;
		let end_x = ( 'horizontal' === access ) ? x : ( odd ? start_x + 2 : start_x );
		let end_y = ( 'horizontal' === access ) ? ( odd ? start_y + 2 : start_y ) : y;
		let startgate = ( 'horizontal' === access ) ? { 'x': 0, 'y': start_y } : { 'x': start_x, 'y': 0 };
		let endgate = ( 'horizontal' === access ) ? { 'x': x + 1, 'y': end_y } : { 'x': end_x, 'y': y + 1 };

		entryNodes.start = { 'x': start_x, 'y': start_y, 'gate': startgate };
		entryNodes.end = { 'x': end_x, 'y': end_y, 'gate': endgate };
	}

	return entryNodes;
}

Maze.prototype.getNeighbours = function( pos ) {
	return {
		'n': ( 0 <= ( pos - this.width ) ) ? pos - this.width : -1,
		's': ( ( this.width * this.height ) > ( pos + this.width ) ) ? pos + this.width : -1,
		'w': ( ( 0 < pos ) && ( 0 !== ( pos % this.width ) ) ) ? pos - 1 : -1,
		'e': ( 0 !== ( ( pos + 1 ) % this.width ) ) ? pos + 1 : -1,
	};
}

Maze.prototype.draw = function() {
	const canvas = document.getElementById( 'maze' );
	if ( !canvas || !this.matrix.length ) {
		return;
	}

	const canvas_width = ( ( this.width * 2 ) + 1 ) * this.wallSize;
	const canvas_height = ( ( this.height * 2 ) + 1 ) * this.wallSize;

	canvas.width = canvas_width;
	canvas.height = canvas_height;

	const ctx = canvas.getContext( '2d' );
	ctx.clearRect( 0, 0, canvas.width, canvas.height );

	const row_count = this.matrix.length;
	const gateEntry = getEntryNode( this.entryNodes, 'start', true );
	const gateExit = getEntryNode( this.entryNodes, 'end', true );

	for ( let i = 0; i < row_count; i++ ) {
		let row_length = this.matrix[ i ].length;
		for ( let j = 0; j < row_length; j++ ) {
			if ( gateEntry && gateExit ) {
				if ( ( j === gateEntry.x ) && ( i === gateEntry.y ) ) {
					continue;
				}
				if ( ( j === gateExit.x ) && ( i === gateExit.y ) ) {
					continue;
				}
			}
			let pixel = parseInt( this.matrix[ i ].charAt( j ), 10 );
			if ( pixel ) {
				ctx.fillRect( ( j * this.wallSize ), ( i * this.wallSize ), this.wallSize, this.wallSize );
			}
		}
	}
}