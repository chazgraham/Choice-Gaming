import React from 'react';

// const platforms = await fetch(`https://api.rawg.io/api/platforms?key=28c1aa24172a42068c97a6d62fe5d5c3`)
//     const response = await fetch(`https://api.rawg.io/api/games?key=28c1aa24172a42068c97a6d62fe5d5c3&dates=2019-09-01,2019-09-30&platforms=18,1,7`)



const HomePage = () => {

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'a6a30e23b9msh480e25105ded1a3p1848f0jsnf9dc19e6f1c5',
            'X-RapidAPI-Host': 'rawg-video-games-database.p.rapidapi.com'
        }
    };

    fetch('https://rawg-video-games-database.p.rapidapi.com/games?key=28c1aa24172a42068c97a6d62fe5d5c3', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

    return (
        <>
            <h2>
                Games!
            </h2>
        </>
    )
}

export default HomePage;