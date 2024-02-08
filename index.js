const weatherApi = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "5b8d9d34eb4de58f7d685bf4baa21165";
const submitBtn = document.getElementById("");

async function getWeatherForCity(city) {
  const response = await fetch(`${weatherApi}?q=${city}&appid=${apiKey}`);
  const weather = await response.json();
  console.log(weather);
}
