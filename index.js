import { createInterface } from 'readline';
import { promises as fs } from 'fs';
import crackShiftCipher from './src/crackShiftCipher.js';
import calcFrequency from './src/calcFrequency';
import crackComplex from './src/crackComplex';

const readline = createInterface({
	input: process.stdin,
	output: process.stdout,
});

readline.question(
	`Enter the path of the file you'd like to crack: `,
	async file => {
		readline.close();
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

		crackComplex(string);
	}
);
