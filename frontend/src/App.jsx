import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import TodoList from "./components/TodoList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  return (
    <Router>
      <AnimatePresence exitBeforeEnter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <Login />
              </motion.div>
            }
          />
          <Route
            path="/signup"
            element={
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <SignUp />
              </motion.div>
            }
          />
          <Route
            path="/todo"
            element={
              <motion.div
                key="todo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <TodoList />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
      <ToastContainer />
    </Router>
  );
}

export default App;
