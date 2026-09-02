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
  const totalSteps: number = 6;

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

    if (prevBtn) {
      if (currentStep === 1) {
        prevBtn.classList.add('invisible');
      } else {
        prevBtn.classList.remove('invisible');
      }
    }

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

      icon.className = "step-icon relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-sm font-semibold text-gray-500 transition-all duration-200";
      if (line) line.className = "step-line absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300";
      labelNum.className = "step-label-num text-sm font-medium text-gray-500";
      labelTitle.className = "step-label-title text-sm font-medium text-gray-500";
      icon.innerHTML = stepNum < 10 ? `0${stepNum}` : stepNum.toString();

      if (stepNum < currentStep) {
        icon.className = "step-icon relative flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white transition-all duration-200";
        if (line) line.className = "step-line absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-green-500";
        labelNum.className = "step-label-num text-sm font-medium text-green-500";
        icon.innerHTML = `<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>`;
      } else if (stepNum === currentStep) {
        icon.className = "step-icon relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-600 bg-white text-sm font-semibold text-blue-600 transition-all duration-200";
        if (line) line.className = "step-line absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300";
        labelNum.className = "step-label-num text-sm font-medium text-blue-600";
        labelTitle.className = "step-label-title text-sm font-medium text-gray-900";
      }
    });
  }

  function validateCurrentStep(): boolean {
    const activeStepContainer = document.querySelector<HTMLDivElement>(`.form-step[data-step="${currentStep}"]`);
    if (!activeStepContainer) return true;

    const inputs = activeStepContainer.querySelectorAll<HTMLInputElement>('input[required]');
    let allValid: boolean = true;

    inputs.forEach((input: HTMLInputElement) => {
      if (!input.checkValidity()) {
        input.reportValidity();
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
      alert('Formulaire soumis avec succès!');
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


const paymentButtons = document.querySelectorAll(".payment-option");
const paymentFields = document.getElementById("paymentFields") as HTMLDivElement;

const creditFields = document.getElementById("creditFields") as HTMLDivElement;
const interacFields = document.getElementById("interacFields") as HTMLDivElement;

let selectedMethod: string | null = null;

// Sélection visuelle + affichage des champs
paymentButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedMethod = btn.getAttribute("data-method");

    // Style actif
    paymentButtons.forEach(b => b.classList.remove("border-blue-500", "bg-blue-50"));
    btn.classList.add("border-blue-500", "bg-blue-50");

    // Affichage des champs
    paymentFields.classList.remove("hidden");
    creditFields.classList.add("hidden");
    interacFields.classList.add("hidden");

    if (selectedMethod === "credit") creditFields.classList.remove("hidden");
    if (selectedMethod === "interac") interacFields.classList.remove("hidden");
  });
});

// Validation
export function validatePayment(): string | null {
  if (!selectedMethod) return "Veuillez choisir un mode de paiement.";

  if (selectedMethod === "credit") {
    const name = (document.getElementById("cardName") as HTMLInputElement).value;
    const num = (document.getElementById("cardNumber") as HTMLInputElement).value;
    const exp = (document.getElementById("cardExp") as HTMLInputElement).value;
    const cvv = (document.getElementById("cardCVV") as HTMLInputElement).value;

    if (!name || !num || !exp || !cvv)
      return "Veuillez remplir tous les champs de la carte de crédit.";
  }

  if (selectedMethod === "interac") {
    const email = (document.getElementById("interacEmail") as HTMLInputElement).value;
    if (!email.includes("@"))
      return "Veuillez entrer un courriel Interac valide.";
  }

  return null;
}


// ---------------------------------------------------------
// 3) SYSTÈME DE STEPS + NAVIGATION + REDIRECTION FINALE
// ---------------------------------------------------------

const nextBtn = document.getElementById("next-btn") as HTMLButtonElement;
const prevBtn = document.getElementById("prev-btn") as HTMLButtonElement;

const steps = document.querySelectorAll(".step");
let currentStep = 1;

// 👉 Tu veux que la redirection soit à l'étape 6
const FINAL_STEP = 6;

// Affichage des steps
function showStep(step: number) {
  steps.forEach((s, i) => {
    s.classList.toggle("hidden", i + 1 !== step);
  });
}

// Bouton Continuer
nextBtn.addEventListener("click", () => {
  if (currentStep < FINAL_STEP) {
    currentStep++;
    showStep(currentStep);

    prevBtn.classList.remove("invisible");

    // Si on arrive à l'étape 6 → changer le texte
    if (currentStep === FINAL_STEP) {
      nextBtn.textContent = "Terminer";
    }
  } else {
    // 👉 Redirection uniquement à l'étape 6
    window.location.href = "index.php"; 
  }
});

// Bouton Précédent
prevBtn.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);

    nextBtn.textContent = "Continuer";

    if (currentStep === 1) {
      prevBtn.classList.add("invisible");
    }
  }
});