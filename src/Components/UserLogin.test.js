import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserLogin from './UserLogin';

jest.mock('axios');

describe('UserLogin Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders the UserLogin component', () => {
    render(
      <Router>
        <UserLogin />
      </Router>
    );

    expect(screen.getByText('User Login'));
  });

  test('Sign In Page', () => {
    render(
      <Router>
        <UserLogin />
      </Router>
    );

    expect(screen.getByText('Sign in'));
  });



  test('handles Home button click', () => {
    render(
      <Router>
        <UserLogin />
      </Router>
    );

    fireEvent.click(screen.getByText('🏡 Home'));

    
  });
});
