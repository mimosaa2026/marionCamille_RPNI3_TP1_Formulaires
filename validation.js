// =====================================================
// VALIDATION.JS
// =====================================================

let messages = {};


// =====================================================
// CHARGEMENT DE validation.json
// =====================================================

export async function chargerMessagesValidation() {
  try {
    const response =
      await fetch("validation.json");

    if (!response.ok) {
      throw new Error(
        `Erreur HTTP : ${response.status}`
      );
    }

    messages =
      await response.json();

  } catch (error) {
    console.error(
      "Erreur lors du chargement de validation.json :",
      error
    );
  }
}


// =====================================================
// RÉCUPÉRER LE MESSAGE D'UN CHAMP
// =====================================================

export function getMessageErreur(champ) {

  const id = champ.id;

  const msg =
    messages[id] || {};


  // Champ obligatoire vide
  if (
    champ.validity.valueMissing &&
    msg.vide
  ) {
    return msg.vide;
  }


  // Pattern incorrect
  if (
    champ.validity.patternMismatch &&
    msg.pattern
  ) {
    return msg.pattern;
  }


  // Mauvais type
  if (
    champ.validity.typeMismatch &&
    msg.type
  ) {
    return msg.type;
  }


  // Valeur sous le minimum
  if (
    champ.validity.rangeUnderflow &&
    msg.min
  ) {
    return msg.min;
  }


  // Valeur au-dessus du maximum
  if (
    champ.validity.rangeOverflow &&
    msg.max
  ) {
    return msg.max;
  }


  return (
    msg.vide ||
    "Veuillez corriger ce champ."
  );
}


// =====================================================
// AFFICHER UNE ERREUR
// =====================================================

export function afficherErreur(
  champ,
  message
) {

  const conteneur =
    champ.parentElement;

  if (!conteneur) {
    return;
  }


  let erreur =
    conteneur.querySelector(
      ".erreur-validation"
    );


  if (!erreur) {

    erreur =
      document.createElement("p");

    erreur.className =
      "erreur-validation text-sm text-red-500 mt-1";

    conteneur.appendChild(
      erreur
    );
  }


  erreur.textContent =
    message;


  champ.classList.add(
    "border-red-500"
  );


  champ.setAttribute(
    "aria-invalid",
    "true"
  );
}


// =====================================================
// RETIRER UNE ERREUR
// =====================================================

export function retirerErreur(champ) {

  const conteneur =
    champ.parentElement;


  const erreur =
    conteneur?.querySelector(
      ".erreur-validation"
    );


  erreur?.remove();


  champ.classList.remove(
    "border-red-500"
  );


  champ.removeAttribute(
    "aria-invalid"
  );
}


// =====================================================
// VALIDER UN CHAMP
// =====================================================

export function validerChamp(champ) {

  if (
    champ.disabled ||
    champ.type === "hidden"
  ) {
    return true;
  }


  if (!champ.validity.valid) {

    afficherErreur(
      champ,
      getMessageErreur(champ)
    );

    return false;
  }


  retirerErreur(champ);

  return true;
}


// =====================================================
// VALIDER UNE ÉTAPE
// =====================================================

export function validerEtape(
  numeroEtape
) {

  const etape =
    document.querySelector(
      `.etape-formulaire[data-step="${numeroEtape}"]`
    );


  if (!etape) {
    return true;
  }


  const champs =
    etape.querySelectorAll(
      "input, select, textarea"
    );


  let valide = true;


  champs.forEach((champ) => {

    if (!validerChamp(champ)) {
      valide = false;
    }

  });


  return valide;
}


// =====================================================
// VALIDATION EN TEMPS RÉEL
// =====================================================

export function activerValidationTempsReel(
  form
) {

  const champs =
    form.querySelectorAll(
      "input, select, textarea"
    );


  champs.forEach((champ) => {

    champ.addEventListener(
      "input",
      () => {

        if (champ.validity.valid) {
          retirerErreur(champ);
        }

      }
    );


    champ.addEventListener(
      "change",
      () => {

        if (champ.validity.valid) {
          retirerErreur(champ);
        }

      }
    );

  });
}