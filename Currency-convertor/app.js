const API_KEY = "cur_live_Oh1HlMuJyqugzhZQfHPkSlBxmhTpbO090dGgeGo9";
const BASE_URL = `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode]; // Expects currency-to-countryCode mapping
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = parseFloat(amount.value);

  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const from = fromCurr.value;
  const to = toCurr.value;

  try {
    let response = await fetch(`${BASE_URL}&base_currency=${from}`);
    if (!response.ok) throw new Error("Failed to fetch exchange rate");
    let data = await response.json();
    let rate = data.data[to].value;

    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${from} = ${finalAmount} ${to}`;
  } catch (error) {
    msg.innerText = "Something went wrong. Please try again.";
    console.error("Error:", error);
  }
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
