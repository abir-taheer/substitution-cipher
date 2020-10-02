import en from 'dictionary-en';
import binarySearch from 'binary-search';

export const dictPromise = new Promise((resolve, reject) => {
	const charMap = {};
	const lenMap = {};

	en((err, res) => {
		if (err) {
			reject(err);
		} else {
			// convert the dictionary into a useful object
			const words = res.dic
				.toString()
				.split('\n')
				.map(line => line.split('/')[0].toLowerCase());

			words.forEach(word => {
				const firstChar = word.charAt(0);
				let charWords = charMap[firstChar];
				if (!charWords) {
					charWords = [];
					charMap[firstChar] = charWords;
				}

				let lenWords = lenMap[word.length];
				if (lenWords) {
					lenWords = [];
					lenMap[word.length] = lenWords;
				}

				lenWords.push(word);
				charWords.push(word);
			});

			resolve({ charMap, lenMap });
		}
	});
});

// Expects word to be lowercase
export async function isInDict(word) {
	const dict = await dictPromise;

	const relevantWords = dict.charMap[word[0]];

	return binarySearch(relevantWords, word, (a, b) => a.localeCompare(b)) >= 0;
}
