import React, { useState } from 'react';
import { motion } from 'framer-motion';
import HeroScene from '../components/HeroScene';
import MagneticButton from '../components/MagneticButton';
import styles from '../styles/LandingPage.module.css';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className={styles.container}>
      <HeroScene />
      <div className={styles.content}>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Plan Your Next <span className={styles.gradientText}>Breakthrough</span>
        </motion.h1>
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          AI-powered execution plans for your wildest goals.
        </motion.p>
        <MagneticButton onClick={onGetStarted}>
          Start Planning
        </MagneticButton>
      </div>
    </div>
  );
};

export default LandingPage;
