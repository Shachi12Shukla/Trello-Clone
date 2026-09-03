import "./ProfileMenu.css";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/Auth_Context";

export const ProfileMenu = ({ onClose }) => {

  const navigate = useNavigate();

  const {
    userData,
    logout
  } = useAuth();


  const username = userData?.username || "User";


  const handleLogout = () => {

    logout();

    onClose();

    navigate("/signin", {
      replace: true
    });

  };


  return (

    <div className="profile-menu">

      <div className="profile-menu-heading">
        ACCOUNT
      </div>


      <div className="profile-user-info">

        <div className="profile-menu-avatar">

          {username.charAt(0).toUpperCase()}

        </div>


        <div className="profile-user-details">

          <p className="profile-username">
            {username}
          </p>

        </div>

      </div>


      <div className="profile-menu-divider"></div>


      <button
        className="logout-button"
        onClick={handleLogout}
      >
        Log out
      </button>

    </div>

  );
};