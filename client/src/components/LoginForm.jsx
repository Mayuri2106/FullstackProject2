import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/LoginForm.module.css';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await axios.post('https://quizbuilderapp-1iew.onrender.com/login', formData);
      console.log("Login successful, response data:", res.data);

      // Extract the user ID from the response
      const userId = res.data._id;

      // On successful login, navigate to the user-specific DashboardPage
      navigate(`/dashboard/${userId}`);
    } catch (err) {
      console.error("Login error:", err);
      setErrors({ global: err.response?.data?.message || 'An error occurred' });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {errors.global && <p className={styles.error}>{errors.global}</p>}
      <div className={styles.formGroup}>
        <label className={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          className={`${styles.inputField} ${errors.email ? styles.errorInput : ''}`}
          placeholder={errors.email || ''}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          className={`${styles.inputField} ${errors.email ? styles.errorInput : ''}`}
          placeholder={errors.password || ''}
        />
      </div>
      <button className={styles.submitBtn} type="submit">Log In</button>
    </form>
  );
}

export default LoginForm;
