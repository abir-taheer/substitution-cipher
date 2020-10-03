import { promises as fs } from 'fs';
import crackShiftCipher from './src/crackShiftCipher.js';
import crackComplex from './src/crackComplex';
import yargs from 'yargs';

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

	console.log(
		'Attempted to solve with dictionary matching and frequency analysis'
	);
	console.log(crackComplex(string));
})();
