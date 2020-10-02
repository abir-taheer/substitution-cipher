export const allLetters = Array(26)
	.fill(null)
	.map((val, index) => String.fromCharCode(97 + index));

const cache = {};

export default function calcFrequency(text) {
	if (cache[text]) {
		return cache[text];
	}

	const lowercaseText = text.toLowerCase();
	const frequencies = {};
	const percentages = {};

	let numChars = 0;

	// Initialize the frequency and percentages object
	allLetters.forEach(char => {
		frequencies[char] = 0;
		percentages[char] = 0;
	});

	for (let i = 0; i < lowercaseText.length; i++) {
		const char = lowercaseText[i];

		if (char >= 'a' && char <= 'z') {
			numChars++;
			frequencies[char]++;
		}
	}

	if (numChars > 0) {
		// Doing percentage calculations at the end because floats are weird
		allLetters.forEach(char => {
			percentages[char] = frequencies[char] / numChars;
		});
	}

	cache[text] = percentages;

	return percentages;
}
