// src/App.tsx

import React from 'react';
import FormioRenderer from './components/FormioRenderer';

const App: React.FC = () => {
  return (
    <div>
      <h1>React + Form.io Integration</h1>
      <FormioRenderer />
    </div>
  );
};

export default App;
