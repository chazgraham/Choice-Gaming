import React from 'react';

import { useQuery } from '@apollo/client';
import { QUERY_USERS} from '../utils/queries';
import UserList from '../components/UserList';
import { popularGames } from '../utils/gamesApi';


const HomePage = () => {

    const {  data } = useQuery(QUERY_USERS);
    const users = data?.users || [];
    console.log(users);
    console.log(popularGames)


    return (
        <>
            <div className='col-1 mb-3'>
                <UserList users={users} title="Other users!" />
            </div>
        </>
    )
}

export default HomePage;