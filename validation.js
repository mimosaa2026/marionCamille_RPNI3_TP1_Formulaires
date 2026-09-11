// -----------------------------
// Données (copie de ton JSON)
// -----------------------------
const data = {
  pays: [
    { name: "Canada", code: "CA" },
    { name: "United States of America (the)", code: "US" },
    // ajoute les autres si tu veux, mais pour la validation ça suffit
  ],
  provinces: [
    { name: "Alberta", code: "AB" },
    { name: "Quebec", code: "QC" },
    // ...
  ],
  etats: [
    { name: "Alabama", code: "AL" },
    { name: "California", code: "CA" },
    // ...
  ]
};

// -----------------------------
// Utilitaires erreurs
// -----------------------------
function showError(input, message) {
  clearError(input);

  const error = document.createElement("p");
  error.className = "text-red-600 text-sm mt-1";
  error.textContent = message;

  input.classList.add("border-red-600");
  input.insertAdjacentElement("afterend", error);
}

function clearError(input) {
  input.classList.remove("border-red-600");

  const next = input.nextElementSibling;
  if (next && next.classList.contains("text-red-600")) {
    next.remove();
  }
}

// -----------------------------
// Validations
// -----------------------------
function validateName(input) {
  const value = input.value.trim();
  if (value.length < 2) {
    showError(input, "Nom invalide.");
    return false;
  }
  clearError(input);
  return true;
}

function validateEmail(input) {
  const value = input.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(value)) {
    showError(input, "Courriel invalide.");
    return false;
  }
  clearError(input);
  return true;
}

function validatePhone(input) {
  const value = input.value.trim();
  if (value.length < 7) {
    showError(input, "Téléphone invalide.");
    return false;
  }
  clearError(input);
  return true;
}

function validateAmount(amountInput, selectedAmount) {
  clearError(amountInput);

  const custom = amountInput.value.trim();
  const finalAmount = custom !== "" ? Number(custom) : selectedAmount;

  if (!finalAmount || finalAmount <= 0 || isNaN(finalAmount)) {
    showError(amountInput, "Veuillez entrer un montant valide.");
    return false;
  }
  return true;
}

function validatePayment(input) {
  if (!input.value) {
    showError(input, "Veuillez choisir un mode de paiement.");
    return false;
  }
  clearError(input);
  return true;
}

function validateCountry(input) {
  const value = input.value;
  const exists = data.pays.some(p => p.code === value);
  if (!exists) {
    showError(input, "Pays invalide.");
    return false;
  }
  clearError(input);
  return true;
}

function validateRegion(countryInput, regionInput) {
  const country = countryInput.value;
  const region = regionInput.value;

  if (country === "CA") {
    const exists = data.provinces.some(p => p.code === region);
    if (!exists) {
      showError(regionInput, "Province invalide.");
      return false;
    }
  } else if (country === "US") {
    const exists = data.etats.some(e => e.code === region);
    if (!exists) {
      showError(regionInput, "État invalide.");
      return false;
    }
  }

  clearError(regionInput);
  return true;
}

// -----------------------------
// Intégration avec ton formulaire
// -----------------------------
let selectedAmount = null;

// boutons de montant
document.querySelectorAll(".amount-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedAmount = Number(btn.dataset.value);

    document.querySelectorAll(".amount-btn").forEach(b =>
      b.classList.remove("bg-indigo-600", "text-white")
    );
    btn.classList.add("bg-indigo-600", "text-white");
  });
});

// navigation stepper
function goToStep(step) {
  document.querySelectorAll(".step-content").forEach(section => {
    const s = Number(section.dataset.step);
    section.classList.toggle("hidden", s !== step);
  });

  document.querySelectorAll(".stepper-item").forEach(item => {
    const itemStep = Number(item.dataset.step);
    const circle = item.querySelector(".step-circle");
    const label = item.querySelector("span:last-child");

    if (itemStep === step) {
      circle.classList.remove("bg-gray-300", "text-gray-600");
      circle.classList.add("bg-indigo-600", "text-white");
      label.classList.remove("text-gray-500");
      label.classList.add("text-gray-900");
    } else {
      circle.classList.add("bg-gray-300", "text-gray-600");
      circle.classList.remove("bg-indigo-600", "text-white");
      label.classList.add("text-gray-500");
      label.classList.remove("text-gray-900");
    }
  });
}

document.querySelectorAll(".stepper-item").forEach(btn => {
  btn.addEventListener("click", () => {
    const step = Number(btn.dataset.step);
    goToStep(step);
  });
});

// boutons next/back
document.getElementById("next1")?.addEventListener("click", () => {
  const amountInput = document.getElementById("customAmount");
  if (!validateAmount(amountInput, selectedAmount)) return;
  goToStep(2);
});

document.getElementById("back1")?.addEventListener("click", () => goToStep(1));

document.getElementById("next2")?.addEventListener("click", () => {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const countryInput = document.getElementById("country");
  const regionInput = document.getElementById("region");

  const ok =
    validateName(nameInput) &&
    validateEmail(emailInput) &&
    validatePhone(phoneInput) &&
    validateCountry(countryInput) &&
    validateRegion(countryInput, regionInput);

  if (!ok) return;
  goToStep(3);
});

document.getElementById("back2")?.addEventListener("click", () => goToStep(2));

// submit
document.getElementById("donationForm")?.addEventListener("submit", e => {
  e.preventDefault();

  const paymentInput = document.getElementById("payment");
  const amountInput = document.getElementById("customAmount");

  const ok =
    validatePayment(paymentInput) &&
    validateAmount(amountInput, selectedAmount);

  if (!ok) return;

  // ici tu peux envoyer au backend
  console.log("Formulaire valide, prêt à être envoyé.");
});

// étape initiale
goToStep(1);