import React from 'react'
import {getWorkspaces} from "../services/WorkspaceService"
import { useState, useEffect } from 'react'

const useWorkspaces = () => {
  
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchWorkspaces = async () => {

      try {

        const data = await getWorkspaces();

        setWorkspaces(data.workspaces || []);

      } catch (error) {
          setWorkspaces([]);
          console.error("Workspace error:", error);
          console.log("STATUS:", error.response?.status);
          console.log("DATA:", error.response?.data);
          console.log("URL:", error.config?.url);
          console.log("METHOD:", error.config?.method);

      } finally {

        setLoading(false);

      }

  };

  useEffect(() => {

    fetchWorkspaces();

  }, []);
  

  return {
    workspaces,
    loading,
    fetchWorkspaces
  }
}

export default useWorkspaces
