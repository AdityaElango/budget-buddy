import Header from "./components/Header"
import PublicHeader from "./components/PublicHeader"
import React, { useContext } from 'react';
import {Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Login from "./components/Login/Login";
import About from "./components/About/About";
import Signup from "./components/Signup/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import Transaction from "./components/Transaction/Transaction";
import Accounts from "./components/Accounts/Accounts";
import Budget from "./components/Budget/Budget";
import Analysis from "./components/Analysis/Analysis";
import Recurring from "./components/Recurring/Recurring";
import Goals from "./components/Goals/Goals";
import Profile from "./components/Profile/Profile";
import Error from "./components/Error"
import ProtectedRoute from "./components/Common/ProtectedRoute";
import { LoginContext } from "./components/Context/Context";

// Page transition animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3
};

function App() {
  const location = useLocation();
  const { isAuthenticated } = useContext(LoginContext);

  return (
    <>
    {isAuthenticated ? <Header/> : <PublicHeader/>}
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <About/>
          </motion.div>
        }/>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dash" replace /> : (
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Login/>
            </motion.div>
          )
        }/>
        <Route path="/signup" element={
          isAuthenticated ? <Navigate to="/dash" replace /> : (
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Signup/>
            </motion.div>
          )
        }/>
        <Route path="/dash" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          </motion.div>
        }/>
        <Route path="/transaction" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ProtectedRoute>
              <Transaction/>
            </ProtectedRoute>
          </motion.div>
        }/>
        <Route path="/accounts" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ProtectedRoute>
              <Accounts/>
            </ProtectedRoute>
          </motion.div>
        }/>
        <Route path="/budget" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ProtectedRoute>
              <Budget/>
            </ProtectedRoute>
          </motion.div>
        }/>
        <Route path="/analysis" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ProtectedRoute>
              <Analysis/>
            </ProtectedRoute>
          </motion.div>
        }/>
        <Route path="/recurring" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ProtectedRoute>
              <Recurring/>
            </ProtectedRoute>
          </motion.div>
        }/>
        <Route path="/goals" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ProtectedRoute>
              <Goals/>
            </ProtectedRoute>
          </motion.div>
        }/>
        <Route path="/profile" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          </motion.div>
        }/>
        <Route path="*" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Error/>
          </motion.div>
        }/>
      </Routes>
    </AnimatePresence>
    </>
  );
}

export default App;
