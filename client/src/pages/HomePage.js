import React from 'react';

import Games from '../components/Games';
import  SearchGames  from '../components/SearchGames';

const HomePage = () => {
    return (
        <>
            <div>
                <SearchGames />
            </div>
            <div>
                <Games />
            </div>
        </>
    )
}

export default HomePage;