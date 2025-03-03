import Bang from "./bang";
import bangs from "./bangs";

const searchInput = document.getElementById("search") as HTMLInputElement;
const searchIcon = document.querySelector(".search-icon") as HTMLElement;
const settingsIcon = document.createElement("i");
settingsIcon.className = "fas fa-cog settings-icon";
document.querySelector(".search-container")?.appendChild(settingsIcon);

// Search engine options
const searchEngines = {
  Google: "https://www.google.com/search?q={{{s}}}",
  Bing: "https://www.bing.com/search?q={{{s}}}",
  DuckDuckGo: "https://duckduckgo.com/?q={{{s}}}",
  Yahoo: "https://search.yahoo.com/search?p={{{s}}}",
  "Brave Search": "https://search.brave.com/search?q={{{s}}}",
};
const CACHE_KEY = "bangs_cache";
const THEME_KEY = "theme_preference";
const DEFAULT_ENGINE_KEY = "default_search_engine";
const bangsArray = getBangs();
const defaultSearchEngine = getDefaultSearchEngine();

function getDefaultSearchEngine(): string {
  const savedEngine = localStorage.getItem(DEFAULT_ENGINE_KEY);
  return savedEngine || searchEngines.Google;
}

function setDefaultSearchEngine(engineUrl: string): void {
  localStorage.setItem(DEFAULT_ENGINE_KEY, engineUrl);
}

function detectPreferredTheme(): string {
  // Check for saved user preference
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    return savedTheme;
  }

  // If no saved preference, check system preference
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

function setTheme(theme: string): void {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);

  const themeSwitch = document.getElementById(
    "theme-switch"
  ) as HTMLInputElement;
  if (themeSwitch) {
    themeSwitch.checked = theme === "dark";
  }
}

function getBangs(): Bang[] {
  try {
    // Check for cached bangs data
    const cachedData = localStorage.getItem(CACHE_KEY);

    if (cachedData) {
      return JSON.parse(cachedData).map(
        (item: { s: string; t: string; u: string }) =>
          new Bang(item.s, item.t, item.u)
      );
    }

    const bangsArray: Bang[] = [];

    bangs.forEach((bang) => {
      bangsArray.push(new Bang(bang.s, bang.t, bang.u));
    });

    // Store in localStorage
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(bangs));
    } catch (e) {
      console.warn("Failed to cache bangs data: ", e);
    }

    return bangsArray;
  } catch (error) {
    // Fallback if anything goes wrong
    console.error("Error with bangs cache, using direct import:", error);
    const bangsArray: Bang[] = [];

    bangs.forEach((bang) => {
      bangsArray.push(new Bang(bang.s, bang.t, bang.u));
    });

    return bangsArray;
  }
}

function extractBang(input: string): { query: string; url: string } {
  const bangMatch = input.match(/!\w+/);

  const performDefaultSearch = () => {
        // no bang in search term, use default search engine
        const url = defaultSearchEngine.replace(
            "{{{s}}}",
            encodeURIComponent(input.trim())
          );
          return { query: input.trim(), url };
  }

  if (!bangMatch) {
    return performDefaultSearch();
  }

  const bang = bangMatch[0].toLowerCase().substring(1); // remove the !

  const bangEntry = bangsArray.find((b) => b.bang.toLowerCase() === bang);

  if (!bangEntry) {
    return performDefaultSearch();
  }

  const query = input.replace(bangMatch[0], "").trim();

  const url = bangEntry.url.replace("{{{s}}}", encodeURIComponent(query));

  return { query, url: url };
}

function getSearch(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get("s") || "";
}

function handleSearch() {
  const search = getSearch();
  const result = extractBang(search ? search : searchInput.value);
  if (result.query) {
    window.location.href = result.url;
  }
}

// Set up event listeners
document.addEventListener("DOMContentLoaded", () => {
  setTheme(detectPreferredTheme());

  // Add event listener for theme switch
  const themeSwitch = document.getElementById(
    "theme-switch"
  ) as HTMLInputElement;
  themeSwitch.addEventListener("change", () => {
    setTheme(themeSwitch.checked ? "dark" : "light");
  });

  // Also listen for system preference changes
  if (window.matchMedia) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
          // Only update automatically if user hasn't set a preference
          setTheme(e.matches ? "dark" : "light");
        }
      });
  }

  // Handle search input when Enter key is pressed
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  });

  // Handle search when search icon is clicked
  searchIcon.addEventListener("click", () => {
    handleSearch();
  });

  const modal = document.createElement("div");
  modal.className = "settings-modal";
  modal.innerHTML = `
        <div class="settings-content">
            <h3>Default Search Engine</h3>
            <p>Select which search engine to use when no bang is provided:</p>
            <select id="default-engine-select">
                ${Object.entries(searchEngines)
                  .map(
                    ([name, url]) =>
                      `<option value="${url}" ${
                        url === getDefaultSearchEngine() ? "selected" : ""
                      }>${name}</option>`
                  )
                  .join("")}
            </select>
            <div class="button-row">
                <button id="close-settings">Close</button>
                <button id="save-settings">Save</button>
            </div>
        </div>
    `;
  document.body.appendChild(modal);

  settingsIcon.addEventListener("click", () => {
    modal.classList.toggle("show");
  });

  document.getElementById("close-settings")?.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  document.getElementById("save-settings")?.addEventListener("click", () => {
    const select = document.getElementById(
      "default-engine-select"
    ) as HTMLSelectElement;
    setDefaultSearchEngine(select.value);
    modal.classList.remove("show");
  });

  const aboutModal = document.getElementById("about-modal") as HTMLDivElement;
  const aboutLink = document.getElementById("about-link") as HTMLAnchorElement;
  const closeModal = document.querySelector(".close-modal") as HTMLSpanElement;

  // Open modal when About is clicked
  aboutLink.addEventListener("click", (e) => {
    e.preventDefault();
    aboutModal.classList.add("show");
  });

  // Close modal when X is clicked
  closeModal.addEventListener("click", () => {
    aboutModal.classList.remove("show");
  });

  // Close modal when clicking outside of it
  window.addEventListener("click", (e) => {
    if (e.target === aboutModal) {
      aboutModal.classList.remove("show");
    }
  });

  const currentSearch = getSearch();
  if (currentSearch) {
    searchInput.value = currentSearch;
  }
});

handleSearch();