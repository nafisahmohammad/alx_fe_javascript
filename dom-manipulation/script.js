// --------------------
// INITIAL DATA
// --------------------
const quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not final, failure is not fatal.", category: "Inspiration" },
  { text: "Believe you can and you're halfway there.", category: "Motivation" }
];

// --------------------
// DOM ELEMENTS
// --------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

// --------------------
// POPULATE CATEGORIES
// --------------------
function populateCategories() {
  const categories = [...new Set(quotes.map(quote => quote.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// --------------------
// FILTER QUOTES (REQUIRED NAME)
// --------------------
function filterQuote() {
  const selectedCategory = categoryFilter.value;

  // ✅ Save selected category
  localStorage.setItem("selectedCategory", selectedCategory);

  quoteDisplay.innerHTML = "";

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(quote => quote.category === selectedCategory);

  filteredQuotes.forEach(quote => {
    const p = document.createElement("p");
    p.textContent = quote.text;
    quoteDisplay.appendChild(p);
  });
}

// --------------------
// RESTORE LAST SELECTED CATEGORY
// --------------------
const savedCategory = localStorage.getItem("selectedCategory");
if (savedCategory) {
  categoryFilter.value = savedCategory;
}

// --------------------
// INITIALIZE APP
// --------------------
populateCategories();
filterQuote();


