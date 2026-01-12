import React, { createContext, useEffect, useMemo, useState } from 'react';

export const LoginContext = createContext("");
export const ExpenseContext = createContext("");
export const DateContext = createContext({});

const getInitialMonthYear = () => {
  const now = new Date();
  const storedMonth = Number(localStorage.getItem("bb_selectedMonth"));
  const storedYear = Number(localStorage.getItem("bb_selectedYear"));

  return {
    month: storedMonth >= 1 && storedMonth <= 12 ? storedMonth : now.getMonth() + 1,
    year: storedYear > 2000 ? storedYear : now.getFullYear(),
  };
};

const Context = ({ children }) => {
  const [logindata, setLoginData] = useState("");
  const [expensedata, setExpenseData] = useState("");

  const initial = useMemo(() => getInitialMonthYear(), []);
  const [selectedMonth, setSelectedMonth] = useState(initial.month);
  const [selectedYear, setSelectedYear] = useState(initial.year);

  useEffect(() => {
    localStorage.setItem("bb_selectedMonth", String(selectedMonth));
    localStorage.setItem("bb_selectedYear", String(selectedYear));
  }, [selectedMonth, selectedYear]);

  const dateValue = useMemo(
    () => ({ selectedMonth, selectedYear, setSelectedMonth, setSelectedYear }),
    [selectedMonth, selectedYear]
  );

  // Single source of truth for auth state across app components
  const isAuthenticated = useMemo(
    () => Boolean(logindata && logindata.ValidUserOne && localStorage.getItem("usersdatatoken")),
    [logindata]
  );

  return (
    <LoginContext.Provider value={{ logindata, setLoginData, isAuthenticated }}>
      <ExpenseContext.Provider value={{ expensedata, setExpenseData }}>
        <DateContext.Provider value={dateValue}>
          {children}
        </DateContext.Provider>
      </ExpenseContext.Provider>
    </LoginContext.Provider>
  );
};

export default Context;
