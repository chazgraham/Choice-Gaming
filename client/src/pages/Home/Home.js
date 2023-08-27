import React, { useEffect, useState } from "react";
import "./home.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from '@apollo/client';
import { SAVE_GAME, WISHLIST_GAME, PLAYED_GAME } from "../../utils/mutations";
import { saveGameIds as saveGames, getSavedGameIds, getWishlistGameIds, saveWishlistIds, getPlayedGameIds, SaveplayedGameIds } from "../../utils/localStorage";
import Auth from '../../utils/auth';
import { BASE_URL, LAST_YEAR, CURRENT_DATE, NEXT_YEAR } from '../../utils/gamesApi';
import noImg from '../../assests/no_img.jpg';

const api_key = '7ed816ff62b4460aa987135932b168c3'

const Home = () => {
  const [gameData, setGameData] = useState([]);
  const [searchedInput, setSearchInput] = useState('');
  const [popularData, setPoularData] = useState([])
  const [upcomingData, setUpcomingData] = useState([])
  const [newGameData, setNewGameData] = useState([])

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
      console.log(game)

      const gameData = game.map((game) => ({
        name: game.name,
        background_image: game.background_image,
        gameId: game.id,
        genres: game.genres,
        platforms: game.platforms,
        rating: game.rating,
        released: game.released
      }));

      setGameData(gameData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  }
  console.log(searchedInput)
  // Gets a list of 10 popular games
  useEffect(() => {
    getPopular()
    getUpcoming()
    getNew()
  }, [])

  const getPopular = async (event) => {
    try {
      const response = await fetch(`${BASE_URL}games?key=${api_key}&dates=${LAST_YEAR},${CURRENT_DATE}&ordering=-rating&page_size=30`)

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const games = await response.json();
      const game = games.results;

      const gameData = game.map((game) => ({
        name: game.name,
        background_image: game.background_image,
        gameId: game.id,
        genres: game.genres,
        platforms: game.platforms,
        rating: game.rating,
        released: game.released
      }));

      setPoularData(gameData);
    } catch (err) {
      console.error(err);
    }
  }

  // Gets a list of 10 Upcoming games
  const getUpcoming = async (event) => {
    try {
      const response = await fetch(`${BASE_URL}games?key=${api_key}&dates=${CURRENT_DATE},${NEXT_YEAR}&ordering=-rating&page_size=30`)

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const games = await response.json();
      const game = games.results;

      const gameData = game.map((game) => ({
        name: game.name,
        background_image: game.background_image,
        gameId: game.id,
        genres: game.genres,
        platforms: game.platforms,
        rating: game.rating,
        released: game.released
      }));

      setUpcomingData(gameData);
    } catch (err) {
      console.error(err);
    }
  }
  console.log(upcomingData)

  // Gets a list of 10 New games
  const getNew = async (event) => {
    try {
      const response = await fetch(`${BASE_URL}games?key=${api_key}&dates=${LAST_YEAR},${CURRENT_DATE}&ordering=-released&page_size=30`)

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const games = await response.json();
      const game = games.results;

      const gameData = game.map((game) => ({
        name: game.name,
        background_image: game.background_image,
        gameId: game.id,
        genres: game.genres,
        platforms: game.platforms,
        rating: game.rating,
        released: game.released
      }));

      setNewGameData(gameData);
    } catch (err) {
      console.error(err);
    }
  }

  // Differnt values for game details
  const [gameDescription, setGameDescription] = useState([])
  const [gamePlatform, setGamePlatform] = useState([])
  const [gameRating, setGameRating] = useState([])
  const [gameReleaseDate, setGameReleaseDate] = useState([])
  const [gameSaveId, setGameSaveId] = useState([])
  const [gameToBeSaved, setGameToBeSaved] = useState([])
  const [gamedisplay, setGameDisplay] = useState('popular');
  const [active, setActive] = useState('popular');

  //handles detail model 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Gets the games ID from gameData and passes it through api call to get details 
  const getDetails = async (gameId) => {

    const gameID = gameId;

    const response = await fetch(`${BASE_URL}games/${gameID}?key=${api_key}&`);
    const game = await response.json();
    console.log(game)

    const gameData = {
      name: game.name,
      background_image: !game.background_image ? noImg : game.background_image,
      gameId: game.id,
    }

    const gameDescription = game.description_raw;
    const gamePlatform = game.platforms;
    const gameRating = game.rating;
    const gameRelease = game.released
    const gameSaveId = game.id

    setGameToBeSaved(gameData)
    setGameDescription(gameDescription);
    setGamePlatform(gamePlatform);
    setGameSaveId(gameSaveId);
    setGameRating(gameRating);
    setGameReleaseDate(gameRelease);
    handleShow()
  }


  // save games code below
  const [savedGameIds, setSavedGameIds] = useState(getSavedGameIds());
  //console.log(savedGameIds)

  const [saveGame] = useMutation(SAVE_GAME);

  const handleSaveGame = async (gameId) => {
    const gameToSave = gameToBeSaved
    console.log(gameToSave)


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

    const gameToSave = gameToBeSaved
    console.log(gameToSave)

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

    const gameToSave = gameToBeSaved


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

  // TODO: add button that renders more games in each category

  return (
    <>
      <section>
        <form className="search" onSubmit={handleFormSubmit}>
          <input className="searchTerm" type="text" placeholder="Search" value={searchedInput} onChange={(e) => setSearchInput(e.target.value)}></input>
          <button className="searchButton" type="submit"><i class="fa fa-search"></i></button>
          <button className="clearButton" onClick={(e) => setGameData([])}>clear</button>
        </form>
        <div className="card_container">
          {gameData.map((game) => (
            <div className="game_card">
              {!game.background_image ?
                <img className="game_img" src={noImg} alt={game.name} />
                :
                <img className="game_img" src={game.background_image} alt={game.name} />
              }
              <div className="overlay" onClick={() => getDetails(game.gameId)}>
                <p className="game_title_overlay">{game.name}</p>
                <div className="genre_list">
                  {game.genres.map((genre) => (
                    <li className="genre">{genre.name}</li>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="main_container">
        <div className='game_display'>
          <button onClick={() => { setGameDisplay('popular'); setActive('popular') }} className={active === 'popular' ? 'active' : 'game_display_btn'}>Popular</button>
          <button onClick={() => { setGameDisplay('upcoming'); setActive('upcoming') }} className={active === 'upcoming' ? 'active' : 'game_display_btn'}>Upcoming</button>
          <button onClick={() => { setGameDisplay('new'); setActive('new') }} className={active === 'new' ? 'active' : 'game_display_btn'}>New</button>
        </div>
        <div className='game_list'>
          {gamedisplay === 'popular' && (
            <div className="card_container">
              {popularData.map((game) => (
                <div className="game_card">
                  {!game.background_image ?
                    <img className="game_img" src={noImg} alt={game.name} />
                    :
                    <img className="game_img" src={game.background_image} alt={game.name} />
                  }
                  <div className="overlay" onClick={() => getDetails(game.gameId)}>
                    <p className="game_title_overlay">{game.name}</p>
                    <div className="genre_list">
                      {game.genres.map((genre) => (
                        <li className="genre">{genre.name}</li>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {gamedisplay === 'upcoming' && (
            <div className="card_container">
              {upcomingData.map((game) => (
                <div className="game_card">
                  {!game.background_image ?
                    <img className="game_img" src={game.background_image = noImg} alt={game.name} />
                    :
                    <img className="game_img" src={game.background_image} alt={game.name} />
                  }
                  <div className="overlay" onClick={() => getDetails(game.gameId)}>
                    <p className="game_title_overlay">{game.name}</p>
                    <div className="genre_list">
                      {game.genres.map((genre) => (
                        <li className="genre">{genre.name}</li>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {gamedisplay === 'new' && (
            <div className="card_container">
              {newGameData.map((game) => (
                <div className="game_card">
                  {!game.background_image ?
                    <img className="game_img" src={noImg} alt={game.name} />
                    :
                    <img className="game_img" src={game.background_image} alt={game.name} />
                  }
                  <div className="overlay" onClick={() => getDetails(game.gameId)}>
                    <p className="game_title_overlay">{game.name}</p>
                    <div className="genre_list">
                      {game.genres.map((genre) => (
                        <li className="genre">{genre.name}</li>
                      ))}
                    </div>
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
              <Button
                variant="secondary"
                disabled={savedGameIds?.some((savedGameId) => savedGameId === gameSaveId)}
                className='save-button'
                onClick={() => handleSaveGame(gameSaveId)}>
                {savedGameIds?.some((savedGameId) => savedGameId === gameSaveId)
                  ? 'Playing!'
                  : 'Set as playing!'}
              </Button>
              <Button
                variant="secondary"
                disabled={wishlistGameIds?.some((savedWishlistGameId) => savedWishlistGameId === gameSaveId)}
                className='save-button'
                onClick={() => handlewishlistGame(gameSaveId)}>
                {wishlistGameIds?.some((savedWishlistGameId) => savedWishlistGameId === gameSaveId)
                  ? 'On Wishlist'
                  : 'Save to wishlist!'}
              </Button>
              <Button
                variant="secondary"
                disabled={playedGameIds?.some((savedPlayedGameId) => savedPlayedGameId === gameSaveId)}
                className='save-button'
                onClick={() => handlePlayedGame(gameSaveId)}>
                {playedGameIds?.some((savedPlayedGameId) => savedPlayedGameId === gameSaveId)
                  ? 'Completed!'
                  : 'Save as Completed!'}
              </Button>
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
  )
}

export default Home;