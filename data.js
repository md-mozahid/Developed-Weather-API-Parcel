//get weather data from API server

const weatherData = {
    city: '',
    country: '',
    API_KEY: '16b574ef6a5793311764ad055bb85fab',
    async getWeather() {
        try{
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.API_KEY}`)
            const {name, main, weather} = await res.json()
            return {
                name,
                main,
                weather
            }
        }catch(err) {
            UI.showMessage('Error in fetching data')
        }
    },
}

export default weatherData