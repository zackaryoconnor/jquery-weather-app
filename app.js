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
          <h4 class="text-2xl font-bold mb-2"">${cityName}</h4>
          <p class="text-xl">Temperature: <span class="font-semibold">${temperature}°F</span></p>
          <p class="text-gray-600">Conditions: ${description}</p>
        `
        $('#weather-info').append(weatherHTMLElements)

        $.ajax({
          url: forecastURL,
          method: 'GET',
          dataType: 'json',
          success: function (forecastData) {
            console.log('Forecast Data:', forecastData)

            const processedDays = {}
            const forecastContainer = $(
              '<div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>'
            )

            for (index in forecastData.list) {
              const forecastDate = new Date(forecastData.list[index].dt_txt)
              const dayOfMonth = forecastDate.getDate()
              if (!processedDays[dayOfMonth]) {
                processedDays[dayOfMonth] = true

                const forecastHTMLElements = `
                  <div class="bg-gray-200 rounded-md p-4">
                    <h4 class="font-semibold mb-1">${dayOfMonth}</h4>
                    <pclass="text-sm">Temperature: <span class="font-semibold">${Math.round(
                      forecastData.list[index].main.temp
                    )}°F</span></p>
                    <p class="text-xs text-gray-600">Conditions: ${
                      forecastData.list[index].weather[0].description
                    }</p>
                  </div>
                `
                forecastContainer.append(forecastHTMLElements)
              }
            }

            $('#weather-info').append(forecastContainer)
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
