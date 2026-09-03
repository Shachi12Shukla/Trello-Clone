import {useEffect, useState} from "react"
import {getIssues} from "../services/IssueService"

const useIssues = (boardId) => {

   const [issues, setIssues] = useState([]);
   const [loading, setLoading] = useState(true);

   const fetchIssues = async () => {

    try {
        setLoading(true);
        const data = await getIssues(boardId);
        console.log("Issues:", data);
        setIssues(data.issues || []);

    } catch (error) {
        console.error("Failed to fetch issues:", error);

        setIssues([]);
    } finally{
        setLoading(false);
    }
   }

   useEffect( () => {
    if(!boardId) return;
    fetchIssues();

   }, [boardId]);

    return {
        issues,
        loading,
        fetchIssues
    }
    
}

export default useIssues
