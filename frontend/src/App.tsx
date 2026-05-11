import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import MealPlanner from './pages/MealPlanner';
import GroceryList from './pages/GroceryList';
import PantryScan from './pages/PantryScan';
import FitnessMode from './pages/FitnessMode';
import BudgetMode from './pages/BudgetMode';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="planner" element={<MealPlanner />} />
          <Route path="grocery" element={<GroceryList />} />
          <Route path="pantry" element={<PantryScan />} />
          <Route path="fitness" element={<FitnessMode />} />
          <Route path="budget" element={<BudgetMode />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
