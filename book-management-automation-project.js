Project Structure:

📁 test-automation-app
├── 📁 backend
│   ├── index.js
│   └── package.json
├── 📁 frontend
│   ├── 📁 src
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── index.css
│   │   └── 📁 components
│   │       ├── Login.js
│   │       └── BookList.js
│   └── package.json
├── 📁 tests
│   └── 📁 selenium
│       ├── test_login.py
│       ├── test_create_book.py
│       ├── test_edit_book.py
│       └── test_delete_book.py
├── 📁 docs
│   ├── README.md
│   └── TEST_PLAN.md
└── 📁 postman
    └── api_test_collection.json


=== FILE CONTENTS ===

📁 backend/index.js:
(Already implemented in canvas above)

📁 backend/package.json:
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  }
}

📁 frontend/src/index.js:
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

📁 frontend/src/index.css:
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f8f9fa;
}

📁 frontend/src/App.js:
import React from 'react';
import Login from './components/Login';
import BookList from './components/BookList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <div className="App">
      {isLoggedIn ? <BookList /> : <Login onLogin={() => setIsLoggedIn(true)} />}
    </div>
  );
}

export default App;

📁 frontend/src/components/Login.js:
import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) onLogin();
    else alert('Invalid credentials');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;

📁 frontend/src/components/BookList.js:
import React, { useEffect, useState } from 'react';

function BookList() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '' });

  useEffect(() => {
    fetch('http://localhost:5000/items')
      .then(res => res.json())
      .then(setBooks);
  }, []);

  const createBook = async () => {
    const res = await fetch('http://localhost:5000/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook)
    });
    const data = await res.json();
    setBooks([...books, data]);
  };

  const editBook = async (id, updatedBook) => {
    await fetch(`http://localhost:5000/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBook)
    });
    setBooks(books.map(b => (b.id === id ? { ...b, ...updatedBook } : b)));
  };

  const deleteBook = async id => {
    await fetch(`http://localhost:5000/items/${id}`, { method: 'DELETE' });
    setBooks(books.filter(b => b.id !== id));
  };

  return (
    <div>
      <h2>Books</h2>
      <ul>
        {books.map(book => (
          <li key={book.id}>
            {book.title} - {book.author}
            <button onClick={() => editBook(book.id, { title: prompt('Title:', book.title), author: prompt('Author:', book.author) })}>Edit</button>
            <button onClick={() => deleteBook(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input placeholder="Title" value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} />
      <input placeholder="Author" value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} />
      <button onClick={createBook}>Add Book</button>
    </div>
  );
}

export default BookList;
