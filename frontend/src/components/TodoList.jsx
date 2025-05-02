import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, deleteTodo, setTodos, updateTodo } from "../redux/todosSlice";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { FaList } from "react-icons/fa";

function TodoList() {
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [todosLoading, setTodosLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { todos } = useSelector((state) => state.todos);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const todofiletrs = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token]);

  const fetchTodos = async () => {
    setTodosLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setTodos(response.data));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load todos";
      toast.error(errorMessage);
    } finally {
      setTodosLoading(false);
    }
  };

  const handleAddTodo = async () => {
    // if (!newTodo.trim()) {
    //   toast.warning("Todo title cannot be empty");
    //   return;
    // }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5001/api/todos/add",
        { title: newTodo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(addTodo(response.data));
      setNewTodo("");
      toast.success("Todo added successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to add todo";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/todos/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(deleteTodo(id));
      toast.success("Todo deleted successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete todo";
      toast.error(errorMessage);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/todos/update/${id}`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(updateTodo(response.data));
      toast.success("Todo updated successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update todo";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Successfully logged out!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 space-y-5">
          <div class="flex justify-center mb-8">
            <div class="bg-indigo-600 rounded-full p-3">
              <FaList className="h-10 w-10 text-white mx-auto" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">TODO LIST</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search note..."
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 bg-white rounded-l-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
            />
            <button
              onClick={handleAddTodo}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-3 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? <BeatLoader color="#ffffff" size={8} /> : "Add"}
            </button>
          </div>

          {todosLoading ? (
            <div className="flex justify-center items-center py-12">
              <BeatLoader color="#3B82F6" size={15} />
            </div>
          ) : (
            <div className="space-y-3">
              {todofiletrs.map((todo) => (
                <div
                  key={todo._id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        handleToggleComplete(todo._id, todo.completed)
                      }
                      className={`flex-shrink-0 h-5 w-5 rounded border flex items-center justify-center ${
                        todo.completed
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {todo.completed && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                    <span
                      className={`${
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-gray-700"
                      }`}
                    >
                      {todo.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              {todofiletrs.length === 0 && !todosLoading && (
                <div className="text-center py-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="mt-4 text-gray-500">
                    {searchTerm
                      ? "No matching tasks found"
                      : "No tasks yet. Add your first todo above!"}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="text-center pt-4">
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center mx-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoList;
