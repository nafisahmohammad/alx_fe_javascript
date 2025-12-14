// --------------------
// STORAGE UTILITIES
// --------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  return storedQuotes ? JSON.parse(storedQuotes) : null;
}

// --------------------
// INITIAL DATA
// --------------------
let quotes = loadQuotes() || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not final, failure is not fatal.", category: "Inspiration" }
];

// --------------------
// DOM ELEMENTS
// --------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportQuotes");
const importFile = document.getElementById("importFile");
const formContainer = document.getElementById("formContainer");

// --------------------
// DISPLAY RANDOM QUOTE
// --------------------
function showRandomQuote() {
  quoteDisplay.innerHTML = "";

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Save last viewed quote to SESSION storage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;

  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// --------------------
// CREATE ADD QUOTE FORM
// --------------------
function createAddQuoteForm() {
  const formDiv = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);

  formContainer.appendChild(formDiv);
}

// --------------------
// ADD QUOTE
// --------------------
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please fill in both fields");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

// --------------------
// EXPORT QUOTES AS JSON
// --------------------
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// --------------------
// IMPORT QUOTES FROM JSON
// --------------------
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) {
        throw new Error("Invalid JSON format");
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Failed to import quotes. Invalid JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// --------------------
// EVENT LISTENERS
// --------------------
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportQuotes);
importFile.addEventListener("change", importFromJsonFile);

// --------------------
// INITIALIZE APP
// --------------------
createAddQuoteForm();

// Load last viewed quote from session storage
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>Category: ${quote.category}</small>
  `;
} else {
  showRandomQuote();
}
