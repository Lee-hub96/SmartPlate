import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Zap, Info, Clock, Flame } from 'lucide-react';
import axios from 'axios';

interface Meal {
  id: string;
  day: string;
  meal_type: string;
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const MealPlanner: React.FC = () => {
  const [mealPlan, setMealPlan] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId] = useState('default-user');
  const [fitnessGoal] = useState('weight_loss'); // This would come from user profile

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner'];

  useEffect(() => {
    fetchMealPlan();
  }, []);

  const fetchMealPlan = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/meals/plans/${userId}`);
      if (response.data.length > 0) {
        setMealPlan(response.data);
      }
    } catch (error) {
      console.error('Error fetching meal plan:', error);
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/meals/generate', {
        userId,
        fitnessGoal
      });
      setMealPlan(response.data.plan);
    } catch (error) {
      console.error('Error generating meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMeal = (day: string, type: string) => {
    return mealPlan.find(m => m.day === day && m.meal_type === type);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Weekly Meal Plan</h1>
          <p className="text-gray-500">Personalized for <span className="font-semibold text-green-600 capitalize">{fitnessGoal.replace('_', ' ')}</span></p>
        </div>
        <button 
          onClick={generatePlan}
          disabled={loading}
          className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-green-300"
        >
          {loading ? (
            <Zap className="h-5 w-5 mr-2 animate-pulse" />
          ) : (
            <Zap className="h-5 w-5 mr-2" />
          )}
          {mealPlan.length > 0 ? 'Regenerate Plan' : 'Generate Weekly Plan'}
        </button>
      </div>

      {mealPlan.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center">
          <img src="/illustrations/meal_plan_onboarding.svg" alt="Meal Plan Onboarding" className="h-48 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-800">No meal plan generated yet</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Click the button above to create your personalized 7-day plan with AI-powered recipe suggestions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {days.map((day) => (
            <div key={day} className="space-y-4">
              <div className="bg-green-50 text-green-700 font-bold text-center py-2 rounded-lg text-sm border border-green-100">
                {day}
              </div>
              {mealTypes.map((type) => {
                const meal = getMeal(day, type);
                return (
                  <div key={`${day}-${type}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">{type}</span>
                      <Info className="h-3 w-3 text-gray-300 cursor-help" />
                    </div>
                    <h4 className="font-bold text-sm text-gray-800 mb-3 leading-tight">{meal?.title || 'No meal'}</h4>
                    <div className="flex items-center text-xs text-gray-500 space-x-3">
                      <div className="flex items-center">
                        <Flame className="h-3 w-3 text-orange-400 mr-1" />
                        {meal?.calories}
                      </div>
                      <div className="flex items-center font-medium">
                        <span className="text-blue-500 mr-1">P:</span> {meal?.protein}g
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {mealPlan.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
          <div>
            <h5 className="text-blue-800 font-semibold text-sm">Pro Tip</h5>
            <p className="text-blue-700 text-xs mt-1">
              Your meal plan is synced with your Grocery List. Head over there to see what you need to buy for the week!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
