require('dotenv').config();

export const BASE_URL = 'https://api.rawg.io/api/'

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
export const CURRENT_DATE = `${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DAY}`
// For popular games
export const LAST_YEAR = `${CURRENT_YEAR -1}-${CURRENT_MONTH}-${CURRENT_DAY}`
// For upcoming games
export const NEXT_YEAR = `${CURRENT_YEAR +1}-${CURRENT_MONTH}-${CURRENT_DAY}`

export const api_key = '7ed816ff62b4460aa987135932b168c3'