import React, { useEffect, useState } from 'react';
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { TbFileDescription } from "react-icons/tb";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function EditExpense() {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState(false);

  const { id } = useParams();   
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpense = async () => {
      const token = JSON.parse(localStorage.getItem("token"));
      let result = await fetch(`http://localhost:5000/get-expense/${id}`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      result = await result.json();
      if (result.success) {
        setCategory(result.data.expense_category);
        setAmount(result.data.amount);
        setDate(result.data.date.split("T")[0]); // yyyy-mm-dd format for input
      }
    };
    fetchExpense();
  }, [id]);

  const handleExpense = async (e) => {
    e.preventDefault();
    if (!category || !amount || !date) {
      setError(true);
      return;
    }

    const token = JSON.parse(localStorage.getItem("token"));
    let result = await fetch(`http://localhost:5000/update-expense/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ expense_category: category, amount, date }),
    });
    result = await result.json();

    if (result.success) {
      toast.success("Expense Updated Successfully!");
      navigate("/view-expenses");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="d-flex justify-content-center mx-auto ">
      <div className="col-sm-12 col-xl-7 text-center shadow">
        <div className="bg-light rounded h-100 p-4">
          <h2 className="mb-4">Edit Expense</h2>

          <form onSubmit={handleExpense}>
          
            <div className="input-group mb-3">
              <span className="input-group-text"><HiOutlineBuildingOffice2 /></span>
              <select
                className={`form-select ${error && !category ? 'is-invalid' : ''}`}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">-- Select Expense Category --</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Shopping">Shopping</option>
              </select>
              <div className="invalid-feedback text-start ps-5">*Select Expense Category</div>
            </div>

       
            <div className="input-group mb-3">
              <span className="input-group-text"><i className="bi bi-cash-coin"></i></span>
              <input
                type="number"
                className={`form-control ${error && !amount ? 'is-invalid' : ''}`}
                placeholder="Amount"
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
              />
              <div className="invalid-feedback text-start ps-5">*Enter Amount</div>
            </div>

           
            <div className="input-group mb-3">
              <span className="input-group-text"><TbFileDescription /></span>
              <input
                type="date"
                className={`form-control ${error && !date ? 'is-invalid' : ''}`}
                onChange={(e) => setDate(e.target.value)}
                value={date}
              />
              <div className="invalid-feedback text-start ps-5">*Select Date</div>
            </div>

            <button className="btn btn-primary w-100 mt-4" type="submit">Update</button>
          </form>
        </div>
      </div>
    </div>
  )
}
