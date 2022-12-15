import React, { useEffect, useState } from "react";
import {  Container, Button, Card, CardColumns } from 'react-bootstrap';
import {retieveGames} from '../utils/gamesApi';

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
            <Container>
                <h3>
                    Popular Games 2022
                </h3>
                <CardColumns>
                    {gameData.map((game) => (
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

export default Games;