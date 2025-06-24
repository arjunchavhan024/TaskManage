import React, { useState } from 'react';

const TaskCard = ({ task, onTaskUpdate, onTaskDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleStatusChange = (newStatus) => {
    onTaskUpdate(task.id, { status: newStatus });
  };

  const handleTitleUpdate = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onTaskUpdate(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTitleUpdate();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const getNextStatus = () => {
    switch (task.status) {
      case 'To Do':
        return 'In Progress';
      case 'In Progress':
        return 'Done';
      case 'Done':
        return 'To Do';
      default:
        return 'To Do';
    }
  };

  const getStatusButtonColor = () => {
    switch (task.status) {
      case 'To Do':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'In Progress':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Done':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="task-card group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleUpdate}
              onKeyDown={handleKeyPress}
              className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <h3 
              className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
              onClick={() => setIsEditing(true)}
            >
              {task.title}
            </h3>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Created: {formatDate(task.created_at)}
          </p>
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleStatusChange(getNextStatus())}
            className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${getStatusButtonColor()}`}
            title={`Move to ${getNextStatus()}`}
          >
            {getNextStatus()}
          </button>
          <button
            onClick={() => onTaskDelete(task.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;