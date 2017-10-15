function getEntryNode( entries, type, gate = false ) {
	if ( !hasEntries( entries ) ) {
		return false;
	}

	if( 'start' === type ) {
		return gate ? entries.start.gate : {'x': entries.start.x, 'y': entries.start.y};
	}

	if( 'end' === type ) {
		return gate ? entries.end.gate : {'x': entries.end.x, 'y': entries.end.y};
	}

	return false;
}

function hasEntries( entries ) {
	if ( entries.hasOwnProperty( 'start' ) && entries.hasOwnProperty( 'end' ) ) {
		return true;
	}

	return false;
}