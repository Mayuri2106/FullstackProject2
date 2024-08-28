import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/SignupForm.module.css';

function SignupForm({ onSignupSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear individual field error on change
  };

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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
      await axios.post('http://localhost:5000/signup', formData);
      onSignupSuccess(); // Notify AuthPage to switch to login view
    } catch (err) {
      setErrors({ global: err.response?.data?.message || 'An error occurred' });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {errors.global && <p className={styles.error}>{errors.global}</p>}
      <div className={styles.formGroup}>
        <label className={styles.label}>Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          className={`${styles.inputField} ${errors.email ? styles.errorInput : ''}`}
          placeholder={errors.name || ''}
        />
      </div>
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
      <div className={styles.formGroup}>
        <label className={styles.label}>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          className={`${styles.inputField} ${errors.email ? styles.errorInput : ''}`}
          placeholder={errors.confirmPassword || ''}
        />
      </div>
      <button className={styles.submitBtn} type="submit">Sign Up</button>
    </form>
  );
}

export default SignupForm;
