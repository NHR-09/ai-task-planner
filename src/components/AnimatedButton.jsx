import React from 'react';
import styles from '../styles/AnimatedButton.module.css';

const AnimatedButton = ({ onClick, children }) => {
  return (
    <button className={styles.cta} onClick={onClick}>
      <span>{children}</span>
      <svg width="15px" height="10px" viewBox="0 0 13 10">
        <path d="M1,5 L11,5" />
        <polyline points="8 1 12 5 8 9" />
      </svg>
    </button>
  );
};

export default AnimatedButton;
