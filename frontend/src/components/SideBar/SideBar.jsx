import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router";

import {
  ChevronDown,
  ChevronUp,
  Columns3,
  Activity,
  Users,
  LayoutDashboard
} from "lucide-react";

import Workspace_Avatar from "../Workspace_Avatar";
import "../Workspace_Avatar.css";

import { useState } from "react";
import useWorkspaces from "../../Hooks/useWorkspaces"


const Sidebar = () => {

  const navigate = useNavigate();

  const [openWorkspaceId, setOpenWorkspaceId] =
    useState(null);

  const {workspaces, loading} = useWorkspaces();

  const toggleWorkspace = (workspaceId) => {

    setOpenWorkspaceId((currentId) =>
      currentId === workspaceId
        ? null
        : workspaceId
    );

  };


  return (

    <aside className="sidebar">

      {/* Main navigation */}

      <nav className="sidebar-navigation">

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">
            <Activity />
          </span>

          <span>Home</span>

        </NavLink>


        <NavLink
          to="/workspaces"
          end
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">
            <LayoutDashboard />
          </span>

          <span>Dashboard</span>

        </NavLink>

      </nav>


      {/* Workspace section */}

      <section className="sidebar-workspaces">

        <div className="sidebar-section-header">
          <span>WORKSPACES</span>
        </div>


        {loading && (

          <p className="sidebar-loading">
            Loading...
          </p>

        )}


        {!loading && workspaces.length === 0 && (

          <p className="sidebar-empty">
            No workspaces yet
          </p>

        )}


        {/* Render every workspace */}

        {!loading && workspaces.map((workspace) => {

          const isOpen =
            openWorkspaceId === workspace._id;

          return (

            <div
              className="workspace"
              key={workspace._id}
            >

              {/* Workspace header */}

              <button
                className="workspace-header"
                type="button"
                aria-expanded={isOpen}
                onClick={() =>
                  toggleWorkspace(workspace._id)
                }

              >

                <div className="workspace-info">

                  <Workspace_Avatar variant="sidebar" size="small"> {workspace.title.charAt(0).toUpperCase()} </Workspace_Avatar>
                  <span className="workspace-name">
                    {workspace.title}
                  </span>

                </div>


                <span className="workspace-arrow">

                  {isOpen
                    ? <ChevronUp size={16} />
                    : <ChevronDown size={16} />
                  }

                </span>

              </button>


              {/* Workspace navigation */}

              {isOpen && (

                <div className="workspace-navigation">

                  <NavLink
                    to={`/boards/${workspace._id}`}
                    className={({ isActive }) =>
                      `workspace-item ${
                        isActive ? "active" : ""
                      }`
                    }
                  >

                    <Columns3
                      className="sidebar-icon"
                      size={15}
                    />

                    Boards

                  </NavLink>


                  <NavLink
                    to={`/members/${workspace._id}`}
                    className={({ isActive }) =>
                      `workspace-item ${
                        isActive ? "active" : ""
                      }`
                    }
                  >

                    <Users
                      className="sidebar-icon"
                      size={15}
                    />

                    Members

                  </NavLink>

                </div>

              )}

            </div>

          );

        })}

      </section>

    </aside>

  );

};


export default Sidebar;