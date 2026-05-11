import React, { useState, useEffect } from 'react';
import { User, Mail, Settings, Shield, Bell, LogOut, ChevronRight, Save, Camera } from 'lucide-react';
import axios from 'axios';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userId] = useState('default-user');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/profile/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/users/profile/${userId}`, {
        name: profile.name,
        email: profile.email,
        preferences: profile.preferences
      });
      alert('Profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <div className="w-32 h-32 rounded-3xl bg-green-100 flex items-center justify-center text-green-600 font-bold text-4xl overflow-hidden border-4 border-white shadow-lg">
            {profile.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <button className="absolute bottom-2 right-2 p-2 bg-gray-900 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
          <p className="text-gray-500">{profile.email}</p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider border border-green-100">
              {profile.fitness_goal.replace('_', ' ')}
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
              Pro Member
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleUpdate}
          disabled={loading}
          className="px-8 py-3 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-colors flex items-center shadow-lg shadow-green-100"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <User className="mr-2 text-green-600 h-5 w-5" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                <input 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Settings className="mr-2 text-green-600 h-5 w-5" />
              Dietary Preferences
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Gluten Free', 'Dairy Free', 'Nut Free', 'Low Carb', 'Low Sugar', 'No Red Meat'].map(pref => (
                <div key={pref} className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <input type="checkbox" className="w-5 h-5 rounded-md border-gray-300 text-green-600 focus:ring-green-500" />
                  <span className="ml-3 text-sm font-medium text-gray-700">{pref}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <nav className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {[
              { icon: Shield, name: 'Privacy & Security' },
              { icon: Bell, name: 'Notifications' },
              { icon: Settings, name: 'App Settings' }
            ].map((item, idx) => (
              <button key={idx} className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 text-gray-400 mr-4" />
                  <span className="font-bold text-gray-700">{item.name}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300" />
              </button>
            ))}
          </nav>

          <button className="w-full flex items-center justify-center p-6 bg-red-50 text-red-600 rounded-3xl font-bold hover:bg-red-100 transition-colors">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
