// src/App.tsx

import React from 'react';
import FormioRenderer from './components/FormioRenderer';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const App: React.FC = () => {
  return (
    <div>
      <h1>React + Form.io Integration</h1>
      <FormioRenderer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
