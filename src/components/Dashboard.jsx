import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    const [spendExpenses, setSpendExpenses] = useState('')
    const [overAllExpenses, setOverAllExpenses] = useState([]);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [currentMonExpense, setCurrentMonth] = useState([]);


    const fetchSpendExpenses = async () => {
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await fetch('http://localhost:5000/overall-spend-expenses', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
            setSpendExpenses(data.data);
        }
    };

    useEffect(() => {
        fetchSpendExpenses();
    }, []);

    const fetchOverAllExpenses = async () => {
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await fetch('http://localhost:5000/overall-category-expenses', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
            setOverAllExpenses(data.data);
        }
    };

    useEffect(() => {
        fetchOverAllExpenses();
    }, []);

    const fetchRecentExpenses = async () => {
        const token = JSON.parse(localStorage.getItem('token'))

        let result = await fetch(`http://localhost:5000/recent-expenses`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        result = await result.json();
        if (result.success) {
            setRecentExpenses(result.data); // fixed here
        }
    }
    useEffect(() => {
        fetchRecentExpenses();
    }, [])

    const fetchCurrentMonthExpenses = async () => {
        const token = JSON.parse(localStorage.getItem('token'))

        let result = await fetch(`http://localhost:5000/get-expenses-current-month`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        result = await result.json();
        if (result.success) {
            setCurrentMonth(result.data)
        }
    }
    useEffect(() => {
        fetchCurrentMonthExpenses();
    }, [])


    return (
        <div className="mt-0 pt-0">
            <div className="col-sm-12 col-lg-10 col-md-8 col-xl-10 mx-auto">
                <div className="bg-light rounded h-100 p-4">
                    <div className='text-center'>
                        <h1>Dashboard</h1>
                    </div>

                    <div className="row mt-5 mb-4 mx-auto d-flex justify-content-center">
                        <div className="col-12 tabs d-flex text-center items-center">
                            Total Spend Expenses : {spendExpenses}
                        </div>
                    </div>

                    <div className="mt-5">
                        <h4 className="text-center">Expenses by Category</h4>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={overAllExpenses} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="expense_category" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total_amount" fill="#2e3192" barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* recent expense */}
                    {recentExpenses.length > 0 &&
                        <div className="table-responsive mt-5">
                            <h4 className="text-center mb-3">Recent Expenses</h4>
                            <table className="table table-hover table-striped">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Expense Name</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentExpenses.map((exp, index) => (
                                        <tr key={exp.id}>
                                            <td>{index + 1}</td>
                                            <td>{exp.expense_category}</td>
                                            <td>{exp.amount}</td>
                                            <td>{new Date(exp.date).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }

                    {currentMonExpense.length > 0 &&
                        <div className="table-responsive mt-5">
                            <h4 className="text-center mb-3">Current Month Expenses</h4>
                            <table className="table table-hover table-striped">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Expense Name</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentMonExpense.map((exp, index) => (
                                        <tr key={exp.id}>
                                            <td>{index + 1}</td>
                                            <td>{exp.expense_category}</td>
                                            <td>{exp.amount}</td>
                                            <td>{new Date(exp.date).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
