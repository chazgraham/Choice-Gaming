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

// const popularGames = `${BASE_URL}games?key=${api_key}&dates=${LAST_YEAR},${CURRENT_DATE}&ordering=-rating&page_size=10`

//const searchGame = `${BASE_URL}games?key=${api_key}&search=${game_name}&page_size=21`;

// const retieveGames = async () => {
//     const response = await fetch(popularGames)
//     const data = await response.json()
//     return(data.results)
// }

// const searchGames = async (game_name) => {
//     const response = await fetch(`${BASE_URL}games?key=${api_key}&search=${game_name}&page_size=21`)
//     const data = await response.json()
//     return(data.results)
// }

// export {retieveGames};