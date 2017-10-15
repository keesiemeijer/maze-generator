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
	const el = document.getElementById( id );
	if ( el ) {
		const el_value = parseInt( el.value, 10 );
		return ( 0 < el_value ) ? el_value : value;
	}
	return value;
}