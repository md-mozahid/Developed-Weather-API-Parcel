//UI
//API data
//LocalStorage
//single responsibility principle

const storage = {
    city: '',
    country: '',
    saveItem() {
        localStorage.setItem('BD-country', this.country)
        localStorage.setItem('BD-city', this.city)
    },
    getItem() {
        const country = localStorage.getItem('BD-country')
        const city = localStorage.getItem('BD-city')
        return {
            country, city
        }
    }
}

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

const UI = {
    loadSelector() {
        const formElm = document.querySelector('form')
        const msgElm = document.querySelector('.showMsg')
        const countryElm = document.querySelector('.country')
        const cityElm = document.querySelector('.city')
        const cityInfoElm = document.querySelector('.m-city')
        const iconElm = document.querySelector('.m-icon')
        const feelElm = document.querySelector('.m-feel')
        const tempElm = document.querySelector('.m-temp')
        const pressureElm = document.querySelector('.m-pressure')
        const humidityElm = document.querySelector('.m-humidity')
        return {
            formElm,
            msgElm,
            countryElm,
            cityElm,
            cityInfoElm,
            iconElm,
            feelElm,
            tempElm,
            pressureElm,
            humidityElm
        }
    },

    //reset the input value
    resetInputVal() {
        const {countryElm, cityElm} = this.loadSelector()
        countryElm.value = ''
        cityElm.value = ''
    },

    //hide warning message
    hideMessage() {
        const msgElm = document.querySelector('#message')
        setTimeout(() => {
            msgElm.remove()
        }, 2000)
    },

    //show warning message
    showMessage(msg) {
        const {msgElm} = this.loadSelector()
        // msgElm.textContent = msg
        const elm = `<div class='alert alert-danger' id='message'>${msg}</div>`
        msgElm.insertAdjacentHTML('afterbegin', elm)
        this.hideMessage()
    },

    //validation check
    validateInput(country, city) {
        if(country === '' || city === '') {
            this.showMessage('Please fill the inputs')
            return true
        }else {
            return false
        }
    },

    //get the input values
    getInputValues() {
        const {countryElm, cityElm} = this.loadSelector()
        //get the result
        //if result is false you should stop here
        const isInValid = this.validateInput(countryElm.value, cityElm.value)
        if(isInValid) return
        return {
            country: countryElm.value,
            city: cityElm.value,
        }
    },

    // handle remote data
    async handleRemoteData() {
       const data = await weatherData.getWeather()
       return data
    },

    //get icon
    getIcon(iconCode) {
        return `https://openweathermap.org/img/w/${iconCode}.png`
    },
    //populate UI
    populateUI(dataInfo) {
        const {
            cityInfoElm,
            tempElm,
            pressureElm,
            humidityElm,
            feelElm,
            iconElm,
        } = this.loadSelector()
        const {name, main: {temp, pressure, humidity}, weather} = dataInfo
        
        cityInfoElm.textContent = name
        tempElm.textContent = `Temperature: ${temp}°C`
        pressureElm.textContent = `Pressure: ${pressure}Kpa`
        humidityElm.textContent = `Humidity: ${humidity}`
        feelElm.textContent = weather[0].description
        iconElm.setAttribute('src', this.getIcon(weather[0].icon))
    },
    //set data to localStorage
    setDataToLocalStorage(city, country) {
        storage.city = city
        storage.country = country
    },
    
    //define initial function
    init() {
        const {formElm} = this.loadSelector()
        formElm.addEventListener('submit', async (evt) => {
            //reload browser
            evt.preventDefault()

            //get input values
            const inputsData = this.getInputValues()
            if(!inputsData) return
            const {country, city} = inputsData
            //setting data to temp data layer
            weatherData.city = city
            weatherData.country = country
            //set data to localStorage
            this.setDataToLocalStorage(city, country)
            //saving to storage
            storage.saveItem()
            //reset input data
            this.resetInputVal()
            //send data API
            const data = await this.handleRemoteData()
            //populate UI
            this.populateUI(data)       
    })
        window.addEventListener('DOMContentLoaded', async() => {
            let {country, city} = storage.getItem()
            if (!city || !country) {
                country = 'BD'
                city = 'Bogra'
              }
            weatherData.country = country
            weatherData.city = city
            //send data to API server
            const data = await this.handleRemoteData()
            //populate UI
            this.populateUI(data)
        })
    },
}
UI.init()