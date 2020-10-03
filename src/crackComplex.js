import calcFrequency, { allLetters } from './calcFrequency';
import { lenMap } from './compareDict';
import stringSimilarity from 'string-similarity';

const calculateFinalMappings = scores => {
	// Make a copy so that we can freely modify
	const scoresCopy = JSON.parse(JSON.stringify(scores));
	const mappings = {};

	let duplicates = true;

	while (duplicates) {
		Object.keys(scoresCopy).forEach(fakeLetter => {
			let highestScore = 0;
			let char = null;
			Object.keys(scoresCopy[fakeLetter]).forEach(decodedLetter => {
				if (scoresCopy[fakeLetter][decodedLetter] > highestScore) {
					highestScore = scoresCopy[fakeLetter][decodedLetter];
					char = decodedLetter;
				}
			});

			mappings[fakeLetter] = { char, score: highestScore };
		});

		duplicates = false;

		let mappingKeys = Object.keys(mappings);

		mappingKeys.forEach((outer, index) => {
			mappingKeys.forEach((inner, innerIndex) => {
				if (
					index !== innerIndex &&
					mappings[outer].char &&
					mappings[outer].char === mappings[inner].char
				) {
					if (mappings[outer].score > mappings[inner].score) {
						delete scoresCopy[inner][mappings[inner].char];
					} else {
						delete scoresCopy[outer][mappings[outer].char];
					}

					duplicates = true;
				}
			});
		});
	}

	return mappings;
};

function rewriteWord(word, mappings, original) {
	let newWord = '';

	for (let i = 0; i < word.length; i++) {
		const char = word[i];
		if (mappings[char] && mappings[char].char) {
			newWord += mappings[char].char;
		} else {
			newWord += original ? char : '?';
		}
	}

	return newWord;
}

export default function crackComplex(text, initialMappings) {
	text = text.toLowerCase();
	// Each letter has an array of possible mappings with confidence
	const letterMappings = {};

	const words = text.split(new RegExp(/[^a-z]/)).filter(Boolean);

	allLetters.forEach(char => {
		letterMappings[char] = {};

		if (initialMappings[char]) {
			// Some absurdly high value to guarantee the match
			letterMappings[char][initialMappings[char]] = 100000000;
		}
	});

	const percentages = calcFrequency(text);

	const frequencyOrder = Object.keys(percentages).sort(
		(a, b) => percentages[b] - percentages[a]
	);

	const addToScore = (decoy, actual, score) => {
		if (!letterMappings[decoy][actual]) {
			letterMappings[decoy][actual] = 0;
		}

		letterMappings[decoy][actual] += score;
	};

	addToScore(frequencyOrder[0], 'e', 100);
	addToScore(frequencyOrder[0], 'a', 80);
	addToScore(frequencyOrder[0], 'i', 60);

	addToScore(frequencyOrder[1], 'e', 80);
	addToScore(frequencyOrder[1], 'a', 90);
	addToScore(frequencyOrder[1], 'i', 80);

	addToScore(frequencyOrder[2], 'e', 70);
	addToScore(frequencyOrder[2], 'a', 80);
	addToScore(frequencyOrder[2], 'i', 80);

	const getLetterPositions = word => {
		const letterPositions = {};

		for (let i = 0; i < word.length; i++) {
			const char = word[i];
			let positionArray = letterPositions[char];

			if (!positionArray) {
				positionArray = [];
				letterPositions[char] = positionArray;
			}

			positionArray.push(i);
		}

		return letterPositions;
	};

	words.forEach(word => {
		if (word.length === 1) {
			addToScore(word, 'a', 900);
			addToScore(word, 'i', 800);
		}

		if (word.length === 2) {
			addToScore(word[0], 'o', 80);
			addToScore(word[1], 'f', 80);

			addToScore(word[0], 't', 80);
			addToScore(word[1], 'o', 60);

			addToScore(word[0], 'a', 50);
			addToScore(word[0], 'n', 50);

			// addToScore(word[0], 'i', 50);
			addToScore(word[0], 'n', 50);
		}

		// Check to see if there are consecutive same letters
		for (let i = 0; i < word.length - 1; i++) {
			const char = word[i];
			if (char === word[i + 1]) {
				addToScore(char, 'l', 10);
				addToScore(char, 's', 8);
				addToScore(char, 'e', 8);
				addToScore(char, 'o', 8);
				addToScore(char, 'p', 6);
			}
		}

		const decoyLetterPositions = getLetterPositions(word);

		lenMap[word.length].forEach(possibility => {
			const possibleLetterPositions = getLetterPositions(possibility);

			Object.keys(decoyLetterPositions).forEach(fakeChar => {
				const fakeCharPositions = decoyLetterPositions[fakeChar];

				Object.keys(possibleLetterPositions).forEach(possibleLetter => {
					const possiblePositions = possibleLetterPositions[possibleLetter];

					const isMoreThanOne =
						fakeCharPositions.length > 1 && possiblePositions.length > 1;

					if (
						(word.length <= 2 || isMoreThanOne) &&
						JSON.stringify(possiblePositions) ===
							JSON.stringify(fakeCharPositions)
					) {
						// THIS IS VERY USEFUL
						addToScore(fakeChar, possibleLetter, 1);
					}
				});
			});
		});
	});

	const mappings = calculateFinalMappings(letterMappings);

	const guess = words.map(word => rewriteWord(word, mappings));

	return {
		estimate: guess
			.map(word => {
				let similarWords = Array.from(lenMap[word.length]);

				for (let i = 0; i < word.length; i++) {
					const char = word[i];

					if (char === '?') {
						continue;
					}

					const smallerDict = similarWords.filter(
						similar => similar[i] === word[i]
					);

					if (smallerDict.length > 2) {
						similarWords = smallerDict;
					}
				}

				return stringSimilarity.findBestMatch(word, similarWords).bestMatch
					.target;
			})
			.join(' '),
		original: words.join(' '),
		replaced: guess.join(' '),
		mappings,
	};
}
