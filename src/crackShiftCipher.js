import calcFrequency from './calcFrequency.js';
import shiftChars from './shiftChars.js';
import { isInDict } from './compareDict.js';

export default async function crackShiftCipher(text) {
	text = text.toLowerCase();
	const frequencies = calcFrequency(text);

	const letterPopularity = Object.keys(frequencies).sort(
		(a, b) => frequencies[b] - frequencies[a]
	);

	const alternatives = [];

	for (let i = 0; i < letterPopularity.length; i++) {
		const possibleE = letterPopularity[i];

		const key = (101 - possibleE.charCodeAt(0) + 26) % 26;

		const newText = shiftChars(text, key);

		const words = newText.split(new RegExp(/[^a-z]/)).filter(Boolean);
		let numValidWords = 0;

		words.forEach(word => {
			if (isInDict(word)) {
				numValidWords++;
			}
		});

		const confidence = numValidWords / words.length;

		const info = {
			key,
			decoded: newText,
			confidence: confidence,
		};

		if (confidence > 0.8) {
			return {
				match: info,
				alternatives: alternatives,
			};
		}

		alternatives.push(info);
	}

	alternatives.sort((a, b) => b.confidence - a.confidence);

	const match = alternatives.splice(0, 1)[0];

	return {
		match,
		alternatives: alternatives.splice(0, 5),
	};
}
