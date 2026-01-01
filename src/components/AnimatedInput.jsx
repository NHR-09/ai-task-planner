import React from 'react';
import styles from '../styles/AnimatedInput.module.css';

const AnimatedInput = ({ value, onChange, placeholder, ...props }) => {
  return (
    <div className={styles.formControl}>
      <input 
        className={`${styles.input} ${styles.inputAlt}`} 
        placeholder={placeholder} 
        type="text" 
        value={value}
        onChange={onChange}
        {...props}
      />
      <span className={`${styles.inputBorder} ${styles.inputBorderAlt}`} />
    </div>
  );
};

export default AnimatedInput;
