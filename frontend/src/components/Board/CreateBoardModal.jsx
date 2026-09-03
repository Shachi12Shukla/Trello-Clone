import {useState} from "react";
import "./CreateBoardModal.css"
import {X, ArrowLeft, LayoutDashboard} from "lucide-react"

const CreateBoardModal = ({onclose, onCreate}) => {

    const [title, setTitle] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!title.trim()){
            return;
        }

        await onCreate(title.trim());
    }


  return (
    <div className="create-board-overlay">
      
      <div className="create-board-modal">
        
        {/* {Header} */}
        <div className="create-board-header">
           
           <button className="create-board-back" onClick={onclose}>
            <ArrowLeft size={20}/>
           </button>

           <h2>Create Board</h2>

           <button className="create-board-close" onClick={onclose}>
            <X size={20}/>
           </button>

        </div>
        
        {/* {Illustration} */}

        <div className="create-board-illustration">

            <div className="illustration-icon">
                <LayoutDashboard size={28}/>
            </div>

            <div className="mini-board">
                <div>

                </div>

                <div>
                    
                </div>

                <div>
                    
                </div>
            </div>

        </div>

        {/* {Description} */}

        <div className="create-board-intro">
            <h3>
                Bring your ideas to life
            </h3>

            <p>
                Create a board to organize your tasks,
                projects, and ideas all in one place.
            </p>
        </div>

        {/* {Form} */}
        <form onSubmit={handleSubmit} className="create-board-form">

            <label htmlFor="board-title">
                Board title <span>*</span>
            </label>

            <input type="text"  id="board-title" placeholder="Enter board title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus/>

            <button type="submit" disabled={!title.trim()}>
                Create board
            </button>
        </form>

      </div>

    </div>
  )
}

export default CreateBoardModal
