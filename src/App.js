import React from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import UsersList from "./components/UsersList";

function App() {
  return (
    <div className="container mt-3">
      <UsersList />
    </div>
  );
}

export default App;
