import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import PhoneEntry from './component/PhoneEntry'
import CodeEntry from './component/CodeEntry'
import Success from './component/Success'

function App() {
  const [count, setCount] = useState(0)

 return (
  <>
  
    <Router>
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<PhoneEntry />} />
          <Route path="/code" element={<CodeEntry />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </div>
    </Router>
    </>
  );
  
}

export default App
