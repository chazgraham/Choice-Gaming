import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, CardColumns } from 'react-bootstrap';
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

    // save games code below
    const [savedGameIds, setSavedGameIds] = useState([]);
    console.log(savedGameIds)
  
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
                <Button className='button' type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
                <button onClick={clearSearch}>
                  clear search
                </button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedGame.length
            ? `Viewing ${searchedGame.length} results:`
            : 'Search for a game to begin'}
        </h2>
        <div className="flex-row">
          {searchedGame.map((game) => (
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
          </div>
          ))}
        </div>
      </Container>
    </>
  )
}

export default SearchGames;