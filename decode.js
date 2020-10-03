import { promises as fs } from 'fs';
import crackShiftCipher from './src/crackShiftCipher.js';
import crackComplex from './src/crackComplex';
import yargs from 'yargs';
const prompt = require('prompt-sync')();
const colors = require('colors');

const file = yargs.argv._[0];

(async () => {
	const data = await fs.readFile(file);
	const string = data.toString();

	// Try to crack it using a simple cipher first
	const simpleTest = await crackShiftCipher(string);
	if (simpleTest.match.confidence > 0.7) {
		console.log(simpleTest);
		console.log('Code broken with simple shift cipher.');
		console.log('Best Match: ' + simpleTest.match.decoded);
		return;
	}

	console.log(`We couldn't use a simple cipher to break the code.\n`);
	console.log(
		`We are going to try frequency analysis but before we begin, are there any letters you already know for certain?`
	);
	console.log(
		`You can enter them below in the format <encoded character>=<decoded character> like so: ` +
			'g=t,o=l'.blue
	);
	console.log('');

	const mappingText = prompt(
		'Enter any mappings you are aware of (you can leave this blank): '
	);

	try {
		let ran = false;

		const mappings = {};

		if (mappingText) {
			mappingText
				.toLowerCase()
				.split(',')
				.map(individual => individual.split('='))
				.forEach(mapping => (mappings[mapping[0]] = mapping[1]));
		}

		let inputText = null;

		while (!ran || inputText) {
			ran = true;
			console.log(
				'Attempting to solve with dictionary matching and frequency analysis\n'
			);
			const attempt = crackComplex(string, mappings);

			console.log('original text: \t' + attempt.original.red);
			console.log('');
			console.log('replaced text: \t' + attempt.replaced.blue);
			console.log('');
			console.log('estimate : \t' + attempt.estimate.green);
			console.log('');
			console.log(
				'mappings: ' +
					Object.keys(attempt.mappings)
						.filter(char => Boolean(attempt.mappings[char].char))
						.map(char => `${char}=${attempt.mappings[char].char}`)
						.join(',').gray
			);
			console.log('');

			console.log(
				`If you notice a pattern you may enter new mappings below as well as update existing mappings.`
			);

			inputText = prompt(
				'Else you can just leave it empty and hit enter to exit the program:'
			);

			if (inputText) {
				inputText
					.toLowerCase()
					.split(',')
					.map(individual => individual.split('='))
					.forEach(mapping => (mappings[mapping[0]] = mapping[1]));
			}
		}
	} catch (er) {
		console.log('There was an unexpected error: ');
		console.error(er);
	}
})();
