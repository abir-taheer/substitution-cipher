// Preserves original case
export default function shiftChars(text, key) {
	let newText = '';

	for (let i = 0; i < text.length; i++) {
		const char = text[i];

		const isLowerCase = char >= 'a' && char <= 'z';
		const isLetter = isLowerCase || (char >= 'A' && char <= 'Z');

		if (isLetter) {
			const charOffset = isLowerCase ? 97 : 65;
			const letterIndex = char.charCodeAt(0) - charOffset;
			const newCharCode = ((letterIndex + key) % 26) + charOffset;

			newText += String.fromCharCode(newCharCode);
		} else {
			newText += char;
		}
	}

	return newText;
}
