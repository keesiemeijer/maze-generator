(function() {

	// Amount of colors in a row
	const row = 11;

	// Classes
	const colorPickerClass = 'color-picker';
	const colorSampleClass = 'color-sample';
	const paletteClass = 'palette';
	const screenReaderClass = 'screen-reader-text';

	// Todo: Use object with color description for accessibility
	var hexColors = [
		'#000000',
		'#191919',
		'#323232',
		'#4b4b4b',
		'#646464',
		'#7d7d7d',
		'#969696',
		'#afafaf',
		'#c8c8c8',
		'#e1e1e1',
		'#ffffff',
		'#820000',
		'#9b0000',
		'#b40000',
		'#cd0000',
		'#e60000',
		'#ff0000',
		'#ff1919',
		'#ff3232',
		'#ff4b4b',
		'#ff6464',
		'#ff7d7d',
		'#823400',
		'#9b3e00',
		'#b44800',
		'#cd5200',
		'#e65c00',
		'#ff6600',
		'#ff7519',
		'#ff8532',
		'#ff944b',
		'#ffa364',
		'#ffb27d',
		'#828200',
		'#9b9b00',
		'#b4b400',
		'#cdcd00',
		'#e6e600',
		'#ffff00',
		'#ffff19',
		'#ffff32',
		'#ffff4b',
		'#ffff64',
		'#ffff7d',
		'#003300',
		'#004d00',
		'#008000',
		'#00b300',
		'#00cc00',
		'#00e600',
		'#1aff1a',
		'#4dff4d',
		'#66ff66',
		'#80ff80',
		'#b3ffb3',
		'#001a4d',
		'#002b80',
		'#003cb3',
		'#004de6',
		'#0000ff',
		'#0055ff',
		'#3377ff',
		'#4d88ff',
		'#6699ff',
		'#80b3ff',
		'#b3d1ff',
		'#003333',
		'#004d4d',
		'#006666',
		'#009999',
		'#00cccc',
		'#00ffff',
		'#1affff',
		'#33ffff',
		'#4dffff',
		'#80ffff',
		'#b3ffff',
		'#4d004d',
		'#602060',
		'#660066',
		'#993399',
		'#ac39ac',
		'#bf40bf',
		'#c653c6',
		'#cc66cc',
		'#d279d2',
		'#d98cd9',
		'#df9fdf',
		'#660029',
		'#800033',
		'#b30047',
		'#cc0052',
		'#e6005c',
		'#ff0066',
		'#ff1a75',
		'#ff3385',
		'#ff4d94',
		'#ff66a3',
		'#ff99c2',
	];

	const colorPickers = document.querySelectorAll('.' + colorPickerClass);
	const palette = '<div class="' + paletteClass + '" style="display: none;"></div>';
	let paletteHasFocus = false;
	let desc = "Use a hex color code or use the tab key to select a color.";
	desc += ' Use the arrow keys to scroll through all colors. Use the space or return key to select the color.';
	desc += ' Use the escape key to close the palette.'

	for (let i = 0; i < colorPickers.length; i++) {
		// Create aria describedby element for the color input
		var describedby = document.createElement("p");
		describedby.style.display = 'none';
		describedby.id = 'desc-' + i;
		describedby.innerHTML = desc;

		// Insert describedby description
		colorPickers[i].insertAdjacentElement('afterbegin', describedby)

		const colorInput = colorPickers[i].querySelector('input');

		// Show color palette on input focus
		colorInput.addEventListener("focus", showColorPalette, false);

		// Check if tab key is used to focus a color in the palette
		colorInput.addEventListener("keydown", inputTabPressed, false);

		// Update color sample after key up
		colorInput.addEventListener("keyup", updateColorSample, false);

		// Add describedby attribute
		colorInput.setAttribute("aria-describedby", 'desc-' + i);

		// Insert color palette
		colorPickers[i].insertAdjacentHTML('beforeend', palette);

		// Get inserted palette
		const colorPalette = colorPickers[i].querySelector('.' + paletteClass);

		for (let j = 0; j < hexColors.length; j++) {
			var colorDiv = document.createElement("div");
			var colorDivText = document.createElement("span");
			colorDivText.className = screenReaderClass;
			colorDivText.innerHTML = hexColors[j];
			colorDiv.appendChild(colorDivText);

			// Make color divs tabbable.
			colorDiv.tabIndex = 0;
			colorDiv.style = 'background-color: ' + hexColors[j] + ';';
			colorDiv.setAttribute("role", "button");
			colorDiv.setAttribute('data-index', j + 1);
			colorPalette.appendChild(colorDiv);


			// Get RGB color from background
			let rgbColor = colorDiv.style.backgroundColor;

			// Get human readable colorname
			let colorLabel = getHumanReadableColor(rgbColor, hexColors[j]);
			if (colorLabel.length) {
				colorDiv.setAttribute("aria-label", colorLabel);
			}

			// Check if a color is the new focused element
			colorDiv.addEventListener("blur", colorBlur);

			// Navigate colors in palette
			colorDiv.addEventListener("keyup", colorNavigation, false);
		}

		colorPalette.onmouseenter = function() {
			paletteHasFocus = true;
		}
		colorPalette.onmouseleave = function() {
			paletteHasFocus = false;
		}

		// Close palette if palette or color is clicked
		colorPalette.addEventListener("click", paletteClick, false);

		// Hide colorpalette if paletteHasFocus is false
		colorInput.addEventListener("focusout", hideColorPalette);
	}

	let colorSample = document.querySelectorAll('.' + colorSampleClass)
	for (let i = 0; i < colorSample.length; i++) {
		// Set initial color same as default (should already be set in HTML)
		let defaultColor = colorSample[i].parentNode.dataset.default;
		colorSample[i].style = 'background-color: ' + defaultColor + ';';

		// Get RGB color from background
		let rgbColor = colorSample[i].style.backgroundColor;

		// Add span for human readable text
		let colorSampleText = document.createElement("span");
		colorSampleText.className = screenReaderClass;
		colorSample[i].appendChild(colorSampleText);

		// Update human readable text
		updateColorSampleText(colorSample[i], defaultColor);

		// Display palette if sample is clicked
		colorSample[i].addEventListener("click", showColorPalette, false);
	}

	function colorBlur(e) {
		// Check what element has focus
		if (e.relatedTarget === null) {
			// No element has focus
			this.parentNode.style.display = 'none';
			paletteHasFocus = false;

		} else {
			if (paletteClass !== e.relatedTarget.parentNode.className) {
				// No element in the palette has focus
				this.parentNode.style.display = 'none';
				paletteHasFocus = false;
			}
		}
	}

	function showColorPalette(e) {
		this.parentNode.querySelector('input').focus();

		let palette = this.parentNode.querySelector('.' + paletteClass);
		palette.style.display = 'block';
	}

	function hideColorPalette(e) {
		let colorPalette = this.parentNode.querySelector('.' + paletteClass);
		if (paletteHasFocus === false) {
			colorPalette.style.display = 'none';
		}
	}

	function paletteClick(e) {
		if (paletteClass !== e.target.className) {
			// Get the clicked color
			let hexColor = rgbToHex(e.target.style.backgroundColor);

			this.parentNode.querySelector('input').value = hexColor;
			let colorSample = this.parentNode.querySelector('.' + colorSampleClass);

			colorSample.style = 'background-color: ' + hexColor + ';';
			updateColorSampleText(colorSample, hexColor)

		}
		// Hide palette
		this.style.display = 'none';
		paletteHasFocus = false;
	}

	function colorNavigation(e) {
		// Select color with space or enter
		if (13 === e.which || 32 === e.which) {
			let hexColor = rgbToHex(this.style.backgroundColor);

			this.parentNode.parentNode.querySelector('input').value = hexColor;
			let colorSample = this.parentNode.parentNode.querySelector('.' + colorSampleClass);
			colorSample.style = 'background-color: ' + hexColor + ';';
			updateColorSampleText(colorSample, hexColor)

			this.parentNode.style.display = 'none';
			paletteHasFocus = false;
			return;
		}

		if(27 === e.which) {
			this.parentNode.style.display = 'none';
			paletteHasFocus = false;
			return;
		}

		let index = 0;

		// Palette navigation with arrow keys
		if (40 === e.which) {
			// down arrow
			index = parseInt(this.dataset.index, 10) + row;
		} else if (38 === e.which) {
			// up arrow
			index = parseInt(this.dataset.index, 10) - row;
		} else if (37 === e.which) {
			// left arrow
			index = parseInt(this.dataset.index, 10) - 1;
		} else if (39 === e.which) {
			// right arrow
			index = parseInt(this.dataset.index, 10) + 1;
		} else {
			// Not a navigation key
			return;
		}

		if (0 >= index || hexColors.length < index) {
			return;
		}

		let next = this.parentNode.querySelector('[data-index="' + index + '"]');
		if (next) {
			next.focus();
		}
	}

	function inputTabPressed(e) {
		// Tab key to go to the first color in the palette
		if (9 === e.which) {
			// Palette has focus if a color has focus
			paletteHasFocus = true;
		}
	}

	function updateColorSample(e) {
		// Update colorsample if it's a valid color
		if (isValidHex(this.value)) {
			let colorSample = this.parentNode.querySelector('.' + colorSampleClass);
			colorSample.style = 'background-color: ' + this.value + ';';
			updateColorSampleText(colorSample, this.value);
		}
	}

	function updateColorSampleText(el, hexColor) {
		let span = el.querySelector('span');
		let rgbColor = el.style.backgroundColor;

		let readableColor = getHumanReadableColor(rgbColor, hexColor);
		if (readableColor.length) {
			span.innerHTML = readableColor;
		}
	}

	function getHumanReadableColor(rgbColor, hexColor) {
		if (typeof HumanColours === "undefined") {
			return hexColor;
		}

		let arr = rgbColor.replace('rgb', '').replace('(', '').replace(')', '').split(',');
		let hslColor = rgbToHsl(arr[0], arr[1], arr[2]);
		hslColor = 'hsl(' + hslColor.join(',') + ')';
		let readable = new HumanColours(hslColor);

		return 'Color ' + readable.hueName() + ', ' + readable.saturationName() + ', ' + readable.lightnessName();
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

	function rgbToHsl(r, g, b) {
		r /= 255, g /= 255, b /= 255;

		var max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if (max == min) {
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}

			h /= 6;
		}

		return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
	}
})();