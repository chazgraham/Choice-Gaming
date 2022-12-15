import React, { useEffect, useState } from "react";
import retieveGames from '../utils/gamesApi';

const Games = () => {
    const [gameData, setGameData] = useState([]);

    retieveGames().then(games => {
        const popularGamesData = games.map((game) => ({
            name: game.name,
            background_image: game.background_image
        }));
        setGameData(popularGamesData);
    })

    return (
        <>
            {gameData.map((game) => (
                <div key={game.name}>
                    <p>{game.name}</p>
                    
                </div>
            ))}
        </>
    )
}

export default Games;