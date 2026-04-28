import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RequestForm from './pages/RequestForm';
import Dashboard from './pages/Dashboard';
import './index.css';

const API_BASE_URL = 'http://localhost:5000';

export { API_BASE_URL };

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<RequestForm />} />
          <Route path="/admin" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;