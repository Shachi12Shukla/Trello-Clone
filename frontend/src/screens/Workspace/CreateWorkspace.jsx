import React from 'react'
import { useState } from 'react'
import {useNavigate} from "react-router"
import toast from "react-hot-toast";
import { createWorkspace } from "../../services/WorkspaceService";
import "./CreateWorkspace.css"
import useWorkspace from "../../Hooks/useWorkspaces"

const CreateWorkspace = () => {

  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const {workspaces} = useWorkspace();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!title.trim()){
      toast.error("Workspace name is required");
      return;
    }

    try {
      setLoading(true);
      const data = await createWorkspace({
        title, description
      });

      toast.success(data.messsage || "Workspace created successfully");
      
      navigate(`/workspace/${data._id}/boards`);
      
    } catch (error) {
        console.error(
          "Failed to create workspace:",
          error
        );


        toast.error(
          error.response?.data?.message ||
          "Failed to create workspace"
        );
      }

      finally{
        setLoading(false);
      }
  } 

  return (
    <div className='create-workspace-page'>

      <h1>Create Workspace</h1>

      <p>
        A workspace helps you organize your boards and collaborate with others.
        Once you create any workspace you become admin of it!
        Collaborate with others by adding them into your workspace.
      </p>

      <form onSubmit={handleSubmit}>
        <div>

          <label>
            Workspace Name
          </label>

          <input type='text' placeholder='enter workspace name' value={title} onChange={(e) => setTitle(e.target.value)}/>

        </div>

        <div>

          <label>
            Description
          </label>

          <textarea placeholder='What is this workspace about?' value={description} onChange={(e) => setDescription(e.target.value)}/>

        </div>

        <button type='submit' disabled={loading}>
          {loading ? "Creating..." : "Create Workspace"}
        </button>
      </form>

    </div>
  )
}

export default CreateWorkspace
