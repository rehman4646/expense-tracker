import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ViewExpenses from './components/ViewExpenses';
import AddExpense from './components/AddExpense';
import EditExpense from './components/EditExpense';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const isAuthenticated = user && token;

  return (
    <BrowserRouter>
      {isAuthenticated && <Sidebar />}

      <div className='main-content' style={{ marginLeft: '20%', marginTop: '50px' }}>
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="view-expenses" element={<ViewExpenses />} />
              <Route path="add-expense" element={<AddExpense />} />
              <Route path="edit-expense/:id" element={<EditExpense />} />
              <Route path="dashboard" element={<Dashboard />} />
            </>
          ) : (
            <>
              < Route path="/" element={<Login />} />
              <Route path="sign-up" element={<SignUp />} />
            </>
          )}
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={4000} />
    </BrowserRouter>
  );
}

export default App;
