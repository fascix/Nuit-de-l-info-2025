document.addEventListener("DOMContentLoaded", () => {
	// ========== GESTION DU RIDEAU ==========
	const button = document.getElementById("openButton");
	const containerPrincipal = document.getElementById("containerPrincipal");

	button.addEventListener("click", function () {
		containerPrincipal.classList.add("open");

		setTimeout(() => {
			// afficher l'écran username
			document.getElementById("usernameScreen").style.display = "flex";
		}, 2500);
	});

	const startQuizBtn =
		document.getElementById("startQuizBtn") ||
		document.querySelector("#usernameScreen button");
	const usernameInput =
		document.getElementById("username") ||
		document.querySelector("#usernameScreen input");

	startQuizBtn.addEventListener("click", () => {
		const username = usernameInput.value.trim() || "Aventurier";

		// Cacher l'écran username
		document.getElementById("usernameScreen").style.display = "none";

		// Afficher le quiz
		const hiddenContent = document.getElementById("hiddenContent");
		hiddenContent.classList.add("revealed");

		// Créer ou mettre à jour l'affichage du username et score
		let statusDiv = document.getElementById("quizStatus");
		if (!statusDiv) {
			statusDiv = document.createElement("div");
			statusDiv.id = "quizStatus";
			statusDiv.style.position = "fixed";
			statusDiv.style.top = "10px";
			statusDiv.style.right = "10px";
			statusDiv.style.padding = "8px 12px";
			statusDiv.style.background = "rgba(0,0,0,0.6)";
			statusDiv.style.color = "white";
			statusDiv.style.borderRadius = "8px";
			statusDiv.style.fontSize = "14px";
			statusDiv.style.zIndex = "1000";
			document.body.appendChild(statusDiv);
		}
		statusDiv.innerHTML = `Utilisateur : ${username} | Score : 0 / 0`;

		// Sauvegarde dans window pour mise à jour future
		window.quizStatusDiv = statusDiv;
		window.quizUsername = username;
		window.quizScore = 0;
		window.quizTotal = 0;
	});

	// ========== QUIZ ==========
	const questions = [
		{
			q: "La production d'un téléviseur génère environ combien de kg de CO2 ? ",
			answers: ["350 KG", "500 KG", "95 KG", "180 KG"],
			correct: 0,
			source:
				'<a href="https://www. greenpeace.fr/la-pollution-numerique/" target="_blank">Greenpeace</a>, <a href="https://impactco2.fr/outils/numerique/television" target="_blank">ImpactCO2</a>',
			explanation:
				"La production d'un téléviseur génère environ 350 kg de CO2, ce qui représente une part importante de son impact environnemental.   Cette donnée souligne l'importance de prolonger la durée de vie des appareils pour réduire leur empreinte carbone.",
		},
		{
			q: "Que veut dire NIRD ?",
			answers: [
				"Nouilles Instantanées Réchauffées du Dimanche",
				"Numérique Incompréhensible Répressif Dépressif",
				"Nuit Info Réflexion Développement",
				"Numérique Inclusif Responsable Durable",
			],
			correct: 3,
			source:
				'<a href="https://nird.forge.apps.education.fr/index.html" target="_blank">nird.forge.apps.education. fr</a>',
			explanation:
				"NIRD signifie Numérique Inclusif Responsable Durable.   C'est une démarche qui vise à rendre le numérique accessible à tous tout en respectant les principes de durabilité et de responsabilité environnementale.",
		},
		{
			q: "Pourquoi l'utilisation de Linux est une des étapes de la démarche du NIRD ?",
			answers: [
				"Pour utiliser des systèmes libres et durables",
				"Pour que les ordinateurs plantent moins souvent",
				"Pour avoir des antivirus intégrés",
				"Pour faire du café avec les lignes de commande",
			],
			correct: 0,
			source:
				'<a href="https://nird.forge.apps.education. fr/" target="_blank">NIRD</a>',
			explanation:
				"Linux est un système d'exploitation libre qui peut être utilisé sur des machines plus anciennes, ce qui prolonge leur durée de vie et limite les déchets électroniques, s'inscrivant ainsi dans une démarche durable.",
		},
		{
			q: "De quel établissement s'inspire directement la démarche NIRD ?",
			answers: [
				"Lycée Marie Curie",
				"Lycée Carnot",
				"Lycée Simone de Beauvoir",
				"Lycée Alain Borne",
			],
			correct: 1,
			source:
				'<a href="https://nird.forge.apps.education.fr/pilotes/" target="_blank">NIRD Pilotes</a>',
			explanation:
				"La démarche NIRD s'inspire directement du Lycée Carnot, un établissement pionnier dans l'intégration des pratiques numériques responsables et durables.",
		},
		{
			q: "Pourquoi Linux est considéré plus durable et écologique que d'autres systèmes ?",
			answers: [
				"Il fonctionne sur des ordinateurs de 10 ans comme si c'était du neuf",
				"Il transforme l'électricité en énergie verte",
				"Linux plante moins que les autres systèmes",
				"Il vient avec un manuel de recyclage intégré",
			],
			correct: 0,
			source: '<a href="https://www. greenit.fr/" target="_blank">GreenIT</a>',
			explanation:
				"Linux peut fonctionner efficacement sur des ordinateurs anciens, évitant ainsi l'achat fréquent de matériel neuf et réduisant l'impact environnemental lié à la production et au recyclage des équipements.",
		},
		{
			q: "Quel est l'avantage de Linux pour la sécurité informatique ?",
			answers: [
				"Il est totalement invincible contre les pirates",
				"Il bénéficie de mises à jour fréquentes et de permissions strictes",
				"Les antivirus sont intégrés à chaque pixel",
				"Les hackers le détestent et s'enfuient",
			],
			correct: 1,
			source:
				'<a href="https://www.linux.org/security/" target="_blank">Linux Security</a>',
			explanation:
				"Linux bénéficie de mises à jour régulières et d'un système de permissions rigoureux, ce qui renforce sa sécurité et protège mieux les utilisateurs contre les attaques.",
		},
		{
			q: "L'utilisation de Linux dans la démarche NIRD permet de :",
			answers: [
				"Faire des sauvegardes automatiques dans l'espace",
				"Réduire l'empreinte numérique et promouvoir le logiciel libre",
				"Faire du café avec les lignes de commande",
				"Changer la couleur des fichiers en arc-en-ciel",
			],
			correct: 1,
			source:
				'<a href="https://nird.forge.apps.education.fr/" target="_blank">NIRD</a>',
			explanation:
				"L'utilisation de Linux contribue à réduire l'empreinte numérique grâce à l'usage de logiciels libres, favorisant la durabilité et l'accessibilité du numérique.",
		},
		{
			q: "Qu'est-ce qui rend la démarche NIRD particulièrement ambitieuse dans les écoles et établissements ?",
			answers: [
				"Elle veut équiper tout le monde avec des tablettes qui font aussi des sandwichs",
				"Elle cherche à intégrer la transformation numérique ET la transition écologique, tout en mobilisant les collectivités et l'institution",
				"Chaque élève devient un super-héros numérique dès la rentrée",
				"Chaque salle de classe a son propre serveur avec un pingouin mascotte",
			],
			correct: 1,
			source:
				'<a href="https://nird.forge.apps.education.fr/" target="_blank">NIRD</a>, <a href="https://eduscol.education.fr/" target="_blank">Eduscol</a>',
			explanation:
				"La démarche NIRD est ambitieuse car elle combine la transformation numérique avec la transition écologique, impliquant à la fois les collectivités, les établissements et l'institution éducative.",
		},
		{
			q: "Pourquoi le reconditionnement d'ordinateurs par les élèves est-il considéré comme une action durable et responsable ?",
			answers: [
				"Chaque ordinateur sauvé devient un super-héros",
				"Cela allonge la durée de vie du matériel et réduit les déchets",
				"Les ordinateurs reconditionnés se déplacent seuls",
				"Chaque élève reçoit une cape verte",
			],
			correct: 1,
			source:
				'<a href="https://eduscol.education.fr/" target="_blank">Eduscol</a>, <a href="https://nird.forge.apps.education. fr/" target="_blank">NIRD</a>',
			explanation:
				"Le reconditionnement permet de prolonger la vie des ordinateurs, ce qui diminue la production de déchets électroniques et l'impact environnemental associé.",
		},
	];

	const cardsDiv = document.getElementById("cards");

	// Initialiser les explications
	questions.forEach((q) => {
		if (! q.explanation) q.explanation = "";
	});

	// ========== FONCTION POUR AFFICHER LA PAGE DE FIN ==========
	function showEndScreen() {
		// Calculer le pourcentage
		const percentage = Math.round((window.quizScore / window.quizTotal) * 100);

		// Cacher le quiz
		const hiddenContent = document.getElementById("hiddenContent");
		if (hiddenContent) {
			hiddenContent.style.display = "none";
		}

		// Cacher le status
		if (window.quizStatusDiv) {
			window.quizStatusDiv.style.display = "none";
		}

		// Afficher la page de fin
		const endScreen = document.getElementById("endScreen");
		if (endScreen) {
			endScreen.classList.remove("hidden");

			// Remplir les données
			document.getElementById("endUsername").textContent = window.quizUsername;
			document.getElementById("finalScore").textContent = window.quizScore;
			document.getElementById("finalTotal").textContent = window.quizTotal;
			document.getElementById("finalPercentage"). textContent = percentage;
		}
	}

	// ========== BOUTON RECOMMENCER ==========
	const restartBtn = document.getElementById("restartBtn");
	if (restartBtn) {
		restartBtn.addEventListener("click", () => {
			location.reload();
		});
	}

	// Créer les cartes de questions
	questions.forEach((q, index) => {
		const card = document.createElement("div");
		card.classList.add("card");
		if (index === 0) card.classList.add("active");

		// ========== CARTE AVEC LA QUESTION ==========
		const questionCard = document.createElement("div");
		questionCard.classList.add("question-card");

		const questionText = document.createElement("p");
		questionText.innerHTML = q.q;
		questionCard.appendChild(questionText);

		card.appendChild(questionCard);

		// ========== RÉPONSES (en dessous de la carte) ==========
		const answersDiv = document.createElement("div");
		answersDiv.classList. add("answers");

		q. answers.forEach((ans, i) => {
			const btn = document.createElement("button");
			btn.innerHTML = ans;
			btn.addEventListener("click", () => {
				if (answersDiv.classList.contains("answered")) return;
				answersDiv.classList.add("answered");
				answersDiv
					.querySelectorAll("button")
					.forEach((b) => (b.disabled = true));

				// Incrémenter score
				window.quizTotal++;
				if (i === q.correct) {
					btn.classList.add("correct");
					window.quizScore++;
				} else {
					btn.classList.add("wrong");
					answersDiv
						.querySelectorAll("button")
						[q.correct]. classList.add("correct");
				}

				// Mettre à jour l'affichage en temps réel
				if (window.quizStatusDiv) {
					window.quizStatusDiv.innerHTML = `Utilisateur : ${window.quizUsername} | Score : ${window.quizScore} / ${window.quizTotal}`;
				}

				// Afficher l'explication
				let explanationDiv = card.querySelector(".explanation");
				if (!explanationDiv) {
					explanationDiv = document.createElement("div");
					explanationDiv. classList.add("explanation");
					card.appendChild(explanationDiv);
				}
				explanationDiv.textContent = q.explanation;

				// ========== VÉRIFIER SI ON ATTEINT 5 BONNES RÉPONSES ==========
				if (window.quizScore >= 5) {
					setTimeout(() => {
						showEndScreen();
					}, 1000); // Délai de 1 seconde pour laisser voir la réponse
				}
			});
			answersDiv.appendChild(btn);
		});

		card.appendChild(answersDiv);

		// ========== SOURCE ==========
		const sourceDiv = document.createElement("div");
		sourceDiv.classList.add("source");
		sourceDiv.innerHTML = "Source : " + q.source;
		card.appendChild(sourceDiv);

		cardsDiv.appendChild(card);
	});

	// Navigation entre les cartes
	let currentCard = 0;
	const allCards = document.querySelectorAll(".card");
	const prevBtn = document.getElementById("prevBtn");
	const nextBtn = document. getElementById("nextBtn");

	function showCard(index) {
		allCards.forEach((c) => c.classList.remove("active"));
		allCards[index]. classList.add("active");
		prevBtn.disabled = index === 0;
		nextBtn.disabled = index === allCards.length - 1;
	}

	prevBtn.addEventListener("click", () => {
		if (currentCard > 0) {
			currentCard--;
			showCard(currentCard);
		}
	});

	nextBtn.addEventListener("click", () => {
		if (currentCard < allCards.length - 1) {
			currentCard++;
			showCard(currentCard);
		}
	});
});