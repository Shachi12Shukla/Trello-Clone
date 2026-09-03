import './App.css'
import {Routes, Route} from 'react-router'
import Home from './screens/Home/Home.jsx'
import Signup from './screens/Auth_Screen/Signup.jsx'
import Signin from './screens/Auth_Screen/Signin.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import Board from './screens/Board/Board.jsx'
import Dashboard from './screens/Dashboard/Dashboard.jsx'
import Members from './screens/Members/Members.jsx'
import Issue from './screens/Issue/Issue.jsx'
import IssueLayout from "./layouts/IssueLayout.jsx"
import AuthLayout from './layouts/AuthLayout.jsx'
import ProtectedRoutes from './components/ProtectedRoutes.jsx'
import CreateWorkspace from './screens/Workspace/CreateWorkspace.jsx'

function App() {

  return (
    
      <Routes>

        {/* {Public Routes} */}
        <Route  element={<AuthLayout/>}>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/signin' element={<Signin/>}/>
        </Route>

        {/* {Application Routes} */}

        <Route element={<ProtectedRoutes />}>
          <Route element={<AppLayout/>}>
            <Route path='/' element={<Home/>}/>
            <Route path='/workspaces' element={<Dashboard/>}/>
            <Route path="/create/workspace" element={<CreateWorkspace />}/>
            <Route path="/boards/:workspaceId" element={<Board/>}/>
            <Route path='/members/:workspaceId' element={<Members/>}/>
            {/* <Route path='/board/boardId' element={<Board/>}/> */}
          </Route>

          <Route element={<IssueLayout/>}>
            <Route path='/boards/:workspaceId/board/:boardId/issues' element={<Issue/>}/>
          </Route>
        </Route>

  
      </Routes>
    
   
  )
}

export default App
