import { Outlet } from "react-router";
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/SideBar/SideBar'

const AppLayout = () => {
  return (
    <div className="app-layout">

      <Navbar/>

      <div className="app-body">
        <SideBar/>
        
        <main className="app-content">
          <Outlet />
        </main>
        
      </div>

    </div>
  );
};

export default AppLayout;