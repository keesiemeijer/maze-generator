function initMaze() {
	let wall_size = getInputIntVal( 'wall-size', 10 );
	let width = getInputIntVal( 'width', 20 );
	let height = getInputIntVal( 'height', 20 );

	let maze = new Maze( width, height, wall_size );
	maze.generateMazeNodes();
	maze.draw();

	console.log( maze )
}

function Maze( width, height, wall_size ) {
	this.nodes = [];
	this.matrix = [];
	this.width = parseInt( width, 10 );
	this.height = parseInt( height, 10 );
	this.wall_size = parseInt( wall_size, 10 );
	this.cells = this.width * this.height;
	this.start = parseInt( Math.floor( Math.random() * this.cells ), 10 );
}

Maze.prototype.generateMazeNodes = function() {
	this.nodes = [];

	let move_nodes = [];
	let nswe_index = { 'n': 1, 's': 2, 'w': 3, 'e': 4, };
	let opposite = { 'n': 2, 's': 1, 'w': 4, 'e': 3 };
	let visited = 0;

	for ( var i = 0; i < this.cells; i++ ) {
		// visited, nswe
		this.nodes[ i ] = "01111";
	}

	let pos = this.start;
	let real_pos = 0;
	this.nodes[ pos ] = replaceAt( this.nodes[ pos ], 0, 1 );

	while ( visited < ( this.cells - 1 ) ) {

		let next = this.getNeighbours( pos );
		let directions = Object.keys( next ).filter( function( key ) {
			return ( -1 !== next[ key ] ) && !stringVal( this.nodes[ next[ key ] ], 0 );
		}, this );

		if ( directions.length ) {
			++visited;

			if ( 1 < directions.length ) {
				move_nodes.push( pos );
			}

			let direction = directions[ Math.floor( Math.random() * directions.length ) ];

			// Update current position
			this.nodes[ pos ] = replaceAt( this.nodes[ pos ], nswe_index[ direction ], 0 );
			// Set new position
			pos = next[ direction ];

			// Update next position
			this.nodes[ pos ] = replaceAt( this.nodes[ pos ], opposite[ direction ], 0 );
			this.nodes[ pos ] = replaceAt( this.nodes[ pos ], 0, 1 );
		} else {
			if ( !move_nodes.length ) {
				break;
			}

			pos = move_nodes.pop();
		}
	}

	this.setMazeMatrix();
}

Maze.prototype.setMazeMatrix = function() {
	// Add the complete maze in a matrix
	// where 1 is a wall and 0 is a corridor.

	this.matrix = [];
	let row1 = '';
	let row2 = '';

	if ( this.nodes.length !== this.cells ) {
		return [];
	}

	for ( var i = 0; i < this.cells; i++ ) {
		row1 += !row1.length ? '1' : '';
		row2 += !row2.length ? '1' : '';

		if ( stringVal( this.nodes[ i ], 1 ) ) {
			row1 += '11';
			if ( stringVal( this.nodes[ i ], 4 ) ) {
				row2 += '01';
			} else {
				row2 += '00';
			}
		} else {
			above_exists = this.nodes.hasOwnProperty( i - this.width );
			above = above_exists && stringVal( this.nodes[ i - this.width ], 4 );
			next_exists = this.nodes.hasOwnProperty( i + 1 );
			next = next_exists && stringVal( this.nodes[ i + 1 ], 1 );

			if ( stringVal( this.nodes[ i ], 4 ) ) {
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

Maze.prototype.getNeighbours = function( pos ) {
	return {
		'n': ( 0 <= ( pos - this.width ) ) ? pos - this.width : -1,
		's': ( this.cells > ( pos + this.width ) ) ? pos + this.width : -1,
		'w': ( ( 0 < pos ) && ( 0 !== ( pos % this.width ) ) ) ? pos - 1 : -1,
		'e': ( 0 !== ( ( pos + 1 ) % this.width ) ) ? pos + 1 : -1,
	};

}

Maze.prototype.draw = function() {
	canvas = document.getElementById( 'maze' );
	if ( !canvas || !this.matrix.length ) {
		return;
	}

	let canvas_width = ( ( this.width * 2 ) + 1 ) * this.wall_size;
	let canvas_height = ( ( this.height * 2 ) + 1 ) * this.wall_size;

	canvas.width = canvas_width;
	canvas.height = canvas_height;

	var ctx = canvas.getContext( '2d' );
	ctx.clearRect( 0, 0, canvas.width, canvas.height );

	row_count = this.matrix.length;

	for ( var i = 0; i < row_count; i++ ) {
		let row_length = this.matrix[ i ].length;
		for ( var j = 0; j < row_length; j++ ) {
			let pixel = parseInt( this.matrix[ i ].charAt( j ), 10 );
			if ( pixel ) {
				ctx.fillRect( ( j * this.wall_size ), ( i * this.wall_size ), this.wall_size, this.wall_size );
			}
		}
	}
}

function replaceAt( str, index, replacement ) {
	if ( index > str.length - 1 ) {
		return str;
	}
	return str.substr( 0, index ) + replacement + str.substr( index + 1 );
}

function stringVal( str, index ) {
	return parseInt( str.charAt( index ), 10 );
}

function getInputIntVal( id, value ) {
	let el = document.getElementById( id );
	if ( el ) {
		let el_value = parseInt( el.value, 10 );
		return ( 0 < el_value ) ? el_value : value;
	}
	return value;
}