import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Flame, 
  Utensils, 
  ShoppingBag, 
  ChevronRight, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [userId] = useState('default-user');

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/dashboard/${userId}`);
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
    }
  };

  if (!summary) return <div className="p-8 text-center">Loading your dashboard...</div>;

  const budgetPercent = Math.min((summary.budget.current / summary.budget.limit) * 100, 100);

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Welcome back, John! 👋</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your nutrition today.</p>
        </div>
        <div className="flex -space-x-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
              U{i}
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-xs font-bold text-green-600">
            +12
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Today's Meals */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Utensils className="mr-2 text-green-600 h-5 w-5" />
                Today's Meal Plan
              </h2>
              <Link to="/planner" className="text-green-600 text-sm font-bold flex items-center hover:underline">
                View Full Week <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['breakfast', 'lunch', 'dinner'].map((type) => {
                const meal = summary.todayMeals.find((m: any) => m.meal_type === type);
                return (
                  <div key={type} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">{type}</span>
                    <h4 className="font-bold text-gray-800 mt-1 mb-3 line-clamp-2 min-h-[2.5rem]">
                      {meal?.title || 'No meal planned'}
                    </h4>
                    {meal && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center text-xs text-gray-500">
                          <Flame className="h-3 w-3 text-orange-400 mr-1" />
                          {meal.calories} kcal
                        </div>
                        <div className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded-md">
                          {meal.protein}g PRO
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Activity/Progress */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Nutrition Progress</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-gray-600">Daily Calories</span>
                  <span className="text-gray-400">1,250 / 2,100 kcal</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 rounded-full w-[60%]"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Protein</p>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[75%]"></div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Carbs</p>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[40%]"></div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fats</p>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 w-[55%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Status Cards */}
        <div className="space-y-6">
          {/* Budget Widget */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <ShoppingBag className="mr-2 text-green-600 h-5 w-5" />
              Budget Status
            </h3>
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-bold text-gray-800">${summary.budget.current.toFixed(2)}</span>
              <span className="text-xs text-gray-400 font-bold mb-1">OF ${summary.budget.limit}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div 
                className={`h-full rounded-full ${budgetPercent > 90 ? 'bg-red-500' : 'bg-green-500'}`} 
                style={{ width: `${budgetPercent}%` }}
              ></div>
            </div>
            <Link to="/budget" className="block text-center py-2 text-sm font-bold text-green-600 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
              Manage Budget
            </Link>
          </div>

          {/* Pantry Widget */}
          <div className="bg-gray-900 p-6 rounded-3xl shadow-lg text-white">
            <h3 className="font-bold mb-4 flex items-center text-green-400">
              <Activity className="mr-2 h-5 w-5" />
              Pantry Health
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Ingredients Tracked</span>
                <span className="font-bold">{summary.pantry.totalItems}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Last Scanned</span>
                <span className="text-xs font-bold text-gray-400 uppercase">2 Days Ago</span>
              </div>
            </div>
            <Link to="/pantry" className="block w-full mt-6 py-3 bg-green-600 text-center rounded-2xl font-bold hover:bg-green-700 transition-colors">
              Scan More
            </Link>
          </div>

          {/* Motivation Quote */}
          <div className="p-6 rounded-3xl bg-green-50 border border-green-100 flex flex-col items-center text-center">
            <img src="/illustrations/success_meal_plan.svg" alt="Success" className="h-20 mb-4" />
            <p className="italic text-green-800 text-sm leading-relaxed">
              "Your food is your fuel. You have 3 meals planned for today that perfectly match your weight loss goal. Let's do this!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
