const allLetters = Array(26)
	.fill(null)
	.map((val, index) => String.fromCharCode(97 + index));

function calcFrequency(text) {
	const frequencies = {};
	const percentages = {};

	allLetters.forEach(char => {
		frequencies[char] = 0;
	});

	const characters = text
		.toLowerCase()
		.split('')
		.filter(char => char >= 'a' && char <= 'z');

	characters.forEach(char => {
		frequencies[char]++;
	});

	// Doing percentage calculations at the end because floats are weird
	allLetters.forEach(char => {
		percentages[char] = frequencies[char] / characters.length;
	});

	return percentages;
}

module.exports = calcFrequency;
