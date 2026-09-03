import React from 'react'
import { useEffect, useState } from 'react'
import {getWorkspaceById} from "../services/WorkspaceService"

const useWorkspaceId = (workspaceId) => {

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaceById = async () => {
        try {
            const data = await getWorkspaceById(workspaceId);
            setWorkspace(data.workspace);
        } catch (error) {
            console.error(error);
        } finally{
            setLoading(false);
        }
    };
    if(workspaceId){
        fetchWorkspaceById();
    }
  },[workspaceId]);


  return {
    workspace,
    loading
  }
}

export default useWorkspaceId
