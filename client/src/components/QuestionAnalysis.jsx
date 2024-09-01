import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/QuestionAnalysis.module.css';

const QuestionAnalysis = () => {
  const { quizId, userId } = useParams();
  const location = useLocation();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Quiz ID:', quizId);
    if (quizId) {
      setLoading(true);
      axios.get(`https://quizbuilderapp-1iew.onrender.com/quizzes/${quizId}/questions`)
        .then(response => {
          console.log('API Response:', response.data);
          setQuizData(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching quiz questions:', error.response ? error.response.data : error.message);
          setError('Failed to fetch quiz questions.');
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError('No quiz ID provided.');
    }
  }, [quizId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!quizData) {
    return <div>No quiz data available</div>;
  }

  // Determine which tab is active
  const isActive = (path) => location.pathname === path ? styles.active : '';

  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString('en-GB', options);
    const [day, month, year] = formattedDate.split(' ');
    return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)}, ${year}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h1 className={styles.heading}>QUIZZIE</h1>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link
                to={`/dashboard/${userId}`}
                className={isActive(`/dashboard/${userId}`)}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to={`/dashboard/${userId}/analysis`}
                className={isActive(`/dashboard/${userId}/analysis`)}
              >
                Analysis
              </Link>
            </li>
            <li>
              <Link
                className={`${styles.linkButton}`}
                to={`/dashboard/${userId}/create-quiz`}
              >
                Create Quiz
              </Link>
            </li>
          </ul>
        </nav>
        <hr className={styles.separator} />
        <button className={styles.logoutBtn} onClick={() => {/* Handle Logout */}}>
          Logout
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>{quizData.quizName} Question Analysis</h2>
          <div className={styles.meta}>
            <p>Created On: {formatDate(quizData.createdOn)}</p>
            <p>Impressions: {quizData.views}</p>
          </div>
        </div>
        <div className={styles.questions}>
          {quizData.questions.length > 0 ? (
            quizData.questions.map((question, index) => (
              <React.Fragment key={index}>
                <div className={styles.questionBlock}>
                  <h3>Q. {index + 1} {question.questionText}</h3>
                  {/* Conditional Rendering based on quiz type */}
                  {quizData.quizType === 'poll' ? (
                    // Poll Type Rendering
                    <div className={styles.optionStats}>
                      {question.optionCounts.map((option, idx) => (
                        <div key={idx} className={styles.optionStatBox}>
                          <p>{option.option}: {option.count} votes</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Q&A Type Rendering
                    <div className={styles.stats}>
                      <div className={styles.statBox}>
                        <p>{question.attemptedCount}</p>
                        <span>People Attempted the question</span>
                      </div>
                      <div className={styles.statBox}>
                        <p>{question.correctCount}</p>
                        <span>People Answered Correctly</span>
                      </div>
                      <div className={styles.statBox}>
                        <p>{question.incorrectCount}</p>
                        <span>People Answered Incorrectly</span>
                      </div>
                    </div>
                  )}
                </div>
                <hr className={styles.questionSeparator} />
              </React.Fragment>
            ))
          ) : (
            <div>No questions available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionAnalysis;
