import React, { useState, useEffect } from 'react';
import { DollarSign, PieChart, TrendingDown, AlertTriangle, Save, DollarSign as MoneyIcon } from 'lucide-react';
import axios from 'axios';

interface BudgetData {
  weekly_budget: number;
  total_estimate: number;
  items_with_prices: any[];
}

const BudgetMode: React.FC = () => {
  const [budget, setBudget] = useState<number>(100);
  const [data, setData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId] = useState('default-user');

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/budget/${userId}`);
      setData(response.data);
      setBudget(response.data.weekly_budget);
    } catch (error) {
      console.error('Error fetching budget data:', error);
    }
  };

  const handleUpdateBudget = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/budget/${userId}`, {
        weeklyBudget: budget
      });
      fetchBudgetData();
    } catch (error) {
      console.error('Error updating budget:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <div className="p-8 text-center">Loading budget data...</div>;

  const percentUsed = Math.min((data.total_estimate / data.weekly_budget) * 100, 100);
  const isOverBudget = data.total_estimate > data.weekly_budget;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header & Settings */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <DollarSign className="mr-2 text-green-600" />
            Budget Management
          </h1>
          <p className="text-gray-500 mt-1">Set and track your weekly grocery spending.</p>
        </div>
        
        <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Weekly Limit</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input 
                type="number" 
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="pl-7 pr-4 py-2 w-32 bg-white border border-gray-200 rounded-lg font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <button 
            onClick={handleUpdateBudget}
            disabled={loading}
            className="mt-5 p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300"
          >
            <Save className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Weekly Budget</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">${data.weekly_budget.toFixed(2)}</h3>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-full opacity-20"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Estimated Cost</p>
          <h3 className={`text-2xl font-bold mt-1 ${isOverBudget ? 'text-red-500' : 'text-gray-800'}`}>
            ${data.total_estimate.toFixed(2)}
          </h3>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`} 
              style={{ width: `${percentUsed}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Remaining</p>
          <h3 className={`text-2xl font-bold mt-1 ${isOverBudget ? 'text-red-500' : 'text-green-600'}`}>
            ${(data.weekly_budget - data.total_estimate).toFixed(2)}
          </h3>
          <div className="mt-4 flex items-center text-xs">
            {isOverBudget ? (
              <span className="flex items-center text-red-500 font-bold">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Over budget by ${(data.total_estimate - data.weekly_budget).toFixed(2)}
              </span>
            ) : (
              <span className="flex items-center text-green-600 font-bold">
                <TrendingDown className="h-3 w-3 mr-1" />
                Under budget
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cost Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <PieChart className="mr-2 text-green-600 h-5 w-5" />
              Itemized Breakdown
            </h2>
          </div>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {data.items_with_prices.length === 0 ? (
              <div className="text-center py-12 text-gray-400 italic">
                No items in your grocery list yet.
              </div>
            ) : (
              data.items_with_prices.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 mr-3">
                      <MoneyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{item.item_name}</p>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">{item.category}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-700">${item.price.toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Savings Advice */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Smart Savings Advice</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <p className="text-sm font-bold text-green-800 mb-1">Bulk Buy Suggestion</p>
              <p className="text-xs text-green-700 leading-relaxed">
                Buying Oats in a 1kg bag instead of small sachets could save you approximately $1.50 per week.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm font-bold text-blue-800 mb-1">Seasonal Alternatives</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Blueberries are currently out of season. Replacing them with frozen berries or seasonal apples will save you $2.00.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
              <p className="text-sm font-bold text-purple-800 mb-1">Store Brand Match</p>
              <p className="text-xs text-purple-700 leading-relaxed">
                We found a store-brand alternative for your Almond Milk that costs $1.00 less with identical nutrition.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-900 rounded-2xl text-white">
            <p className="text-sm text-gray-400">Projected Monthly Savings</p>
            <h4 className="text-3xl font-bold mt-1 text-green-400">$18.40</h4>
            <button className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold transition-colors">
              Apply All Savings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetMode;
