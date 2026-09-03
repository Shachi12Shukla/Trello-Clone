import { Outlet } from "react-router";
import Navbar from '../components/Navbar/Navbar'

const AppLayout = () => {
  return (
    <div className="app-layout">

      <Navbar/>
        
        <main className="app-content">
          <Outlet />
        </main>
    

    </div>
  );
};

export default AppLayout;