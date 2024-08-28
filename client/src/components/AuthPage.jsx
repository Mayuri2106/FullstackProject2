import React, { useState } from 'react';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import styles from '../styles/AuthPage.module.css'; // Import relevant CSS module

function AuthPage() {
  const [isSignup, setIsSignup] = useState(true);

  const handleSignupSuccess = () => {
    setIsSignup(false); // Switch to login view after successful signup
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1 className={styles.heading}>QUIZZIE</h1>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => setIsSignup(true)}
            className={`${styles.button1} ${isSignup ? styles.active : ''}`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setIsSignup(false)}
            className={`${styles.button1} ${!isSignup ? styles.active : ''}`}
          >
            Log In
          </button>
        </div>
        <div className={styles.formContainer}>
          {isSignup ? <SignupForm onSignupSuccess={handleSignupSuccess} /> : <LoginForm />}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
