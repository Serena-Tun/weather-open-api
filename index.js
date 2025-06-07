document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('locationInput').value;
  if (!query) return;

  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&country=US`)
    .then(res => res.json())
    .then(geoData => {
      if (!geoData.results || geoData.results.length === 0) throw new Error("Location not found");

      const { latitude, longitude, name } = geoData.results[0];
      getWeather(latitude, longitude, name);
    })
    .catch(err => {
      console.error("Geocoding error:", err);
      alert("Location not found.");
    });
});

// Load user's location on start
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeather(lat, lon, "Your Location");
    }, () => {
      console.warn("Geolocation denied. Showing default.");
      getWeather(33.7490, -84.3880, "Atlanta"); // fallback
    });
  }
};

function getWeather(lat, lon, locationLabel) {
  const today = new Date().toISOString().split("T")[0];
  const tenDaysFromNow = new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&start_date=${today}&end_date=${tenDaysFromNow}`)
    .then(res => res.json())
    .then(data => {
      const current = data.current_weather;
      const daily = data.daily;

      document.getElementById("locationName").textContent = locationLabel;
      document.getElementById("temp").textContent = `Temperature: ${current.temperature.toFixed(1)}°C / ${(current.temperature * 9/5 + 32).toFixed(1)}°F`;
      document.getElementById("wind").textContent = `Wind Speed: ${current.windspeed} km/h`;

      const forecastDiv = document.getElementById("forecastData");
      forecastDiv.innerHTML = "";
      for (let i = 0; i < daily.time.length; i++) {
        const maxC = daily.temperature_2m_max[i];
        const minC = daily.temperature_2m_min[i];
        const maxF = (maxC * 9/5) + 32;
        const minF = (minC * 9/5) + 32;

        const dayCard = document.createElement("div");
        dayCard.className = "forecast-card";
        dayCard.textContent = `${daily.time[i]}: High ${maxC}°C / ${maxF.toFixed(1)}°F, Low ${minC}°C / ${minF.toFixed(1)}°F`;
        forecastDiv.appendChild(dayCard);
        }
    })
    
    .catch(err => {
      console.error("Weather API error:", err);
    });
}
