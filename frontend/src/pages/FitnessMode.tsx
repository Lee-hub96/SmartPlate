import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, Target, Info, Flame, Trophy, Leaf, Zap } from 'lucide-react';
import axios from 'axios';

const FitnessMode: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState('weight_loss');
  const [loading, setLoading] = useState(false);
  const [userId] = useState('default-user');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/fitness/${userId}`);
      if (response.data.fitness_goal) {
        setSelectedGoal(response.data.fitness_goal);
      }
    } catch (error) {
      console.error('Error fetching fitness profile:', error);
    }
  };

  const handleGoalSelect = async (goalId: string) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/fitness/${userId}`, {
        fitnessGoal: goalId
      });
      setSelectedGoal(goalId);
    } catch (error) {
      console.error('Error updating fitness goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const goals = [
    {
      id: 'weight_loss',
      title: 'Weight Loss',
      description: 'Focus on a calorie deficit and high-volume, low-calorie foods.',
      icon: Flame,
      illustration: '/illustrations/fitness/weight_loss.svg',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      activeColor: 'bg-orange-500',
      stats: '500 cal deficit | Balanced Macros'
    },
    {
      id: 'bulking',
      title: 'Bulking',
      description: 'Calorie surplus to support muscle growth and strength gains.',
      icon: Trophy,
      illustration: '/illustrations/fitness/bulking.svg',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      activeColor: 'bg-blue-500',
      stats: '300 cal surplus | High Protein'
    },
    {
      id: 'high_protein',
      title: 'High Protein',
      description: 'Maximum protein intake to maintain lean mass and satiety.',
      icon: Zap,
      illustration: null,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      activeColor: 'bg-purple-500',
      stats: '150g+ Protein | Moderate Carbs'
    },
    {
      id: 'keto',
      title: 'Keto',
      description: 'Very low carb, high fat diet to induce ketosis for fat burning.',
      icon: Target,
      illustration: null,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      activeColor: 'bg-red-500',
      stats: '<20g Net Carbs | High Fat'
    },
    {
      id: 'vegan',
      title: 'Vegan',
      description: 'Purely plant-based meal plans with balanced amino acid profiles.',
      icon: Leaf,
      illustration: '/illustrations/fitness/vegan.svg',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      activeColor: 'bg-green-500',
      stats: 'Plant-Based | Whole Foods'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <Activity className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">Select Your Fitness Mode</h1>
        <p className="text-gray-500 mt-2 max-w-lg mx-auto">
          Your choice will customize your AI-generated meal plans, macro targets, and grocery lists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const isActive = selectedGoal === goal.id;
          
          return (
            <div 
              key={goal.id}
              onClick={() => handleGoalSelect(goal.id)}
              className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md ${
                isActive 
                  ? `${goal.borderColor} ${goal.bgColor} shadow-sm` 
                  : 'border-gray-100 bg-white hover:border-green-200'
              }`}
            >
              {isActive && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className={`h-6 w-6 ${goal.color}`} />
                </div>
              )}
              
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl flex-shrink-0 ${isActive ? 'bg-white' : goal.bgColor}`}>
                  {goal.illustration ? (
                    <img src={goal.illustration} alt={goal.title} className="h-12 w-12" />
                  ) : (
                    <Icon className={`h-8 w-8 ${goal.color}`} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{goal.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {goal.description}
                  </p>
                  <div className={`inline-flex items-center mt-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isActive ? goal.color + ' bg-white' : 'text-gray-400 bg-gray-100'}`}>
                    {goal.stats}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-green-600 p-6 rounded-2xl shadow-lg flex items-center justify-between text-white">
        <div className="flex items-center">
          <Info className="h-6 w-6 mr-4 opacity-80" />
          <div>
            <p className="font-medium">Ready to see your new plan?</p>
            <p className="text-sm text-green-100">Changing your mode will suggest new recipes in the Meal Planner.</p>
          </div>
        </div>
        <button 
          onClick={() => window.location.href = '/planner'}
          className="px-6 py-2 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors"
        >
          Go to Planner
        </button>
      </div>
    </div>
  );
};

export default FitnessMode;
