import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from '@apollo/client';
import { SAVE_GAME } from "../utils/mutations";
import Auth from '../utils/auth';
import { BASE_URL, LAST_YEAR, CURRENT_DATE, NEXT_YEAR } from '../utils/gamesApi';

const api_key = process.env.REACT_APP_API_KEY

const Games = () => {
  const [gameData, setGameData] = useState([]);
  const [gameDescription, setGameDescription] = useState([])

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getDetails = async (gameId) => {
    const gameDetail = gameData.find((game) => game.gameId === gameId);
    console.log(gameDetail)
    const gameID = gameDetail.gameId
    console.log(gameID)

     const response =  await fetch (`${BASE_URL}games/${gameID}?key=${api_key}&`)
     const game = await response.json();
     console.log(game)

     const gameDescription = game.description
     console.log(gameDescription)

     setGameDescription(gameDescription);
     handleShow()
  }

  const getPopular = async (event) => {
    try {
      const response = await fetch(`${BASE_URL}games?key=${api_key}&dates=${LAST_YEAR},${CURRENT_DATE}&ordering=-rating&page_size=10`)

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const games = await response.json();
      const game = games.results;

      const gameData = game.map((game) => ({
        name: game.name,
        background_image: game.background_image,
        gameId: game.id
      }));

      setGameData(gameData);
    } catch (err) {
      console.error(err);
    }
  }

  const getUpcoming = async (event) => {
    try {
      const response = await fetch(`${BASE_URL}games?key=${api_key}&dates=${CURRENT_DATE},${NEXT_YEAR}&ordering=-rating&page_size=10`)

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const games = await response.json();
      const game = games.results;

      const gameData = game.map((game) => ({
        name: game.name,
        background_image: game.background_image,
        gameId: game.id
      }));

      setGameData(gameData);
    } catch (err) {
      console.error(err);
    }
  }

  const getNew = async (event) => {
    try {
      const response = await fetch(`${BASE_URL}games?key=${api_key}&dates=${LAST_YEAR},${CURRENT_DATE}&ordering=-released&page_size=10`)

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const games = await response.json();
      const game = games.results;

      const gameData = game.map((game) => ({
        name: game.name,
        background_image: game.background_image,
        gameId: game.id
      }));

      setGameData(gameData);
    } catch (err) {
      console.error(err);
    }
  }


  // save games code below
  const [savedGameIds, setSavedGameIds] = useState([]);
  console.log(savedGameIds)

  const [saveGame] = useMutation(SAVE_GAME);

   const handleSaveGame = async (gameId) => {
    
    const gameToSave = gameData.find((game) => game.gameId === gameId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await saveGame({
        variables: {
          GameData: { ...gameToSave },
        },
      });
      console.log(response)

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      // if game successfully saves to user's account, save game id to state
      setSavedGameIds([...savedGameIds, gameToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
      <div className="card-container">
        <div className="gamesBtn">
          <button className="btn-1" onClick={getPopular}>
            Popular Games
          </button>
          <button className="btn-1" onClick={getUpcoming}>
            upcoming Games
          </button>
          <button className="btn-1" onClick={getNew}>
            New Games
          </button>
        </div>

        <div className="flex-row">
          {gameData.map((game) => (
            <div className="game-card" key={game.name} border='dark'>
              <img className="img-thumbnail" src={game.background_image} alt={`${game.name}`} variant='top' />
              <div className="img__overlay">
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
              <p >{game.name}</p>
              <button onClick= {() => getDetails(game.gameId)}>game deets</button>
            </div>
          ))}
        </div>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>{gameDescription}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </>
  )
}

export default Games;