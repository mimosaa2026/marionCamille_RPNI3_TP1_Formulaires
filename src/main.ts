import "/src/css/style.css";

// Mobile menu toggle
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// Smooth scroll effect for header
const header = document.querySelector("header");

if (header) {
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.classList.add("shadow-xl");
    } else {
      header.classList.remove("shadow-xl");
    }
  });
}

// ==========================================
// FORMULAIRE DE DON - MAIN.TS
// ==========================================

// Formulaire
const form = document.querySelector<HTMLFormElement>("#donationForm");

// Étapes
const steps = document.querySelectorAll<HTMLElement>(".step");
const stepperItems =
  document.querySelectorAll<HTMLButtonElement>(".stepper-item");

// Boutons montant
const amountButtons =
  document.querySelectorAll<HTMLButtonElement>(".amount-btn");

const customAmount =
  document.querySelector<HTMLInputElement>("#customAmount");

// Boutons navigation
const next1 = document.querySelector<HTMLButtonElement>("#next1");
const next2 = document.querySelector<HTMLButtonElement>("#next2");
const next3 = document.querySelector<HTMLButtonElement>("#next3");
const next4 = document.querySelector<HTMLButtonElement>("#next4");

const back2 = document.querySelector<HTMLButtonElement>("#back2");
const back3 = document.querySelector<HTMLButtonElement>("#back3");
const back4 = document.querySelector<HTMLButtonElement>("#back4");
const back5 = document.querySelector<HTMLButtonElement>("#back5");

// Champs
const nameInput =
  document.querySelector<HTMLInputElement>("#name");

const emailInput =
  document.querySelector<HTMLInputElement>("#email");

const receiptInput =
  document.querySelector<HTMLInputElement>("#receipt");

const messageInput =
  document.querySelector<HTMLTextAreaElement>("#message");

// Messages d'erreur
const amountError =
  document.querySelector<HTMLParagraphElement>("#amountError");

const infoError =
  document.querySelector<HTMLParagraphElement>("#infoError");

// Confirmation
const confirmAmount =
  document.querySelector<HTMLSpanElement>("#confirmAmount");

const confirmType =
  document.querySelector<HTMLSpanElement>("#confirmType");

const confirmName =
  document.querySelector<HTMLSpanElement>("#confirmName");

const confirmEmail =
  document.querySelector<HTMLSpanElement>("#confirmEmail");

const confirmReceipt =
  document.querySelector<HTMLSpanElement>("#confirmReceipt");

const confirmMessage =
  document.querySelector<HTMLSpanElement>("#confirmMessage");


// ==========================================
// VARIABLES
// ==========================================

let currentStep = 1;
let selectedAmount = 0;


// ==========================================
// AFFICHER UNE ÉTAPE
// ==========================================

function showStep(stepNumber: number): void {

  currentStep = stepNumber;

  // Afficher la bonne étape
  steps.forEach((step) => {

    const stepValue = Number(step.dataset.step);

    if (stepValue === stepNumber) {
      step.classList.remove("hidden");
    } else {
      step.classList.add("hidden");
    }

  });


  // Mettre à jour le stepper
  stepperItems.forEach((item) => {

    const stepValue = Number(item.dataset.step);

    const circle =
      item.querySelector<HTMLDivElement>(".step-circle");

    const text =
      item.querySelector<HTMLSpanElement>("span");

    if (!circle || !text) return;


    // Étape actuelle
    if (stepValue === stepNumber) {

      circle.classList.remove(
        "bg-gray-300",
        "bg-green-600",
        "text-gray-600"
      );

      circle.classList.add(
        "bg-blue-600",
        "text-white"
      );

      text.classList.remove("text-gray-500");
      text.classList.add("text-gray-900");
    }


    // Étape terminée
    else if (stepValue < stepNumber) {

      circle.classList.remove(
        "bg-gray-300",
        "bg-blue-600",
        "text-gray-600"
      );

      circle.classList.add(
        "bg-green-600",
        "text-white"
      );

      text.classList.remove("text-gray-500");
      text.classList.add("text-gray-900");
    }


    // Étape à venir
    else {

      circle.classList.remove(
        "bg-blue-600",
        "bg-green-600",
        "text-white"
      );

      circle.classList.add(
        "bg-gray-300",
        "text-gray-600"
      );

      text.classList.remove("text-gray-900");
      text.classList.add("text-gray-500");
    }

  });

}


// ==========================================
// ÉTAPE 1 - MONTANT
// ==========================================

amountButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const value = Number(button.dataset.value);

    selectedAmount = value;

    // Effacer le montant personnalisé
    if (customAmount) {
      customAmount.value = "";
    }


    // Réinitialiser les boutons
    amountButtons.forEach((btn) => {

      btn.classList.remove(
        "bg-blue-600",
        "text-white",
        "border-blue-600"
      );

      btn.classList.add("border-gray-300");

    });


    // Activer le bouton sélectionné
    button.classList.remove("border-gray-300");

    button.classList.add(
      "bg-blue-600",
      "text-white",
      "border-blue-600"
    );


    // Cacher l'erreur
    amountError?.classList.add("hidden");

  });

});


// Montant personnalisé
customAmount?.addEventListener("input", () => {

  const value = Number(customAmount.value);

  if (value > 0) {

    selectedAmount = value;

    // Désélectionner les boutons
    amountButtons.forEach((button) => {

      button.classList.remove(
        "bg-blue-600",
        "text-white",
        "border-blue-600"
      );

      button.classList.add("border-gray-300");

    });

    amountError?.classList.add("hidden");

  }

});


// ==========================================
// BOUTON SUIVANT - ÉTAPE 1
// ==========================================

next1?.addEventListener("click", () => {

  if (selectedAmount <= 0) {

    amountError?.classList.remove("hidden");

    return;
  }

  amountError?.classList.add("hidden");

  showStep(2);

});


// ==========================================
// ÉTAPE 2 - TYPE DE DON
// ==========================================

next2?.addEventListener("click", () => {

  showStep(3);

});


// Retour à l'étape 1
back2?.addEventListener("click", () => {

  showStep(1);

});


// ==========================================
// ÉTAPE 3 - INFORMATIONS
// ==========================================

next3?.addEventListener("click", () => {

  const name = nameInput?.value.trim() ?? "";
  const email = emailInput?.value.trim() ?? "";


  // Vérification du nom
  if (name.length < 2) {

    infoError?.classList.remove("hidden");

    return;
  }


  // Vérification du courriel
  if (!email.includes("@") || !email.includes(".")) {

    infoError?.classList.remove("hidden");

    return;
  }


  // Tout est valide
  infoError?.classList.add("hidden");

  showStep(4);

});


// Retour à l'étape 2
back3?.addEventListener("click", () => {

  showStep(2);

});


// ==========================================
// ÉTAPE 4 - PRÉFÉRENCES
// ==========================================

next4?.addEventListener("click", () => {

  updateConfirmation();

  showStep(5);

});


// Retour à l'étape 3
back4?.addEventListener("click", () => {

  showStep(3);

});


// ==========================================
// METTRE À JOUR LA CONFIRMATION
// ==========================================

function updateConfirmation(): void {

  // Montant
  if (confirmAmount) {

    confirmAmount.textContent =
      `${selectedAmount.toFixed(2)} $`;

  }


  // Type de don
  const selectedType =
    document.querySelector<HTMLInputElement>(
      'input[name="donationType"]:checked'
    );

  if (confirmType) {

    if (selectedType?.value === "periodique") {

      confirmType.textContent = "Don périodique";

    } else {

      confirmType.textContent = "Don unique";

    }

    if (selectedType?.value === "corporatif") {

      confirmType.textContent = "Don corporatif";

    } else {

      confirmType.textContent = "Don unique";

    }

    if (selectedType?.value === "hommage") {

      confirmType.textContent = "Don en hommage";

    } else {

      confirmType.textContent = "Don unique";

    }

    if (selectedType?.value === "commemoratif") {

      confirmType.textContent = "Don commémoratif";

    } else {

      confirmType.textContent = "Don unique";

    }

  }


  // Nom
  if (confirmName) {

    confirmName.textContent =
      nameInput?.value.trim() ?? "";

  }


  // Courriel
  if (confirmEmail) {

    confirmEmail.textContent =
      emailInput?.value.trim() ?? "";

  }


  // Reçu
  if (confirmReceipt) {

    confirmReceipt.textContent =
      receiptInput?.checked
        ? "Oui"
        : "Non";

  }


  // Message
  if (confirmMessage) {

    const message =
      messageInput?.value.trim() ?? "";

    confirmMessage.textContent =
      message !== ""
        ? message
        : "Aucun message";

  }

}


// ==========================================
// RETOUR À L'ÉTAPE 4
// ==========================================

back5?.addEventListener("click", () => {

  showStep(4);

});


// ==========================================
// SOUMISSION DU FORMULAIRE
// ==========================================

form?.addEventListener("submit", (event) => {

  event.preventDefault();

  alert(
    "Merci ! Votre don a été confirmé."
  );

  // Réinitialiser le formulaire
  form.reset();

  selectedAmount = 0;

  // Réinitialiser l'apparence des boutons
  amountButtons.forEach((button) => {

    button.classList.remove(
      "bg-blue-600",
      "text-white",
      "border-blue-600"
    );

    button.classList.add("border-gray-300");

  });

  // Retour à la première étape
  showStep(1);

});


// ==========================================
// STEPPER CLIQUABLE
// ==========================================

stepperItems.forEach((item) => {

  item.addEventListener("click", () => {

    const requestedStep =
      Number(item.dataset.step);


    // On permet seulement de revenir
    // aux étapes déjà complétées
    if (requestedStep < currentStep) {

      showStep(requestedStep);

    }

  });

});


// ==========================================
// INITIALISATION
// ==========================================

showStep(1);