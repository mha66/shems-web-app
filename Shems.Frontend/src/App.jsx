import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import List from './pages/List';
import Create from './pages/Create';
import Details from './pages/Details';

function App() {
  return (
    <div>
      {/* Basic Navigation Menu */}
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/items"> View Items</Link> | 
        <Link to="/items/new"> Add Item</Link>
      </nav>

      {/* Route Definitions */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/items" element={<List />} />
        <Route path="/items/new" element={<Create />} />
        <Route path="/items/:id" element={<Details />} />
      </Routes>
    </div>
  )
}

export default App;
