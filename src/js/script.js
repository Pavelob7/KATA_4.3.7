//Объясните, пожалуйста, мне тупому, почему так важны именно 2 пробела, а не табы?
//В WebStorm у меня автоматически код выравнивается табами, мне всегда ок было

const searchInput = document.querySelector("input");
const searchBlockResults = document.querySelector(".search-block__results");
const saved = document.querySelector(".saved");

const debounce = (fn, debounceTime) => {
  let inDebounce;
  return function () {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => fn.apply(this, arguments), debounceTime);
  };
};

async function getSearchResults() {
  const searchUrl = new URL("https://api.github.com/search/repositories");
  const repositorySearch = searchInput.value;
  if (repositorySearch === "") {
    removeResults();
    hideNoResultsMessage();
    return;
  }
  searchUrl.searchParams.append("q", repositorySearch);
  try {
    const response = await fetch(searchUrl);
    if (response.ok) {
      const searchResults = await response.json();
      if (searchResults.items.length === 0) {
        showNoResultsMessage();
      } else {
        hideNoResultsMessage();
        showResults(searchResults);
      }
    } else {
      return;
    }
  } catch (err) {
    return null;
  }
}

const getSearchResultsDebounce = debounce(getSearchResults, 500);
searchInput.addEventListener("input", getSearchResultsDebounce);

function removeResults() {
  searchBlockResults.innerHTML = "";
  hideNoResultsMessage();
}

function showResults(results) {
  removeResults();
  for (let i = 0; i < 5; i++) {
    const {name, owner, stargazers_count: stars} = results.items[i];
    const div = document.createElement("div");
    div.innerHTML = `${name}`;
    div.classList.add("search-block__result");
    div.dataset.owner = `${owner.login}`;
    div.dataset.stars = `${stars}`;
    searchBlockResults.append(div);
  }
}

function showNoResultsMessage() {
  removeResults();
  searchBlockResults.innerHTML = "Таких репозиториев нет";
}

function hideNoResultsMessage() {
  searchBlockResults.innerHTML = "";
}

searchBlockResults.addEventListener("click", function (evt) {
  if (evt.target.classList.contains("search-block__result")) {
    saveResult(evt.target);
    searchInput.value = "";
    removeResults();
  } else {
    return;
  }
});

function saveResult(savedResult) {
  const name = savedResult.textContent;
  const owner = savedResult.dataset.owner;
  const stars = savedResult.dataset.stars;
  const div = document.createElement("div");
  div.classList.add("saved__result");
  const infoDiv = document.createElement("div");
  infoDiv.classList.add("saved__info");
  const pName = document.createElement("p");
  pName.innerHTML = `Name: ${name}`;
  infoDiv.append(pName);
  const pOwner = document.createElement("p");
  pOwner.innerHTML = `Owner: ${owner}`;
  infoDiv.append(pOwner);
  const pStars = document.createElement("p");
  pStars.innerHTML = `Stars: ${stars}`;
  infoDiv.append(pStars);
  div.append(infoDiv);
  const btn = document.createElement("button");
  btn.classList.add("remove-btn");
  div.append(btn);
  saved.append(div);
}

saved.addEventListener("click", function (evt) {
  if (evt.target.classList.contains("remove-btn")) {
    evt.target.parentElement.remove();
  } else {
    return;
  }
});
