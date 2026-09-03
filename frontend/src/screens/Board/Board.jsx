import "./Board.css";
import Workspace_Avatar from "../../components/Workspace_Avatar";
// import "../../components/Workspace_Avatar.css"
import {UserRound} from "lucide-react";
import { useNavigate, useParams} from "react-router";
import useWorkspaceId from "../../Hooks/useWorkspaceId"
import  useBoards from "../../Hooks/useBoards"
import CreateBoardModal from "../../components/Board/CreateBoardModal"
import { useState } from "react";
import { createBoard } from "../../services/BoardService";

const Boards = () => {

  const navigate = useNavigate();
  const {workspaceId, boardId} = useParams();
  const {workspace} = useWorkspaceId(workspaceId);
  const {boards, loading, fetchBoards} = useBoards(workspaceId);
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false); 

  const handleCreateBoard = async (title) => {
    try {
      await createBoard(workspaceId, title);
      console.log("board created");
      setShowCreateBoardModal(false);
      await fetchBoards();
    } catch (error) {
      console.error("Failed to create board: ", error)
    }
  }

  return (
    <div className="boards-page">

      {/* Workspace Header */}
      <section className="board-workspace-header">

        <div className="workspace-info">

          {/* {Workspace Avatar} */}
          <Workspace_Avatar size="large"> {workspace?.title?.charAt(0)} </Workspace_Avatar>
          <div>
            <h1>{workspace?.title}</h1>
            <p>{workspace?.description}</p>
          </div>
        </div>

      </section>


      {/* Divider */}
      <div className="boards-divider"></div>


      {/* Boards Section */}
      <section className="boards-section">

        <div className="boards-section-header">

          <div className="boards-title">
            <span className="boards-title-icon"> <UserRound/> </span>
            <h2>Your boards</h2>
          </div>

        </div>


        {/* Board Grid */}
        <div className="boards-grid">

          {loading ? (
            <p style={{"color": "blue", "fontSize": "19px"}}>Loading boards...</p>
          ) : boards.length === 0 ? (
              <p style={{"color" : "red", "fontSize": "19px"}}>No boards found.</p>
          ) : (
            boards.map((board) => (
              <button key={board._id} className="board-card" onClick={() => navigate(`/boards/${workspaceId}/board/${board._id}/issues`)}>
                <div className="board-card-cover"></div>
                <div className="board-card-content">
                  <h3>{board.title}</h3>
                </div>
              </button>
            ))
          )}

          {/* Create Board */}
          <button className="create-board-card" onClick={() => setShowCreateBoardModal(true)}>
            <span className="create-board-icon">+</span>
            <span>Create new board</span>
          </button>

          {showCreateBoardModal && (
            <CreateBoardModal 
              onclose={() => setShowCreateBoardModal(false)}
              onCreate={handleCreateBoard}/>
          )}

        </div>

      </section>

    </div>
  );
};

export default Boards;
