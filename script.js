// Select DOM elements
const topBar = document.querySelector("#top-bar");
const exteriorColorButtons = document.querySelector("#exterior-buttons");
const interiorColorButtons = document.querySelector("#interior-buttons");
const exteriorImage = document.querySelector("#exterior-image");
const interiorImage = document.querySelector("#interior-image");
const wheelButtonSection = document.querySelector("#wheel-buttons");
const aiPackageButton = document.querySelector("#ai-package-button");
const rocketBoosterCheckbox = document.querySelector("#rocket-booster");
const accessoryCheckboxes = document.querySelectorAll(".accessory-form-checkbox");
const totalPriceElement = document.getElementById("total-price");
const downPaymentElement = document.getElementById("down-payment");
const monthlyPaymentElement = document.getElementById("monthly-payment");

// Constants for prices
const PRICES = {
    base: 107879,
    performanceWheels: 2322,
    aiPackage: 6232,
    rocketBoosters: 12340,
    accessories: {
        "Center Console Trays": 500,
        "Sunshade": 205,
        "All-Weather Interior Liners": 450
    },
    downPayment: 12000,
    loanTermMonths: 60,
    annualInterestRate: 0.03
};

let selectedExteriorColor = "Stealth Black";
let selectedInteriorColor = "Leather Black";
const selectedOptions = {
    "Performance Wheels": false,
    "AI Package": false,
    "Rocket Boosters": false,
    "Accessories": {}
};

// Disappearing Top Bar
const handleScroll = () => {
    const atTop = window.scrollY === 0;
    topBar.classList.toggle("visible-bar", atTop);
    topBar.classList.toggle("hidden-bar", !atTop);
};

// Image Mapping
const exteriorImages = {
    "Stealth Black": "./911 Stealth Black.webp",
    "Light Grey": "./911 Light Grey.webp",
    "Lime Yellow": "./911 Lime Yellow.webp",
    "Mint Green": "./911 Mint Green.webp",
    "Red": "./911 Red.webp",
    "Blue": "./911 Blue.webp",
};

const interiorImages = {
    "Leather Black": "./Leather Black.webp",
    "Leather Red": "./Leather Red.webp",
    "Leather Blue": "./Leather Blue.webp",
};

// Update Exterior Image based on color and wheels
const updateExteriorImage = () => {
    const performanceSuffix = selectedOptions["Performance Wheels"] ? "-performance" : "";
    const colorKey = selectedExteriorColor in exteriorImages ? selectedExteriorColor : "Stealth Black";
    const imagePath = exteriorImages[colorKey].replace(".webp", `${performanceSuffix}.webp`);
    exteriorImage.src = imagePath;
};

// Update Interior Image based on color
const updateInteriorImage = () => {
    const colorKey = selectedInteriorColor in interiorImages ? selectedInteriorColor : "Leather Black";
    interiorImage.src = interiorImages[colorKey];
};

// Handle Color Button Click
const handleColorButtonClick = (e) => {
    let button;

    if (e.target.tagName === "IMG") {
        button = e.target.closest("button");
    } else if (e.target.tagName === "BUTTON") {
        button = e.target;
    }

    if (button) {
        const buttons = e.currentTarget.querySelectorAll("button");
        buttons.forEach((btn) => btn.classList.remove("btn-selected"));
        button.classList.add("btn-selected");

        // Change Exterior Image
        if (e.currentTarget === exteriorColorButtons) {
            selectedExteriorColor = button.querySelector("img").alt;
            updateExteriorImage();
        }

        // Change Interior Image
        if (e.currentTarget === interiorColorButtons) {
            selectedInteriorColor = button.querySelector("img").alt;
            updateInteriorImage();
        }

        updateTotalPrice();
    }
};

// Wheel Selection
const handleWheelButtonClick = (e) => {
    if (e.target.tagName === "BUTTON") {
        const buttons = wheelButtonSection.querySelectorAll("button");
        buttons.forEach((btn) => btn.classList.remove("bg-gray-700", "text-white"));

        // Add selected style to clicked button
        e.target.classList.add("bg-gray-700", "text-white");

        // Update selected options
        selectedOptions["Performance Wheels"] = e.target.textContent.includes("Performance");

        // Update exterior image
        updateExteriorImage();

        updateTotalPrice();
    }
};

// AI Package Selection
const handleAIPackageClick = () => {
    selectedOptions["AI Package"] = !selectedOptions["AI Package"];
    aiPackageButton.classList.toggle("bg-gray-700", selectedOptions["AI Package"]);
    aiPackageButton.classList.toggle("text-white", selectedOptions["AI Package"]);
    updateTotalPrice();
};

// Rocket Boosters Selection
const handleRocketBoosterChange = () => {
    selectedOptions["Rocket Boosters"] = rocketBoosterCheckbox.checked;
    updateTotalPrice();
};

// Accessories Selection
const handleAccessoryChange = () => {
    selectedOptions["Accessories"] = {};
    accessoryCheckboxes.forEach((checkbox) => {
        const accessoryName = checkbox.parentElement.parentElement.querySelector('span').textContent;
        if (checkbox.checked) {
            const price = parseInt(checkbox.getAttribute('data-price'), 10);
            selectedOptions["Accessories"][accessoryName] = price;
        }
    });
    updateTotalPrice();
};

// Update Total Price
const updateTotalPrice = () => {
    let totalPrice = PRICES.base;

    if (selectedOptions["Performance Wheels"]) totalPrice += PRICES.performanceWheels;
    if (selectedOptions["AI Package"]) totalPrice += PRICES.aiPackage;
    if (selectedOptions["Rocket Boosters"]) totalPrice += PRICES.rocketBoosters;

    // Add accessories prices
    for (const price of Object.values(selectedOptions["Accessories"])) {
        totalPrice += price;
    }

    // Update total price display
    totalPriceElement.textContent = `£${totalPrice.toLocaleString()}`;

    // Recalculate payment breakdown
    updatePaymentBreakdown(totalPrice);
};

// Update Payment Breakdown
const updatePaymentBreakdown = (totalPrice) => {
    const downPayment = PRICES.downPayment;
    const loanTermMonths = PRICES.loanTermMonths;
    const annualInterestRate = PRICES.annualInterestRate;

    const loanAmount = totalPrice - downPayment;
    const monthlyInterestRate = annualInterestRate / 12;
    const monthlyPayment = (loanAmount * monthlyInterestRate) / 
        (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));

    monthlyPaymentElement.textContent = `£${monthlyPayment.toFixed(2)}`;
    downPaymentElement.textContent = `£${downPayment.toLocaleString()}`;
};

// Event Listeners
window.addEventListener("scroll", handleScroll);
exteriorColorButtons.addEventListener("click", handleColorButtonClick);
interiorColorButtons.addEventListener("click", handleColorButtonClick);
wheelButtonSection.addEventListener("click", handleWheelButtonClick);
aiPackageButton.addEventListener("click", handleAIPackageClick);
rocketBoosterCheckbox.addEventListener("change", handleRocketBoosterChange);
accessoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", handleAccessoryChange);
});

// Initial Calculations
updateTotalPrice();
