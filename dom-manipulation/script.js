
// --------------------
// STORAGE HELPERS
// --------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  return stored ? JSON.parse(stored) : [];
}

// --------------------
// INITIAL DATA
// --------------------
let quotes = loadQuotes();

// --------------------
// DOM ELEMENTS
// --------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");
const manualSyncBtn = document.getElementById("manualSync");

// --------------------
// POPULATE CATEGORIES
// --------------------
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// --------------------
// FILTER QUOTES
// --------------------
function filterQuotes() {
  const selected = categoryFilter.value;
  quoteDisplay.innerHTML = "";

  const filtered =
    selected === "all"
      ? quotes
      : quotes.filter(q => q.category === selected);

  filtered.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}"`;
    quoteDisplay.appendChild(p);
  });
}

// --------------------
// SERVER SYNC (SIMULATION)
// --------------------
async function fetchServerQuotes() {
  syncStatus.textContent = "Status: Syncing with server...";

  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5"
  );
  const data = await response.json();

  // Convert server data to quotes format
  const serverQuotes = data.map(post => ({
    text: post.title,
    category: `User-${post.userId}`,
    source: "server"
  }));

  resolveConflicts(serverQuotes);
}

// --------------------
// CONFLICT RESOLUTION
// Strategy: SERVER WINS
// --------------------
function resolveConflicts(serverQuotes) {
  let conflictsResolved = false;

  serverQuotes.forEach(serverQuote => {
    const exists = quotes.find(
      localQuote => localQuote.text === serverQuote.text
    );

    if (!exists) {
      quotes.push(serverQuote);
      conflictsResolved = true;
    }
  });

  if (conflictsResolved) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyConflictResolved();
  }

  syncStatus.textContent = "Status: Synced successfully";
}

// --------------------
// USER NOTIFICATION
// --------------------
function notifyConflictResolved() {
  alert(
    "Data was updated from the server.\nServer data took precedence where conflicts occurred."
  );
}

// --------------------
// PERIODIC SYNC
// --------------------
setInterval(fetchServerQuotes, 30000); // every 30 seconds

// --------------------
// MANUAL SYNC
// --------------------
manualSyncBtn.addEventListener("click", fetchServerQuotes);

// --------------------
// INITIALIZE APP
// --------------------
populateCategories();
filterQuotes();
