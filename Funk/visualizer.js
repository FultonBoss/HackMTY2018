// Atributos de barras y background
let displayBins = 512;
let backgroundColour = "#ABF639";
let barColour ="#bf0137";
let songFont = "15px 'Arial'";
// *IMPORTANTE* Movimiento max barras
// Movimiento de barra
let floorLevel = 100;
let drawPitch = true;
let drawCurved = true;
let drawFilled = false;
let drawText = false;
// Grafica de sonido
let audioContext;
// cargan 'snippets' de audio
let audioBuffer;
// Invoca frecuencia en tiempo real y analysis del sonido
let audioAnalyserNode;
let audioVisualizerInitialized = false;
let songText = "";
// tamaño
let textSize;
// canvas Caracteristicas
let canvasContext;
let canvasWidth;
let canvasHeight;
//Operaciones
let multiplier;
//caracteristicas bin
let finalBins = [];
let logLookupTable = [];
let logBinLengths = [];
let binWidth;
let magicConstant = 42; //Wea pokemon
//Inicializacion de variables
function initializeVisualizer(canvasElement, audioElement) {
	try {
		let ctxt = window.AudioContext || window.webkitAudioContext;
		if (ctxt) {
			initCanvas(canvasElement);
			audioContext = new ctxt();
			setupAudioApi(audioElement);
		}
	} catch(e) {
		console.log(e);
	}
}
function updateSongText(newText) {
	songText = newText;
	if (canvasContext)
		textSize = canvasContext.measureText(songText);
}

function setupAudioApi(audioElement) {
	let src = audioContext.createMediaElementSource(audioElement);

	audioAnalyserNode = audioContext.createAnalyser();

	audioAnalyserNode.fftSize = drawPitch ? displayBins * 8 : displayBins * 2;
	multiplier = Math.pow(22050, 1 / displayBins) * Math.pow(1 / magicConstant, 1 / displayBins);
	finalBins = [];
	logLookupTable = [];
	logBinLengths = [];
	for (let i = 0; i < displayBins; i++) {
		finalBins.push(0);
		logLookupTable.push(0);
	}
	createLookupTable(audioAnalyserNode.frequencyBinCount, logBinLengths, logLookupTable);
	binWidth = Math.ceil(canvasWidth / (displayBins - 1));

	src.connect(audioAnalyserNode);
	audioAnalyserNode.connect(audioContext.destination);audioVisualizerInitialized = true;
}

function initCanvas(canvasElement) {
	canvasContext = canvasElement.getContext('2d');
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	requestAnimationFrame(paint);
	canvasContext.font = songFont;
	canvasContext.strokeStyle = barColour;

	textSize = canvasContext.measureText(songText);
}
//Pinta la grafica
function paint() {
	requestAnimationFrame(paint);

	if(!audioVisualizerInitialized)
		return;

	canvasContext.fillStyle = backgroundColour;
	canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);

	let bins = audioAnalyserNode.frequencyBinCount;
	let data = new Uint8Array(bins);
	audioAnalyserNode.getByteFrequencyData(data);
	canvasContext.fillStyle = barColour;

	if (drawPitch)
		updateBinsLog(logLookupTable, data);
	else
		updateBins(bins, logBinLengths, data);

	if (!drawCurved) {
		for (let i = 0; i < displayBins; i++) {
			paintSingleBin(i);
		}
	} else {
		canvasContext.fillStyle = barColour;
		canvasContext.beginPath();
		canvasContext.moveTo(0, canvasHeight - getBinHeight(0));
		let i;
		for (i = 0; i < displayBins - 2;) {
			var thisX = i * binWidth;
			var nextX = (i + logBinLengths[i]) * binWidth; //First subbin of the next bin
			var x = (thisX + nextX) / 2;

			var thisY = canvasHeight - getBinHeight(i);
			var nextY = canvasHeight - getBinHeight(i + logBinLengths[i]);
			var y = (thisY + nextY) / 2;

			canvasContext.quadraticCurveTo(thisX, thisY, x, y);

			i += logBinLengths[i];
		}
		canvasContext.quadraticCurveTo(i * binWidth, canvasHeight - getBinHeight(i), (i + 1) * binWidth, canvasHeight - getBinHeight(i + 1));
		if (drawFilled) {
			canvasContext.lineTo(canvasWidth, canvasHeight);
			canvasContext.lineTo(0, canvasHeight);
			canvasContext.fill();
		} else {
			canvasContext.stroke();
		}
	}

	if (drawText) {
		canvasContext.fillStyle = 'white';
		//Note: the 15's here need to be changed if you change the font size
		canvasContext.fillText(songText, canvasWidth / 2 - textSize.width / 2, canvasHeight / 2 - 15 / 2 + 15);
	}
}
//Visualizacion de la tabla en enfoque a el TOP MIN
function averageRegion(data, start, stop) {
	if (stop <= start)
		return data[start];

	let sum = 0;
	for (let i = start; i < stop; i++) {
		sum += data[i];
	}
	return sum / (stop - start);
}

function updateBins(bins, binLengths, data) {
	let step = bins / displayBins;
	for (let i = 0; i < displayBins; i++) {
		let lower = i * step;
		let upper = (i + 1) * step - 1;
		let binValue = averageRegion(data, lower, upper);
		binLengths.push(1);
		finalBins[i] = binValue;
	}
}

function createLookupTable(bins, binLengths, lookupTable) {
	if (drawPitch) {
		let lastFrequency = magicConstant / multiplier;
		let currentLength = 0;
		let lastBinIndex = 0;
		for (let i = 0; i < displayBins; i++) {
			let thisFreq = lastFrequency * multiplier;
			lastFrequency = thisFreq;
			let binIndex = Math.floor(bins * thisFreq / 22050);
			lookupTable[i] = binIndex;
			currentLength++;

			if (binIndex != lastBinIndex) {
				for (let j = 0; j < currentLength; j++)
					binLengths.push(currentLength);
				currentLength = 0;
			}

			lastBinIndex = binIndex;
		}
	} else {
		for (let i = 0; i < displayBins; i++) {
			lookupTable[i] = i;
		}
	}
}

function updateBinsLog(lookupTable, data) {
	for (let i = 0; i < displayBins; i++) {
		finalBins[i] = data[lookupTable[i]];
	}
}

function getBinHeight(i) {
	let binValue = finalBins[i];
  let height = Math.max(0, (binValue - floorLevel));
  return height;
}

function paintSingleBin(i) {
	let height = getBinHeight(i);
	canvasContext.fillRect(i * binWidth, canvasHeight - height, binWidth, height);
}
