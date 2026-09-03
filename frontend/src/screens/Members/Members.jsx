import { useState, useEffect, use } from "react";
import "./Members.css";
import InviteMemberModal from "../../components/InviteMember/InviteMemberModal.jsx"
import { useParams } from "react-router";
import { getMembers, removeMembers, addMemberToWorkspace } from "../../services/WorkspaceService.js";
import {useAuth} from "../../context/Auth_Context.jsx"
import toast from "react-hot-toast"

const Members = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState("");

  const {workspaceId} = useParams();
  const {userData} = useAuth();

  // Filter members based on search input
  const filteredMembers = members.filter((member) =>
    member.username
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const fetchMembers = async () => {
    try {
      const data = await getMembers(workspaceId);
      console.log("Members:", data);
      setMembers(data.members || []);
      setIsAdmin(data.isAdmin);
      setAdminName(data.admin?.username || "");

    } catch (error) {
      console.error("Failed to fetch members: ", error);
    } finally{
      setLoading(false);
    }
  }

  const handleInviteMember = async (username) => {
    try {

      const data = await addMemberToWorkspace(workspaceId, username);
      toast.success(`${username} added to the workspace`);

      setShowInviteModal(false);
      await fetchMembers();
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member");
    }
  };

  const remove = async (memberUsername) => {

    try {
      const data = await removeMembers(workspaceId, memberUsername);

      toast.success(`${memberUsername} removed from the workspace`);

      await fetchMembers();
    } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Failed to remove member"
        );
    }
  }

  const handleRemoveMember = (memberUsername) => {

    toast((t) => (
      <div className="remove-member-toast">
        <p>
          Are you sure you want to remove{" "}
          <strong>{memberUsername}</strong> from this workspace?
        </p>

        <div className="remove-member-toast-actions">
          <button onClick={() => toast.dismiss(t.id)}>
            Cancel
          </button>

          <button onClick={() => { toast.dismiss(t.id); remove(memberUsername)}}>
            Remove
          </button>
        </div>
      </div>
    ))
    
  };

  useEffect(() => {
    if(workspaceId){
      fetchMembers();
    }
  }, [workspaceId]);

  return (
    <div className="members-page">
      <div className="members-container">
        
        <div className="heading">
          {/* Heading */}
          <h1 className="members-title">
            Collaborators ({members.length})
          </h1>

          <h1 className="admin-info">
            Admin: {isAdmin? "You": adminName}
          </h1>
        </div>

        {/* Members Tab */}
        <div className="members-tabs">
          <button className="members-tab active">
            Members ({members.length})
          </button>
        </div>

        {/* Description and Invite Button */}
        <div className="members-actions-section">
          <p className="members-description">
            Workspace members can view and create boards.
            Besides this, they can view, create and update issues of boards.
          </p>
          
          {isAdmin && (
            <button className="invite-member-button" onClick={() => setShowInviteModal(true)}>
              + Invite workspace members
              </button>
          )}

          {showInviteModal && (
            <InviteMemberModal
              onClose={() => setShowInviteModal(false)}
              onInvite={handleInviteMember}
            />
          )}
        </div>

        {/* Search */}
        <div className="members-search-section">
          <input
            type="text"
            placeholder="Filter by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="members-search"
          />
        </div>

        {/* Members List */}
        <div className="members-list">
          {loading ? 
            (<p>Loading Members...</p>)
              : members.length === 0 ? (
                <p>No members found.</p>
              ) : (
                filteredMembers.map((member) => (
                  <div className="member-row" key={member._id}>

                    <div className="member-info">
                      <div className="member-avatar">
                        {member.username?.charAt(0).toUpperCase()}
                      </div>

                      <div className="member-name">
                        {member.username}
                      </div>
                    </div>

                    {
                      isAdmin && (
                        <button className="remove-member-button" onClick={() => handleRemoveMember(member.username)}>
                          Delete
                        </button>
                      )
                    }
                  </div>
                ))
              )
            }
        </div>


      </div>
    </div>
  );
};

export default Members;