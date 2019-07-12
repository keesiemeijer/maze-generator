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

function removeFromArray(arr, element) {
  // Could use indexOf here instead to be more efficient
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == element) {
      arr.splice(i, 1);
    }
  }
  return arr;
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}