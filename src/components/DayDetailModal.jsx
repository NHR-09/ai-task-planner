import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import PlannerCard from './PlannerCard';
import styles from '../styles/DayDetailModal.module.css';

const DayDetailModal = ({ date, planners, onClose, onPlannerClick }) => {
  const colors = ['red', 'blue', 'green', 'purple', 'orange'];

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2>{date}</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {planners.length > 0 ? (
            <div className={`${styles.cards} cards`}>
              {planners.map((planner, index) => (
                <PlannerCard
                  key={planner.id}
                  planner={planner}
                  color={colors[index % colors.length]}
                  onClick={() => onPlannerClick(planner)}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No planners for this day</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DayDetailModal;