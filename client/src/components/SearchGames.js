import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Modal } from 'react-bootstrap';
import { BASE_URL } from '../utils/gamesApi';
import Auth from '../utils/auth';
import { useMutation } from '@apollo/client';
import { SAVE_GAME } from "../utils/mutations";

const api_key = process.env.REACT_APP_API_KEY

const SearchGames = () => {
  const [searchedGame, setSearchedGame] = useState([]);
  const [searchedInput, setSearchInput] = useState('');

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

  const clearSearch = (event) => {
    window.location.reload()
  }

  const [gameDescription, setGameDescription] = useState([])
  const [gamePlatform, setGamePlatform] = useState([])
  const [gameGenre, setGameGenres] = useState([])
  const [gameRating, setGameRating] = useState([])
  const [gameReleaseDate, setGameReleaseDate] = useState([])

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getDetails = async (gameId) => {
    const gameDetail = searchedGame.find((game) => game.gameId === gameId);
    console.log(gameDetail)
    const gameID = gameDetail.gameId
    console.log(gameID)

    const response = await fetch(`${BASE_URL}games/${gameID}?key=${api_key}&`)
    const game = await response.json();
    console.log(game)

    const gameDescription = game.description
    console.log(gameDescription)
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
  const [savedGameIds, setSavedGameIds] = useState([]);

  useEffect(() => {
    return () => savedGameIds;
  });

  const [saveGame] = useMutation(SAVE_GAME);

  const handleSaveGame = async (gameId) => {
    // find the book in `searchedBooks` state by the matching id
    const gameToSave = searchedGame.find((game) => game.gameId === gameId);
    console.log(gameToSave)

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

      // if book successfully saves to user's account, save book id to state
      setSavedGameIds([...savedGameIds, gameToSave.bookId]);
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