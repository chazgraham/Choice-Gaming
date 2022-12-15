import React, { useEffect, useState } from "react";
import { retieveGames } from '../utils/gamesApi';

const Games = () => {
    const [gameData, setGameData] = useState([]);

    retieveGames().then(games => {
        const popularGamesData = games.map((game) => ({
            name: game.name,
            background_image: game.background_image,
            gameId: game.id,
        }));
        setGameData(popularGamesData);
    })
    

    return (
        <>
            <div className="card-container">
                <h3>
                    Popular Games 2022
                </h3>
                <div className="flex-row">
                    {gameData.map((game) => (
                        <div className="image" key={game.name} border='dark'>
                            <img className="img-thumbnail" src={game.background_image} alt={`${game.name}`} variant='top'  />
                            <div className="img__overlay">
                                <p >{game.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Games;