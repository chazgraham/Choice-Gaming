export const getSavedGameIds = () => {
    const savedGameIds = localStorage.getItem('saved_games')
      ? JSON.parse(localStorage.getItem('saved_games'))
      : [];
  
    return savedGameIds;
  };
  
  export const saveGameIds = (gameIdArr) => {
    if (gameIdArr.length) {
      localStorage.setItem('saved_games', JSON.stringify(gameIdArr));
    } else {
      localStorage.removeItem('saved_games');
    }
  };