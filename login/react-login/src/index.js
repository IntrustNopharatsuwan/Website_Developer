import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInSide from './SignInSide';
import Blog from './Blog';
import SignUp from './SignUp';

// Correct approach for React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignInSide />} />
      <Route path='/login' element={<SignInSide />}/>
      <Route path='/blog' element={<Blog />}/>
      <Route path='/register' element={<SignUp />}/>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
