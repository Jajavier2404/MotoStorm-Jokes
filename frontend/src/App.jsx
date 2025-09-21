import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Jokes from './pages/Jokes';
import CarStore from './pages/CarStore';
import Meteorogia from './pages/Meteorogia';

function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/jokes" element={<Jokes />} />
          <Route path="/car-store" element={<CarStore />} />
          <Route path="/weather" element={<Meteorogia />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;