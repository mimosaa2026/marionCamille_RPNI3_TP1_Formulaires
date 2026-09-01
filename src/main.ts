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

document.addEventListener('DOMContentLoaded', (): void => {
  let currentStep: number = 1;
  const totalSteps: number = 10;

  // Sélection des éléments avec typage strict
  const formSteps = document.querySelectorAll<HTMLDivElement>('.form-step');
  const stepIndicators = document.querySelectorAll<HTMLLIElement>('.step-indicator');
  const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement | null;
  const nextBtn = document.getElementById('next-btn') as HTMLButtonElement | null;

  function updateForm(): void {
    // 1. Gérer l'affichage des sections du formulaire (Masquer/Afficher)
    formSteps.forEach((step: HTMLDivElement) => {
      const stepNum: number = parseInt(step.dataset.step || '0', 10);
      if (stepNum === currentStep) {
        step.classList.remove('hidden');
      } else {
        step.classList.add('hidden');
      }
    });

    // 2. Gérer la visibilité du bouton Précédent (Invisible à l'étape 1)
    if (prevBtn) {
      if (currentStep === 1) {
        prevBtn.classList.add('invisible');
      } else {
        prevBtn.classList.remove('invisible');
      }
    }

    // 3. Modifier le texte du bouton de fin et générer le récapitulatif
    if (nextBtn) {
      if (currentStep === totalSteps) {
        nextBtn.textContent = 'Soumettre';
        
        const firstname = (document.getElementById('firstname') as HTMLInputElement | null)?.value || '';
        const lastname = (document.getElementById('lastname') as HTMLInputElement | null)?.value || '';
        const email = (document.getElementById('email') as HTMLInputElement | null)?.value || '-';
        
        const summaryNameOpt = document.getElementById('summary-name') as HTMLSpanElement | null;
        const summaryEmailOpt = document.getElementById('summary-email') as HTMLSpanElement | null;
        
        if (summaryNameOpt) summaryNameOpt.textContent = `${firstname} ${lastname}`.trim() || '-';
        if (summaryEmailOpt) summaryEmailOpt.textContent = email;
      } else {
        nextBtn.textContent = 'Continuer';
      }
    }

    // 4. Mettre à jour les styles et états du Stepper à gauche
    stepIndicators.forEach((indicator: HTMLLIElement) => {
      const stepNum: number = parseInt(indicator.dataset.step || '0', 10);
      const icon = indicator.querySelector<HTMLSpanElement>('.step-icon');
      const line = indicator.querySelector<HTMLDivElement>('.step-line');
      const labelNum = indicator.querySelector<HTMLSpanElement>('.step-label-num');
      const labelTitle = indicator.querySelector<HTMLSpanElement>('.step-label-title');

      if (!icon || !labelNum || !labelTitle) return;

      // État par défaut : À venir (Muted / Gray)
      icon.className = "step-icon relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-sm font-semibold text-gray-500 transition-all duration-200";
      if (line) line.className = "step-line absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300";
      labelNum.className = "step-label-num text-sm font-medium text-gray-500";
      labelTitle.className = "step-label-title text-sm font-medium text-gray-500";
      icon.innerHTML = stepNum < 10 ? `0${stepNum}` : stepNum.toString();

      if (stepNum < currentStep) {
        // État : Terminé (Blue background + Checkmark SVG)
        icon.className = "step-icon relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-200";
        if (line) line.className = "step-line absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-blue-600";
        labelNum.className = "step-label-num text-sm font-medium text-blue-600";
        icon.innerHTML = `<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>`;
      } else if (stepNum === currentStep) {
        // État : Actif (Blue border ring + Dark text)
        icon.className = "step-icon relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-600 bg-white text-sm font-semibold text-blue-600 transition-all duration-200";
        if (line) line.className = "step-line absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300";
        labelNum.className = "step-label-num text-sm font-medium text-blue-600";
        labelTitle.className = "step-label-title text-sm font-medium text-gray-900";
      }
    });
  }

  // Déclencher la validation native du navigateur sur les champs requis
  function validateCurrentStep(): boolean {
    const activeStepContainer = document.querySelector<HTMLDivElement>(`.form-step[data-step="${currentStep}"]`);
    if (!activeStepContainer) return true;

    const inputs = activeStepContainer.querySelectorAll<HTMLInputElement>('input[required]');
    let allValid: boolean = true;

    inputs.forEach((input: HTMLInputElement) => {
      if (!input.checkValidity()) {
        input.reportValidity(); // Ouvre l'infobulle d'erreur native (ex: "Veuillez remplir ce champ")
        allValid = false;
      }
    });
    return allValid;
  }

  // Événement clic sur "Continuer / Soumettre"
  nextBtn?.addEventListener('click', (): void => {
    if (!validateCurrentStep()) return;

    if (currentStep < totalSteps) {
      currentStep++;
      updateForm();
    } else {
      // Action finale lors de la soumission du formulaire complet
      alert('Formulaire soumis avec succès !');
      const form = document.getElementById('multi-step-form') as HTMLFormElement | null;
      if (form) form.reset();
      currentStep = 1;
      updateForm();
    }
  });

  // Événement clic sur "Précédent"
  prevBtn?.addEventListener('click', (): void => {
    if (currentStep > 1) {
      currentStep--;
      updateForm();
    }
  });

  // Initialisation au chargement de la page
  updateForm();
});

const amountButtons = document.querySelectorAll(".amount-btn");
const customAmount = document.getElementById("customAmount") as HTMLInputElement;

let selectedAmount: number | null = null;
const MAX_AMOUNT = 500;

// --- Sélection via boutons ---
amountButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const value = Number(btn.dataset.value);

    if (value > MAX_AMOUNT) return; // sécurité

    selectedAmount = value;
    customAmount.value = "";

    amountButtons.forEach(b => b.classList.remove("bg-indigo-100", "border-indigo-600"));
    btn.classList.add("bg-indigo-100", "border-indigo-600");
  });
});

// --- Saisie d’un montant personnalisé ---
customAmount.addEventListener("input", () => {
  const value = Number(customAmount.value);

  // Limite max
  if (value > MAX_AMOUNT) {
    customAmount.value = MAX_AMOUNT.toString();
  }

  selectedAmount = Number(customAmount.value);

  // Désactive visuellement les boutons
  amountButtons.forEach(b => b.classList.remove("bg-indigo-100", "border-indigo-600"));
});

// --- Fonction pour récupérer le montant final ---
export function getDonationAmount(): number | null {
  if (!selectedAmount || selectedAmount <= 0 || selectedAmount > MAX_AMOUNT) {
    return null;
  }
  return selectedAmount;
}

const paymentMethod = document.getElementById("paymentMethod") as HTMLSelectElement;

const creditFields = document.getElementById("creditFields") as HTMLDivElement;
const interacFields = document.getElementById("interacFields") as HTMLDivElement;
const chequeFields = document.getElementById("chequeFields") as HTMLDivElement;

// Affichage dynamique des champs selon le mode choisi
paymentMethod.addEventListener("change", () => {
  const value = paymentMethod.value;

  creditFields.classList.add("hidden");
  interacFields.classList.add("hidden");
  chequeFields.classList.add("hidden");

  if (value === "credit") creditFields.classList.remove("hidden");
  if (value === "interac") interacFields.classList.remove("hidden");
  if (value === "cheque") chequeFields.classList.remove("hidden");
});

// Validation du mode de paiement
export function validatePayment(): string | null {
  const value = paymentMethod.value;

  if (!value) return "Veuillez choisir un mode de paiement.";

  if (value === "credit") {
    const num = (document.getElementById("cardNumber") as HTMLInputElement).value;
    const name = (document.getElementById("cardName") as HTMLInputElement).value;
    const exp = (document.getElementById("cardExp") as HTMLInputElement).value;
    const cvv = (document.getElementById("cardCVV") as HTMLInputElement).value;

    if (!name || !num || !exp || !cvv) return "Veuillez remplir les champs de la carte de crédit.";
  }

  if (value === "interac") {
    const email = (document.getElementById("interacEmail") as HTMLInputElement).value;
    if (!email.includes("@")) return "Veuillez entrer un courriel Interac valide.";
  }

  return null; // OK
}