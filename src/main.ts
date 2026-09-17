import "/src/css/style.css";

// =====================================================
// MENU MOBILE
// =====================================================

const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// =====================================================
// HEADER - OMBRE AU SCROLL
// =====================================================

const header = document.querySelector<HTMLElement>("header");

if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("shadow-xl", window.scrollY > 100);
  });
}

// =====================================================
// MESSAGE DE REMERCIEMENT SUR L'ACCUEIL
// =====================================================

const thankYouMessage =
  document.querySelector<HTMLElement>("#thankYouMessage");

const donationSubmitted =
  sessionStorage.getItem("donSubmitted");

if (donationSubmitted === "true" && thankYouMessage) {
  thankYouMessage.classList.remove("hidden");

  thankYouMessage.classList.add(
    "opacity-0",
    "-translate-y-2"
  );

  requestAnimationFrame(() => {
    thankYouMessage.classList.remove(
      "opacity-0",
      "-translate-y-2"
    );

    thankYouMessage.classList.add(
      "opacity-100",
      "translate-y-0"
    );
  });

  sessionStorage.removeItem("donSubmitted");

  setTimeout(() => {
    thankYouMessage.classList.add(
      "opacity-0",
      "-translate-y-2"
    );

    setTimeout(() => {
      thankYouMessage.classList.add("hidden");
    }, 300);
  }, 6000);
}

// =====================================================
// FORMULAIRE
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

const stepperButtons =
  document.querySelectorAll<HTMLButtonElement>(
    ".stepper-button"
  );

let currentStep = 1;

const totalSteps = steps.length;

// =====================================================
// FONCTIONS UTILITAIRES
// =====================================================

function getInput(id: string): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(
    `#${id}`
  );
}

function getSelect(id: string): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>(
    `#${id}`
  );
}

function getElement(id: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    `#${id}`
  );
}

// =====================================================
// DATE DE NAISSANCE
// =====================================================

const dobDay = getSelect("dobDay");
const dobMonth = getSelect("dobMonth");
const dobYear = getSelect("dobYear");

const birthdateError =
  getElement("birthdateError");

// =====================================================
// GÉNÉRER LES ANNÉES
// =====================================================

function populateYears(): void {
  if (!dobYear) return;

  while (dobYear.options.length > 1) {
    dobYear.remove(1);
  }

  const currentYear =
    new Date().getFullYear();

  for (
    let year = currentYear;
    year >= 1900;
    year--
  ) {
    const option =
      document.createElement("option");

    option.value = String(year);
    option.textContent = String(year);

    dobYear.appendChild(option);
  }
}

// =====================================================
// GÉNÉRER LES JOURS
// =====================================================

function populateDays(): void {
  if (!dobDay) return;

  const previousDay =
    dobDay.value;

  const month =
    Number(dobMonth?.value);

  const year =
    Number(dobYear?.value);

  let numberOfDays = 31;

  if (month === 2) {
    const leapYear =
      year > 0 &&
      (
        year % 400 === 0 ||
        (
          year % 4 === 0 &&
          year % 100 !== 0
        )
      );

    numberOfDays =
      leapYear ? 29 : 28;
  }

  else if (
    [4, 6, 9, 11].includes(month)
  ) {
    numberOfDays = 30;
  }

  while (dobDay.options.length > 1) {
    dobDay.remove(1);
  }

  for (
    let day = 1;
    day <= numberOfDays;
    day++
  ) {
    const option =
      document.createElement("option");

    option.value = String(day);
    option.textContent = String(day);

    dobDay.appendChild(option);
  }

  if (
    previousDay &&
    Number(previousDay) <= numberOfDays
  ) {
    dobDay.value = previousDay;
  }
}

populateYears();
populateDays();

dobMonth?.addEventListener(
  "change",
  populateDays
);

dobYear?.addEventListener(
  "change",
  populateDays
);

// =====================================================
// ERREURS DATE DE NAISSANCE
// =====================================================

function addBirthdateErrorStyle(): void {
  [dobDay, dobMonth, dobYear].forEach(
    (select) => {
      select?.classList.add(
        "border-red-500",
        "ring-1",
        "ring-red-500"
      );
    }
  );
}

function removeBirthdateErrorStyle(): void {
  [dobDay, dobMonth, dobYear].forEach(
    (select) => {
      select?.classList.remove(
        "border-red-500",
        "ring-1",
        "ring-red-500"
      );
    }
  );
}

function showBirthdateError(
  message: string
): false {
  if (birthdateError) {
    birthdateError.textContent = message;
    birthdateError.classList.remove("hidden");
  }

  addBirthdateErrorStyle();

  return false;
}

// =====================================================
// VALIDATION DATE + 18 ANS
// =====================================================

function validateBirthdate(): boolean {
  if (
    !dobDay ||
    !dobMonth ||
    !dobYear
  ) {
    return false;
  }

  const day =
    Number(dobDay.value);

  const month =
    Number(dobMonth.value);

  const year =
    Number(dobYear.value);

  if (!day || !month || !year) {
    return showBirthdateError(
      "Veuillez sélectionner votre date de naissance."
    );
  }

  const birthdate =
    new Date(
      year,
      month - 1,
      day
    );

  const validDate =
    birthdate.getFullYear() === year &&
    birthdate.getMonth() === month - 1 &&
    birthdate.getDate() === day;

  if (!validDate) {
    return showBirthdateError(
      "Veuillez sélectionner une date valide."
    );
  }

  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  if (birthdate > today) {
    return showBirthdateError(
      "La date de naissance ne peut pas être dans le futur."
    );
  }

  let age =
    today.getFullYear() -
    birthdate.getFullYear();

  const monthDifference =
    today.getMonth() -
    birthdate.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() <
      birthdate.getDate()
    )
  ) {
    age--;
  }

  if (age < 18) {
    return showBirthdateError(
      "Vous devez avoir 18 ans ou plus pour effectuer un don."
    );
  }

  birthdateError?.classList.add("hidden");

  removeBirthdateErrorStyle();

  return true;
}

[dobDay, dobMonth, dobYear].forEach(
  (select) => {
    select?.addEventListener(
      "change",
      () => {
        birthdateError?.classList.add(
          "hidden"
        );

        removeBirthdateErrorStyle();
      }
    );
  }
);

// =====================================================
// TYPE DE DON
// =====================================================

const typeDonInputs =
  document.querySelectorAll<HTMLInputElement>(
    'input[name="typeDon"]'
  );

const recurringOptions =
  getElement("recurringOptions");

const memorialOptions =
  getElement("memorialOptions");

const plannedOptions =
  getElement("plannedOptions");

function updatetypeDonOptions(): void {
  const selected =
    document.querySelector<HTMLInputElement>(
      'input[name="typeDon"]:checked'
    );

  recurringOptions?.classList.add("hidden");
  memorialOptions?.classList.add("hidden");
  plannedOptions?.classList.add("hidden");

  if (!selected) return;

  if (selected.value === "Don récurrent") {
    recurringOptions?.classList.remove(
      "hidden"
    );
  }

  if (selected.value === "Don commémoratif") {
    memorialOptions?.classList.remove(
      "hidden"
    );
  }

  if (selected.value === "Don planifié") {
    plannedOptions?.classList.remove(
      "hidden"
    );
  }
}

typeDonInputs.forEach(
  (radio) => {
    radio.addEventListener(
      "change",
      () => {
        updatetypeDonOptions();

        getElement(
          "typeDonError"
        )?.classList.add("hidden");
      }
    );
  }
);

// =====================================================
// MONTANTS
// =====================================================

const amountRadios =
  document.querySelectorAll<HTMLInputElement>(
    'input[name="amount"]'
  );

const customAmount =
  getInput("customAmount");

amountRadios.forEach(
  (radio) => {
    radio.addEventListener(
      "change",
      () => {
        if (customAmount) {
          customAmount.value = "";
        }

        getElement(
          "amountError"
        )?.classList.add("hidden");
      }
    );
  }
);

customAmount?.addEventListener(
  "input",
  () => {
    if (customAmount.value.trim() !== "") {
      amountRadios.forEach(
        (radio) => {
          radio.checked = false;
        }
      );
    }

    getElement(
      "amountError"
    )?.classList.add("hidden");
  }
);

// =====================================================
// FORMAT NUMÉRO DE TÉLÉPHONE
// (418) 555-1234
// =====================================================

const phone =
  getInput("phone");

phone?.addEventListener(
  "input",
  () => {
    let value =
      phone.value
        .replace(/\D/g, "")
        .slice(0, 10);

    if (value.length === 0) {
      phone.value = "";
    }

    else if (value.length <= 3) {
      phone.value =
        `(${value}`;
    }

    else if (value.length <= 6) {
      phone.value =
        `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }

    else {
      phone.value =
        `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
    }
  }
);

// =====================================================
// FORMAT CODE POSTAL
// G1A 1A1
// =====================================================

function formatPostalCode(
  input: HTMLInputElement
): void {
  let value =
    input.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);

  if (value.length > 3) {
    value =
      `${value.slice(0, 3)} ${value.slice(3)}`;
  }

  input.value = value;
}

const postalCode =
  getInput("postalCode");

const billingPostalCode =
  getInput("billingPostalCode");

postalCode?.addEventListener(
  "input",
  () => {
    formatPostalCode(postalCode);
  }
);

billingPostalCode?.addEventListener(
  "input",
  () => {
    formatPostalCode(
      billingPostalCode
    );
  }
);

// =====================================================
// ADRESSE DE FACTURATION
// =====================================================

const sameBillingAddress =
  getInput("sameBillingAddress");

const billingAddressFields =
  getElement("billingAddressFields");

function updateBillingAddress(): void {
  if (
    !sameBillingAddress ||
    !billingAddressFields
  ) {
    return;
  }

  billingAddressFields.classList.toggle(
    "hidden",
    sameBillingAddress.checked
  );
}

sameBillingAddress?.addEventListener(
  "change",
  updateBillingAddress
);

updateBillingAddress();

// =====================================================
// FORMAT NUMÉRO DE CARTE
// =====================================================

const cardNumber =
  getInput("cardNumber");

cardNumber?.addEventListener(
  "input",
  () => {
    const value =
      cardNumber.value
        .replace(/\D/g, "")
        .slice(0, 16);

    cardNumber.value =
      value
        .replace(/(.{4})/g, "$1 ")
        .trim();
  }
);

// =====================================================
// FORMAT EXPIRATION
// =====================================================

const expiry =
  getInput("expiry");

expiry?.addEventListener(
  "input",
  () => {
    let value =
      expiry.value
        .replace(/\D/g, "")
        .slice(0, 4);

    if (value.length >= 3) {
      value =
        `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    expiry.value = value;
  }
);

// =====================================================
// FORMAT CVV
// =====================================================

const cvv =
  getInput("cvv");

cvv?.addEventListener(
  "input",
  () => {
    cvv.value =
      cvv.value
        .replace(/\D/g, "")
        .slice(0, 4);
  }
);

// =====================================================
// AFFICHER UNE ÉTAPE
// =====================================================

function showStep(
  step: number,
  direction: "next" | "back" = "next"
): void {
  steps.forEach(
    (section) => {
      const sectionStep =
        Number(
          section.dataset.step
        );

      if (sectionStep === step) {
        section.classList.remove(
          "hidden"
        );

        section.classList.add(
          "opacity-0"
        );

        if (direction === "next") {
          section.classList.add(
            "translate-x-4"
          );
        } else {
          section.classList.add(
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
      }

      else {
        section.classList.add(
          "hidden"
        );

        section.classList.remove(
          "opacity-100",
          "translate-x-0",
          "translate-x-4",
          "-translate-x-4"
        );
      }
    }
  );

  updateStepper();
  updateButtons();

  if (step === 5) {
    updateReview();
  }
}

// =====================================================
// STEPPER
// =====================================================

function updateStepper(): void {
  stepperButtons.forEach(
    (button) => {
      const stepNumber =
        Number(
          button.dataset.stepButton
        );

      const circle =
        button.querySelector<HTMLElement>(
          ".step-circle"
        );

      const label =
        button.querySelector<HTMLElement>(
          ".step-label"
        );

      if (!circle || !label) {
        return;
      }

      // ÉTAPE TERMINÉE
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
          "bg-[#CD5C08]"
        );

        circle.classList.add(
          "bg-green-500",
          "text-white"
        );

        circle.innerHTML =
          "&#10004;";

        label.classList.remove(
          "text-slate-500",
          "text-[#CD5C08]"
        );

        label.classList.add(
          "text-green-600"
        );
      }

      // ÉTAPE ACTUELLE
      else if (
        stepNumber === currentStep
      ) {
        button.disabled = true;

        button.classList.remove(
          "cursor-pointer",
          "hover:translate-x-1",
          "opacity-50"
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

      // ÉTAPE FUTURE
      else {
        button.disabled = true;

        button.classList.remove(
          "cursor-pointer",
          "hover:translate-x-1",
          "opacity-100"
        );

        button.classList.add(
          "opacity-50",
          "cursor-not-allowed"
        );

        circle.classList.remove(
          "bg-green-500",
          "bg-[#CD5C08]",
          "text-white"
        );

        circle.classList.add(
          "bg-slate-200",
          "text-slate-500"
        );

        circle.innerHTML =
          String(stepNumber);

        label.classList.remove(
          "text-green-600",
          "text-[#CD5C08]"
        );

        label.classList.add(
          "text-slate-500"
        );
      }
    }
  );
}

// =====================================================
// BOUTONS
// =====================================================

function updateButtons(): void {
  if (
    !nextBtn ||
    !prevBtn ||
    !submitBtn
  ) {
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
// VALIDATION CHAMP TEXTE
// =====================================================

function validateTextField(
  id: string
): boolean {
  const field =
    getInput(id);

  const error =
    getElement(`${id}Error`);

  if (
    !field ||
    field.value.trim() === ""
  ) {
    error?.classList.remove(
      "hidden"
    );

    field?.classList.add(
      "border-red-500",
      "ring-1",
      "ring-red-500"
    );

    return false;
  }

  error?.classList.add(
    "hidden"
  );

  field.classList.remove(
    "border-red-500",
    "ring-1",
    "ring-red-500"
  );

  return true;
}

// =====================================================
// VALIDATION ÉTAPE 1
// =====================================================

function validateStep1(): boolean {
  const selectedType =
    document.querySelector<HTMLInputElement>(
      'input[name="typeDon"]:checked'
    );

  const error =
    getElement("typeDonError");

  if (!selectedType) {
    error?.classList.remove("hidden");

    if (error) {
      error.textContent =
        "Veuillez sélectionner un type de don.";
    }

    return false;
  }

  if (
    selectedType.value ===
    "Don récurrent"
  ) {
    const frequency =
      getSelect("donationFrequency");

    const firstPaymentDate =
      getInput("firstPaymentDate");

    if (
      !frequency?.value ||
      !firstPaymentDate?.value
    ) {
      error?.classList.remove("hidden");

      if (error) {
        error.textContent =
          "Veuillez sélectionner la fréquence et la date du premier prélèvement.";
      }

      return false;
    }
  }

  if (
    selectedType.value ===
    "Don commémoratif"
  ) {
    const memorialName =
      getInput("memorialName");

    if (
      !memorialName ||
      memorialName.value.trim() === ""
    ) {
      error?.classList.remove("hidden");

      if (error) {
        error.textContent =
          "Veuillez indiquer le nom de la personne.";
      }

      return false;
    }
  }

  if (
    selectedType.value ===
    "Don planifié"
  ) {
    const plannedType =
      getSelect("plannedtypeDon");

    if (!plannedType?.value) {
      error?.classList.remove("hidden");

      if (error) {
        error.textContent =
          "Veuillez sélectionner un type de don planifié.";
      }

      return false;
    }
  }

  error?.classList.add("hidden");

  return true;
}

// =====================================================
// VALIDATION ÉTAPE 2
// =====================================================

function validateStep2(): boolean {
  const selectedAmount =
    document.querySelector<HTMLInputElement>(
      'input[name="amount"]:checked'
    );

  const error =
    getElement("amountError");

  const customValue =
    Number(
      customAmount?.value ?? 0
    );

  const valid =
    selectedAmount !== null ||
    customValue > 0;

  if (!valid) {
    error?.classList.remove("hidden");
    return false;
  }

  error?.classList.add("hidden");

  return true;
}

// =====================================================
// VALIDATION CODE POSTAL
// =====================================================

function isValidPostalCode(
  value: string
): boolean {
  const postalRegex =
    /^[A-Z]\d[A-Z][ -]?\d[A-Z]\d$/i;

  return postalRegex.test(
    value.trim()
  );
}

// =====================================================
// VALIDATION ÉTAPE 3
// =====================================================

function validateStep3(): boolean {
  let valid = true;

  if (!validateTextField("firstName")) {
    valid = false;
  }

  if (!validateTextField("lastName")) {
    valid = false;
  }

  // COURRIEL

  const email =
    getInput("email");

  const emailError =
    getElement("emailError");

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !email ||
    !emailRegex.test(
      email.value.trim()
    )
  ) {
    emailError?.classList.remove(
      "hidden"
    );

    email?.classList.add(
      "border-red-500",
      "ring-1",
      "ring-red-500"
    );

    valid = false;
  }

  else {
    emailError?.classList.add(
      "hidden"
    );

    email.classList.remove(
      "border-red-500",
      "ring-1",
      "ring-red-500"
    );
  }

  // DATE DE NAISSANCE

  if (!validateBirthdate()) {
    valid = false;
  }

  // ADRESSE

  if (!validateTextField("address")) {
    valid = false;
  }

  // VILLE

  const city =
    getInput("city");

  if (
    !city ||
    city.value.trim() === ""
  ) {
    city?.classList.add(
      "border-red-500",
      "ring-1",
      "ring-red-500"
    );

    valid = false;
  }

  else {
    city.classList.remove(
      "border-red-500",
      "ring-1",
      "ring-red-500"
    );
  }

  // PROVINCE

  const province =
    getSelect("province");

  if (!province?.value) {
    province?.classList.add(
      "border-red-500",
      "ring-1",
      "ring-red-500"
    );

    valid = false;
  }

  else {
    province.classList.remove(
      "border-red-500",
      "ring-1",
      "ring-red-500"
    );
  }

  // CODE POSTAL

  if (
    !postalCode ||
    !isValidPostalCode(
      postalCode.value
    )
  ) {
    postalCode?.classList.add(
      "border-red-500",
      "ring-1",
      "ring-red-500"
    );

    valid = false;
  }

  else {
    postalCode.classList.remove(
      "border-red-500",
      "ring-1",
      "ring-red-500"
    );
  }

  return valid;
}

// =====================================================
// VALIDATION EXPIRATION
// =====================================================

function isValidExpiry(
  value: string
): boolean {
  if (!/^\d{2}\/\d{2}$/.test(value)) {
    return false;
  }

  const [monthString, yearString] =
    value.split("/");

  const month =
    Number(monthString);

  const year =
    Number(yearString);

  if (
    month < 1 ||
    month > 12
  ) {
    return false;
  }

  const today =
    new Date();

  const currentYear =
    today.getFullYear() % 100;

  const currentMonth =
    today.getMonth() + 1;

  if (year < currentYear) {
    return false;
  }

  if (
    year === currentYear &&
    month < currentMonth
  ) {
    return false;
  }

  return true;
}

// =====================================================
// VALIDATION ÉTAPE 4
// =====================================================

function validateStep4(): boolean {
  const paymentMethod =
    getSelect("paymentMethod");

  const cardName =
    getInput("cardName");

  const terms =
    getInput("terms");

  const error =
    getElement("paymentError");

  const cleanCard =
    cardNumber?.value
      .replace(/\D/g, "") ?? "";

  const cleanCvv =
    cvv?.value
      .replace(/\D/g, "") ?? "";

  let valid =
    paymentMethod !== null &&
    paymentMethod.value !== "" &&

    cardName !== null &&
    cardName.value.trim() !== "" &&

    cleanCard.length === 16 &&

    expiry !== null &&
    isValidExpiry(expiry.value) &&

    cleanCvv.length >= 3 &&
    cleanCvv.length <= 4 &&

    terms !== null &&
    terms.checked;

  // ADRESSE DE FACTURATION DIFFÉRENTE

  if (
    sameBillingAddress &&
    !sameBillingAddress.checked
  ) {
    const billingAddress =
      getInput("billingAddress");

    const billingCity =
      getInput("billingCity");

    const billingPostal =
      getInput("billingPostalCode");

    if (
      !billingAddress?.value.trim() ||
      !billingCity?.value.trim() ||
      !billingPostal ||
      !isValidPostalCode(
        billingPostal.value
      )
    ) {
      valid = false;
    }
  }

  if (!valid) {
    error?.classList.remove(
      "hidden"
    );

    return false;
  }

  error?.classList.add(
    "hidden"
  );

  return true;
}

// =====================================================
// VALIDATION ÉTAPE 5
// =====================================================

function validateStep5(): boolean {
  const confirmation =
    getInput("finalConfirmation");

  const error =
    getElement("confirmationError");

  if (
    !confirmation ||
    !confirmation.checked
  ) {
    error?.classList.remove(
      "hidden"
    );

    return false;
  }

  error?.classList.add(
    "hidden"
  );

  return true;
}

// =====================================================
// VALIDATION ÉTAPE ACTUELLE
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
      return validateStep5();

    default:
      return false;
  }
}

// =====================================================
// RÉCUPÉRER LE MONTANT
// =====================================================

function getDonationAmount(): string {
  const selected =
    document.querySelector<HTMLInputElement>(
      'input[name="amount"]:checked'
    );

  if (
    customAmount &&
    customAmount.value.trim() !== ""
  ) {
    return `${customAmount.value} $`;
  }

  if (selected) {
    return `${selected.value} $`;
  }

  return "Non sélectionné";
}

// =====================================================
// RÉCUPÉRER DATE DE NAISSANCE
// =====================================================

function getBirthdate(): string {
  if (
    !dobDay?.value ||
    !dobMonth?.value ||
    !dobYear?.value
  ) {
    return "Non renseignée";
  }

  const day =
    dobDay.value.padStart(
      2,
      "0"
    );

  const month =
    dobMonth.value.padStart(
      2,
      "0"
    );

  return `${day}/${month}/${dobYear.value}`;
}

// =====================================================
// CONSTRUIRE L'ADRESSE COMPLÈTE
// =====================================================

function getFullAddress(): string {
  const address =
    getInput("address")?.value.trim() ?? "";

  const apartment =
    getInput("apartment")?.value.trim() ?? "";

  const city =
    getInput("city")?.value.trim() ?? "";

  const province =
    getSelect("province")?.value ?? "";

  const postal =
    getInput("postalCode")?.value.trim() ?? "";

  let street = address;

  if (apartment) {
    street +=
      `, app. ${apartment}`;
  }

  const location =
    [city, province]
      .filter(Boolean)
      .join(", ");

  return [
    street,
    location,
    postal
  ]
    .filter(Boolean)
    .join(", ");
}

// =====================================================
// PAGE DE VÉRIFICATION
// =====================================================

function updateReview(): void {
  const typeDon =
    document.querySelector<HTMLInputElement>(
      'input[name="typeDon"]:checked'
    );

  const firstName =
    getInput("firstName");

  const lastName =
    getInput("lastName");

  const email =
    getInput("email");

  const paymentMethod =
    getSelect("paymentMethod");

  const donationPurpose =
    getSelect("donationPurpose");

  const donationFrequency =
    getSelect("donationFrequency");

  // TYPE DE DON

  const verifTypeDon =
    getElement("verifTypeDon");

  if (verifTypeDon) {
    verifTypeDon.textContent =
      typeDon?.value ??
      "Non sélectionné";
  }

  // FRÉQUENCE

  const reviewFrequencyRow =
    getElement("reviewFrequencyRow");

  const reviewFrequency =
    getElement("reviewFrequency");

  if (
    typeDon?.value ===
    "Don récurrent"
  ) {
    reviewFrequencyRow?.classList.remove(
      "hidden"
    );

    if (reviewFrequency) {
      reviewFrequency.textContent =
        donationFrequency?.value ||
        "Non sélectionnée";
    }
  }

  else {
    reviewFrequencyRow?.classList.add(
      "hidden"
    );
  }

  // MONTANT

  const reviewAmount =
    getElement("reviewAmount");

  if (reviewAmount) {
    reviewAmount.textContent =
      getDonationAmount();
  }

  // AFFECTATION

  const reviewPurpose =
    getElement("reviewPurpose");

  if (reviewPurpose) {
    reviewPurpose.textContent =
      donationPurpose?.options[
        donationPurpose.selectedIndex
      ]?.text ??
      "Non sélectionnée";
  }

  // NOM

  const reviewName =
    getElement("reviewName");

  if (reviewName) {
    reviewName.textContent =
      `${firstName?.value ?? ""} ${lastName?.value ?? ""}`
        .trim() ||
      "Non renseigné";
  }

  // DATE DE NAISSANCE

  const reviewBirthdate =
    getElement("reviewBirthdate");

  if (reviewBirthdate) {
    reviewBirthdate.textContent =
      getBirthdate();
  }

  // COURRIEL

  const reviewEmail =
    getElement("reviewEmail");

  if (reviewEmail) {
    reviewEmail.textContent =
      email?.value ||
      "Non renseigné";
  }

  // TÉLÉPHONE

  const reviewPhone =
    getElement("reviewPhone");

  if (reviewPhone) {
    reviewPhone.textContent =
      phone?.value.trim() ||
      "Non renseigné";
  }

  // ADRESSE

  const reviewAddress =
    getElement("reviewAddress");

  if (reviewAddress) {
    reviewAddress.textContent =
      getFullAddress() ||
      "Non renseignée";
  }

  // MÉTHODE DE PAIEMENT

  const reviewPayment =
    getElement("reviewPayment");

  if (reviewPayment) {
    reviewPayment.textContent =
      paymentMethod?.value ||
      "Non sélectionné";
  }

  // CARTE MASQUÉE

  const reviewCard =
    getElement("reviewCard");

  if (reviewCard) {
    const value =
      cardNumber?.value
        .replace(/\D/g, "") ?? "";

    if (value.length >= 4) {
      reviewCard.textContent =
        `•••• •••• •••• ${value.slice(-4)}`;
    }

    else {
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
// STEPPER
// RETOUR AUX ÉTAPES PRÉCÉDENTES SEULEMENT
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

        if (
          targetStep <
          currentStep
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
// ENLEVER LES ERREURS PENDANT LA SAISIE
// =====================================================

[
  "firstName",
  "lastName",
  "email",
  "address",
  "city",
  "postalCode",
  "cardName"
].forEach(
  (id) => {
    const input =
      getInput(id);

    input?.addEventListener(
      "input",
      () => {
        input.classList.remove(
          "border-red-500",
          "ring-1",
          "ring-red-500"
        );

        getElement(
          `${id}Error`
        )?.classList.add("hidden");
      }
    );
  }
);

// =====================================================
// CONFIRMATION FINALE
// =====================================================

getInput(
  "finalConfirmation"
)?.addEventListener(
  "change",
  () => {
    getElement(
      "confirmationError"
    )?.classList.add("hidden");
  }
);

// =====================================================
// SOUMISSION DU FORMULAIRE
// =====================================================

form?.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    sessionStorage.setItem(
      "donSubmitted",
      "true"
    );

    window.location.href =
      "/index.html";
  }
);

// =====================================================
// INITIALISATION
// =====================================================

if (
  form &&
  totalSteps > 0
) {
  updatetypeDonOptions();
  updateBillingAddress();

  showStep(
    1,
    "next"
  );
}