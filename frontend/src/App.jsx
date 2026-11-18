

import { useState } from 'react'
import './App.css'

function App() {
  // Controls whether the Add Task form is visible
  const [showForm, setShowForm] = useState(false)

  // Stores all tasks
  const [tasks, setTasks] = useState([])

  // Stores the values entered in the form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'Medium'
  })

  // Handles changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert('Please enter a task title!')
      return
    }

    const newTask = {
      id: Date.now(),
      ...formData,
      status: 'Pending'
    }

    setTasks([...tasks, newTask])

    setFormData({
      title: '',
      description: '',
      due_date: '',
      priority: 'Medium'
    })

    setShowForm(false)
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">FlowMint</h2>

        <nav>
          <a href="#" className="active">Dashboard</a>
          <a href="#">My Tasks</a>
          <a href="#">Calendar</a>
          <a href="#">Completed</a>
        </nav>

        <div className="sidebar-bottom">
          <p>Make every day flow.</p>
        </div>
      </aside>

      {/* Main dashboard */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's your productivity overview.</p>
          </div>

          <button
  className="add-task-btn"
  onClick={() => setShowForm(true)}
>
  + Add Task
</button>
        </header>


{/* Add Task Form */}
{showForm && (
  <section className="form-section">
    <h2>Create a New Task</h2>

    <form onSubmit={handleSubmit}>
      <label>Task Title</label>
      <input
        type="text"
        name="title"
        placeholder="What do you need to do?"
        value={formData.title}
        onChange={handleChange}
      />

      <label>Description</label>
      <textarea
        name="description"
        placeholder="Add some details..."
        value={formData.description}
        onChange={handleChange}
      />

      <label>Due Date</label>
      <input
        type="date"
        name="due_date"
        value={formData.due_date}
        onChange={handleChange}
      />

      <label>Priority</label>
      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <div className="form-buttons">
        <button type="submit" className="add-task-btn">
          Save Task
        </button>

        <button
          type="button"
          className="cancel-btn"
          onClick={() => setShowForm(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  </section>
)}


        {/* Task summary */}
        
<section className="summary">
  <div className="summary-card">
    <p>Total Tasks</p>
    <h2>{tasks.length}</h2>
  </div>

  <div className="summary-card">
    <p>Pending</p>
    <h2>{tasks.filter((task) => task.status === 'Pending').length}</h2>
  </div>

  <div className="summary-card">
    <p>Completed</p>
    <h2>{tasks.filter((task) => task.status === 'Completed').length}</h2>
  </div>
</section>


        {/* Task list */}
        
{/* Task list */}
<section className="tasks-section">
  <h2>My Tasks</h2>

  {tasks.length === 0 ? (
    <p className="empty-message">
      No tasks yet. Add your first task to get started!
    </p>
  ) : (
    <div className="task-list">
      {tasks.map((task) => (
        <div className="task-card" key={task.id}>
          <div>
            <h3>{task.title}</h3>
            <p>{task.description}</p>

            <div className="task-details">
              <span>Due: {task.due_date || 'No due date'}</span>
              <span>Priority: {task.priority}</span>
              <span>Status: {task.status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</section>

      </main>
    </div>
  )
}

export default App
