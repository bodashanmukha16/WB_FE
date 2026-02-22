import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ScrolltoTop from './components/sroll_to_top/ScrolltoTop.jsx'
import { BrowserRouter } from 'react-router-dom'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ScrolltoTop></ScrolltoTop>
    <App />
  </BrowserRouter>,
)
