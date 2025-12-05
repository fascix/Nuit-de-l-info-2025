// Toutes les lettres AZERTY dans l'ordre de lecture (gauche à droite, haut en bas)
const azertyLetters = "azertyuiopqsdfghjklmwxcvbn";

// Création de la map avec décalage +1 global
const shiftMap = {};

for (let i = 0; i < azertyLetters.length; i++) {
	const currentLetter = azertyLetters[i];
	const nextLetter = azertyLetters[(i + 1) % azertyLetters.length];
	shiftMap[currentLetter] = nextLetter;
	shiftMap[currentLetter.toUpperCase()] = nextLetter.toUpperCase();
}

// Inversions des caractères spéciaux français (cycle)
shiftMap["é"] = "è";
shiftMap["è"] = "à";
shiftMap["à"] = "ù";
shiftMap["ù"] = "é";
shiftMap["É"] = "È";
shiftMap["È"] = "À";
shiftMap["À"] = "Ù";
shiftMap["Ù"] = "É";

// Gestion spéciale pour ç, x, c
shiftMap["ç"] = "c"; // ç donne c
shiftMap["Ç"] = "C";
shiftMap["x"] = "ç"; // x donne ç (au lieu de c normalement)
shiftMap["X"] = "Ç";
shiftMap["c"] = "v"; // c donne v (comme dans le décalage normal)
shiftMap["C"] = "V";

const input = document.getElementById("username");
let actualValue = "";

input.addEventListener("keydown", function (e) {
	if (e.key.length > 1 && e.key !== "Backspace" && e.key !== "Delete") {
		return;
	}

	e.preventDefault();

	const cursorPosition = this.selectionStart;
	const cursorEnd = this.selectionEnd;

	if (e.key === "Backspace") {
		if (cursorPosition > 0 && cursorPosition === cursorEnd) {
			actualValue =
				actualValue.slice(0, cursorPosition - 1) +
				actualValue.slice(cursorPosition);
		} else if (cursorPosition !== cursorEnd) {
			actualValue =
				actualValue.slice(0, cursorPosition) + actualValue.slice(cursorEnd);
		}
	} else if (e.key === "Delete") {
		if (cursorPosition < actualValue.length && cursorPosition === cursorEnd) {
			actualValue =
				actualValue.slice(0, cursorPosition) +
				actualValue.slice(cursorPosition + 1);
		} else if (cursorPosition !== cursorEnd) {
			actualValue =
				actualValue.slice(0, cursorPosition) + actualValue.slice(cursorEnd);
		}
	} else if (e.key.length === 1) {
		actualValue =
			actualValue.slice(0, cursorPosition) +
			e.key +
			actualValue.slice(cursorEnd);
	}

	// Transformer selon le décalage
	let transformedValue = "";
	for (let char of actualValue) {
		if (shiftMap[char]) {
			transformedValue += shiftMap[char];
		} else {
			transformedValue += char;
		}
	}

	this.value = transformedValue;

	const newCursorPos =
		e.key === "Backspace"
			? Math.max(0, cursorPosition - 1)
			: e.key === "Delete"
			? cursorPosition
			: cursorPosition + 1;

	this.setSelectionRange(newCursorPos, newCursorPos);
});

input.addEventListener("paste", (e) => e.preventDefault());
input.addEventListener("cut", (e) => e.preventDefault());
