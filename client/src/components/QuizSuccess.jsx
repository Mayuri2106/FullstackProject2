import React from 'react';
import styles from '../styles/QuizSuccess.module.css';
import { FaCheckCircle } from 'react-icons/fa';

const QuizSuccess = ({  handleShare, handleClose, message }) => {
  return (
    <div className={styles.successContainer}>
      <div className={styles.successHeader}>
        <button className={styles.cancelButton} onClick={handleClose}>
          &times;
        </button>
      </div>
      {message && (
        <div className={styles.copyMessage}>
          <FaCheckCircle className={styles.tickIcon} />
          {message}
        </div>
      )}

      <div className={styles.content}>
        <h2>Congrats your quiz is Published!</h2>
      </div>

      <input
        type="text"
        readOnly
        placeholder="Your link is here"
        className={styles.linkInput}
      />
      <button className={styles.shareButton} onClick={handleShare}>
        Share
      </button>
    </div>
  );
};

export default QuizSuccess;
