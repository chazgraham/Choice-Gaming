import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, CardColumns } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { QUERY_USERS} from '../utils/queries';

const UserList = () => {
    const {  data } = useQuery(QUERY_USERS);
    const users = data?.users || [];

    if (!users.length) {
        return <h3>No users Yet</h3>;
    }

    return (
        <>
            <Container>
                <h3>Explore other Users!</h3>
                <CardColumns>
                    {users.map(users => (
                        <Card className='user-cards' key={users._id}>
                            <Card.Body>
                                <Card.Title>
                                    <Link
                                        to={`/profile/${users.username}`}
                                        style={{ fontWeight: 700 }}
                                    >
                                        {users.username}
                                    </Link>{' '}
                                </Card.Title>
                            </Card.Body>
                        </Card>
                    ))}
                </CardColumns>
            </Container>
        </>
    );
};

export default UserList;