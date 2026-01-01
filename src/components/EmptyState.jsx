import React from 'react';
import { motion } from 'framer-motion';
import { Ghost } from 'lucide-react'; // Or any icon
import styles from '../styles/EmptyState.module.css';

const EmptyState = ({ message }) => {
  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.iconWrapper}>
        <Ghost size={48} strokeWidth={1} />
      </div>
      <p className={styles.message}>{message}</p>
    </motion.div>
  );
};

export default EmptyState;
