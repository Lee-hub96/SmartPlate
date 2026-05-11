import React, { useState, useEffect } from 'react';
import { ShoppingBasket, CheckCircle2, Circle, RefreshCw, ShoppingCart, Tag } from 'lucide-react';
import axios from 'axios';

interface GroceryItem {
  id: string;
  item_name: string;
  category: string;
  bought: boolean;
}

const GroceryList: React.FC = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId] = useState('default-user');

  useEffect(() => {
    fetchGroceryList();
  }, []);

  const fetchGroceryList = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/grocery/${userId}`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching grocery list:', error);
    }
  };

  const generateList = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/grocery/generate', { userId });
      setItems(response.data.items);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error generating list');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = async (itemId: string, currentStatus: boolean) => {
    try {
      await axios.patch(`http://localhost:5000/api/grocery/${userId}/${itemId}`, {
        bought: !currentStatus
      });
      setItems(items.map(item => 
        item.id === itemId ? { ...item, bought: !currentStatus } : item
      ));
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const groupedItems = items.reduce((acc: any, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Smart Grocery List</h1>
          <p className="text-gray-500">Based on your current meal plan and pantry stock.</p>
        </div>
        <button 
          onClick={generateList}
          disabled={loading}
          className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-green-300"
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Sync with Plan
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center">
          <img src="/illustrations/empty_grocery_list.svg" alt="Empty Grocery List" className="h-48 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-800">Your grocery list is empty</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Generate a meal plan first, then sync it here to see what you need for the week.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedItems).map((category) => (
            <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center">
                <Tag className="h-4 w-4 text-green-600 mr-2" />
                <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">{category}</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {groupedItems[category].map((item: GroceryItem) => (
                  <div 
                    key={item.id} 
                    onClick={() => toggleItem(item.id, item.bought)}
                    className="flex items-center px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    {item.bought ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500 mr-4" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-300 mr-4 group-hover:text-green-400" />
                    )}
                    <span className={`text-gray-700 ${item.bought ? 'line-through text-gray-400' : 'font-medium'}`}>
                      {item.item_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroceryList;
