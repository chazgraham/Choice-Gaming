import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, GET_ME } from '../utils/queries';
import FriendList from '../components/FriendList';
import Auth from '../utils/auth';
import { ADD_FRIEND, Delete_GAME } from '../utils/mutations';
import { deleteGameId } from '../utils/localStorage';
import { BASE_URL } from '../utils/gamesApi';

const api_key = process.env.REACT_APP_API_KEY

const Profile = () => {
  const [addFriend] = useMutation(ADD_FRIEND);
  const [deleteGame] = useMutation(Delete_GAME);
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : GET_ME, {
    variables: { username: userParam }
  });


  // Add friend
  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const user = data?.me || data?.user || {};

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
    const response = await fetch(`${BASE_URL}games/${gameId}?key=${api_key}&`);
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

  // navigate to personal profile page if username is the logged-in user's
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }

  const handleDeleteGame = async (gameId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log(gameId)

    if (!token) {
      return false;
    }

    try {
      await deleteGame({
        variables: { gameId: gameId },
      })

      deleteGameId(gameId);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <div className="profile-h2">
        <h2>
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>

        <div className="flex-row">
          {user.savedGames.map((game) => (
            <div className="game-card" key={game.name}>
              <h4>{game.name}</h4>
              <div className="overlay-position">
                <img className="img-thumbnail" src={game.background_image} alt={`${game.name}`} />
                {Auth.loggedIn() && (
                  <div className="img__overlay">
                    <button
                      className='save-button'
                      onClick={() => handleDeleteGame(game.gameId)}>
                      Remove
                    </button>
                  </div>
                )}
              </div>
              {<button className="details-btn" onClick={() => getDetails(game.gameId)}>Details</button>}
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

        {Auth.loggedIn() && (
          <div>
        {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
        </div>
        )}
      </div>

      <div className="friend-container">

        <div className="">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
