import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from '@apollo/client';
import { SAVE_GAME } from "../utils/mutations";
import { GET_ME } from '../utils/queries';
import { saveGameIds, getSavedGameIds } from "../utils/localStorage";
import Auth from '../utils/auth';
import { BASE_URL, LAST_YEAR, CURRENT_DATE, NEXT_YEAR } from '../utils/gamesApi';

const api_key = process.env.REACT_APP_API_KEY

const Games = () => {
  const [gameData, setGameData] = useState([]);
  const [gameDescription, setGameDescription] = useState([])
  const [gamePlatform, setGamePlatform] = useState([])
  const [gameGenre, setGameGenres] = useState([])
  const [gameRating, setGameRating] = useState([])
  const [gameReleaseDate, setGameReleaseDate] = useState([])

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getDetails = async (gameId) => {
    const gameDetail = gameData.find((game) => game.gameId === gameId);
    const gameID = gameDetail.gameId;

    const response = await fetch(`${BASE_URL}games/${gameID}?key=${api_key}&`);
    const game = await response.json();

    const gameDescription = game.description;
    const gamePlatform = game.platforms;
    const gameGenres = game.genres;
    const gameRating = game.rating;
    const gameRelease = game.released

    console.log(gameRelease)

    setGameDescription(gameDescription);
    setGamePlatform(gamePlatform);
    setGameGenres(gameGenres);
    setGameRating(gameRating);
    setGameReleaseDate(gameRelease);
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
      console.log(game)

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
  const [savedGameIds, setSavedGameIds] = useState(getSavedGameIds());
  //console.log(savedGameIds)

  const [saveGame] = useMutation(SAVE_GAME);

  useEffect(() => {
    return () => saveGameIds(savedGameIds);
  });

  const handleSaveGame = async (gameId) => {

    console.log(gameData)
    const gameToSave = gameData.find((game) => game.gameId === gameId);


    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    console.log(gameToSave)

    if (typeof gameToSave === 'object' &&
      gameToSave !== null &&
      !Array.isArray(gameToSave)
    ) {
      console.log('✅ Value is an object');
    } else {
      console.log('⛔️ Value is not an object');
    }

    try {
      await saveGame({
        variables: { game: { ...gameToSave } },
        update: cache => {
          const { me } = cache.readQuery({ query: GET_ME });
          console.log(me)
          cache.writeQuery({ query: GET_ME, data: { me: { ...me, savedGames: [...me.savedGames, gameToSave] } } })
        }
      });

      // if game successfully saves to user's account, save game id to state
      setSavedGameIds([...savedGameIds, gameToSave.gameId]);
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
            <div className="game-card" key={game.name}>
              <h4>{game.name}</h4>
              <div className="overlay-position">
                <img className="img-thumbnail" src={game.background_image} alt={`${game.name}`} />
                {Auth.loggedIn() && (
                  <div className="img__overlay">
                    <button
                      disabled={savedGameIds?.some((savedGameId) => savedGameId === game.gameId)}
                      className='save-button'
                      onClick={() => handleSaveGame(game.gameId)}>
                      {savedGameIds?.some((savedGameId) => savedGameId === game.gameId)
                        ? 'saved!'
                        : 'Save Game!'}
                    </button>
                  </div>
                )}
              </div>
              <button className="details-btn" onClick={() => getDetails(game.gameId)}>Details</button>
            </div>
          ))}
        </div>
        <Modal show={show} onHide={handleClose}>
          <p>{gameRating === 0
            ? 'Currently Unrated'
            : `Rating: ${gameRating} out of 5`}
          </p>
          <p>Released on: {gameReleaseDate}</p>
          <Modal.Header>
            <Modal.Title>Description</Modal.Title>
          </Modal.Header>
          <Modal.Body>{gameDescription}</Modal.Body>
          <Modal.Header>
            <Modal.Title>Platforms</Modal.Title>
          </Modal.Header>
          <Modal.Body>{gamePlatform.map((platforms) => (
            <li key={platforms.platform.name}>{platforms.platform.name}</li>
          ))}</Modal.Body>
          <Modal.Header>
            <Modal.Title>Genres</Modal.Title>
          </Modal.Header>
          <Modal.Body>{gameGenre.map((genres) => (
            <li key={genres.name}>{genres.name}</li>
          ))}</Modal.Body>
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