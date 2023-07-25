<div>
      <div className="profile-h2">
        <h2>
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>
      </div>
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

      <Row>
        <Col xs={2}>
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </Col>

        <Col>
          <div className='profile-h3'>
            <h3>Playing</h3>
          </div>
          {user.savedGames.map((game) => (
            <div className="game-card" key={game.name}>
              <h4>{game.name}</h4>
              <div className="overlay-position">
                <img className="img-thumbnail" src={game.background_image} alt={`${game.name}`} />
                {!userParam && (
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
        </Col>

        <Col>
          <div className='profile-h3'>
            <h3>Wishlist</h3>
          </div>
          {user.wishlistGames.map((game) => (
            <div className="game-card" key={game.name}>
              <h4>{game.name}</h4>
              <div className="overlay-position">
                <img className="img-thumbnail" src={game.background_image} alt={`${game.name}`} />
                {!userParam && (
                  <div className="img__overlay">
                    <button
                      className='save-button'
                      onClick={() => handleDeleteWishlistGame(game.gameId)}>
                      Remove
                    </button>
                  </div>
                )}
              </div>
              {<button className="details-btn" onClick={() => getDetails(game.gameId)}>Details</button>}
            </div>
          ))}
        </Col>

        <Col>
          <div className='profile-h3'>
            <h3>Completed</h3>
          </div>
          {user.playedGames.map((game) => (
            <div className="game-card" key={game.name}>
              <h4>{game.name}</h4>
              <div className="overlay-position">
                <img className="img-thumbnail" src={game.background_image} alt={`${game.name}`} />
                {!userParam && (
                  <div className="img__overlay">
                    <button
                      className='save-button'
                      onClick={() => handleDeletePlayedGame(game.gameId)}>
                      Remove
                    </button>
                  </div>
                )}
              </div>
              {<button className="details-btn" onClick={() => getDetails(game.gameId)}>Details</button>}
            </div>
          ))}
        </Col>
      </Row>

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