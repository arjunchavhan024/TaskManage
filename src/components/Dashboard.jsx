import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TaskColumn from './TaskColumn';
import TaskForm from './TaskForm';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreate = async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      setTasks([response.data, ...tasks]);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updates);
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const groupTasksByStatus = () => {
    return {
      'To Do': tasks.filter(task => task.status === 'To Do'),
      'In Progress': tasks.filter(task => task.status === 'In Progress'),
      'Done': tasks.filter(task => task.status === 'Done')
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  const groupedTasks = groupTasksByStatus();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100 mt-1">Manage your tasks efficiently</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowTaskForm(true)}
              className="btn-primary bg-green-600 hover:bg-green-700"
            >
              + Add Task
            </button>
            <button
              onClick={logout}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-gray-700">To Do</h3>
            <p className="text-3xl font-bold text-red-600">{groupedTasks['To Do'].length}</p>
          </div>
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-gray-700">In Progress</h3>
            <p className="text-3xl font-bold text-yellow-600">{groupedTasks['In Progress'].length}</p>
          </div>
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-gray-700">Done</h3>
            <p className="text-3xl font-bold text-green-600">{groupedTasks['Done'].length}</p>
          </div>
        </div>

        {/* Task Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TaskColumn
            title="To Do"
            tasks={groupedTasks['To Do']}
            status="To Do"
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            colorClass="border-red-400"
          />
          <TaskColumn
            title="In Progress"
            tasks={groupedTasks['In Progress']}
            status="In Progress"
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            colorClass="border-yellow-400"
          />
          <TaskColumn
            title="Done"
            tasks={groupedTasks['Done']}
            status="Done"
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            colorClass="border-green-400"
          />
        </div>

        {/* Add Task Modal */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <TaskForm
                onSubmit={handleTaskCreate}
                onCancel={() => setShowTaskForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;