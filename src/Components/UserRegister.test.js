import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserRegister from './UserRegister';

jest.mock('axios');

describe('UserRegister Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('User Register Page', () => {
    render(
      <Router>
        <UserRegister />
      </Router>
    );

    expect(screen.getByText('Register'));
  });



  test('handles Home button click', () => {
    render(
      <Router>
        <UserRegister />
      </Router>
    );

    fireEvent.click(screen.getByText('🏡 Home'));

    
  });
});
