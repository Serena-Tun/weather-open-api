fetch('https://api.open-meteo.com/v1/forecast?latitude=33.7490&longitude=-84.3880&current_weather=true')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Make sure you see data in browser console
  })
  .catch(error => {
    console.error('Error fetching weather data:', error);
  });
