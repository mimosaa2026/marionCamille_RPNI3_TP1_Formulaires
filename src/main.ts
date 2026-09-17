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
    header.classList.toggle(
      "shadow-xl",
      window.scrollY > 100
    );
  });
}


// =====================================================
// FORMULAIRE
// =====================================================

const form =
  document.querySelector<HTMLFormElement>(
    "#donationForm"
  );

const steps =
  document.querySelectorAll<HTMLElement>(
    ".etape-formulaire"
  );

const nextBtn =
  document.querySelector<HTMLButtonElement>(
    "#nextBtn"
  );

const prevBtn =
  document.querySelector<HTMLButtonElement>(
    "#prevBtn"
  );

const submitBtn =
  document.querySelector<HTMLButtonElement>(
    "#submitBtn"
  );

const successMessage =
  document.querySelector<HTMLElement>(
    "#successMessage"
  );

const stepperButtons =
  document.querySelectorAll<HTMLButtonElement>(
    ".bouton-etape"
  );

let currentStep = 1;

const totalSteps = steps.length;


// =====================================================
// FONCTIONS UTILITAIRES
// =====================================================

function getInput(
  id: string
): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(
    `#${id}`
  );
}

function getSelect(
  id: string
): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>(
    `#${id}`
  );
}

function getElement(
  id: string
): HTMLElement | null {
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

  const previousDay = dobDay.value;

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
// VALIDATION DATE DE NAISSANCE
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

  const isValidDate =
    birthdate.getFullYear() === year &&
    birthdate.getMonth() === month - 1 &&
    birthdate.getDate() === day;

  if (!isValidDate) {
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

  birthdateError?.classList.add(
    "hidden"
  );

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

function updateTypeDonOptions(): void {
  const selected =
    document.querySelector<HTMLInputElement>(
      'input[name="typeDon"]:checked'
    );

  recurringOptions?.classList.add(
    "hidden"
  );

  memorialOptions?.classList.add(
    "hidden"
  );

  if (!selected) return;

  if (
    selected.value ===
    "Don récurrent"
  ) {
    recurringOptions?.classList.remove(
      "hidden"
    );
  }

  if (
    selected.value ===
    "Don commémoratif"
  ) {
    memorialOptions?.classList.remove(
      "hidden"
    );
  }
}

typeDonInputs.forEach(
  (radio) => {
    radio.addEventListener(
      "change",
      () => {
        updateTypeDonOptions();

        getElement(
          "typeDonError"
        )?.classList.add(
          "hidden"
        );
      }
    );
  }
);


// =====================================================
// MONTANT
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
        )?.classList.add(
          "hidden"
        );
      }
    );
  }
);

customAmount?.addEventListener(
  "input",
  () => {
    if (
      customAmount.value.trim() !== ""
    ) {
      amountRadios.forEach(
        (radio) => {
          radio.checked = false;
        }
      );
    }

    getElement(
      "amountError"
    )?.classList.add(
      "hidden"
    );
  }
);


// =====================================================
// TÉLÉPHONE
// FORMAT : (418) 555-1234
// =====================================================

const phone =
  getInput("phone");

function formatPhoneNumber(
  input: HTMLInputElement
): void {
  const digits =
    input.value
      .replace(/\D/g, "")
      .slice(0, 10);

  if (digits.length === 0) {
    input.value = "";
    return;
  }

  if (digits.length <= 3) {
    input.value =
      `(${digits}`;

    return;
  }

  if (digits.length <= 6) {
    input.value =
      `(${digits.slice(0, 3)}) ${digits.slice(3)}`;

    return;
  }

  input.value =
    `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

phone?.addEventListener(
  "input",
  () => {
    formatPhoneNumber(phone);
  }
);


// =====================================================
// CODE POSTAL
// FORMAT : G1A 1A1
// =====================================================

const postalCode =
  getInput("postalCode");

const billingPostalCode =
  getInput("billingPostalCode");

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

postalCode?.addEventListener(
  "input",
  () => {
    formatPostalCode(postalCode);

    postalCode.classList.remove(
      "border-red-500",
      "ring-1",
      "ring-red-500"
    );
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
  getElement(
    "billingAddressFields"
  );

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
// NUMÉRO DE CARTE
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
        .replace(
          /(.{4})/g,
          "$1 "
        )
        .trim();

    getElement(
      "paymentError"
    )?.classList.add(
      "hidden"
    );
  }
);


// =====================================================
// EXPIRATION
// FORMAT : MM/AA
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

    getElement(
      "paymentError"
    )?.classList.add(
      "hidden"
    );
  }
);


// =====================================================
// CVV
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

    getElement(
      "paymentError"
    )?.classList.add(
      "hidden"
    );
  }
);


// =====================================================
// AFFICHER UNE ÉTAPE
// =====================================================

function showStep(
  step: number,
  direction:
    "next" | "back" = "next"
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

        if (
          direction === "next"
        ) {
          section.classList.add(
            "translate-x-4"
          );
        }

        else {
          section.classList.add(
            "-translate-x-4"
          );
        }

        requestAnimationFrame(
          () => {
            section.classList.remove(
              "opacity-0",
              "translate-x-4",
              "-translate-x-4"
            );

            section.classList.add(
              "opacity-100",
              "translate-x-0"
            );
          }
        );
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
          ".cercle-etape"
        );

      const label =
        button.querySelector<HTMLElement>(
          ".libelle-etape"
        );

      if (
        !circle ||
        !label
      ) {
        return;
      }

      // ---------------------------------------------
      // ÉTAPE TERMINÉE
      // ---------------------------------------------

      if (
        stepNumber < currentStep
      ) {
        button.disabled = false;

        button.classList.remove(
          "opacity-50",
          "cursor-not-allowed"
        );

        button.classList.add(
          "cursor-pointer"
        );

        circle.classList.remove(
          "bg-slate-200",
          "text-slate-500",
          "bg-[#CD5C08]"
        );

        circle.classList.add(
          "bg-[#496E60]",
          "text-white"
        );

        circle.innerHTML =
          "&#10004;";

        label.classList.remove(
          "text-slate-500",
          "text-[#CD5C08]"
        );

        label.classList.add(
          "text-[#496E60]"
        );
      }

      // ---------------------------------------------
      // ÉTAPE ACTUELLE
      // ---------------------------------------------

      else if (
        stepNumber === currentStep
      ) {
        button.disabled = true;

        button.classList.remove(
          "opacity-50",
          "cursor-pointer"
        );

        button.classList.add(
          "opacity-100",
          "cursor-default"
        );

        circle.classList.remove(
          "bg-slate-200",
          "text-slate-500",
          "bg-[#496E60]"
        );

        circle.classList.add(
          "bg-[#CD5C08]",
          "text-white"
        );

        circle.textContent =
          String(stepNumber);

        label.classList.remove(
          "text-slate-500",
          "text-[#496E60]"
        );

        label.classList.add(
          "text-[#CD5C08]"
        );
      }

      // ---------------------------------------------
      // ÉTAPE FUTURE
      // ---------------------------------------------

      else {
        button.disabled = true;

        button.classList.remove(
          "opacity-100",
          "cursor-pointer",
          "cursor-default"
        );

        button.classList.add(
          "opacity-50",
          "cursor-not-allowed"
        );

        circle.classList.remove(
          "bg-[#496E60]",
          "bg-[#CD5C08]",
          "text-white"
        );

        circle.classList.add(
          "bg-slate-200",
          "text-slate-500"
        );

        circle.textContent =
          String(stepNumber);

        label.classList.remove(
          "text-[#496E60]",
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
// BOUTONS PRÉCÉDENT / SUIVANT / CONFIRMER
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
// STYLE D'ERREUR
// =====================================================

function showFieldError(
  field:
    | HTMLInputElement
    | HTMLSelectElement
): void {
  field.classList.add(
    "border-red-500",
    "ring-1",
    "ring-red-500"
  );
}

function removeFieldError(
  field:
    | HTMLInputElement
    | HTMLSelectElement
): void {
  field.classList.remove(
    "border-red-500",
    "ring-1",
    "ring-red-500"
  );
}


// =====================================================
// VALIDATION TEXTE
// =====================================================

function validateTextField(
  id: string,
  errorId?: string
): boolean {
  const field =
    getInput(id);

  if (!field) {
    return false;
  }

  const valid =
    field.value.trim() !== "";

  if (!valid) {
    showFieldError(field);

    if (errorId) {
      getElement(
        errorId
      )?.classList.remove(
        "hidden"
      );
    }
  }

  else {
    removeFieldError(field);

    if (errorId) {
      getElement(
        errorId
      )?.classList.add(
        "hidden"
      );
    }
  }

  return valid;
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
    error?.classList.remove(
      "hidden"
    );

    return false;
  }

  // DON RÉCURRENT

  if (
    selectedType.value ===
    "Don récurrent"
  ) {
    const frequency =
      getSelect(
        "donationFrequency"
      );

    const firstPaymentDate =
      getInput(
        "firstPaymentDate"
      );

    if (
      !frequency?.value ||
      !firstPaymentDate?.value
    ) {
      if (error) {
        error.textContent =
          "Veuillez sélectionner la fréquence et la date du premier prélèvement.";

        error.classList.remove(
          "hidden"
        );
      }

      return false;
    }
  }

  // DON COMMÉMORATIF

  if (
    selectedType.value ===
    "Don commémoratif"
  ) {
    const memorialName =
      getInput(
        "memorialName"
      );

    if (
      !memorialName ||
      memorialName.value.trim() === ""
    ) {
      if (error) {
        error.textContent =
          "Veuillez indiquer le nom de la personne.";

        error.classList.remove(
          "hidden"
        );
      }

      return false;
    }
  }

  if (error) {
    error.textContent =
      "Veuillez sélectionner un type de don.";

    error.classList.add(
      "hidden"
    );
  }

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

  const customValue =
    Number(
      customAmount?.value ?? 0
    );

  const error =
    getElement("amountError");

  const valid =
    selectedAmount !== null ||
    customValue > 0;

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
// VALIDATION CODE POSTAL
// =====================================================

function isValidPostalCode(
  value: string
): boolean {
  return /^[A-Z]\d[A-Z] \d[A-Z]\d$/i.test(
    value.trim()
  );
}


// =====================================================
// VALIDATION ÉTAPE 3
// =====================================================

function validateStep3(): boolean {
  let valid = true;

  // PRÉNOM

  if (
    !validateTextField(
      "firstName",
      "firstNameError"
    )
  ) {
    valid = false;
  }

  // NOM

  if (
    !validateTextField(
      "lastName",
      "lastNameError"
    )
  ) {
    valid = false;
  }

  // DATE DE NAISSANCE

  if (!validateBirthdate()) {
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

    if (email) {
      showFieldError(email);
    }

    valid = false;
  }

  else {
    emailError?.classList.add(
      "hidden"
    );

    removeFieldError(email);
  }

  // TÉLÉPHONE FACULTATIF

  if (
    phone &&
    phone.value.trim() !== ""
  ) {
    const phoneDigits =
      phone.value.replace(
        /\D/g,
        ""
      );

    if (
      phoneDigits.length !== 10
    ) {
      showFieldError(phone);

      valid = false;
    }

    else {
      removeFieldError(phone);
    }
  }

  else if (phone) {
    removeFieldError(phone);
  }

  // VILLE

  const city =
    getInput("city");

  if (
    !city ||
    city.value.trim() === ""
  ) {
    if (city) {
      showFieldError(city);
    }

    valid = false;
  }

  else {
    removeFieldError(city);
  }

  // PROVINCE

  const province =
    getSelect("province");

  if (
    !province ||
    province.value === ""
  ) {
    if (province) {
      showFieldError(
        province
      );
    }

    valid = false;
  }

  else {
    removeFieldError(
      province
    );
  }

  // CODE POSTAL

  if (
    !postalCode ||
    !isValidPostalCode(
      postalCode.value
    )
  ) {
    if (postalCode) {
      showFieldError(
        postalCode
      );
    }

    valid = false;
  }

  else {
    removeFieldError(
      postalCode
    );
  }

  // PAYS

  const country =
    getSelect("country");

  if (
    !country ||
    country.value === ""
  ) {
    if (country) {
      showFieldError(
        country
      );
    }

    valid = false;
  }

  else {
    removeFieldError(
      country
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
  if (
    !/^\d{2}\/\d{2}$/.test(
      value
    )
  ) {
    return false;
  }

  const [
    monthString,
    yearString
  ] = value.split("/");

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
    getSelect(
      "paymentMethod"
    );

  const cardName =
    getInput("cardName");

  const terms =
    getInput("terms");

  const paymentError =
    getElement(
      "paymentError"
    );

  const cleanCard =
    cardNumber?.value
      .replace(/\D/g, "") ?? "";

  const cleanCvv =
    cvv?.value
      .replace(/\D/g, "") ?? "";

  let valid = true;

  // MÉTHODE

  if (
    !paymentMethod ||
    paymentMethod.value === ""
  ) {
    if (paymentMethod) {
      showFieldError(
        paymentMethod
      );
    }

    valid = false;
  }

  else {
    removeFieldError(
      paymentMethod
    );
  }

  // NOM SUR CARTE

  if (
    !cardName ||
    cardName.value.trim() === ""
  ) {
    if (cardName) {
      showFieldError(cardName);
    }

    valid = false;
  }

  else {
    removeFieldError(cardName);
  }

  // NUMÉRO DE CARTE

  if (
    !cardNumber ||
    cleanCard.length !== 16
  ) {
    if (cardNumber) {
      showFieldError(
        cardNumber
      );
    }

    valid = false;
  }

  else {
    removeFieldError(
      cardNumber
    );
  }

  // EXPIRATION

  if (
    !expiry ||
    !isValidExpiry(
      expiry.value
    )
  ) {
    if (expiry) {
      showFieldError(expiry);
    }

    valid = false;
  }

  else {
    removeFieldError(expiry);
  }

  // CVV

  if (
    !cvv ||
    (
      cleanCvv.length !== 3 &&
      cleanCvv.length !== 4
    )
  ) {
    if (cvv) {
      showFieldError(cvv);
    }

    valid = false;
  }

  else {
    removeFieldError(cvv);
  }

  // ADRESSE DE FACTURATION DIFFÉRENTE

  if (
    sameBillingAddress &&
    !sameBillingAddress.checked
  ) {
    const billingAddress =
      getInput(
        "billingAddress"
      );

    const billingCity =
      getInput(
        "billingCity"
      );

    if (
      !billingAddress ||
      billingAddress.value.trim() === ""
    ) {
      if (billingAddress) {
        showFieldError(
          billingAddress
        );
      }

      valid = false;
    }

    else {
      removeFieldError(
        billingAddress
      );
    }

    if (
      !billingCity ||
      billingCity.value.trim() === ""
    ) {
      if (billingCity) {
        showFieldError(
          billingCity
        );
      }

      valid = false;
    }

    else {
      removeFieldError(
        billingCity
      );
    }

    if (
      !billingPostalCode ||
      !isValidPostalCode(
        billingPostalCode.value
      )
    ) {
      if (billingPostalCode) {
        showFieldError(
          billingPostalCode
        );
      }

      valid = false;
    }

    else {
      removeFieldError(
        billingPostalCode
      );
    }
  }

  // CONDITIONS

  if (
    !terms ||
    !terms.checked
  ) {
    valid = false;
  }

  if (!valid) {
    paymentError?.classList.remove(
      "hidden"
    );
  }

  else {
    paymentError?.classList.add(
      "hidden"
    );
  }

  return valid;
}


// =====================================================
// VALIDATION ÉTAPE 5
// =====================================================

function validateStep5(): boolean {
  const confirmation =
    getInput(
      "finalConfirmation"
    );

  const error =
    getElement(
      "confirmationError"
    );

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
// MONTANT DU DON
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

  return "—";
}


// =====================================================
// DATE DE NAISSANCE POUR LE RÉSUMÉ
// =====================================================

function getBirthdate(): string {
  if (
    !dobDay?.value ||
    !dobMonth?.value ||
    !dobYear?.value
  ) {
    return "—";
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

  return (
    `${day}/${month}/${dobYear.value}`
  );
}


// =====================================================
// LOCALISATION POUR LE RÉSUMÉ
// =====================================================

function getLocation(): string {
  const city =
    getInput("city")
      ?.value
      .trim() ?? "";

  const province =
    getSelect("province")
      ?.value ?? "";

  const postal =
    postalCode
      ?.value
      .trim() ?? "";

  const country =
    getSelect("country")
      ?.value ?? "";

  return [
    city,
    province,
    postal,
    country
  ]
    .filter(Boolean)
    .join(", ");
}


// =====================================================
// RÉSUMÉ FINAL
// =====================================================

function updateReview(): void {
  const selectedType =
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
    getSelect(
      "paymentMethod"
    );


  // TYPE DE DON

  const verifTypeDon =
    getElement(
      "verifTypeDon"
    );

  if (verifTypeDon) {
    verifTypeDon.textContent =
      selectedType?.value ?? "—";
  }


  // FRÉQUENCE

  const reviewFrequencyRow =
    getElement(
      "reviewFrequencyRow"
    );

  const reviewFrequency =
    getElement(
      "reviewFrequency"
    );

  if (
    selectedType?.value ===
    "Don récurrent"
  ) {
    const frequency =
      getSelect(
        "donationFrequency"
      );

    reviewFrequencyRow
      ?.classList.remove(
        "hidden"
      );

    if (reviewFrequency) {
      reviewFrequency.textContent =
        frequency?.value ?? "—";
    }
  }

  else {
    reviewFrequencyRow
      ?.classList.add(
        "hidden"
      );
  }


  // MONTANT

  const reviewAmount =
    getElement(
      "reviewAmount"
    );

  if (reviewAmount) {
    reviewAmount.textContent =
      getDonationAmount();
  }


  // NOM

  const reviewName =
    getElement(
      "reviewName"
    );

  if (reviewName) {
    const fullName =
      `${firstName?.value ?? ""} ${lastName?.value ?? ""}`
        .trim();

    reviewName.textContent =
      fullName || "—";
  }


  // DATE DE NAISSANCE

  const reviewBirthdate =
    getElement(
      "reviewBirthdate"
    );

  if (reviewBirthdate) {
    reviewBirthdate.textContent =
      getBirthdate();
  }


  // COURRIEL

  const reviewEmail =
    getElement(
      "reviewEmail"
    );

  if (reviewEmail) {
    reviewEmail.textContent =
      email?.value.trim() ||
      "—";
  }


  // TÉLÉPHONE

  const reviewPhone =
    getElement(
      "reviewPhone"
    );

  if (reviewPhone) {
    reviewPhone.textContent =
      phone?.value.trim() ||
      "Non renseigné";
  }


  // LOCALISATION

  const reviewAddress =
    getElement(
      "reviewAddress"
    );

  if (reviewAddress) {
    reviewAddress.textContent =
      getLocation() || "—";
  }


  // MÉTHODE DE PAIEMENT

  const reviewPayment =
    getElement(
      "reviewPayment"
    );

  if (reviewPayment) {
    reviewPayment.textContent =
      paymentMethod?.value ||
      "—";
  }


  // CARTE MASQUÉE

  const reviewCard =
    getElement(
      "reviewCard"
    );

  if (reviewCard) {
    const digits =
      cardNumber?.value
        .replace(/\D/g, "") ?? "";

    if (digits.length >= 4) {
      reviewCard.textContent =
        `•••• •••• •••• ${digits.slice(-4)}`;
    }

    else {
      reviewCard.textContent =
        "—";
    }
  }
}


// =====================================================
// BOUTON SUIVANT
// =====================================================

nextBtn?.addEventListener(
  "click",
  () => {
    if (
      !validateCurrentStep()
    ) {
      return;
    }

    if (
      currentStep <
      totalSteps
    ) {
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
// ON PEUT REVENIR EN ARRIÈRE,
// MAIS PAS ALLER VERS UNE ÉTAPE FUTURE
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

const firstName =
  getInput("firstName");

const lastName =
  getInput("lastName");

const email =
  getInput("email");

const city =
  getInput("city");

firstName?.addEventListener(
  "input",
  () => {
    removeFieldError(
      firstName
    );

    getElement(
      "firstNameError"
    )?.classList.add(
      "hidden"
    );
  }
);

lastName?.addEventListener(
  "input",
  () => {
    removeFieldError(
      lastName
    );

    getElement(
      "lastNameError"
    )?.classList.add(
      "hidden"
    );
  }
);

email?.addEventListener(
  "input",
  () => {
    removeFieldError(email);

    getElement(
      "emailError"
    )?.classList.add(
      "hidden"
    );
  }
);

city?.addEventListener(
  "input",
  () => {
    removeFieldError(city);
  }
);

phone?.addEventListener(
  "input",
  () => {
    removeFieldError(phone);
  }
);


// =====================================================
// PAIEMENT - RETIRER MESSAGE D'ERREUR
// =====================================================

getSelect(
  "paymentMethod"
)?.addEventListener(
  "change",
  () => {
    getElement(
      "paymentError"
    )?.classList.add(
      "hidden"
    );
  }
);

getInput(
  "cardName"
)?.addEventListener(
  "input",
  () => {
    getElement(
      "paymentError"
    )?.classList.add(
      "hidden"
    );
  }
);

getInput(
  "terms"
)?.addEventListener(
  "change",
  () => {
    getElement(
      "paymentError"
    )?.classList.add(
      "hidden"
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
    )?.classList.add(
      "hidden"
    );
  }
);


// =====================================================
// SOUMISSION
// =====================================================

form?.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    if (!validateStep5()) {
      return;
    }

    // Afficher le message de succès

    successMessage?.classList.remove(
      "hidden"
    );

    // Cacher les boutons

    prevBtn?.classList.add(
      "hidden"
    );

    submitBtn?.classList.add(
      "hidden"
    );

    // Désactiver le formulaire

    form
      .querySelectorAll<
        HTMLInputElement |
        HTMLSelectElement |
        HTMLTextAreaElement |
        HTMLButtonElement
      >(
        "input, select, textarea, button"
      )
      .forEach(
        (element) => {
          element.disabled = true;
        }
      );

    successMessage?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
);


// =====================================================
// INITIALISATION
// =====================================================

if (
  form &&
  totalSteps > 0
) {
  updateTypeDonOptions();
  updateBillingAddress();

  showStep(
    1,
    "next"
  );
}