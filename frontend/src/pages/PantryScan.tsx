import React, { useState, useEffect } from 'react';
import { Upload, Camera, Trash2, Plus, Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface PantryItem {
  id: string;
  item_name: string;
  quantity: string;
}

const PantryScan: React.FC = () => {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [userId] = useState('default-user');

  useEffect(() => {
    fetchPantry();
  }, []);

  const fetchPantry = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/pantry/${userId}`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching pantry:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setScanning(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', userId);

    try {
      const response = await axios.post('http://localhost:5000/api/pantry/scan', formData);
      setItems([...items, ...response.data.items]);
    } catch (error) {
      console.error('Error scanning pantry:', error);
    } finally {
      setScanning(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/pantry/${userId}/${itemId}`);
      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Camera className="mr-2 text-green-600" />
            Scan Pantry
          </h2>
          <p className="text-gray-600 mb-6">
            Upload a photo of your pantry or fridge ingredients. Our AI will automatically identify what you have.
          </p>
          
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileUpload}
              accept="image/*"
              disabled={scanning}
            />
            {scanning ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 text-green-500 animate-spin mb-2" />
                <p className="text-sm font-medium text-gray-700">AI is analyzing your photo...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Current Pantry Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <CheckCircle className="mr-2 text-green-600" />
              In Your Pantry
            </h2>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
              {items.length} Items
            </span>
          </div>

          <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <img src="/illustrations/empty_pantry.svg" alt="Empty Pantry" className="h-32 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400 italic">Your pantry is empty. Scan a photo to get started!</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 group hover:border-green-200 transition-colors">
                  <div>
                    <span className="font-medium text-gray-800">{item.item_name}</span>
                    <span className="text-xs text-gray-500 ml-2">({item.quantity})</span>
                  </div>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
          
          <button className="w-full mt-4 flex items-center justify-center py-2 border-2 border-dashed border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 hover:text-green-600 hover:border-green-200 transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Add Item Manually
          </button>
        </div>
      </div>
    </div>
  );
};

export default PantryScan;
