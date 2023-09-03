import React, { ChangeEvent, FormEvent, useState } from 'react';
import Form from './Form';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { revenueActions, RevenueData } from '../store/slices/revenueSlice';

const Revenue = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.revenue.data);
  const [monthValues, setMonthValues] = useState<string[]>(data.map((d) => d.month));
  const [yearValues, setYearValues] = useState<number[]>(data.map((d) => d.year));
  const [amountValues, setAmountValues] = useState<number[]>(data.map((d) => d.amount));
  const [values, setValues] = useState<RevenueData>({
    month: 'October',
    year: 2023,
    amount: 600,
  });
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setMonthValues(data.map((d) => d.month));
    setYearValues(data.map((d) => d.year));
    setAmountValues(data.map((d) => d.amount));
    setIsEditing(false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const newValues = data.map((month, index) => ({
      month: monthValues[index],
      year: yearValues[index],
      amount: amountValues[index],
    }));
    dispatch(revenueActions.updateData(newValues));
    setIsEditing(false);
  };

  const handleDelete = (revData: RevenueData) => {
    const index = data.findIndex((item) => item.month === revData.month);
    const newData = [...data];
    newData.splice(index, 1);
    dispatch(revenueActions.removeData(revData));
    setMonthValues(newData.map((d) => d.month));
    setYearValues(newData.map((d) => d.year));
    setAmountValues(newData.map((d) => d.amount));
  };

  const handleMonthChange = (index: number, month: string) => {
    setMonthValues(monthValues.map((m, i) => (i === index ? month : m)));
  };

  const handleYearChange = (index: number, year: number) => {
    setYearValues(yearValues.map((y, i) => (i === index ? year : y)));
  };

  const handleAmountChange = (index: number, amount: number) => {
    setAmountValues(amountValues.map((a, i) => (i === index ? amount : a)));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleAdding = () => {
    setIsAdding(true);
  };

  const handleCancelAddingData = () => {
    setIsAdding(false);
  };

  const handleSubmitAddingData = (event: FormEvent) => {
    event.preventDefault();
    dispatch(revenueActions.addData(values));
    setIsAdding(false);
  };

  const content = (
    <div className="flex flex-col gap-5">
      <ul className="flex flex-col gap-2">
        {data.map((month, index) => (
          <li key={month.month} className="flex gap-3">
            <input
              value={monthValues[index]}
              onChange={(event) => {
                handleMonthChange(index, event.target.value);
              }}
              type="text"
              name="month"
              className="bg-amber-100 rounded-md outline-none"
            />
            <input
              value={yearValues[index]}
              onChange={(event) => {
                handleYearChange(index, parseInt(event.target.value));
              }}
              type="number"
              name="year"
              className="bg-amber-100 rounded-md outline-none"
            />
            <input
              value={amountValues[index]}
              onChange={(event) => {
                handleAmountChange(index, parseInt(event.target.value));
              }}
              type="number"
              name="amount"
              className="bg-amber-100 rounded-md outline-none"
            />
            <button
              onClick={() => handleDelete(month)}
              className="w-fit p-4 rounded-md bg-gray-500"
              type="button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2 justify-between">
        <button onClick={handleAdding} className="w-fit p-1 bg-gray-400 rounded-md">
          Add data
        </button>
        <div className="flex gap-4 justify-end">
          <button className="w-fit p-4 rounded-md bg-amber-100" type="submit">
            Save
          </button>
          <button onClick={handleCancel} className="w-fit p-4 rounded-md bg-gray-500" type="button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const contentAddData = (
    <div className="flex flex-col gap-5">
      <div className="flex gap-4">
        <input
          value={values.month}
          onChange={handleChange}
          type="text"
          name="month"
          placeholder="month"
          className="bg-amber-100 rounded-md outline-none"
        />
        <input
          value={values.year}
          onChange={handleChange}
          type="number"
          name="year"
          placeholder="year"
          className="bg-amber-100 rounded-md outline-none"
        />
        <input
          value={values.amount}
          onChange={handleChange}
          type="number"
          name="amount"
          placeholder="amount"
          className="bg-amber-100 rounded-md outline-none"
        />
      </div>
      <div className="flex gap-4 justify-end">
        <button className="w-fit p-4 rounded-md bg-amber-100" type="submit">
          Save
        </button>
        <button
          onClick={handleCancelAddingData}
          className="w-fit p-4 rounded-md bg-gray-500"
          type="button"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <>
      {isEditing ? (
        <Form content={content} onSubmit={handleSubmit} />
      ) : isAdding ? (
        <Form content={contentAddData} onSubmit={handleSubmitAddingData} />
      ) : (
        <div className="flex flex-col gap-2">
          <ul className="flex flex-col gap-2">
            {data.map((month) => (
              <li key={month.month} className="flex gap-4">
                <p>
                  {month.month} {month.year}
                </p>
                <p>${month.amount}</p>
              </li>
            ))}
          </ul>
          <button onClick={handleEdit} className="w-fit p-1 bg-gray-400 rounded-md">
            Edit
          </button>
        </div>
      )}
    </>
  );
};

export default Revenue;
