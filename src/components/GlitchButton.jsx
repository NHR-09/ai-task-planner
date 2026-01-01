import React from 'react';
import styles from '../styles/GlitchButton.module.css';

const GlitchButton = ({ onClick, children }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};

export default GlitchButton;
