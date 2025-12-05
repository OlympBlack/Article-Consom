import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Posts from './components/Posts';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import DeletePost from './components/DeletePost';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/delete/:id" element={<DeletePost />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
