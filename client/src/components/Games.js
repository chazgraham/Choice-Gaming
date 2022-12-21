import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from '@apollo/client';
import { SAVE_GAME, WISHLIST_GAME, PLAYED_GAME } from "../utils/mutations";
import { saveGameIds as saveGames, getSavedGameIds, getWishlistGameIds, saveWishlistIds, getPlayedGameIds,  SaveplayedGameIds } from "../utils/localStorage";
import Auth from '../utils/auth';
import { BASE_URL, LAST_YEAR, CURRENT_DATE, NEXT_YEAR } from '../utils/gamesApi';
import { Container } from "react-bootstrap";

const api_key = process.env.REACT_APP_API_KEY
console.log(api_key)

const Games = () => {
  const [gameData, setGameData] = useState([]);

  // Gets a list of 10 popular games
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

  // Gets a list of 10 Upcoming games
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

  // Gets a list of 10 New games
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

  // Differnt values for game details
  const [gameDescription, setGameDescription] = useState([])
  const [gamePlatform, setGamePlatform] = useState([])
  const [gameGenre, setGameGenres] = useState([])
  const [gameRating, setGameRating] = useState([])
  const [gameReleaseDate, setGameReleaseDate] = useState([])

  //handles detail model 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Gets the games ID from gameData and passes it through api call to get details 
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

    setGameDescription(gameDescription);
    setGamePlatform(gamePlatform);
    setGameGenres(gameGenres);
    setGameRating(gameRating);
    setGameReleaseDate(gameRelease);
    handleShow()
  }


  // save games code below
  const [savedGameIds, setSavedGameIds] = useState(getSavedGameIds());
  //console.log(savedGameIds)

  const [saveGame] = useMutation(SAVE_GAME);

  const handleSaveGame = async (gameId) => {

    console.log(gameData)
    const gameToSave = gameData.find((game) => game.gameId === gameId);


    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveGame({
        variables: { gameToSave: { ...gameToSave } },
      });

      // if game successfully saves to user's account, save game id to state
      setSavedGameIds([...savedGameIds, gameToSave.gameId]);
      saveGames([...savedGameIds, gameToSave.gameId]);
    } catch (err) {
      console.error(err);
    }
  };

    // save games code below
    const [wishlistGameIds, setWishlistGameIds] = useState(getWishlistGameIds());
  
    const [wishlistGame] = useMutation(WISHLIST_GAME);
  
    const handlewishlistGame = async (gameId) => {
  
      const gameToSave = gameData.find((game) => game.gameId === gameId);
  
      // get token
      const token = Auth.loggedIn() ? Auth.getToken() : null;
  
      if (!token) {
        return false;
      }
  
      try {
        await wishlistGame({
          variables: { gameToSave: { ...gameToSave } },
        });
  
        // if game successfully saves to user's account, save game id to state
        setWishlistGameIds([...wishlistGameIds, gameToSave.gameId]);
        saveWishlistIds([...wishlistGameIds, gameToSave.gameId]);
      } catch (err) {
        console.error(err);
      }
    };

    // save games code below
    const [playedGameIds, setPlayedGameIds] = useState(getPlayedGameIds());
  
    const [PlayedGame] = useMutation(PLAYED_GAME);
  
    const handlePlayedGame = async (gameId) => {
  
      const gameToSave = gameData.find((game) => game.gameId === gameId);
  
  
      // get token
      const token = Auth.loggedIn() ? Auth.getToken() : null;
  
      if (!token) {
        return false;
      }
  
      try {
        await PlayedGame({
          variables: { gameToSave: { ...gameToSave } },
        });
  
        // if game successfully saves to user's account, save game id to state
        setPlayedGameIds([...playedGameIds, gameToSave.gameId]);
        SaveplayedGameIds([...playedGameIds, gameToSave.gameId]);
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

        <Container className="flex-row">
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
                        ? 'Playing!'
                        : 'Set as playing!'}
                    </button>
                    <button
                      disabled={wishlistGameIds?.some((savedWishlistGameId) => savedWishlistGameId === game.gameId)}
                      className='save-button'
                      onClick={() => handlewishlistGame(game.gameId)}>
                      {wishlistGameIds?.some((savedWishlistGameId) => savedWishlistGameId === game.gameId)
                        ? 'On Wishlist'
                        : 'Save to wishlist!'}
                    </button>
                    <button
                      disabled={playedGameIds?.some((savedPlayedGameId) => savedPlayedGameId === game.gameId)}
                      className='save-button'
                      onClick={() => handlePlayedGame(game.gameId)}>
                      {playedGameIds?.some((savedPlayedGameId) => savedPlayedGameId === game.gameId)
                        ? 'Completed!'
                        : 'Save as Completed!'}
                    </button>
                  </div>
                )}
              </div>
              <button className="details-btn" onClick={() => getDetails(game.gameId)}>Details</button>
            </div>
          ))}
        </Container>
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