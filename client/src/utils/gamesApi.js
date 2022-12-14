require('dotenv').config();

const BASE_URL = 'https://api.rawg.io/api/'
const api_key = process.env.API_KEY

// GET THE DATE
const getCurrentMonth = ()=> {
    const month = new Date().getMonth()+1
    if(month < 10) {
        return `0${month}`
    }
    else {
        return month
    }
}

// GET CURRENT DAY
const getCurrentDay = ()=> {
    const day = new Date().getDate()
    if(day < 10) {
        return `0${day}`
    }
    else {
        return day
    }
}

// GET CURRENT DAY/MONTH/YEAR
const CURRENT_YEAR = new Date().getFullYear()
const CURRENT_MONTH = getCurrentMonth()
const CURRENT_DAY = getCurrentDay()
// For Both popular and upcoming games
const CURRENT_DATE = `${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DAY}`
// For popular games
const LAST_YEAR = `${CURRENT_YEAR -1}-${CURRENT_MONTH}-${CURRENT_DAY}`
// For upcoming games
const NEXT_YEAR = `${CURRENT_YEAR +1}-${CURRENT_MONTH}-${CURRENT_DAY}`

export const popularGames = `${BASE_URL}games?key=${api_key}&dates=${LAST_YEAR},${CURRENT_DATE}&ordering=-rating&page_size=10`
