import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';
import {  BASE_URL } from '../utils/gamesApi';

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

            const  games  = await response.json();
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

    return(
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
                <CardColumns>
                    {searchedGame.map((game) => (
                        <Card key={game.name} border='dark'>
                            <Card.Img src={game.background_image} alt={`The cover image for ${game.name}`} variant='top' />
                            <Card.Body>
                                <Card.Title>{game.name}</Card.Title>
                            </Card.Body>
                        </Card>
                    ))}
                </CardColumns>
            </Container>
      </>
    )
}

export default SearchGames;