import axios from 'axios';
import fs from 'fs';

axios
	.get(
		'http://app.aspell.net/create?max_size=10&spelling=US&max_variant=1&diacritic=strip&special=hacker&download=wordlist&encoding=utf-8&format=inline'
	)
	.then(res => {
		const data = res.data.toString().toLowerCase();
		fs.writeFileSync('dictionary.txt', data.substr(data.indexOf('---') + 4));
	});
