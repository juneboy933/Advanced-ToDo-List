import React, { useEffect, useState } from 'react'

const Todo = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState('')
    const [priority, setPriority] = useState('Low');
    const [filterPriority, setFilterPriority] = useState('All');
    const [sortOrder, setSortOrder] = useState('asc');
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
       const savedTasks = localStorage.getItem('tasks');
       if(savedTasks) {
        setTasks(JSON.parse(savedTasks));
       }
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) setTheme(savedTheme);
    }, []);

    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    const addItem = () => {
        if(title || deadline !== '') {
            const newTask = {
                title: title,
                deadline: deadline,
                priority: priority,
            };
            setTasks([...tasks, newTask]);
            setTitle('');
            setDeadline('');
            setPriority('Low');
        } else {
            return alert('Enter your task and deadline!');
        }
    };

    const deleteItem = (indexToRemove) => {
        setTasks(tasks.filter((_, index) => index !== indexToRemove));
    };

    const getDisplayedTasks = () => {
        let filtered = tasks;

        if(filterPriority !== 'All') {
            filtered = filtered.filter(task => task.priority === filterPriority);
        }

        return filtered.sort((a,b) => {
            const dateA = new Date(a.deadline);
            const dateB = new Date(b.deadline);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    };


  return (
    <div className='container'>
        <div className="heading">
            <h2>To-Do List</h2>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}> Switch to {theme === 'dark' ? 'light' : 'dark'} Mode</button>

        </div>
        <div className="inputFields">
        <input 
            type="text"
            value={title}
            placeholder='Enter task title'
            onChange={(e) => setTitle(e.target.value)}/>
        <input 
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)} />
        <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
        </select>
        <button 
            onClick={addItem}>Add Task</button>
        </div>

        <div>
            <label>Filter by Priority</label>
            <select 
                onChange={(e) => setFilterPriority(e.target.value)}
                value={filterPriority}>
                    <option value="All">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>

                <label>Sort by Deadline: </label>
                <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
        </div>

        <ul>
        {getDisplayedTasks().map((task, index) => (
            <li key={index} className={task.priority}>
                {task.title} - {task.deadline} - {task.priority}
                <button onClick={() => deleteItem(index)}>Delete</button>
            </li>
            ))}
        </ul>
    </div>
  );
};

export default Todo
