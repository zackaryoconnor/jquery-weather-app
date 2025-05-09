$(document).ready(function () {
  $('#search-button').click(function () {
    let location = $('#location-input').val()
    const apiKey = 'd83bcf3cb67b1b83f80d5f14f87d3d68'
    let currentWeatherURL
    let forecastURL

    if (!isNaN(Number(location)) && location.length === 5) {
      currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?zip=${location},us&appid=${apiKey}&units=imperial`
      forecastURL = `https://api.openweathermap.org/data/2.5/forecast?zip=${location},us&appid=${apiKey}&units=imperial`
    } else {
      currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=imperial`
      forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=imperial`
    }
    console.log(currentWeatherURL)

    $.ajax({
      url: currentWeatherURL,
      method: 'GET',
      datayType: 'json',
      success: function (data) {
        console.log('Weather data received:', data)

        const cityName = data.name
        const temperature = Math.round(data.main.temp)
        const description = data.weather[0].description

        const weatherHTMLElements = `
            <h2>${cityName}</h2>
            <p>Temperature: ${temperature}°F</p>
            <p>Conditions: ${description}</p>
        `
        $('#weather-info').append(weatherHTMLElements)

        $.ajax({
          url: forecastURL,
          method: 'GET',
          datayType: 'json',
          success: function (forecastData) {
            console.log('Forecast Data:', forecastData)

            const processedDays = {}
            for (index in forecastData.list) {
              const forecastDate = new Date(forecastData.list[index].dt_txt)
              const dayOfMonth = forecastDate.getDate()
              if (!processedDays[dayOfMonth]) {
                processedDays[dayOfMonth] = true
                
                

                const forecastHTMLElements = `
                    <h4>${dayOfMonth}</h4>
                    <p>Temperature: ${Math.round(forecastData.list[index].main.temp)}°F</p>
                    <p>Conditions: ${forecastData.list[index].weather[0].description}</p>
                `
                $('#weather-info').append(forecastHTMLElements)
              }
            }
          },

          error: function (forecastError) {
            console.error('Error fetching forecast data:', forecastError)
            $('#weather-forecast').text('Error fetching forecast data.')
          },
        })
      },
      error: function (error) {
        console.error('Error fetching weather data:', error)
      },
    })
  })
})
