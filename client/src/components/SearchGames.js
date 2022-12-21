import React, { useState } from 'react';
import { Jumbotron, Container, Col, Form, Button, Modal } from 'react-bootstrap';
import { BASE_URL } from '../utils/gamesApi';
import Auth from '../utils/auth';
import { useMutation } from '@apollo/client';
import { SAVE_GAME, WISHLIST_GAME, PLAYED_GAME } from "../utils/mutations";
import { saveGameIds as saveGames, getSavedGameIds, getWishlistGameIds, saveWishlistIds, getPlayedGameIds,  SaveplayedGameIds } from "../utils/localStorage";

const api_key = '7ed816ff62b4460aa987135932b168c3'

const SearchGames = () => {
  const [searchedGame, setSearchedGame] = useState([]);
  const [searchedInput, setSearchInput] = useState('');

  // Sets the forms input to searchedGame state then runs it through api call
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchedInput) {
      return false;
    }

    try {
      const response = await fetch(`${BASE_URL}games?key=${api_key}&search=${searchedInput}&page_size=21`)

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

      setSearchedGame(gameData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  }

  // Clear button
  const clearSearch = (event) => {
    window.location.reload()
  }

  // Different values for the games details
  const [gameDescription, setGameDescription] = useState([])
  const [gamePlatform, setGamePlatform] = useState([])
  const [gameGenre, setGameGenres] = useState([])
  const [gameRating, setGameRating] = useState([])
  const [gameReleaseDate, setGameReleaseDate] = useState([])

  // Controlls the model that shows the games details
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Gets the games ID from searchGame and passes it through api call to get details
  const getDetails = async (gameId) => {
    const gameDetail = searchedGame.find((game) => game.gameId === gameId);
    const gameID = gameDetail.gameId

    const response = await fetch(`${BASE_URL}games/${gameID}?key=${api_key}&`)
    const game = await response.json();

    const gameDescription = game.description
    const gamePlatform = game.platforms
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

  const [saveGame] = useMutation(SAVE_GAME);

  const handleSaveGame = async (gameId) => {
    const gameToSave = searchedGame.find((game) => game.gameId === gameId);


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
    
        const gameToSave = searchedGame.find((game) => game.gameId === gameId);
    
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
  
      const gameToSave = searchedGame.find((game) => game.gameId === gameId);
  
  
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
      <Jumbotron fluid className='text-light'>
        <Container>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchedInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a game'
                />
              </Col>
              <Col xs={12} md={4}>
                <button className='btn-2' type='submit' size='lg'>
                  Submit Search
                </button>
                <button className='clear-btn' onClick={clearSearch}>
                  clear search
                </button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2 className='viewing'>
          {searchedGame.length
            ? `Viewing ${searchedGame.length} results:`
            : ''}
        </h2>
        <div className="flex-row">
          {searchedGame.map((game) => (
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
                        ? 'Played!'
                        : 'Save as Played!'}
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
      </Container>
    </>
  )
}

export default SearchGames;