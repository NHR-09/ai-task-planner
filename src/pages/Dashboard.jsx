import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Calendar, Settings, Home, Sparkles, Edit, FileText, X } from 'lucide-react';
import TaskInput from '../components/TaskInput';
import Timeline from '../components/Timeline';
import CalendarView from '../components/CalendarView';
import MagneticButton from '../components/MagneticButton';
import EmptyState from '../components/EmptyState';
import ManualPlanner from '../components/ManualPlanner';
import JsonImporter from '../components/JsonImporter';
import SettingsPage from './SettingsPage';
import styles from '../styles/Dashboard.module.css';

const SidebarItem = ({ icon: Icon, label, active, onClick, onDelete, showDelete }) => (
  <div 
    className={`${styles.sidebarItem} ${active ? styles.activeItem : ''}`}
    onClick={onClick}
  >
    <Icon size={20} />
    <span>{label}</span>
    {showDelete && (
      <button 
        className={styles.deleteBtn}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <X size={16} />
      </button>
    )}
    {active && <motion.div layoutId="activeTab" className={styles.activeGlow} />}
  </div>
);

const Dashboard = ({ user, onLogout }) => {
  const [view, setView] = useState('generator'); // 'generator', 'manual', 'json', 'planner', 'calendar'
  const [plans, setPlans] = useState([]); // Saved plans
  const [activePlanId, setActivePlanId] = useState(null); // ID of currently viewed saved plan
  const [generatedPlan, setGeneratedPlan] = useState(null); // Temporary preview plan
  const [loading, setLoading] = useState(false);
  const [plansLoaded, setPlansLoaded] = useState(false);

  // Load user plans when component mounts
  React.useEffect(() => {
    const loadUserPlans = async () => {
      if (user?.uid && !plansLoaded) {
        console.log('🔄 Loading plans for user:', user.uid);
        const { getUserPlans } = await import('../utils/mockData');
        const userPlans = await getUserPlans(user.uid);
        console.log('📋 Loaded plans:', userPlans);
        setPlans(userPlans);
        setPlansLoaded(true);
      }
    };
    loadUserPlans();
  }, [user?.uid, plansLoaded]);

  // --- Actions ---

  const handleGeneratePlan = async (goal, days) => {
    setLoading(true);
    const { generatePlan } = await import('../utils/mockData');
    const newPlan = await generatePlan(goal, days, user?.uid);
    // Don't override the ID if it already exists from the API
    if (!newPlan.id) {
      newPlan.id = Date.now().toString();
    }
    setGeneratedPlan(newPlan);
    setLoading(false);
  };

  const handleSavePlan = () => {
    if (generatedPlan) {
      setPlans([...plans, generatedPlan]);
      setGeneratedPlan(null);
      setView('planner');
      setActivePlanId(generatedPlan.id);
    }
  };

  const handleSaveManualPlan = async (plan) => {
    const { savePlan } = await import('../utils/mockData');
    const savedPlan = await savePlan(plan, user?.uid);
    setPlans([...plans, savedPlan]);
    setView('planner');
    setActivePlanId(savedPlan.id);
  };

  const handleImportJsonPlan = async (plan) => {
    const { savePlan } = await import('../utils/mockData');
    const savedPlan = await savePlan(plan, user?.uid);
    setPlans([...plans, savedPlan]);
    setView('planner');
    setActivePlanId(savedPlan.id);
  };

  const updatePlanState = (dayNum, updateFn) => {
    const updateLogic = (planToUpdate) => ({
      ...planToUpdate,
      days: planToUpdate.days.map(day => 
        day.day === dayNum 
          ? updateFn(day)
          : day
      )
    });

    if (view === 'planner' && activePlanId) {
      setPlans(plans.map(p => p.id === activePlanId ? updateLogic(p) : p));
    } else if (view === 'generator' && generatedPlan) {
      setGeneratedPlan(updateLogic(generatedPlan));
    }
  };

  const handleToggleTask = (dayNum, taskId) => {
    updatePlanState(dayNum, (day) => ({
      ...day,
      tasks: day.tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const handleEditTask = (dayNum, taskId, newText) => {
    updatePlanState(dayNum, (day) => ({
      ...day,
      tasks: day.tasks.map(task => 
        task.id === taskId ? { ...task, text: newText } : task
      )
    }));
  };

  const handleDeleteTask = (dayNum, taskId) => {
    updatePlanState(dayNum, (day) => ({
      ...day,
      tasks: day.tasks.filter(task => task.id !== taskId)
    }));
  };

  const handleAddTask = (dayNum) => {
    const newTask = {
      id: Date.now().toString(),
      text: 'New Task',
      completed: false
    };
    updatePlanState(dayNum, (day) => ({
      ...day,
      tasks: [...day.tasks, newTask]
    }));
  };

  const handleDeletePlan = async (planId) => {
    try {
      const { deletePlan } = await import('../utils/mockData');
      const success = await deletePlan(planId, user?.uid);
      
      if (success) {
        // Only remove from UI if database delete succeeded
        setPlans(plans.filter(p => p.id !== planId));
        if (activePlanId === planId) {
          setActivePlanId(null);
          setView('generator');
        }
      } else {
        console.error('Failed to delete plan from database');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const activePlan = plans.find(p => p.id === activePlanId);

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>AI Planner</div>
        <nav className={styles.nav}>
          <div className={styles.sectionTitle}>Create</div>
          <SidebarItem 
            icon={Sparkles} 
            label="AI Generator" 
            active={view === 'generator'} 
            onClick={() => setView('generator')} 
          />
          <SidebarItem 
            icon={Edit} 
            label="Manual Planner" 
            active={view === 'manual'} 
            onClick={() => setView('manual')} 
          />
          <SidebarItem 
            icon={FileText} 
            label="Import JSON" 
            active={view === 'json'} 
            onClick={() => setView('json')} 
          />
          
          <div className={styles.sectionTitle}>My Planners</div>
          {plans.map(plan => (
            <SidebarItem 
              key={plan.id}
              icon={Layout} 
              label={plan.goal} 
              active={view === 'planner' && activePlanId === plan.id} 
              onClick={() => {
                setView('planner');
                setActivePlanId(plan.id);
              }}
              onDelete={() => handleDeletePlan(plan.id)}
              showDelete={true}
            />
          ))}
          
          {plans.length === 0 && (
            <div className={styles.emptyNav}>
               <span style={{ fontSize: '0.9rem', color: '#666' }}>No plans yet</span>
            </div>
          )}

          <div className={styles.sectionTitle} style={{ marginTop: 'auto' }}>Tools</div>
          <SidebarItem 
            icon={Calendar} 
            label="Calendar" 
            active={view === 'calendar'} 
            onClick={() => setView('calendar')} 
          />
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            active={view === 'settings'} 
            onClick={() => setView('settings')} 
          />
        </nav>
      </aside>

      <main className={styles.main}>
        <AnimatePresence mode="wait">
          {view === 'generator' && (
            <motion.div 
              key="generator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={styles.contentContainer}
            >
              {!generatedPlan && !loading && (
                <TaskInput onSubmit={handleGeneratePlan} />
              )}
              
              {loading && (
                <div className={styles.loadingState}>
                  <div className={styles.spinner}></div>
                  <p>AI is crafting your plan...</p>
                </div>
              )}

              {generatedPlan && (
                <div className={styles.planView}>
                  <div className={styles.previewHeader}>
                    <h2>Preview: {generatedPlan.goal}</h2>
                    <div className={styles.previewActions}>
                      <button onClick={() => setGeneratedPlan(null)} className={styles.discardBtn}>Discard</button>
                      <MagneticButton onClick={handleSavePlan}>Save to Planners</MagneticButton>
                    </div>
                  </div>
                  <Timeline 
                    plan={generatedPlan} 
                    onToggleTask={handleToggleTask} 
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                    onAddTask={handleAddTask}
                  />
                </div>
              )}
            </motion.div>
          )}

          {view === 'manual' && (
            <motion.div 
              key="manual"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={styles.contentContainer}
            >
              <ManualPlanner 
                onSave={handleSaveManualPlan}
                onCancel={() => setView('generator')}
              />
            </motion.div>
          )}

          {view === 'json' && (
            <motion.div 
              key="json"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={styles.contentContainer}
            >
              <JsonImporter 
                onImport={handleImportJsonPlan}
                onCancel={() => setView('generator')}
              />
            </motion.div>
          )}

          {view === 'planner' && (
            <motion.div 
              key="planner"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={styles.contentContainer}
            >
              {activePlan ? (
                <Timeline 
                  plan={activePlan} 
                  onToggleTask={handleToggleTask} 
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={handleAddTask} 
                />
              ) : (
                <EmptyState message="Select a plan from the sidebar or generate a new one." />
              )}
            </motion.div>
          )}
          
          {view === 'calendar' && (
            <motion.div 
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ height: '100%' }}
            >
              <CalendarView 
                plan={activePlan || plans[0]} 
                allPlans={plans}
                onPlannerSelect={(plannerId) => {
                  setView('planner');
                  setActivePlanId(plannerId);
                }}
              />
            </motion.div>
          )}
          
          {view === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={styles.contentContainer}
            >
              <SettingsPage user={user} onLogout={onLogout} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
