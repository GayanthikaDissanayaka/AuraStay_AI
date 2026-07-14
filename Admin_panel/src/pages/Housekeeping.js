import React, { useState } from 'react';
import { auth } from "../firebase/firebase";
import './Housekeeping.css';

const Housekeeping = () => {
  const [tasks, setTasks] = useState([
    { id: 1, room: '101', task: 'Clean room', status: 'Pending', priority: 'High', assignedTo: 'Maria' },
    { id: 2, room: '102', task: 'Change linens', status: 'In Progress', priority: 'Medium', assignedTo: 'John' },
    { id: 3, room: '201', task: 'Restock amenities', status: 'Completed', priority: 'Low', assignedTo: 'Sarah' },
    { id: 4, room: '202', task: 'Deep cleaning', status: 'Pending', priority: 'High', assignedTo: 'Mike' },
    { id: 5, room: '301', task: 'Vacuum', status: 'In Progress', priority: 'Medium', assignedTo: 'Lisa' },
  ]);

  const updateStatus = (id, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-progress';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className="housekeeping">
      <div className="housekeeping-header">
        <h2>Housekeeping Tasks</h2>
        <button className="add-task-btn">+ Assign New Task</button>
      </div>

      <div className="tasks-table-container">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Task</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.room}</td>
                <td>{task.task}</td>
                <td>
                  <span className={`task-status ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td>
                  <span className={`task-priority ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td>{task.assignedTo}</td>
                <td>
                  <select 
                    value={task.status} 
                    onChange={(e) => updateStatus(task.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Housekeeping;