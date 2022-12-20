export const getSavedGameIds = () => {
    const savedGameIds = localStorage.getItem('saved_games')
      ? JSON.parse(localStorage.getItem('saved_games'))
      : [];
  
    return savedGameIds;
  };
  
  export const saveGameIds = (gameIdArr) => {
    console.log(gameIdArr)
    if (gameIdArr.length) {
      localStorage.setItem('saved_games', JSON.stringify(gameIdArr));
    } else {
      localStorage.removeItem('saved_games');
    }
  };

  export const deleteGameId = (gameId) => {
    const savedGameIds = localStorage.getItem('saved_games')
      ? JSON.parse(localStorage.getItem('saved_games'))
      : null;
      console.log(savedGameIds)
  
    if (!savedGameIds) {
      return false;
    }
    const updatedSavedGameIds = savedGameIds?.filter((savedGameId) => savedGameId != gameId);
    localStorage.setItem('saved_games', JSON.stringify(updatedSavedGameIds));
    console.log(updatedSavedGameIds)
  
    return true;
  };