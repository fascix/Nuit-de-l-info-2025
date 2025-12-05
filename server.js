const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config(); // Pour gérer les variables cachées (.env)

const app = express();

// --- CONFIGURATION SPECIALE ALWAYSDATA ---
// Alwaysdata nous donne un PORT et une IP spécifiques. Il faut les utiliser.
const PORT = process.env.PORT || 3000;
const IP = process.env.IP || '0.0.0.0';

// --- MIDDLEWARES (La configuration) ---
app.use(cors());
app.use(express.json()); // Pour comprendre les données envoyées par le site

// 🚨 LA LIGNE MAGIQUE : C'est elle qui affiche votre site !
// Elle dit : "Si quelqu'un arrive sur le site, montre-lui les fichiers du dossier 'public'"
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Be NIRD.html'));
});


// --- GESTION DE LA "BASE DE DONNÉES" (Fichier JSON) ---
const FICHIER_DB = path.join(__dirname, 'database.json');

// Fonction pour lire le fichier (et le créer s'il n'existe pas)
function lireDonnees() {
    if (!fs.existsSync(FICHIER_DB)) {
        fs.writeFileSync(FICHIER_DB, '[]', 'utf8'); // On crée un tableau vide
        return [];
    }
    try {
        const data = fs.readFileSync(FICHIER_DB, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

// Route pour SAUVEGARDER (appelée par le bouton du site)
app.post('/sauvegarde', (req, res) => {
    const { nom, question } = req.body;

    if (!nom || !question) return res.status(400).json({ message: "Il manque des infos !" });

    const db = lireDonnees();
    const nouvelleEntree = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        nom,
        question
    };

    db.push(nouvelleEntree);
    fs.writeFileSync(FICHIER_DB, JSON.stringify(db, null, 2), 'utf8');

    console.log("Nouvelle sauvegarde :", nouvelleEntree);
    res.json({ message: "C'est dans la boîte ! 💾", entree: nouvelleEntree });
});

// Route pour LIRE l'historique (si vous voulez l'afficher un jour)
app.get('/historique', (req, res) => {
    res.json(lireDonnees());
});


// --- ROUTE CHATBOT (IA) ---
app.post('/chat', async (req, res) => {
    const messageUser = req.body.message;
    
    // Si vous n'avez pas encore mis de clé API, on renvoie une fausse réponse pour tester
    if (!process.env.MISTRAL_API_KEY && !process.env.OPENAI_API_KEY) {
        return res.json({ 
            reponse: "🤖 (Mode Test) Je suis le backend ! Je n'ai pas encore de cerveau (Clé API manquante), mais je reçois bien ton message : " + messageUser 
        });
    }

    // Si vous avez configuré l'IA, mettez votre code Axios ici (comme vu précédemment)
    // Pour l'instant, on garde le mode test simple pour éviter les erreurs
    res.json({ reponse: "Le backend a reçu : " + messageUser });
});


// --- DEMARRAGE DU SERVEUR ---
app.listen(PORT, IP, () => {
    console.log(`🚀 Serveur lancé !`);
    console.log(`👉 Adresse : http://${IP}:${PORT}`);
    console.log(`📂 Dossier public servi : ${path.join(__dirname, 'public')}`);
});