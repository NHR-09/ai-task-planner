export const generatePlan = async (goal, days, userId) => {
  try {
    const response = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ goal, days, userId })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating plan:', error);
    return {
      id: Date.now().toString(),
      goal,
      totalDays: days,
      days: Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        title: `Day ${i + 1}: ${goal}`,
        tasks: [
          { id: `d${i}-t1`, text: `Task 1 for ${goal} (Day ${i + 1})`, completed: false },
          { id: `d${i}-t2`, text: `Task 2 for ${goal} (Day ${i + 1})`, completed: false },
          { id: `d${i}-t3`, text: `Task 3 for ${goal} (Day ${i + 1})`, completed: false },
        ]
      }))
    };
  }
};

export const savePlan = async (plan, userId) => {
  try {
    console.log('💾 Saving plan to Firebase:', { plan: plan.goal, userId });
    const response = await fetch(`/api/plans?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plan)
    });
    
    if (!response.ok) {
      console.error('❌ Failed to save plan:', response.status);
      throw new Error('Failed to save plan');
    }
    
    const savedPlan = await response.json();
    console.log('✅ Plan saved successfully:', savedPlan.id);
    return savedPlan;
  } catch (error) {
    console.error('❌ Error saving plan:', error);
    return plan;
  }
};

export const deletePlan = async (planId, userId) => {
  try {
    console.log('🗑️ Deleting plan:', planId, 'for user:', userId);
    const response = await fetch(`/api/plans?userId=${userId}&planId=${planId}`, {
      method: 'DELETE'
    });
    
    console.log('📡 Delete response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Delete failed:', response.status, errorText);
      return false;
    }
    
    const result = await response.json();
    console.log('✅ Delete result:', result);
    return result.success;
  } catch (error) {
    console.error('❌ Error deleting plan:', error);
    return false;
  }
};
export const getUserPlans = async (userId) => {
  try {
    console.log('🔍 Fetching plans for user:', userId);
    const response = await fetch(`/api/plans?userId=${userId}`);
    
    if (!response.ok) {
      console.error('❌ Failed to fetch plans:', response.status);
      throw new Error('Failed to fetch plans');
    }
    
    const plans = await response.json();
    console.log('📋 Fetched plans:', plans.length, 'plans found');
    return plans;
  } catch (error) {
    console.error('❌ Error fetching plans:', error);
    return [];
  }
};
