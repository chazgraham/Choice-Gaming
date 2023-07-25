import React, { useState } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import { Nav, Modal, Tab } from 'react-bootstrap';
import SignUpForm from '../SignUp/SignupForm';
import LoginForm from '../Login/LoginForm';

import Auth from '../../utils/auth';

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className='header'>
    
          <Link to='/' className='nav_link'><h1 className='title'>Game Seeker</h1></Link>

        <div>
          <ul className='nav_list'>
            {Auth.loggedIn() ? (
              <>
                <Link to='/users' className='nav_link'><li>Friends</li></Link>
                <Link to='/profile' className='nav_link'><li>Profile</li></Link>
                <Link onClick={Auth.logout} className='nav_link'><li>Logout</li></Link>
              </>
            ) : (
              <Link onClick={() => setShowModal(true)} className='nav_link'><li>Login/Sign Up</li></Link>
            )}
          </ul>
        </div>
      </section>
      <section>
        <Modal
          size='lg'
          show={showModal}
          onHide={() => setShowModal(false)}
          aria-labelledby='signup-modal'>
          {/* tab container to do either signup or login component */}
          <Tab.Container defaultActiveKey='login'>
            <Modal.Header closeButton>
              <Modal.Title id='signup-modal'>
                <Nav variant='pills'>
                  <Nav.Item>
                    <Nav.Link eventKey='login'>Login</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Tab.Content>
                <Tab.Pane eventKey='login'>
                  <LoginForm handleModalClose={() => setShowModal(false)} />
                </Tab.Pane>
                <Tab.Pane eventKey='signup'>
                  <SignUpForm handleModalClose={() => setShowModal(false)} />
                </Tab.Pane>
              </Tab.Content>
            </Modal.Body>
          </Tab.Container>
        </Modal>
      </section>
    </>
  );
};

export default AppNavbar;
