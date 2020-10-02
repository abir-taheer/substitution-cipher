import fs from 'fs';
import stringSimilarity from 'string-similarity';

export const charMap = {};
export const lenMap = {};

const dict = fs.readFileSync('dictionary.txt');
const words = dict.toString().split('\n');

words.forEach(word => {
	const firstChar = word.charAt(0);
	let charWords = charMap[firstChar];
	if (!charWords) {
		charWords = [];
		charMap[firstChar] = charWords;
	}

	let lenWords = lenMap[word.length];
	if (!lenWords) {
		lenWords = [];
		lenMap[word.length] = lenWords;
	}

	lenWords.push(word);
	charWords.push(word);
});

// Expects word to be lowercase
export function isInDict(word) {
	const relevantWords = charMap[word[0]];

	for (let i = 0; i < relevantWords.length; i++) {
		if (stringSimilarity.compareTwoStrings(word, relevantWords[i]) > 0.9) {
			return true;
		}
	}

	return false;
}
