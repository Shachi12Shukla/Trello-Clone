import React from "react";
import "../Common.css"
import "./Home.css";
import {Plus} from "lucide-react"
import welcome_illustration from "../../assets/Trello-home-welcome-img.png"
import "../../components/Recently_viewed"
import Recently_viewed from "../../components/Recently_viewed";
import {useNavigate} from "react-router"

const Home = () => {
  
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* Main Content */}
      <section className="home-main">

        <div className="welcome-card">

          {/* Illustration */}
          <div className="welcome-illustration">

            <img src={ welcome_illustration} alt="welcome-illustration"/>

          </div>


          {/* Text */}
          <div className="welcome-content">

            <h2>Organize anything</h2>

            <p>
              Put everything in one place and start moving things forward
              with your first Trello board!
            </p>

            <button className="create-workspace-button" onClick={() => navigate('/create/workspace') }>
              Create a Workspace
            </button>

          </div>

        </div>

      </section>


      {/* Right Section */}
      <aside className="home-right">

        {/* Recently Viewed */}
          <Recently_viewed/>

      </aside>

    </div>
  );
};

export default Home;
