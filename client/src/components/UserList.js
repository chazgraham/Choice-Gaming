import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, CardColumns } from 'react-bootstrap';

const UserList = ({ users, username }) => {
    if (!users.length) {
        return <h3>No users Yet</h3>;
    }

    return (
        <>
            <Container>
                <h3>Users</h3>
                <CardColumns>
                    {users.map(users => (
                        <Card key={users._id}>
                            <Card.Body >
                                <Card.Title>
                                    <Link
                                        to={`/profile/${users.username}`}
                                        style={{ fontWeight: 700 }}
                                        className="text-dark"
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