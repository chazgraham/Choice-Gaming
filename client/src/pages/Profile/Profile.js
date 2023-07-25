import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, GET_ME } from '../../utils/queries';
import Auth from '../../utils/auth';
import { ADD_FRIEND, Delete_GAME, Delete_WISHLISTGAME, Delete_PLAYEDGAME } from '../../utils/mutations';
import { deleteGameId, deleteWishlistGameId, deletePlayedGameId } from '../../utils/localStorage';
import { BASE_URL } from '../../utils/gamesApi';
import "./profile.css";

const api_key = '7ed816ff62b4460aa987135932b168c3'

const Profile = () => {
  const [addFriend] = useMutation(ADD_FRIEND);
  const [deleteGame] = useMutation(Delete_GAME);
  const [deleteWishlistGame] = useMutation(Delete_WISHLISTGAME);
  const [deletePlayedGame] = useMutation(Delete_PLAYEDGAME);
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
  const [gameDescription, setGameDescription] = useState([]);
  const [gamePlatform, setGamePlatform] = useState([]);
  //const [gameGenre, setGameGenres] = useState([])
  const [gameRating, setGameRating] = useState([]);
  const [gameReleaseDate, setGameReleaseDate] = useState([]);
  const [gameDeleteId, setGameDeleteId] = useState([]);
  const [modalDeleteBtn, setModalDeleteBtn] = useState('');
  const [gamedisplay, setGameDisplay] = useState('playing');
  const [active, setActive] = useState('playing');

  //handles detail model 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Gets the games ID from gameData and passes it through api call to get details 
  const getDetails = async (gameId) => {
    const response = await fetch(`${BASE_URL}games/${gameId}?key=${api_key}&`);
    const game = await response.json();

    const gameDescription = game.description_raw;
    const gamePlatform = game.platforms;
    //const gameGenres = game.genres;
    const gameRating = game.rating;
    const gameRelease = game.released
    const gameDeleteId = game.id
    console.log(gameDeleteId)

    setGameDescription(gameDescription);
    setGamePlatform(gamePlatform);
    //setGameGenres(gameGenres);
    setGameRating(gameRating);
    setGameReleaseDate(gameRelease);
    setGameDeleteId(gameDeleteId.toString())
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

  const handleDeleteWishlistGame = async (gameId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await deleteWishlistGame({
        variables: { gameId: gameId },
      })

      deleteWishlistGameId(gameId);
    } catch (err) {
      console.error(err);
    }
  }

  const handleDeletePlayedGame = async (gameId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }

    try {
      await deletePlayedGame({
        variables: { gameId: gameId },
      })

      deletePlayedGameId(gameId);
    } catch (err) {
      console.error(err);
    }
  }

  //Set up for friend button
  //console.log(userParam)
  //console.log(user.friends)
  //console.log(Auth.getProfile().data)
  //console.log(users)
  //const { data: users } = useQuery(QUERY_USERS);

  return (
    <>
      <section>
        {Auth.loggedIn() && (
          <div>
            {userParam && (
              <button
                className="add-friend"
                onClick={handleClick}>
                Add As Friend
              </button>
            )}
          </div>
        )}
        <h2 className='profile_h2'>
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>
      </section>
      <section className='profile_game_container'>
        <div className='game_display'>
          <button onClick={() => { setGameDisplay('playing'); setActive('playing') }} className={active === 'playing' ? 'active' : 'game_display_btn'}>Playing</button>
          <button onClick={() => { setGameDisplay('wishList'); setActive('wishList') }} className={active === 'wishList' ? 'active' : 'game_display_btn'}>wishList</button>
          <button onClick={() => { setGameDisplay('completed'); setActive('completed') }} className={active === 'completed' ? 'active' : 'game_display_btn'}>completed</button>
        </div>
        <div className='game_list'>
          {gamedisplay === 'playing' && (
            <div className="card_container">
              {user.savedGames.map((game) => (
                <div className="game_card">
                  <img className="game_img" src={game.background_image} alt={game.name} />
                  <div className="overlay" onClick={() => { getDetails(game.gameId); setModalDeleteBtn('playing') }}>
                    <p className="game_title_overlay">{game.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {gamedisplay === 'wishList' && (
            <div className="card_container">
              {user.wishlistGames.map((game) => (
                <div className="game_card">
                  <img className="game_img" src={game.background_image} alt={game.name} />
                  <div className="overlay" onClick={() => { getDetails(game.gameId); setModalDeleteBtn('wishlist') }}>
                    <p className="game_title_overlay">{game.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {gamedisplay === 'completed' && (
            <div className="card_container">
              {user.playedGames.map((game) => (
                <div className="game_card">
                  <img className="game_img" src={game.background_image} alt={game.name} />
                  <div className="overlay" onClick={() => { getDetails(game.gameId); setModalDeleteBtn('completed') }}>
                    <p className="game_title_overlay">{game.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <section>
        <Modal show={show} onHide={handleClose} className="modal">
          <Modal.Header>
            <p>{gameRating === 0
              ? 'Currently Unrated'
              : `Rating: ${gameRating} out of 5`}
            </p>
            <p>Released on: {gameReleaseDate}</p>
          </Modal.Header>
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
          {Auth.loggedIn() && (
            <Modal.Body>
              {!userParam && (
                <div>
                  {modalDeleteBtn === 'playing' && (
                    <Button
                      onClick={() => handleDeleteGame(gameDeleteId)}>
                      Remove
                    </Button>
                  )}
                  {modalDeleteBtn === 'wishlist' && (
                    <Button
                      onClick={() => handleDeleteWishlistGame(gameDeleteId)}>
                      Remove
                    </Button>
                  )}
                  {modalDeleteBtn === 'completed' && (
                    <Button
                      onClick={() => handleDeletePlayedGame(gameDeleteId)}>
                      Remove
                    </Button>
                  )}
                </div>
              )}
            </Modal.Body>
          )}
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </section>
    </>
  );
};

export default Profile;
