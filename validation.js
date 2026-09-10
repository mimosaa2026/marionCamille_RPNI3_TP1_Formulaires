document.addEventListener("DOMContentLoaded", () => {

    // ============================
    // Sélecteurs principaux
    // ============================

    const steps = document.querySelectorAll(".step");
    const stepperItems = document.querySelectorAll(".stepper-item");
    const circles = document.querySelectorAll(".step-circle");

    const amountButtons = document.querySelectorAll(".amount-btn");
    const customAmount = document.getElementById("customAmount");
    const amountError = document.getElementById("amountError");

    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const infoError = document.getElementById("infoError");

    const messageField = document.getElementById("message");

    const confirmAmount = document.getElementById("confirmAmount");
    const confirmType = document.getElementById("confirmType");
    const confirmName = document.getElementById("confirmName");
    const confirmEmail = document.getElementById("confirmEmail");
    const confirmMessage = document.getElementById("confirmMessage");

    const form = document.getElementById("donationForm");

    let selectedAmount = null;


    // ============================
    // Gestion du stepper
    // ============================

    function goToStep(stepNumber) {
        steps.forEach((step) => {
            step.classList.add("hidden");
        });

        const activeStep = document.querySelector(`.step[data-step="${stepNumber}"]`);
        activeStep.classList.remove("hidden");

        circles.forEach((circle) => {
            circle.classList.remove("bg-blue-600", "text-white");
            circle.classList.add("bg-gray-300", "text-white");
        });

        const activeCircle = document.querySelector(`.stepper-item[data-step="${stepNumber}"] .step-circle`);
        if (activeCircle) {
            activeCircle.classList.add("bg-blue-600", "text-white");
            activeCircle.classList.remove("bg-gray-300", "text-gray-600");
        }
    }


    // ============================
    // Étape 1 : Montant
    // ============================

    amountButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            selectedAmount = btn.dataset.value;
            customAmount.value = "";
            amountError.classList.add("hidden");

            amountButtons.forEach((b) => b.classList.remove("bg-blue-100", "border-blue-600"));
            btn.classList.add("bg-blue-100", "border-blue-600");
        });
    });

    customAmount.addEventListener("input", () => {
        selectedAmount = customAmount.value;
        amountButtons.forEach((b) => b.classList.remove("bg-blue-100", "border-blue-600"));
        amountError.classList.add("hidden");
    });

    document.getElementById("next1").addEventListener("click", () => {
        if (!selectedAmount || selectedAmount < 1) {
            amountError.classList.remove("hidden");
            return;
        }
        goToStep(2);
    });


    // ============================
    // Étape 2 : Type de don
    // ============================

    document.getElementById("next2").addEventListener("click", () => {
        goToStep(3);
    });

    document.getElementById("back2").addEventListener("click", () => {
        goToStep(1);
    });


    // ============================
    // Étape 3 : Informations
    // ============================

    function validateInfo() {
        const nameValid = nameField.value.trim().length >= 2;
        const emailValid = emailField.value.includes("@") && emailField.value.includes(".");

        if (!nameValid || !emailValid) {
            infoError.classList.remove("hidden");
            return false;
        }

        infoError.classList.add("hidden");
        return true;
    }

    document.getElementById("next3").addEventListener("click", () => {
        if (!validateInfo()) return;
        goToStep(4);
    });

    document.getElementById("back3").addEventListener("click", () => {
        goToStep(2);
    });


    // ============================
    // Étape 4 : Préférences
    // ============================

    document.getElementById("next4").addEventListener("click", () => {
        // Remplir la confirmation
        const donationType = document.querySelector('input[name="donationType"]:checked').value;

        confirmAmount.textContent = selectedAmount + "$";
        confirmType.textContent = donationType;
        confirmName.textContent = nameField.value;
        confirmEmail.textContent = emailField.value;
        confirmMessage.textContent = messageField.value || "Aucun message";

        goToStep(5);
    });

    document.getElementById("back4").addEventListener("click", () => {
        goToStep(3);
    });


    // ============================
    // Étape 5 : Confirmation
    // ============================

    document.getElementById("back5").addEventListener("click", () => {
        goToStep(4);
    });


    // ============================
    // Soumission finale
    // ============================

    form.addEventListener("submit", (e) => {
        if (!selectedAmount || !validateInfo()) {
            e.preventDefault();
            alert("Veuillez compléter correctement les étapes.");
        }
    });

});