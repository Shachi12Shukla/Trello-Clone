import { useState } from "react";
import "./InviteMemberModal.css";

const InviteMemberModal = ({
  onClose,
  onInvite,
  loading = false,
}) => {
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      return;
    }

    await onInvite(trimmedUsername);

    setUsername("");
  };

  return (
    <div className="invite-modal-overlay">

      <div className="invite-modal">

        <div className="invite-modal-header">

          <h2>Invite to Organisation</h2>

          <button
            className="invite-close-button"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            ×
          </button>

        </div>


        <form
          className="invite-member-form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />


          <div className="invite-modal-footer">

            <p>
              Enter the username of the person you want to add
              to this workspace.
            </p>

            <button
              type="submit"
              className="invite-member-button"
              disabled={!username.trim() || loading}
            >
              {loading ? "Adding..." : "Add member"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default InviteMemberModal;