import React from 'react';

import { useQuery } from '@apollo/client';
import { QUERY_USERS} from '../utils/queries';
import UserList from '../components/UserList';
import Games from '../components/Games';

const HomePage = () => {

    const {  data } = useQuery(QUERY_USERS);
    const users = data?.users || [];
    console.log(users);
    
    return (
        <>
            <div>
                <UserList users={users} title="Other users!" />
            </div>
            <div>
                <Games />
            </div>
        </>
    )
}

export default HomePage;