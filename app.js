const apiKey = 'abe132d841968990560dd886075d217f'; // Replace with your actual API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');

searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    weatherInfo.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch('/.netlify/functions/getWeather', {
            method: 'POST',
            body: JSON.stringify({ city }),
        });
        const data = await response.json();

        if (response.status === 404) {
            weatherInfo.innerHTML = '<p>City not found. Please try again.</p>';
        } else if (response.status === 200) {
            const weather = data.weather[0];
            const temp = data.main.temp;
            
            weatherInfo.innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <p>${weather.description}</p>
                <p>🌡️ Temperature: ${temp.toFixed(1)}°C</p>
                <p>💧 Humidity: ${data.main.humidity}%</p>
                <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
            `;
        } else {
            throw new Error('Unexpected error');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherInfo.innerHTML = '<p>An error occurred. Please try again later.</p>';
    }
}

// Set focus to the input field when the page loads
window.onload = () => cityInput.focus();