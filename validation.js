// Chargement du JSON contenant les messages d’erreur
let messages = {};

fetch("messages.json")
  .then(response => response.json())
  .then(data => {
    messages = data;
  })
  .catch(err => console.error("Erreur chargement JSON :", err));


// Fonction qui retourne le bon message d’erreur selon la validité du champ
function getMessageErreur(champ) {
  const id = champ.id;          // id du champ (doit correspondre au JSON)
  const msg = messages[id] || {}; // messages pour ce champ

  // Si le champ est vide
  if (champ.validity.valueMissing && msg.vide) {
    return msg.vide;
  }

  // Si le pattern ne correspond pas
  if (champ.validity.patternMismatch && msg.pattern) {
    return msg.pattern;
  }

  // Si le type est incorrect (email, tel, etc.)
  if (champ.validity.typeMismatch && msg.type) {
    return msg.type;
  }

  // Si une règle personnalisée est violée (ex: min)
  if (champ.validity.rangeUnderflow && msg.min) {
    return msg.min;
  }

  // Message générique si rien ne correspond
  return msg.vide || "Veuillez corriger ce champ.";
}


// Affichage du message sous le champ
function afficherErreur(champ, message) {
  let span = champ.parentElement.querySelector(".erreur-msg");

  // Si aucun span n’existe, on le crée
  if (!span) {
    span = document.createElement("span");
    span.className = "erreur-msg text-red-600 text-sm mt-1 block";
    champ.parentElement.appendChild(span);
  }

  span.textContent = message;
}


// Validation globale du formulaire
function validerFormulaire(form) {
  let valide = true;

  const champs = form.querySelectorAll("input, select, textarea");

  champs.forEach((champ) => {
    if (!champ.validity.valid) {
      const msg = getMessageErreur(champ);
      afficherErreur(champ, msg);
      valide = false;
    }
  });

  return valide;
}


// Exemple d’utilisation
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-don");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const ok = validerFormulaire(form);

    if (ok) {
      console.log("Formulaire valide !");
      form.submit(); // tu peux remplacer par ton step suivant
    }
  });
});
