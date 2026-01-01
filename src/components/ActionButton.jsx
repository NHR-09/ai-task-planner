import React from 'react';
import styles from '../styles/ActionButton.module.css';

const ActionButton = ({ onClick, children, className }) => {
  return (
    <button className={`${styles.uiBtn} ${className || ''}`} onClick={onClick}>
      <span>
        {children}
      </span>
    </button>
  );
};

export default ActionButton;