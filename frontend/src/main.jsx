import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'react-hot-toast';
import { AuthContextProvider } from "./context/Auth_Context.jsx";


createRoot(document.getElementById('root')).render(

  <StrictMode>

    <BrowserRouter>

      <AuthContextProvider>  

        <App />

      </AuthContextProvider> 
      <Toaster/>

    </BrowserRouter>
        
   
  </StrictMode>
    
  
)
