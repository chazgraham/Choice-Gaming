import React, { useEffect, useState } from "react";
import { retieveGames } from '../utils/gamesApi';
import {  useMutation } from '@apollo/client';
import { SAVE_GAME } from "../utils/mutations";
import Auth from '../utils/auth';

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

    // save games code below
    const [savedGameIds, setSavedGameIds] = useState([]);
    console.log(savedGameIds)
    
    useEffect(() => {
        return () => savedGameIds;
    });

    const [saveGame] = useMutation(SAVE_GAME);


    const handleSaveGame = async (gameId) => {
        // find the book in `searchedBooks` state by the matching id
        const gameToSave = gameData.find((game) => game.gameId === gameId);
        console.log(gameToSave)
    
        // get token
        const token = Auth.loggedIn() ? Auth.getToken() : null;
    
        if (!token) {
          return false;
        }
    
        try {
            const response = await saveGame({
            variables: {
              GameData: {...gameToSave},
            },
          });
          console.log(response)
    
          if (!response.ok) {
            throw new Error('something went wrong!');
          }
    
          // if book successfully saves to user's account, save book id to state
          setSavedGameIds([...savedGameIds, gameToSave.bookId]);
        } catch (err) {
          console.error(err);
        }
      };
      

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
                                <br/>
                                {Auth.loggedIn() && (
                                <button 
                                    disabled={savedGameIds?.some((savedGameId) => savedGameId === game.gameId)}
                                    className='button'
                                    onClick={() => handleSaveGame(game.gameId)}>
                                    {savedGameIds?.some((savedGameId) => savedGameId === game.gameId)
                                     ? 'saved!'
                                     : 'Save Game!'}
                                </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Games;