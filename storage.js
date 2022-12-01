//set data to local storage

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

export default storage