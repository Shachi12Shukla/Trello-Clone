import "./Navbar.css";
import {
  LayoutGrid,
  Megaphone,
  CircleQuestionMark,
  Bell,
  Search
} from "lucide-react";

import Logo from "../../assets/Logo.webp";
import { useNavigate } from "react-router";
import { ProfileMenu } from "./ProfileMenu";
import { useAuth } from "../../context/Auth_Context";
import { useState } from "react";


const Navbar = () => {

  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const { userData } = useAuth();

  const username = userData?.username || "User";


  return (

    <header className="navbar">

      {/* LEFT SECTION */}

      <div className="navbar-left">

        <button className="layout-grid-button">
          <LayoutGrid />
        </button>


        <button
          className="navbar-logo"
          onClick={() => navigate("/")}
        >
          <img
            src={Logo}
            alt="Trello Logo"
          />

          Trello
        </button>

      </div>


      {/* CENTER SECTION */}

      <div className="search-container">

        <Search className="search-icon" />

        <input
          type="text"
          placeholder="Search"
          className="search-input"
        />

      </div>


      <button
        className="create-button"
        onClick={() => navigate("/create/workspace")}
      >
        Create
      </button>


      {/* RIGHT SECTION */}

      <div className="navbar-right">

        <button className="icon-button">
          <Megaphone />
        </button>


        <button className="icon-button">
          <Bell />
        </button>


        <button className="icon-button">
          <CircleQuestionMark />
        </button>


        {/* PROFILE */}

        <div className="profile-wrapper">

          <button
            className="profile-button"
            onClick={() =>
              setShowProfileMenu(!showProfileMenu)
            }
          >
            {username.charAt(0).toUpperCase()}
          </button>


          {showProfileMenu && (

            <ProfileMenu
              onClose={() =>
                setShowProfileMenu(false)
              }
            />

          )}

        </div>

      </div>

    </header>

  );
};


export default Navbar;