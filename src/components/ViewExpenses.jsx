import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ViewExpenses() {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();


  const fetchExpenses = async () => {
    const token = JSON.parse(localStorage.getItem('token'))

    let result = await fetch(`http://localhost:5000/get-expenses-current-month`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    result = await result.json();
    if (result.success) {
      setExpenses(result.data)
    }
  }
  useEffect(() => {
    fetchExpenses();
  }, [])

  const deleteExpense = async (id) => {
    const token = JSON.parse(localStorage.getItem("token"));

    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    let result = await fetch(`http://localhost:5000/delete-expense/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    result = await result.json();
    if (result.success) {
      alert("Expense deleted successfully!");
      fetchExpenses();  // refresh expenses
    } else {
      alert(result.message);
    }
  };

  const addExpense = () => {
    navigate("/add-expense");
  };
  const updateExpense = (id) => {
    navigate(`/edit-expense/${id}`);
  };

  return (
    <div className="mt-0 pt-0">
      <div className="col-sm-12 col-lg-10 col-md-8 col-xl-10 mx-auto">
        <div className="bg-light rounded h-100 p-4">
          <div className="row d-flex align-items-center">
            <div className="col-2 mb-2"></div>
            <div className="col-6 mb-6 text-center">
              <h2 className="mb-0">Current Month Expense</h2>
            </div>
            <div className="col-4 mb-3 text-end">
              <button
                type="button"
                className="btn btn-primary rounded-pill py-2 px-4"
                onClick={addExpense}
              >
                Add Expense
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Expense Name</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Date</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No expenses found. Please add your first expense.
                    </td>
                  </tr>
                ) : (
                  expenses.map((exp, index) => (
                    <tr key={exp.id}>
                      <td>{index + 1}</td>
                      <td>{exp.expense_category}</td>
                      <td>{exp.amount}</td>
                      <td>{new Date(exp.date).toLocaleDateString()}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary px-4 fs-6 rounded-pill me-2"
                          onClick={() => updateExpense(exp.id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger px-3 fs-6 rounded-pill"
                          onClick={() => deleteExpense(exp.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
