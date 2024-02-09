const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
const iconsUrl = "https://openweathermap.org/img/wn/";
const apiKey = "5b8d9d34eb4de58f7d685bf4baa21165";
const weatherForm = document.getElementById("weatherForm");
const button = document.getElementById("submitButon");
const weatherContainer = document.getElementById("weatherContainer");
const updateTimeKey = "updateTime";
const intervalTime = 5 * 1000 * 60;

setInterval(() => {
  updateTheWeather();
}, intervalTime);

window.addEventListener("load", async () => {
  if (!localStorage.getItem(updateTimeKey))
    localStorage.setItem(updateTimeKey, Date.now());

  if (localStorage.length > 1) {
    const keys = Object.keys(localStorage);
    keys.forEach(async (key) => {
      if (key === updateTimeKey) return;
      const weather = localStorage.getItem(key);
      weatherContainer.innerHTML = "";
      createNewWeatherElement(JSON.parse(weather));
    });
  }
  await updateTheWeather();
});

button.addEventListener("click", async () => {
  const input = weatherForm.cityInput.value;
  const weather = await getWeatherForCity(input);
  if (localStorage.length > 9) {
    alert("Nie można dodawać więcej niż 10 miast!");
    return;
  }
  if (localStorage.getItem(input) === null) {
    localStorage.setItem(input, JSON.stringify(weather));
    createNewWeatherElement(weather);
  } else {
    alert(`Jest już takie miasto jak ${weather.name}!`);
  }
  weatherForm.cityInput.value = "";
});

async function getWeatherForCity(city) {
  return new Promise((resolve, reject) => {
    fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=metric`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        alert(error);
        reject(error);
      });
  });
}

function createNewWeatherElement(weather) {
  const div = document.createElement("div");
  const header = document.createElement("h4");
  const img = document.createElement("img");
  const temp = document.createElement("p");
  const hum = document.createElement("p");
  const pres = document.createElement("p");
  const removeBtn = document.createElement("button");
  div.classList.add("weather-item");
  div.id = weather.name;
  img.src = getWeatherIcon(weather.weather[0].icon);
  header.textContent = weather.name;
  temp.textContent = `${weather.main.temp} °C`;
  hum.textContent = `${weather.main.humidity}%`;
  pres.textContent = `${weather.main.pressure} hPa`;
  removeBtn.textContent = "Usuń";
  removeBtn.addEventListener("click", () => {
    removeWeatherElement(div.id);
  });
  div.append(header, img, temp, hum, pres, removeBtn);
  weatherContainer.append(div);
}

async function updateTheWeather() {
  const timeDiff = Date.now() - localStorage.getItem(updateTimeKey);
  const keys = Object.keys(localStorage);
  keys.forEach(async (key) => {
    if (key === updateTimeKey) return;
    if (timeDiff >= intervalTime && localStorage.length > 1) {
      const weather = await getWeatherForCity(key);
      localStorage.setItem(key, JSON.stringify(weather));
      weatherContainer.innerHTML = "";
      createNewWeatherElement(weather);
      console.log("updated weather");
      localStorage.setItem(updateTimeKey, Date.now());
    }
  });
}

function removeWeatherElement(key) {
  localStorage.removeItem(key);
  let elem = document.getElementById(key);
  elem.remove();
}

function getWeatherIcon(iconCode) {
  return `${iconsUrl}${iconCode}@2x.png`;
}
