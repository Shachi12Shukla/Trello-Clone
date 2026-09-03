import React, { useEffect, useState } from "react";
import {Bug, ArrowLeft,Plus, PencilSparkles, UserStar, Ellipsis,User} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

import { getIssues, updateIssueState, createIssue, updateIssueTitle as updateIssueTitleAPI } from "../../services/IssueService";
import {useAuth} from "../../context/Auth_Context"

import "./Issue.css";


const Issue = () => {

    const navigate = useNavigate();
    const {userData} = useAuth();

    const currentUserId = userData?._id;

    console.log("USER DATA:", userData);
    console.log("CURRENT USER ID:", currentUserId);

    const { workspaceId, boardId } = useParams();

    const [board, setBoard] = useState(null);

    const [workspace, setWorkspace] = useState(null);

    const [issues, setIssues] = useState([]);

    const [loading, setLoading] = useState(true);

    const [editingIssue, setEditingIssue] = useState(null);
    
    const [showCreateIssue, setShowCreateIssue] = useState(false);

    const [newIssueTitle, setNewIssueTitle] = useState("");

    const [creatingIssue, setCreatingIssue] = useState(false);

    const [draggedIssue, setDraggedIssue] = useState(null);

    const [newIssueState, setNewIssueState] = useState("To Do");

    const columns = [

        {
            key: "To Do",
            title: "To Do"
        },

        {
            key: "In-Progress",
            title: "In-Progress"
        },

        {
            key: "Completed",
            title: "Completed"
        }

    ];

    useEffect(() => {

        if (!boardId) return;


        const fetchIssues = async () => {

            try {

                setLoading(true);


                const data = await getIssues(boardId);


                console.log("Issue page data:", data);


                // Board information
                setBoard(data.board);


                // Workspace information
                setWorkspace(data.workspace);


                // Issues
                setIssues(data.issues || []);

            }

            catch (error) {

                console.error(
                    "Failed to fetch issues:",
                    error
                );


                setIssues([]);


                toast.error(
                    error.response?.data?.message ||
                    "Failed to load issues"
                );

            }

            finally {

                setLoading(false);

            }

        };


        fetchIssues();

    }, [boardId]);


    const updateIssueTitle = async (issueId,title) => {

        const trimmedTitle = title.trim();

        if (!trimmedTitle) {

            toast.error(
                "Issue title cannot be empty"
            );

            return;
        }

        try {

            const data =
                await updateIssueTitleAPI(
                    boardId,
                    issueId,
                    trimmedTitle
                );

            console.log(
                "Updated issue:",
                data
            );


            setIssues((currentIssues) =>

                currentIssues.map((issue) =>

                    issue._id === issueId

                        ? {
                            ...issue,
                            title: trimmedTitle
                        }

                        : issue

                )

            );

            setEditingIssue(null);

            toast.success(
                "Issue updated successfully"
            );

        } catch (error) {

            console.error(
                "Update title error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to update issue"
            );

        }

    };

    const handleIssueDrop = async (issue,newState) => {

        const oldState = issue.state;


        // Same column
        if (oldState === newState) {

            setDraggedIssue(null);

            return;

        }


        try {

            setIssues((currentIssues) =>

                currentIssues.map((currentIssue) =>

                    currentIssue._id === issue._id

                        ? {
                            ...currentIssue,
                            state: newState
                        }

                        : currentIssue

                )

            );


            await updateIssueState(boardId, issue._id, oldState, newState);


            toast.success("Issue moved successfully");

        } catch (error) {

            console.error("Move issue error:",error);

            // UI is rolled back if backend fails

            setIssues((currentIssues) =>

                currentIssues.map((currentIssue) => currentIssue._id === issue._id

                    ? {
                        ...currentIssue,
                        state: oldState
                    }

                    : currentIssue

                )

            );


            toast.error(error.response?.data?.message || "Failed to move issue");

        } finally {

            setDraggedIssue(null);

        }

    };

    if (loading) {

        return (

            <div className="issue-screen">

                <main className="issue-board">

                    <div className="issue-loading">
                        Loading issues...
                    </div>

                </main>

            </div>

        );

    }

    return (

        <div className="issue-screen">

            <aside className="issue-sidebar">

                <button className="issue-back-button"
                    onClick={() =>
                        navigate(`/boards/${workspaceId}`)
                    }
                >
                    <ArrowLeft size={18} />

                    <span style={{fontSize: "medium"}}>
                        Back to boards
                    </span>

                </button>

                <div className="issue-sidebar-heading">

                    <span className="issue-sidebar-icon">
                        <Bug size={18} />
                    </span>

                    <h2> Issues </h2>

                    <button className="issue-sidebar-menu" aria-label="Issue options">
                        <Ellipsis size={20} />
                    </button>

                </div>

                {!showCreateIssue ? (

                    <button
                        className="issue-add-card"
                        onClick={() => setShowCreateIssue(true)}
                    >
                        <Plus size={18} />

                        <span>
                            Add an issue
                        </span>
                    </button> ) : (

                        <div className="issue-create-form">

                            {/* Title */}

                            <div className="issue-create-field">

                                <label>
                                    Title
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter issue title"
                                    value={newIssueTitle}
                                    onChange={(event) =>
                                        setNewIssueTitle(event.target.value)
                                    }
                                    autoFocus
                                />

                            </div>


                            {/* State */}

                            <div className="issue-create-field">

                                <label>
                                    State
                                </label>

                                <select
                                    value={newIssueState}
                                    onChange={(event) =>
                                        setNewIssueState(event.target.value)
                                    }
                                >

                                    <option value="To Do">
                                        To Do
                                    </option>

                                    <option value="In-Progress">
                                        In-Progress
                                    </option>

                                    <option value="Completed">
                                        Completed
                                    </option>

                                </select>

                            </div>


                            {/* Buttons */}

                            <div className="issue-create-actions">

                                <button
                                    className="issue-create-button"
                                    disabled={creatingIssue}
                                    onClick={async () => {

                                        const title =
                                            newIssueTitle.trim();

                                        if (!title) {

                                            toast.error(
                                                "Issue title cannot be empty"
                                            );

                                            return;
                                        }

                                        try {

                                            setCreatingIssue(true);

                                            const data =
                                                await createIssue(
                                                    boardId,
                                                    title,
                                                    newIssueState
                                                );

                                            console.log(
                                                "Created issue:",
                                                data
                                            );


                                            setIssues(
                                                (currentIssues) => [
                                                    ...currentIssues,
                                                    data.issue
                                                ]
                                            );


                                            // Reset form

                                            setNewIssueTitle("");

                                            setNewIssueState("To Do");

                                            setShowCreateIssue(false);


                                            toast.success(
                                                "Issue created successfully"
                                            );

                                        } catch (error) {

                                            console.error(
                                                "Create issue error:",
                                                error
                                            );

                                            toast.error(
                                                error.response?.data?.message ||
                                                "Failed to create issue"
                                            );

                                        } finally {

                                            setCreatingIssue(false);

                                        }

                                    }}
                                >

                                    {creatingIssue
                                        ? "Creating..."
                                        : "Create"}

                                </button>


                                <button
                                    className="issue-cancel-button"
                                    disabled={creatingIssue}
                                    onClick={() => {

                                        setShowCreateIssue(false);

                                        setNewIssueTitle("");

                                        setNewIssueState("To Do");

                                    }}
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>
                )}

            </aside>

            <main className="issue-board">

                <header className="issue-board-header">
                    <div>

                        <p className="issue-board-label"> {workspace?.title || "Workspace"} </p>

                        <h1> Board: {board?.title || "Board-Name"} </h1>

                    </div>

                    <div className="issue-board-actions">

                        <UserStar size={25} />

                        <span className="issue-admin"> Admin :{" "} {workspace?.admin?.username || "Admin"} </span>

                    </div>

                </header>

                <section className="issue-columns" aria-label="Issues by state">

                    {columns.map(
                        ({ key, title }) => {

                            const columnIssues = issues.filter((issue) => issue.state === key);

                            return (

                                <article className="issue-column" key={key} >

                                    <header className="issue-column-header">
                                        <h2> {title} </h2>

                                        <span className="issue-count"> {columnIssues.length} </span>

                                        <button className="issue-column-menu" aria-label={`${title} options`}>
                                            <Ellipsis size={20} />
                                        </button>

                                    </header>


                                    <div className="issue-list" onDragOver={(event) => {event.preventDefault();}}
                                        onDrop={async () => {
                                            if(!draggedIssue) return;

                                            await handleIssueDrop(
                                                draggedIssue,
                                                key
                                            );
                                        }}
                                        >

                                        {columnIssues.length === 0 ? (

                                            <div className="issue-empty"> No issues yet </div>
                                        ) : (

                                                columnIssues.map(
                                                    (issue) => {

                                                        const isIssueCreator = String(issue.createdBy?._id) === String(currentUserId);
                                                        return (
                                                            <div className="issue-card" key={issue._id} draggable={isIssueCreator}
                                                                onDragStart={() => {if(!isIssueCreator) return;  setDraggedIssue(issue)}}
                                                                onDragEnd={() => {setDraggedIssue(null)}} >

                                                                {editingIssue === issue._id ? (

                                                                    <input className="issue-edit-input"
                                                                        defaultValue={issue.title} autoFocus

                                                                        onBlur={(event) =>
                                                                            updateIssueTitle(issue._id, event.target.value)
                                                                        }

                                                                        onKeyDown={(event) => {

                                                                            if (event.key === "Enter") {
                                                                                event.preventDefault();
                                                                                event.target.blur();
                                                                            }

                                                                            if (event.key === "Escape") {
                                                                                setEditingIssue(null);
                                                                            }

                                                                        }}

                                                                    />

                                                                ) : (

                                                                    <span className="issue-title"> {issue.title} </span>

                                                                )}

                                                                <div className="issue-card-footer">
                                                                    {isIssueCreator && (
                                                                        <button className="issue-edit-button"

                                                                            aria-label={`Edit ${issue.title}`}

                                                                            onClick={() =>setEditingIssue(issue._id)}
                                                                        >

                                                                            <PencilSparkles size={15}/>

                                                                            Edit

                                                                        </button>
                                                                        
                                                                    )}

                                                                    <span className="issue-user-details" aria-label="Issue creator">

                                                                        <span className="issue-user">

                                                                            <User size={15} />

                                                                        </span>

                                                                        <span className="issue-user-name">

                                                                            {issue.createdBy?.username || workspace?.admin?.username || "User"}

                                                                        </span>

                                                                    </span>

                                                                </div>

                                                            </div>
                                                        );
                                                    }    
                                                
                                                )  

                                            )

                                        }

                                    </div>

                                </article>

                            );

                        }
                    )}


                </section>

            </main>


        </div>

    );

};


export default Issue;