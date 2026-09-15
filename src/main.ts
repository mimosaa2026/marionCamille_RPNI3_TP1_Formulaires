import "/src/css/style.css";

// =====================================================
// MENU MOBILE
// =====================================================

const mobileMenuBtn =
  document.getElementById("mobile-menu-btn");

const mobileMenu =
  document.getElementById("mobile-menu");

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}


// =====================================================
// HEADER - OMBRE AU SCROLL
// =====================================================

const header =
  document.querySelector<HTMLElement>("header");

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


// =====================================================
// FORMULAIRE MULTI-ÉTAPES
// =====================================================

const form =
  document.querySelector<HTMLFormElement>("#donationForm");

const steps =
  document.querySelectorAll<HTMLElement>(".form-step");

const nextBtn =
  document.querySelector<HTMLButtonElement>("#nextBtn");

const prevBtn =
  document.querySelector<HTMLButtonElement>("#prevBtn");

const submitBtn =
  document.querySelector<HTMLButtonElement>("#submitBtn");

const successMessage =
  document.querySelector<HTMLElement>("#successMessage");

const stepperButtons =
  document.querySelectorAll<HTMLButtonElement>(
    ".stepper-button"
  );

let currentStep = 1;

const totalSteps = steps.length;


// =====================================================
// AFFICHER UNE ÉTAPE
// =====================================================

function showStep(
  step: number,
  direction: "next" | "back" = "next"
): void {

  steps.forEach((section) => {

    const sectionStep =
      Number(section.dataset.step);

    if (sectionStep === step) {

      section.classList.remove("hidden");

      // Position de départ de l'animation
      if (direction === "next") {

        section.classList.add(
          "opacity-0",
          "translate-x-4"
        );

      } else {

        section.classList.add(
          "opacity-0",
          "-translate-x-4"
        );
      }

      requestAnimationFrame(() => {

        section.classList.remove(
          "opacity-0",
          "translate-x-4",
          "-translate-x-4"
        );

        section.classList.add(
          "opacity-100",
          "translate-x-0"
        );
      });

    } else {

      section.classList.add("hidden");

      section.classList.remove(
        "opacity-100",
        "opacity-0",
        "translate-x-4",
        "-translate-x-4",
        "translate-x-0"
      );
    }
  });

  updateStepper();
  updateButtons();

  if (step === 5) {
    updateReview();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}


// =====================================================
// METTRE À JOUR LE STEPPER
// =====================================================

function updateStepper(): void {

  stepperButtons.forEach((button) => {

    const stepNumber =
      Number(button.dataset.stepButton);

    const circle =
      button.querySelector<HTMLElement>(".step-circle");

    const label =
      button.querySelector<HTMLElement>(".step-label");

    if (!circle || !label) return;


    // -------------------------------------------------
    // ÉTAPE TERMINÉE
    // -------------------------------------------------

    if (stepNumber < currentStep) {

      button.disabled = false;

      button.classList.remove(
        "opacity-50",
        "cursor-not-allowed"
      );

      button.classList.add(
        "cursor-pointer",
        "hover:translate-x-1"
      );

      circle.classList.remove(
        "bg-slate-200",
        "text-slate-500",
        "bg-blue-600",
        "text-white"
      );

      circle.classList.add(
        "bg-green-500",
        "text-white"
      );

      circle.innerHTML = "&#10004;";

      label.classList.remove(
        "text-slate-500",
        "text-blue-600"
      );

      label.classList.add(
        "text-green-600"
      );
    }


    // -------------------------------------------------
    // ÉTAPE ACTUELLE
    // -------------------------------------------------

    else if (stepNumber === currentStep) {

      button.disabled = true;

      button.classList.remove(
        "cursor-pointer",
        "hover:translate-x-1"
      );

      button.classList.add(
        "opacity-100",
        "cursor-not-allowed"
      );

      circle.classList.remove(
        "bg-slate-200",
        "text-slate-500",
        "bg-green-500"
      );

      circle.classList.add(
        "bg-[#CD5C08]",
        "text-white"
      );

      circle.innerHTML =
        String(stepNumber);

      label.classList.remove(
        "text-slate-500",
        "text-green-600"
      );

      label.classList.add(
        "text-[#CD5C08]"
      );
    }


    // -------------------------------------------------
    // ÉTAPE FUTURE
    // -------------------------------------------------

    else {

      button.disabled = true;

      button.classList.remove(
        "cursor-pointer",
        "hover:translate-x-1"
      );

      button.classList.add(
        "opacity-50",
        "cursor-not-allowed"
      );

      circle.classList.remove(
        "bg-blue-600",
        "text-white",
        "bg-green-500"
      );

      circle.classList.add(
        "bg-slate-200",
        "text-slate-500"
      );

      circle.innerHTML =
        String(stepNumber);

      label.classList.remove(
        "text-blue-600",
        "text-green-600"
      );

      label.classList.add(
        "text-slate-500"
      );
    }
  });
}


// =====================================================
// BOUTONS SUIVANT / PRÉCÉDENT
// =====================================================

function updateButtons(): void {

  if (!nextBtn || !prevBtn || !submitBtn) {
    return;
  }

  prevBtn.classList.toggle(
    "hidden",
    currentStep === 1
  );

  nextBtn.classList.toggle(
    "hidden",
    currentStep === totalSteps
  );

  submitBtn.classList.toggle(
    "hidden",
    currentStep !== totalSteps
  );
}


// =====================================================
// VALIDATION DE L'ÉTAPE 1
// =====================================================

function validateStep1(): boolean {

  const selectedType =
    document.querySelector<HTMLInputElement>(
      'input[name="donationType"]:checked'
    );

  const error =
    document.querySelector<HTMLElement>(
      "#donationTypeError"
    );

  if (!selectedType) {

    error?.classList.remove("hidden");

    return false;
  }

  error?.classList.add("hidden");

  return true;
}


// =====================================================
// VALIDATION DE L'ÉTAPE 2
// =====================================================

function validateStep2(): boolean {

  const selectedAmount =
    document.querySelector<HTMLInputElement>(
      'input[name="amount"]:checked'
    );

  const customAmount =
    document.querySelector<HTMLInputElement>(
      "#customAmount"
    );

  const error =
    document.querySelector<HTMLElement>(
      "#amountError"
    );

  const amountIsValid =
    selectedAmount !== null ||
    (
      customAmount !== null &&
      customAmount.value.trim() !== "" &&
      Number(customAmount.value) > 0
    );

  if (!amountIsValid) {

    error?.classList.remove("hidden");

    return false;
  }

  error?.classList.add("hidden");

  return true;
}


// =====================================================
// VALIDATION DE L'ÉTAPE 3
// =====================================================

function validateStep3(): boolean {

  const fields = [
    "firstName",
    "lastName",
    "email",
    "dateNaissance",
    "address",
  ];

  let valid = true;


  // -------------------------------------------------
  // VALIDATION DES CHAMPS
  // -------------------------------------------------

  fields.forEach((fieldId) => {

    const field =
      document.querySelector<HTMLInputElement>(
        `#${fieldId}`
      );

    const error =
      document.querySelector<HTMLElement>(
        `#${fieldId}Error`
      );

    if (
      !field ||
      field.value.trim() === ""
    ) {

      error?.classList.remove("hidden");

      field?.classList.add(
        "border-red-500",
        "ring-1",
        "ring-red-500"
      );

      valid = false;

    } else {

      error?.classList.add("hidden");

      field.classList.remove(
        "border-red-500",
        "ring-1",
        "ring-red-500"
      );
    }
  });


  // -------------------------------------------------
  // VALIDATION DU COURRIEL
  // -------------------------------------------------

  const email =
    document.querySelector<HTMLInputElement>(
      "#email"
    );

  if (
    email &&
    email.value.trim() !== ""
  ) {

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.value)) {

      const error =
        document.querySelector<HTMLElement>(
          "#emailError"
        );

      error?.classList.remove("hidden");

      email.classList.add(
        "border-red-500",
        "ring-1",
        "ring-red-500"
      );

      valid = false;
    }
  }


  // -------------------------------------------------
  // VALIDATION DE LA DATE DE NAISSANCE
  // -------------------------------------------------

  const dateNaissance =
    document.querySelector<HTMLInputElement>(
      "#dateNaissance"
    );

  const dateNaissanceError =
    document.querySelector<HTMLElement>(
      "#dateNaissanceError"
    );

  if (
    dateNaissance &&
    dateNaissance.value !== ""
  ) {

    const dateChoisie =
      new Date(
        `${dateNaissance.value}T00:00:00`
      );

    const aujourdHui =
      new Date();

    aujourdHui.setHours(
      0,
      0,
      0,
      0
    );


    // Date dans le futur
    if (dateChoisie > aujourdHui) {

      dateNaissanceError?.classList.remove(
        "hidden"
      );

      dateNaissance.classList.add(
        "border-red-500",
        "ring-1",
        "ring-red-500"
      );

      valid = false;

    } else {

      dateNaissanceError?.classList.add(
        "hidden"
      );

      dateNaissance.classList.remove(
        "border-red-500",
        "ring-1",
        "ring-red-500"
      );
    }
  }


  return valid;
}


// =====================================================
// VALIDATION DE L'ÉTAPE 4
// =====================================================

function validateStep4(): boolean {

  const paymentMethod =
    document.querySelector<HTMLSelectElement>(
      "#paymentMethod"
    );

  const cardNumber =
    document.querySelector<HTMLInputElement>(
      "#cardNumber"
    );

  const expiry =
    document.querySelector<HTMLInputElement>(
      "#expiry"
    );

  const cvv =
    document.querySelector<HTMLInputElement>(
      "#cvv"
    );

  const terms =
    document.querySelector<HTMLInputElement>(
      "#terms"
    );

  const error =
    document.querySelector<HTMLElement>(
      "#paymentError"
    );

  if (
    !paymentMethod ||
    paymentMethod.value === "" ||
    !cardNumber ||
    cardNumber.value.trim() === "" ||
    !expiry ||
    expiry.value.trim() === "" ||
    !cvv ||
    cvv.value.trim() === "" ||
    !terms ||
    !terms.checked
  ) {

    error?.classList.remove("hidden");

    return false;
  }

  error?.classList.add("hidden");

  return true;
}


// =====================================================
// VALIDATION DE L'ÉTAPE ACTUELLE
// =====================================================

function validateCurrentStep(): boolean {

  switch (currentStep) {

    case 1:
      return validateStep1();

    case 2:
      return validateStep2();

    case 3:
      return validateStep3();

    case 4:
      return validateStep4();

    case 5:
      return true;

    default:
      return false;
  }
}


// =====================================================
// RÉCUPÉRER LE MONTANT
// =====================================================

function getDonationAmount(): string {

  const selectedAmount =
    document.querySelector<HTMLInputElement>(
      'input[name="amount"]:checked'
    );

  const customAmount =
    document.querySelector<HTMLInputElement>(
      "#customAmount"
    );

  if (
    customAmount &&
    customAmount.value.trim() !== ""
  ) {

    return `${customAmount.value} $`;
  }

  if (selectedAmount) {

    return `${selectedAmount.value} $`;
  }

  return "Non sélectionné";
}


// =====================================================
// METTRE À JOUR LA PAGE DE VÉRIFICATION
// =====================================================

function updateReview(): void {

  const donationType =
    document.querySelector<HTMLInputElement>(
      'input[name="donationType"]:checked'
    );

  const firstName =
    document.querySelector<HTMLInputElement>(
      "#firstName"
    );

  const lastName =
    document.querySelector<HTMLInputElement>(
      "#lastName"
    );

  const email =
    document.querySelector<HTMLInputElement>(
      "#email"
    );

  const dateNaissance =
    document.querySelector<HTMLInputElement>(
      "#dateNaissance"
    );

  const address =
    document.querySelector<HTMLInputElement>(
      "#address"
    );

  const paymentMethod =
    document.querySelector<HTMLSelectElement>(
      "#paymentMethod"
    );

  const cardNumber =
    document.querySelector<HTMLInputElement>(
      "#cardNumber"
    );


  const reviewDonationType =
    document.querySelector<HTMLElement>(
      "#reviewDonationType"
    );

  const reviewAmount =
    document.querySelector<HTMLElement>(
      "#reviewAmount"
    );

  const reviewName =
    document.querySelector<HTMLElement>(
      "#reviewName"
    );

  const reviewEmail =
    document.querySelector<HTMLElement>(
      "#reviewEmail"
    );

  const reviewDateNaissance =
    document.querySelector<HTMLElement>(
      "#reviewDateNaissance"
    );

  const reviewAddress =
    document.querySelector<HTMLElement>(
      "#reviewAddress"
    );

  const reviewPayment =
    document.querySelector<HTMLElement>(
      "#reviewPayment"
    );

  const reviewCard =
    document.querySelector<HTMLElement>(
      "#reviewCard"
    );


  // -------------------------------------------------
  // TYPE DE DON
  // -------------------------------------------------

  if (reviewDonationType) {

    reviewDonationType.textContent =
      donationType?.value ??
      "Non sélectionné";
  }


  // -------------------------------------------------
  // MONTANT
  // -------------------------------------------------

  if (reviewAmount) {

    reviewAmount.textContent =
      getDonationAmount();
  }


  // -------------------------------------------------
  // NOM
  // -------------------------------------------------

  if (reviewName) {

    reviewName.textContent =
      `${firstName?.value ?? ""} ${lastName?.value ?? ""}`;
  }


  // -------------------------------------------------
  // COURRIEL
  // -------------------------------------------------

  if (reviewEmail) {

    reviewEmail.textContent =
      email?.value ?? "";
  }


  // -------------------------------------------------
  // DATE DE NAISSANCE
  // -------------------------------------------------

  if (reviewDateNaissance) {

    if (
      dateNaissance &&
      dateNaissance.value !== ""
    ) {

      const date =
        new Date(
          `${dateNaissance.value}T00:00:00`
        );

      reviewDateNaissance.textContent =
        date.toLocaleDateString(
          "fr-CA"
        );

    } else {

      reviewDateNaissance.textContent =
        "Non renseignée";
    }
  }


  // -------------------------------------------------
  // ADRESSE
  // -------------------------------------------------

  if (reviewAddress) {

    reviewAddress.textContent =
      address?.value ?? "";
  }


  // -------------------------------------------------
  // MODE DE PAIEMENT
  // -------------------------------------------------

  if (reviewPayment) {

    reviewPayment.textContent =
      paymentMethod?.value ??
      "Non sélectionné";
  }


  // -------------------------------------------------
  // CARTE
  // -------------------------------------------------

  if (reviewCard) {

    const value =
      cardNumber?.value ?? "";

    if (value.length >= 4) {

      reviewCard.textContent =
        `•••• •••• •••• ${value.slice(-4)}`;

    } else {

      reviewCard.textContent =
        "Non renseignée";
    }
  }
}


// =====================================================
// BOUTON SUIVANT
// =====================================================

nextBtn?.addEventListener(
  "click",
  () => {

    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < totalSteps) {

      currentStep++;

      showStep(
        currentStep,
        "next"
      );
    }
  }
);


// =====================================================
// BOUTON PRÉCÉDENT
// =====================================================

prevBtn?.addEventListener(
  "click",
  () => {

    if (currentStep > 1) {

      currentStep--;

      showStep(
        currentStep,
        "back"
      );
    }
  }
);


// =====================================================
// STEPPER : RETOUR AUX ÉTAPES TERMINÉES
// =====================================================

stepperButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        const targetStep =
          Number(
            button.dataset.stepButton
          );

        // Seulement les étapes déjà complétées
        if (
          targetStep < currentStep
        ) {

          currentStep =
            targetStep;

          showStep(
            currentStep,
            "back"
          );
        }
      }
    );
  }
);


// =====================================================
// ENVOI DU FORMULAIRE
// =====================================================

form?.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    if (successMessage) {

      successMessage.classList.remove(
        "hidden"
      );

      successMessage.classList.add(
        "opacity-0",
        "translate-y-2"
      );

      requestAnimationFrame(
        () => {

          successMessage.classList.remove(
            "opacity-0",
            "translate-y-2"
          );

          successMessage.classList.add(
            "opacity-100",
            "translate-y-0"
          );
        }
      );
    }

    form.classList.add(
      "hidden"
    );
  }
);


// =====================================================
// INITIALISATION
// =====================================================

showStep(1);