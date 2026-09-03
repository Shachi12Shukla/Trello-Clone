import React from 'react'
import useWorkspaces from "../../Hooks/useWorkspaces"
import Recently_viewed from "../../components/Recently_viewed"
import Workspace_Avatar from "../../components/Workspace_Avatar"
import { useNavigate } from "react-router";
import "./Dashboard.css"
import "../Common.css";

const Dashboard = () => {
  
  const {loading, workspaces} = useWorkspaces();
  const navigate = useNavigate();

  return (
    
    <div className="dashboard">

      <section className="dashboard-left">

        {/* CREATE NEW WORKSPACE */}

        <div className="create-workspace">

          <h1 className="dashboard-title">
            Create New Workspace
          </h1>

          <div className="workspace-grid">

            <button
              className="create-workspace-card"
              onClick={() => navigate("/create/workspace")}
            >
              <span className="create-workspace-icon">
                +
              </span>

              <span>
                New Workspace
              </span>
            </button>

          </div>

        </div>


        {/* YOUR WORKSPACES */}

        <div className="dashboard-bottom">

          <h2 className="workspace-section-title">
            YOUR WORKSPACES
          </h2>


          {loading ? (

            <p>Loading workspaces...</p>

          ) : (

            <div className="workspace-grid">

              {workspaces.map((workspace) => (

                <button
                  key={workspace._id}
                  className="workspace-card existing-workspace-card"
                  onClick={() =>
                    navigate(`/boards/${workspace._id}`)
                  }
                >

                  <Workspace_Avatar size="medium">
                    {workspace.title.charAt(0).toUpperCase()}
                  </Workspace_Avatar>


                  <div className="workspace-card-info">

                    <h3>
                      {workspace.title}
                    </h3>

                    <p>
                      {workspace.description}
                    </p>

                  </div>

                </button>

              ))}

            </div>

          )}

        </div>

      </section>


      <div className="dashboard-right">
        <Recently_viewed />
      </div>

    </div>
  )
}

export default Dashboard
