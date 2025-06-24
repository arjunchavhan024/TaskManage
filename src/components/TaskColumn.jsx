import React from 'react';
import TaskCard from './TaskCard';

const TaskColumn = ({ title, tasks, status, onTaskUpdate, onTaskDelete, colorClass }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'To Do':
        return 'bg-red-50 border-red-200';
      case 'In Progress':
        return 'bg-yellow-50 border-yellow-200';
      case 'Done':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getHeaderColor = () => {
    switch (status) {
      case 'To Do':
        return 'text-red-700 bg-red-100';
      case 'In Progress':
        return 'text-yellow-700 bg-yellow-100';
      case 'Done':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className={`rounded-lg border-2 ${getStatusColor()} p-4 min-h-96`}>
      <div className={`flex items-center justify-between mb-4 p-3 rounded-lg ${getHeaderColor()}`}>
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm font-medium">{tasks.length}</span>
      </div>
      
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks in {title.toLowerCase()}</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onTaskUpdate={onTaskUpdate}
              onTaskDelete={onTaskDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumn;