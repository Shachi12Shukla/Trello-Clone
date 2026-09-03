import {useState, useEffect} from "react";
import {getBoards} from "../services/BoardService";

const useBoards = (workspaceId) => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(false);


    const fetchBoards = async () => {
        try {
            setLoading(true);

            const data = await getBoards(workspaceId);

            setBoards(data.board || []);
        } catch (error) {

            setBoards([]);
        } finally{
            setLoading(false);
        }
    };

    useEffect( () => {
        if(!workspaceId) return;
        fetchBoards();
    }, [workspaceId]);

    return {
        boards, loading, fetchBoards
    }
}

export default useBoards;