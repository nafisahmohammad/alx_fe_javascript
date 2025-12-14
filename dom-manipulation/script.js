const quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Quote one", category: "Life" },
  { text: "Quote two", category: "Motivation" }
];

const categoryFilter = document.getElementById("categoryFilter");
const quoteDisplay = document.getElementById("quoteDisplay");

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

function filterQuote() {
  const selectedCategory = categoryFilter.value;
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

  localStorage.setItem("selectedCategory", selectedCategory);
}

populateCategories();
filterQuote();

