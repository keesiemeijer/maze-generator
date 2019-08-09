(function() {
	const palette = '<div class="palette" style="display: none;"><div tabindex="0" style="background-color:#000000"></div><div tabindex="0" style="background-color:#191919"></div><div tabindex="0" style="background-color:#323232"></div><div tabindex="0" style="background-color:#4b4b4b"></div><div tabindex="0" style="background-color:#646464"></div><div tabindex="0" style="background-color:#7d7d7d"></div><div tabindex="0" style="background-color:#969696"></div><div tabindex="0" style="background-color:#afafaf"></div><div tabindex="0" style="background-color:#c8c8c8"></div><div tabindex="0" style="background-color:#e1e1e1"></div><div tabindex="0" style="background-color:#ffffff"></div><div tabindex="0" style="background-color:#820000"></div><div tabindex="0" style="background-color:#9b0000"></div><div tabindex="0" style="background-color:#b40000"></div><div tabindex="0" style="background-color:#cd0000"></div><div tabindex="0" style="background-color:#e60000"></div><div tabindex="0" style="background-color:#ff0000"></div><div tabindex="0" style="background-color:#ff1919"></div><div tabindex="0" style="background-color:#ff3232"></div><div tabindex="0" style="background-color:#ff4b4b"></div><div tabindex="0" style="background-color:#ff6464"></div><div tabindex="0" style="background-color:#ff7d7d"></div><div tabindex="0" style="background-color:#823400"></div><div tabindex="0" style="background-color:#9b3e00"></div><div tabindex="0" style="background-color:#b44800"></div><div tabindex="0" style="background-color:#cd5200"></div><div tabindex="0" style="background-color:#e65c00"></div><div tabindex="0" style="background-color:#ff6600"></div><div tabindex="0" style="background-color:#ff7519"></div><div tabindex="0" style="background-color:#ff8532"></div><div tabindex="0" style="background-color:#ff944b"></div><div tabindex="0" style="background-color:#ffa364"></div><div tabindex="0" style="background-color:#ffb27d"></div><div tabindex="0" style="background-color:#828200"></div><div tabindex="0" style="background-color:#9b9b00"></div><div tabindex="0" style="background-color:#b4b400"></div><div tabindex="0" style="background-color:#cdcd00"></div><div tabindex="0" style="background-color:#e6e600"></div><div tabindex="0" style="background-color:#ffff00"></div><div tabindex="0" style="background-color:#ffff19"></div><div tabindex="0" style="background-color:#ffff32"></div><div tabindex="0" style="background-color:#ffff4b"></div><div tabindex="0" style="background-color:#ffff64"></div><div tabindex="0" style="background-color:#ffff7d"></div><div tabindex="0" style="background-color:#003300"></div><div tabindex="0" style="background-color:#004d00"></div><div tabindex="0" style="background-color:#008000"></div><div tabindex="0" style="background-color:#00b300"></div><div tabindex="0" style="background-color:#00cc00"></div><div tabindex="0" style="background-color:#00e600"></div><div tabindex="0" style="background-color:#1aff1a"></div><div tabindex="0" style="background-color:#4dff4d"></div><div tabindex="0" style="background-color:#66ff66"></div><div tabindex="0" style="background-color:#80ff80"></div><div tabindex="0" style="background-color:#b3ffb3"></div><div tabindex="0" style="background-color:#001a4d"></div><div tabindex="0" style="background-color:#002b80"></div><div tabindex="0" style="background-color:#003cb3"></div><div tabindex="0" style="background-color:#004de6"></div><div tabindex="0" style="background-color:#0000ff"></div><div tabindex="0" style="background-color:#0055ff"></div><div tabindex="0" style="background-color:#3377ff"></div><div tabindex="0" style="background-color:#4d88ff"></div><div tabindex="0" style="background-color:#6699ff"></div><div tabindex="0" style="background-color:#80b3ff"></div><div tabindex="0" style="background-color:#b3d1ff"></div><div tabindex="0" style="background-color:#003333"></div><div tabindex="0" style="background-color:#004d4d"></div><div tabindex="0" style="background-color:#006666"></div><div tabindex="0" style="background-color:#009999"></div><div tabindex="0" style="background-color:#00cccc"></div><div tabindex="0" style="background-color:#00ffff"></div><div tabindex="0" style="background-color:#1affff"></div><div tabindex="0" style="background-color:#33ffff"></div><div tabindex="0" style="background-color:#4dffff"></div><div tabindex="0" style="background-color:#80ffff"></div><div tabindex="0" style="background-color:#b3ffff"></div><div tabindex="0" style="background-color:#4d004d"></div><div tabindex="0" style="background-color:#602060"></div><div tabindex="0" style="background-color:#660066"></div><div tabindex="0" style="background-color:#993399"></div><div tabindex="0" style="background-color:#ac39ac"></div><div tabindex="0" style="background-color:#bf40bf"></div><div tabindex="0" style="background-color:#c653c6"></div><div tabindex="0" style="background-color:#cc66cc"></div><div tabindex="0" style="background-color:#d279d2"></div><div tabindex="0" style="background-color:#d98cd9"></div><div tabindex="0" style="background-color:#df9fdf"></div><div tabindex="0" style="background-color:#660029"></div><div tabindex="0" style="background-color:#800033"></div><div tabindex="0" style="background-color:#b30047"></div><div tabindex="0" style="background-color:#cc0052"></div><div tabindex="0" style="background-color:#e6005c"></div><div tabindex="0" style="background-color:#ff0066"></div><div tabindex="0" style="background-color:#ff1a75"></div><div tabindex="0" style="background-color:#ff3385"></div><div tabindex="0" style="background-color:#ff4d94"></div><div tabindex="0" style="background-color:#ff66a3"></div><div tabindex="0" style="background-color:#ff99c2"></div></div>';
	const colorPickers = document.querySelectorAll('.color-picker');
	backgroudDefault = "#ffffff" // empty string is transparent background
	mazeSolveColor = "#cc3737"
	mazeColor = "#000000"
	let paletteHasFocus = false;

	for (let i = 0; i < colorPickers.length; i++) {
		const colorInput = colorPickers[i].querySelector('input');
		colorInput.addEventListener("focus", showColorPalette, false);
		colorInput.addEventListener("keydown", keyup, false);
		colorInput.addEventListener("keyup", updateColorSample, false);

		// Insert color palette
		colorPickers[i].insertAdjacentHTML('beforeend', palette);

		// Get inserted palette
		const colorPalette = colorPickers[i].querySelector('.palette');

		const colors = colorPalette.querySelectorAll('div');
		for (let j = 0; j < colors.length; j++) {
			// For tabbed focus
			colors[j].addEventListener("blur", colorBlur);
		}

		colorPalette.onmouseenter = function() {
			paletteHasFocus = true;
		}
		colorPalette.onmouseleave = function() {
			paletteHasFocus = false;
		}

		// Close palette if clicked (also if clicked on color)
		colorPalette.addEventListener("click", paletteClick, false);
		colorInput.addEventListener("focusout", hideColorPalette);
	}

	let colorSample = document.querySelectorAll('.color-sample')
	for (let i = 0; i < colorSample.length; i++) {
		colorSample[i].addEventListener("click", showColorPalette, false);
	}

	function keyup(e) {
		if (9 === e.which) {
			paletteHasFocus = true;
		}
	}

	function colorBlur(e) {
		if (e.relatedTarget === null) {
			this.parentNode.style.display = 'none';
			paletteHasFocus = false;

		} else {
			if ('palette' !== e.relatedTarget.parentNode.className) {
				paletteHasFocus = false;
				this.parentNode.style.display = 'none';
			}
		}
	}

	function showColorPalette(e) {
		this.parentNode.querySelector('input').focus();

		let palette = this.parentNode.querySelector('.palette');
		palette.style.display = 'block';
	}

	function hideColorPalette(e) {
		let colorPalette = this.parentNode.querySelector('.palette');
		if (paletteHasFocus === false) {
			colorPalette.style.display = 'none';
		}
	}

	function paletteClick(e) {
		if ('palette' !== e.target.className) {
			let color = rgbToHex(e.target.style.backgroundColor);

			this.parentNode.querySelector('input').value = color;
			this.parentNode.querySelector('.color-sample').style = 'background-color: ' + color + ';';
		}
		this.style.display = 'none';
	}

	function updateColorSample(e) {
		if (isValidHex(this.value)) {
			let colorSample = this.parentNode.querySelector('.color-sample');
			colorSample.style = 'background-color: ' + this.value + ';';
		}
	}

	function isValidHex(hex) {
		return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(hex.trim());
	}

	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(color) {
		arr = color.replace('rgb', '').replace('(', '').replace(')', '').split(',');
		return "#" + componentToHex(Number(arr[0])) + componentToHex(Number(arr[1])) + componentToHex(Number(arr[2]));
	}
})();