document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. LISTE DES QUESTIONS (Déplacée en haut pour éviter les bugs)
    // ==========================================
    const questions = [
        {
            q: "La production d'un téléviseur génère environ combien de kg de CO2 ? ",
            answers: ["350 KG", "500 KG", "95 KG", "180 KG"],
            correct: 0,
            source: '<a href="https://www.greenpeace.fr/la-pollution-numerique/" target="_blank">Greenpeace</a>',
            explanation: "La production d'un téléviseur génère environ 350 kg de CO2. Prolongez leur durée de vie !"
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
            source: '<a href="https://nird.forge.apps.education.fr/" target="_blank">NIRD</a>',
            explanation: "NIRD signifie Numérique Inclusif Responsable Durable."
        },
        {
            q: "Pourquoi l'utilisation de Linux est une des étapes de la démarche du NIRD ?",
            answers: [
                "Car il est un outil pédagogique, éthique et écologique",
                "Car Linux est le seul système compatible Nuit de l’Info",
                "Car Linux offre une sécurité absolue",
                "Car il permet d’avoir ChatGPT gratuit",
            ],
            correct: 0,
            source: '<a href="https://nird.forge.apps.education.fr/linux/" target="_blank">NIRD Linux</a>',
            explanation: "Linux prolonge la durée de vie des vieilles machines (écologique) et est libre (éthique)."
        },
        {
            q: "De quel établissement s'inspire directement la démarche NIRD ?",
            answers: ["Lycée Marie Curie", "Lycée Carnot", "Lycée Simone de Beauvoir", "Lycée Alain Borne"],
            correct: 1,
            source: '<a href="https://nird.forge.apps.education.fr/pilotes/" target="_blank">NIRD Pilotes</a>',
            explanation: "La démarche s'inspire du Lycée Carnot, pionnier en la matière."
        },
        {
            q: "En quoi le reconditionnement par les élèves est une bonne chose ?",
            answers: [
                "Pour revendre et faire du profit",
                "Rend le PC plus puissant que neuf",
                "Pour se faire bien voir",
                "C'est une activité ludique et une expérience concrète de développement durable"
            ],
            correct: 3,
            source: '<a href="https://nird.forge.apps.education.fr/reconditionnement/" target="_blank">NIRD Reconditionnement</a>',
            explanation: "Cela permet de prendre conscience de l'impact écologique et de l'importance du réemploi."
        },
        {
            q: "Comment s'appelle le forum disponible sur le site de la démarche NIRD ?",
            answers: ["Tchop", "Tchap", "Tchaaap", "Atchoum"],
            correct: 1,
            source: '<a href="https://nird.forge.apps.education.fr/tools/" target="_blank">NIRD Tools</a>',
            explanation: "Le forum s'appelle Tchap et permet l'entraide sécurisée."
        },
        {
            q: "Quelles sont les 3 piliers de la démarche NIRD ?",
            answers: [
                "Inclusion Responsabilité Durabilité",
                "Inspiration Réflexion Digitalisation",
                "Inclusion Réflexion Durabilité",
                "Inclusion Responsabilité Digitalisation",
            ],
            correct: 0,
            source: '<a href="https://nird.forge.apps.education.fr/" target="_blank">NIRD</a>',
            explanation: "Inclusion, Responsabilité, Durabilité sont les piliers fondamentaux."
        }
    ];

    // ==========================================
    // 2. VARIABLES GLOBALES
    // ==========================================
    let timerInterval;
    let secondsElapsed = 0;
    let currentCard = 0;
    
    // Initialisation des variables globales pour le score
    window.quizScore = 0;
    window.quizTotal = 0;
    window.quizUsername = "Aventurier";

    // ==========================================
    // 3. GESTION DU RIDEAU (Ouverture)
    // ==========================================
    const openButton = document.getElementById("openButton");
    const containerPrincipal = document.getElementById("containerPrincipal");
    const usernameScreen = document.getElementById("usernameScreen");

    if (openButton) {
        openButton.addEventListener("click", function () {
            containerPrincipal.classList.add("open");
            setTimeout(() => {
                if (usernameScreen) usernameScreen.style.display = "flex";
            }, 2500);
        });
    }

    // ==========================================
    // 4. DEMARRAGE DU QUIZ (Le bouton qui buggait)
    // ==========================================
    const startQuizBtn = document.getElementById("startQuizBtn");
    const usernameInput = document.getElementById("username");

    if (startQuizBtn) {
        startQuizBtn.addEventListener("click", () => {
            
            // A. Gestion du nom utilisateur
            const inputVal = usernameInput ? usernameInput.value.trim() : "";
            window.quizUsername = inputVal || "Aventurier";

            // B. Lancer le timer (Correction ici : on ne calcule plus timeLeft)
            startTimer();

            // C. Lancer la musique
            const maMusique = document.getElementById("musique-fond");
            if(maMusique){
                maMusique.volume = 0.5;
                maMusique.play().catch(e => console.log("Autoplay bloqué", e));
            }

            // D. Interface : Cacher Username -> Afficher Quiz
            if (usernameScreen) usernameScreen.style.display = "none";
            
            const hiddenContent = document.getElementById("hiddenContent");
            if (hiddenContent) hiddenContent.classList.add("revealed");

            // E. Créer le petit bandeau "Utilisateur : ..." en haut
            let statusDiv = document.getElementById("quizStatus");
            if (!statusDiv) {
                statusDiv = document.createElement("div");
                statusDiv.id = "quizStatus";
                // Style rapide pour le bandeau
                Object.assign(statusDiv.style, {
                    position: "fixed", top: "10px", right: "10px",
                    padding: "8px 12px", background: "rgba(0,0,0,0.6)",
                    color: "white", borderRadius: "8px", fontSize: "14px", zIndex: "1000"
                });
                document.body.appendChild(statusDiv);
            }
            statusDiv.innerHTML = `Utilisateur : ${window.quizUsername} | Score : 0 / 0`;
            window.quizStatusDiv = statusDiv;

            // F. Afficher la première question
            showCard(0);
        });
    }

    // ==========================================
    // 5. FONCTIONS TIMER
    // ==========================================
    function startTimer() {
        const timerDisplay = document.getElementById("timer-display");
        if(timerDisplay) timerDisplay.style.display = "block";
        
        secondsElapsed = 0;
        updateTimerUI();

        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            secondsElapsed++;
            updateTimerUI();
        }, 1000);
    }

    function updateTimerUI() {
        const timerDisplay = document.getElementById("timer-display");
        if (!timerDisplay) return;
        
        const minutes = Math.floor(secondsElapsed / 60);
        const seconds = secondsElapsed % 60;
        timerDisplay.textContent = `⏱️ ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // ==========================================
    // 6. GENERATION DES CARTES (QUESTIONS)
    // ==========================================
    const cardsDiv = document.getElementById("cards");
    
    if (cardsDiv) {
        questions.forEach((q, index) => {
            // Création de la carte
            const card = document.createElement("div");
            card.classList.add("card");
            if (index === 0) card.classList.add("active"); // La 1ère est visible

            // Texte Question
            const questionCard = document.createElement("div");
            questionCard.classList.add("question-card");
            const p = document.createElement("p");
            p.innerHTML = q.q;
            questionCard.appendChild(p);
            card.appendChild(questionCard);

            // Réponses
            const answersDiv = document.createElement("div");
            answersDiv.classList.add("answers");

            q.answers.forEach((ans, i) => {
                const btn = document.createElement("button");
                btn.innerHTML = ans;
                btn.addEventListener("click", () => {
                    if (answersDiv.classList.contains("answered")) return;
                    
                    answersDiv.classList.add("answered");
                    // Désactiver tous les boutons
                    answersDiv.querySelectorAll("button").forEach(b => b.disabled = true);

                    // Vérification
                    window.quizTotal++; // On augmente le nombre de questions répondues
                    if (i === q.correct) {
                        btn.classList.add("correct");
                        window.quizScore++;
                    } else {
                        btn.classList.add("wrong");
                        // Montrer la bonne réponse
                        answersDiv.querySelectorAll("button")[q.correct].classList.add("correct");
                    }

                    // Mise à jour bandeau
                    if (window.quizStatusDiv) {
                        window.quizStatusDiv.innerHTML = `Utilisateur : ${window.quizUsername} | Score : ${window.quizScore} / ${window.quizTotal}`;
                    }

                    // Afficher explication
                    let exp = document.createElement("div");
                    exp.classList.add("explanation");
                    exp.textContent = q.explanation || "";
                    card.appendChild(exp);

                    // FIN DU JEU ?
                    // Si c'était la dernière question OU si on a atteint un score spécifique
                    // Ici, on attend la fin de toutes les questions
                    if (window.quizTotal === questions.length) {
                         setTimeout(showEndScreen, 2000);
                    }
                });
                answersDiv.appendChild(btn);
            });
            card.appendChild(answersDiv);

            // Source
            const src = document.createElement("div");
            src.classList.add("source");
            src.innerHTML = "Source : " + q.source;
            card.appendChild(src);

            cardsDiv.appendChild(card);
        });
    }

    // ==========================================
    // 7. NAVIGATION (Suivant / Précédent)
    // ==========================================
    const allCards = document.getElementsByClassName("card"); // Live collection
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    function showCard(index) {
        // Cacher toutes les cartes
        for(let c of allCards) c.classList.remove("active");
        // Montrer la bonne
        if(allCards[index]) allCards[index].classList.add("active");
        
        // Gérer état des boutons
        if(prevBtn) prevBtn.disabled = (index === 0);
        if(nextBtn) nextBtn.disabled = (index === questions.length - 1);
    }

    if(prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentCard > 0) {
                currentCard--;
                showCard(currentCard);
            }
        });
    }

    if(nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentCard < questions.length - 1) {
                currentCard++;
                showCard(currentCard);
            }
        });
    }

    // ==========================================
    // 8. ECRAN DE FIN
    // ==========================================
    function showEndScreen() {
        clearInterval(timerInterval);
        const timerDisplay = document.getElementById("timer-display");
        if(timerDisplay) timerDisplay.style.display = "none";

        // Arrêt Musique
        const maMusique = document.getElementById("musique-fond");
        if(maMusique) { maMusique.pause(); }

        // Calculs
        const percentage = Math.round((window.quizScore / questions.length) * 100);
        const m = Math.floor(secondsElapsed / 60);
        const s = secondsElapsed % 60;
        const timeStr = `${m}m ${s}s`;

        // Cacher le jeu
        const hiddenContent = document.getElementById("hiddenContent");
        if(hiddenContent) hiddenContent.style.display = "none";
        if(window.quizStatusDiv) window.quizStatusDiv.style.display = "none";

        // Afficher écran fin
        const endScreen = document.getElementById("endScreen");
        if(endScreen) {
            endScreen.classList.remove("hidden");
            
            // Nom du joueur
            const endUser = document.getElementById("endUsername");
            if(endUser) endUser.textContent = window.quizUsername;
            
            // Injection dynamique du contenu (Score + Bouton)
            const contentDiv = document.querySelector(".custom-content");
            if (contentDiv) {
                 contentDiv.innerHTML = `
                    <h2 style="margin-bottom:20px; text-align:center;">
                        ${percentage >= 50 ? "🎉 MISSION RÉUSSIE !" : "❌ MISSION ÉCHOUÉE"}
                    </h2>
                    <p style="text-align:center; font-size:1.2em; margin-bottom:30px;">
                        ${percentage >= 50 ? "Bravo aventurier, le numérique responsable n'a plus de secrets pour toi." : "Il va falloir retourner étudier le manuel du NIRD..."}
                    </p>

                    <div style="display:flex; justify-content:center; gap:20px; flex-wrap:wrap; margin-bottom:30px;">
                        <div style="background:rgba(255,255,255,0.1); padding:15px 30px; border-radius:10px; text-align:center; border:1px solid rgba(255,255,255,0.2);">
                            <div style="font-size:0.9em; opacity:0.8;">SCORE FINAL</div>
                            <div style="font-size:2em; font-weight:bold; color:#00ff88;">${window.quizScore} / ${questions.length}</div>
                        </div>
                        <div style="background:rgba(255,255,255,0.1); padding:15px 30px; border-radius:10px; text-align:center; border:1px solid rgba(255,255,255,0.2);">
                            <div style="font-size:0.9em; opacity:0.8;">TEMPS</div>
                            <div style="font-size:2em; font-weight:bold; color:#4dabf7;">${timeStr}</div>
                        </div>
                    </div>

                    <div style="text-align:center;">
                        <button id="finalRestartBtn" style="padding:15px 35px; font-size:1.2em; border-radius:50px; border:none; background:white; color:#001f3f; font-weight:bold; cursor:pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.2); transition: transform 0.2s;">
                            On repart pour un tour ?
                        </button>
                    </div>
                 `;
                 
                 // Réattacher l'événement sur le bouton généré
                 setTimeout(() => {
                     const btn = document.getElementById("finalRestartBtn");
                     if(btn) {
                        btn.onclick = () => location.reload();
                        // Petit effet de survol en JS si besoin (optionnel)
                        btn.onmouseover = () => btn.style.transform = "scale(1.05)";
                        btn.onmouseout = () => btn.style.transform = "scale(1)";
                     }
                 }, 100);
            }
        }
    }

    // Bouton Restart (celui déjà présent dans le HTML, au cas où)
    const restartBtn = document.getElementById("restartBtn");
    if (restartBtn) {
        restartBtn.addEventListener("click", () => location.reload());
    }
});