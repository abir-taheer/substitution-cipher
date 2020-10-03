import { promises as fs } from 'fs';
import yargs from 'yargs';
import calcFrequency from "./src/calcFrequency";

const file = yargs.argv._[0];

(async () => {
	const data = await fs.readFile(file);
	const string = data.toString();

	console.log(calcFrequency(string));
})();
