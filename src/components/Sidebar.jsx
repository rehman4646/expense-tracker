import React from 'react'
import { MdDashboard } from "react-icons/md";
import { GiExpense } from "react-icons/gi";
import { PiUsersThreeFill } from "react-icons/pi";
import { MdPayments } from "react-icons/md";
import { IoLogInSharp } from "react-icons/io5";
import { FaFileInvoice, FaFileSignature } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import expenseLogo from '../assets/images/expense_tracker_logo.png'


export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate(`/`)
    window.location.href = '/';
  }


  return (
    <div className="sidebar pe-4 pb-3" style={{ width: '20%', position: 'fixed', height: '100vh', left: 0, top: 0, backgroundColor: '#ebf2f9', overflowY: 'auto', zIndex: 1000 }} >
      <nav className="navbar bg-light navbar-light">

        <div className="d-flex align-items-center ms-4 mb-4">
          <div className="position-relative">
            <img
              className="rounded-circle"
              src={expenseLogo}
              alt=""
              style={{ width: '40px', height: '40px' }}
            />
           
          </div>
          <div className="ms-3 mt-2">
            <h6 className="mb-0">Expense Tracker</h6>
            <span>Admin</span>
          </div>
        </div>

        <div className="navbar-nav w-100">

          <a href="/dashboard" className="nav-item nav-link">
            <i className="me-2"><MdDashboard className='fs-5' /></i>Dashboard
          </a>

          <a href="/view-expenses" className="nav-item nav-link">
            <i className="me-2"><GiExpense className='fs-5' /></i>View Expenses
          </a>

          <div className="nav-item nav-link cursor-pointer" onClick={logout}>
            <i className="me-2"><IoLogInSharp className='fs-5' /></i>Logout
          </div>
        </div>
      </nav>
    </div>
  );
}
