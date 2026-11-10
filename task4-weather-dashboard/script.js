// ---------- Elements ----------
const form = document.getElementById("search-form");
const input = document.getElementById("city-input");
const message = document.getElementById("message");
const currentSection = document.getElementById("current");
const forecastSection = document.getElementById("forecast");

const cityName = document.getElementById("city-name");
const icon = document.getElementById("icon");
const temp = document.getElementById("temp");
const description = document.getElementById("description");
const feels = document.getElementById("feels");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

// ---------- Weather code -> emoji + text ----------
function describeWeather(code) {
  if (code === 0) return { emoji: "☀️", text: "Clear sky" };
  if (code <= 2) return { emoji: "⛅", text: "Partly cloudy" };
  if (code === 3) return { emoji: "☁️", text: "Overcast" };
  if (code <= 48) return { emoji: "🌫️", text: "Foggy" };
  if (code <= 57) return { emoji: "🌦️", text: "Drizzle" };
  if (code <= 67) return { emoji: "🌧️", text: "Rain" };
  if (code <= 77) return { emoji: "❄️", text: "Snow" };
  if (code <= 82) return { emoji: "🌧️", text: "Rain showers" };
  if (code <= 86) return { emoji: "🌨️", text: "Snow showers" };
  return { emoji: "⛈️", text: "Thunderstorm" };
}

// ---------- Message helper ----------
function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? "error" : "";
}

// ---------- Step 1: city name -> lat/long ----------
async function getCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not reach the location service.");

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${city}" not found. Check the spelling.`);
  }
  return data.results[0];
}

// ---------- Step 2: lat/long -> weather ----------
async function getWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=auto&forecast_days=6`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not load weather data.");
  return response.json();
}

// ---------- Step 3: show on screen ----------
function displayCurrent(place, weather) {
  const c = weather.current;
  const info = describeWeather(c.weather_code);

  cityName.textContent = `${place.name}, ${place.country}`;
  icon.textContent = info.emoji;
  temp.textContent = `${Math.round(c.temperature_2m)}°C`;
  description.textContent = info.text;
  feels.textContent = `${Math.round(c.apparent_temperature)}°C`;
  humidity.textContent = `${c.relative_humidity_2m}%`;
  wind.textContent = `${c.wind_speed_10m} km/h`;

  currentSection.classList.remove("hidden");
}

function displayForecast(weather) {
  const d = weather.daily;
  forecastSection.innerHTML = "";

  // index 0 is today, so start from 1 for the next 5 days
  for (let i = 1; i < d.time.length; i++) {
    const info = describeWeather(d.weather_code[i]);
    const dayName = new Date(d.time[i]).toLocaleDateString("en-US", { weekday: "short" });

    const card = document.createElement("div");
    card.className = "day";
    card.innerHTML = `
      <strong>${dayName}</strong>
      <div class="emoji">${info.emoji}</div>
      <div>${Math.round(d.temperature_2m_max[i])}° / ${Math.round(d.temperature_2m_min[i])}°</div>
    `;
    forecastSection.appendChild(card);
  }

  forecastSection.classList.remove("hidden");
}

// ---------- Main search ----------
async function searchCity(city) {
  showMessage("Loading...");
  currentSection.classList.add("hidden");
  forecastSection.classList.add("hidden");

  try {
    const place = await getCoordinates(city);
    const weather = await getWeather(place.latitude, place.longitude);

    displayCurrent(place, weather);
    displayForecast(weather);
    showMessage("");
  } catch (error) {
    showMessage(error.message, true);
  }
}

// ---------- Events ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (city === "") {
    showMessage("Please enter a city name.", true);
    return;
  }
  searchCity(city);
});