
import { useState } from 'react'
import './App.css'

function App() {
  const [showForm, setShowForm] = useState(false)
  const [tasks, setTasks] = useState([])
  const [editingTaskId, setEditingTaskId] = useState(null)

  // Search, filter and sorting states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [sortOption, setSortOption] = useState('recent')

  // Calendar states
  const [displayedMonth, setDisplayedMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'Medium'
  })

  // Format a date as YYYY-MM-DD
  const formatDateKey = (year, month, day) => {
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')

    return `${year}-${mm}-${dd}`
  }

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Open form for adding a task
  const handleAddTask = () => {
    setFormData({
      title: '',
      description: '',
      due_date: '',
      priority: 'Medium'
    })

    setEditingTaskId(null)
    setShowForm(true)
  }

  // Open form for editing a task
  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      due_date: task.due_date || '',
      priority: task.priority
    })

    setEditingTaskId(task.id)
    setShowForm(true)
  }

  // Save or update a task
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert('Please enter a task title!')
      return
    }

    if (editingTaskId !== null) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId
            ? { ...task, ...formData }
            : task
        )
      )
    } else {
      const newTask = {
        id: Date.now(),
        ...formData,
        status: 'Pending'
      }

      setTasks([...tasks, newTask])
    }

    handleCancel()
  }

  // Reset and close the form
  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      due_date: '',
      priority: 'Medium'
    })

    setEditingTaskId(null)
    setShowForm(false)
  }

  // Toggle task status
  const handleToggleStatus = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status:
                task.status === 'Completed'
                  ? 'Pending'
                  : 'Completed'
            }
          : task
      )
    )
  }

  // Delete a task
  const handleDelete = (taskId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this task?'
    )

    if (confirmDelete) {
      setTasks(tasks.filter((task) => task.id !== taskId))
    }
  }

  // Search and filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' || task.status === statusFilter

    const matchesPriority =
      priorityFilter === 'All' || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Sort filtered tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === 'earliest') {
      if (!a.due_date) return 1
      if (!b.due_date) return -1
      return a.due_date.localeCompare(b.due_date)
    }

    if (sortOption === 'latest') {
      if (!a.due_date) return 1
      if (!b.due_date) return -1
      return b.due_date.localeCompare(a.due_date)
    }

    if (sortOption === 'priority') {
      const priorityOrder = {
        High: 3,
        Medium: 2,
        Low: 1
      }

      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }

    if (sortOption === 'recent') {
      return b.id - a.id
    }

    return 0
  })

  // Calendar calculations
  const calendarYear = displayedMonth.getFullYear()
  const calendarMonth = displayedMonth.getMonth()

  const firstDay = new Date(
    calendarYear,
    calendarMonth,
    1
  ).getDay()

  // Convert Sunday-first to Monday-first
  const startingDay = (firstDay + 6) % 7

  const daysInMonth = new Date(
    calendarYear,
    calendarMonth + 1,
    0
  ).getDate()

  const calendarDays = [
    ...Array(startingDay).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => index + 1
    )
  ]

  const monthName = displayedMonth.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  })

  const today = new Date()
  const todayKey = formatDateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  // Find tasks for the selected calendar date
  const selectedDateTasks = selectedDate
    ? tasks.filter((task) => task.due_date === selectedDate)
    : []

  // Move to previous month
  const previousMonth = () => {
    setDisplayedMonth(
      new Date(calendarYear, calendarMonth - 1, 1)
    )
    setSelectedDate(null)
  }

  // Move to next month
  const nextMonth = () => {
    setDisplayedMonth(
      new Date(calendarYear, calendarMonth + 1, 1)
    )
    setSelectedDate(null)
  }

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">FlowMint</h2>

        <nav className="nav-links">
          <p className="nav-item active">Dashboard</p>
          <p className="nav-item">My Tasks</p>
          <p className="nav-item">Completed</p>
          <p className="nav-item">Calendar</p>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Top Bar */}
        <header className="topbar">
          <div>
            <h1>My Dashboard</h1>
            <p>Organize your day, one task at a time.</p>
          </div>

          <button
            className="add-task-btn"
            onClick={handleAddTask}
          >
            + Add Task
          </button>
        </header>

        {/* Add / Edit Form */}
        {showForm && (
          <section className="form-section">
            <h2>
              {editingTaskId !== null
                ? 'Edit Task'
                : 'Create a New Task'}
            </h2>

            <form onSubmit={handleSubmit}>
              <label>Task Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter task title"
                value={formData.title}
                onChange={handleChange}
              />

              <label>Description</label>
              <textarea
                name="description"
                placeholder="Enter task description"
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
                  {editingTaskId !== null
                    ? 'Update Task'
                    : 'Save Task'}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Task Summary */}
        <section className="summary">
          <div className="summary-card">
            <p>Total Tasks</p>
            <h2>{tasks.length}</h2>
          </div>

          <div className="summary-card">
            <p>Pending</p>
            <h2>
              {tasks.filter(
                (task) => task.status === 'Pending'
              ).length}
            </h2>
          </div>

          <div className="summary-card">
            <p>Completed</p>
            <h2>
              {tasks.filter(
                (task) => task.status === 'Completed'
              ).length}
            </h2>
          </div>
        </section>

        {/* Calendar View */}
        <section className="calendar-section">

          <div className="calendar-header">
            <h2>Task Calendar</h2>

            <div className="calendar-navigation">
              <button
                onClick={previousMonth}
                className="calendar-nav-btn"
              >
                &#8592;
              </button>

              <h3>{monthName}</h3>

              <button
                onClick={nextMonth}
                className="calendar-nav-btn"
              >
                &#8594;
              </button>
            </div>
          </div>

          {/* Calendar Weekdays */}
          <div className="calendar-grid">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
              (day) => (
                <div className="calendar-weekday" key={day}>
                  {day}
                </div>
              )
            )}

            {/* Calendar Dates */}
            {calendarDays.map((day, index) => {
              if (day === null) {
                return (
                  <div
                    className="calendar-empty"
                    key={`empty-${index}`}
                  />
                )
              }

              const dateKey = formatDateKey(
                calendarYear,
                calendarMonth,
                day
              )

              const dayTasks = tasks.filter(
                (task) => task.due_date === dateKey
              )

              const isToday = dateKey === todayKey
              const isSelected = dateKey === selectedDate

              return (
                <button
                  key={dateKey}
                  className={`calendar-day
                    ${isToday ? 'today' : ''}
                    ${isSelected ? 'selected-day' : ''}
                    ${dayTasks.length > 0 ? 'has-tasks' : ''}
                  `}
                  onClick={() => setSelectedDate(dateKey)}
                >
                  <span>{day}</span>

                  {dayTasks.length > 0 && (
                    <span className="calendar-task-count">
                      {dayTasks.length} task
                      {dayTasks.length > 1 ? 's' : ''}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Selected Date Tasks */}
          <div className="selected-date-section">
            {selectedDate === null ? (
              <p>Select a date to view its tasks.</p>
            ) : (
              <>
                <h3>
                  Tasks for {selectedDate}
                </h3>

                {selectedDateTasks.length === 0 ? (
                  <p>No tasks scheduled for this date.</p>
                ) : (
                  <div className="calendar-task-list">
                    {selectedDateTasks.map((task) => (
                      <div
                        className="calendar-task-item"
                        key={task.id}
                      >
                        <div>
                          <strong>{task.title}</strong>
                          <p>
                            {task.priority} Priority | {task.status}
                          </p>
                        </div>

                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(task)}
                        >
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

        </section>

        {/* Search, Filters and Sorting */}
        <section className="filter-section">

          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>

          <select
            className="filter-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="recent">Recently Added</option>
            <option value="earliest">Due Date: Earliest First</option>
            <option value="latest">Due Date: Latest First</option>
            <option value="priority">Priority: High to Low</option>
          </select>

        </section>

        {/* Task List */}
        <section className="tasks-section">
          <h2>My Tasks</h2>

          {sortedTasks.length === 0 ? (
            <p className="empty-message">
              {tasks.length === 0
                ? 'No tasks yet. Add your first task to get started!'
                : 'No matching tasks found. Try changing your search or filters.'}
            </p>
          ) : (
            <div className="task-list">
              {sortedTasks.map((task) => (
                <div
                  className={`task-card ${
                    task.status === 'Completed'
                      ? 'completed-task'
                      : ''
                  }`}
                  key={task.id}
                >
                  <div className="task-content">
                    <h3>{task.title}</h3>

                    <p>
                      {task.description || 'No description provided'}
                    </p>

                    <div className="task-details">
                      <span>
                        Due: {task.due_date || 'No due date'}
                      </span>

                      <span>Priority: {task.priority}</span>
                      <span>Status: {task.status}</span>
                    </div>
                  </div>

                  {/* Task Actions */}
                  <div className="task-actions">
                    <button
                      className="complete-btn"
                      onClick={() => handleToggleStatus(task.id)}
                    >
                      {task.status === 'Completed'
                        ? 'Mark Pending'
                        : 'Complete'}
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </button>
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
