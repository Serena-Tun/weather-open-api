// Fetch call for both temperature and wind speed
fetch('https://api.open-meteo.com/v1/forecast?latitude=33.7490&longitude=-84.3880&current_weather=true')
  .then(response => response.json())
  .then(data => {
    console.log(data); 

    const tempC = data.current_weather.temperature;
    const tempF = (tempC * 9/5) + 32;
    const wind = data.current_weather.windspeed;

// Update the DOM
    document.getElementById("temp").textContent = `Temperature: ${tempF.toFixed(1)}°F`;
    document.getElementById("wind").textContent = `Wind Speed: ${wind} km/h`;
  })
  .catch(error => {
    console.error('Error fetching weather data:', error);
  });
