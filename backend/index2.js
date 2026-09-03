const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {userModel, workspaceModel, boardModel, issueModel} = require("./model2.js");
const {authMiddleware} = require('./auth-middleware2.js');
const { success } = require("zod");
const app = express();
app.use(express.json());
require('dotenv').config();
const cors = require("cors");

const allowedOrigins = ['http://localhost:5173'];
app.use(cors({origin: allowedOrigins,credentials: true}));


app.listen(3000 , ()=> console.log("server started"));


// CREATE endpoints
app.post("/signup", async (req,res) =>{
    const username = req.body.username;
    const password = req.body.password;

    const userExists =  await userModel.findOne({
        username: username
    });

    if(userExists){
        res.status(403).send("username already exists");
    }

    const newUser = await userModel.create({
        username: username,
        password: password
    });

    res.status(201).json({
        id: newUser._id,
        message: "You have signed up"
    });

});


app.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userModel.findOne({
        username: username,
        password: password
    });

    if (!userExists) {
        res.status(403).json({
            message: "Incorrect credentials"
        })
        return;
    }

    const token = jwt.sign({
        userId: userExists.id
    }, process.env.SECRET);

    res.json({
        token,
        user: {
            _id: userExists._id,
            username: userExists.username
        }
    })
})


app.post("/workspace", authMiddleware , async (req,res) => {

    const userId = req.userId;

    const newWorkspace = await workspaceModel.create({
        title : req.body.title,
        description : req.body.description,
        admin : userId,
        members : []
    });

    res.status(201).json({
        message : "workspace created",
        id : newWorkspace._id,
        workspace: newWorkspace

    });
});


app.post("/add-member-to-workspace", authMiddleware , async (req,res) => {

    const userId = req.userId;
    const workspaceId = req.body.workspaceId;
    const memberUsername = req.body.memberUsername;


    // find if the workspace exists and if the user with ID "userId" is admin
    
    const workspace = await workspaceModel.findOne({_id: workspaceId});

    if(!workspace || workspace.admin.toString() !== userId){
        res.status(411).json({
            message : "Either this workspace doesn't exists or you are not an admin"
        });
        return;
    };

    
    const memberUser = await userModel.findOne({
        username: memberUsername
    });

    if(!memberUser){
        res.status(411).json({
            message : "No user with this username exists in our DB"
        })
        return;
    }

    // member already exists?
    const isAlreadyMember = workspace.members.some( (memberId) => memberId.toString() === memberUser._id.toString());

    if(isAlreadyMember){
        res.status(411).json({
            message: "User is already a member of this workspace"
        });
        return;
    }

    await workspaceModel.updateOne({
        _id: workspaceId
    }, {
        $push: {
            "members" : memberUser._id
        }
    });

    // OR workspace.members.push( memberUser._id)
    // await workspace.save()

    res.json({
        message : "New member added"
    }).status(200);
});


app.post("/board", authMiddleware ,async (req,res) => {
    const userId = req.userId;
    const workspaceId = req.body.workspaceId;

  
    const workspace = await workspaceModel.findOne({
        _id : workspaceId
    })

    if(!workspace){
        res.status(403).json({message: "Board can't be created as no such workspace exist"});
        return;
    };

    const isAdmin = workspace.admin.toString() === userId;
    const isMember = workspace.members.some( id => id.toString() === userId);    

    if(!isAdmin && !isMember){
        res.status(403).send("You don't have access to this workspace");
        return;
    };

    const newBoard = await boardModel.create({
        title : req.body.title,
        workspaceId : workspaceId
    });
    

    res.status(201).json({
        message : "Board created",
        id : newBoard._id
    });
});


app.post("/issue", authMiddleware , async(req,res) => {
    const userId = req.userId;
    const boardId = req.body.boardId;

    const board = await boardModel.findOne({_id: boardId});

    if(!board){
        res.status(403).json({message : "Issue can't be created as no such board exist"});
        return;
    };
    
    const workspace = await workspaceModel.findOne({_id: board.workspaceId});

    if (!workspace) {
        res.status(403).json({
            message: "Workspace does not exist"
        });
        return;
    }

    
    const isAdmin = workspace.admin.toString() === userId;

    const isMember = workspace.members.some(id => id.toString() === userId);

    const isAuthorized = workspace && (isAdmin || isMember);

    if(!isAuthorized){
        res.status(400).json({message : "Either the workspace doesn't exists or you don't have access"});
        return;
    };

   const newIssue = await issueModel.create({
        boardId: boardId,
        title: req.body.title,
        state: req.body.state,
        createdBy: userId
    });

    const populatedIssue = await issueModel.findById(newIssue._id).populate("createdBy", "username");

    res.status(201).json({
        message : "Issue created",
        issue: populatedIssue
    });
});



// READ endpoints

// get all workspaces (where userId == admin or member)
app.get("/workspaces", authMiddleware, async (req, res) => {
    try {

        const userId = req.userId;

        const workspaces = await workspaceModel.find({
            $or: [
                { admin: userId },
                { members: userId }
            ]
        });

        if (workspaces.length === 0) {
            return res.status(200).json({
                message: "No workspaces found",
                success: true,
                workspaces: []
            });
        }


        return res.status(200).json({
            workspaces,
            success: true
        });

    } catch (error) {

        console.error("Error fetching workspaces:", error);

        return res.status(500).json({
            message: "Failed to fetch workspaces",
            success: false
        });

    }
});


// get workspace by Id
app.get("/workspace", authMiddleware, async (req,res) => {
    const userId = req.userId;
    const workspaceId = req.query.workspaceId;

    // find if the workspace exists and if the user with ID "userId" is admin    
    const workspace = await workspaceModel.findOne({_id: workspaceId});

    const isAdmin = workspace?.admin?.toString() === userId;

    const isMember = workspace?.members?.some(
        memberId => memberId.toString() === userId
    );

    if (!workspace || (!isAdmin && !isMember)) {
        res.status(403).json({
            message: "Either this workspace doesn't exist or you don't have access"
        });
        return;
    }

    const members = await userModel.find({
        _id: workspace.members
    });

    res.status(200).json({
        workspace: {
            title: workspace.title,
            description: workspace.description,
            members: members.map(m => ({
                username: m.username,
                _id: m._id
            }))
        }

    });

});


app.get("/boards/:workspaceId", authMiddleware ,async (req,res) => {
    const userId = req.userId;

    const workspaceId = req.params.workspaceId;

    const workspace = await workspaceModel.findOne({_id: workspaceId});   // returns object
    
    
    if(!workspace){
        res.status(403).json({
            message : "There's no such workspace that exists"
        });
        return;
    };

    const isAdmin = workspace.admin.toString() === userId;
    const isMember = workspace.members.some( id => id.toString() === userId);    

    if(!isAdmin && !isMember){
        res.status(403).send("You don't have access to this workspace");
        return;
    };


    const boardsExistsinOrg = await boardModel.find({workspaceId : workspaceId});   // returns array


    if(boardsExistsinOrg.length === 0){    // no boards 
        res.status(404).json({
            message: "No boards found"
        })
        return;
    };

    res.status(200).json({
        message: "Board exists",
        board: boardsExistsinOrg
    });
});


app.get("/issues/:boardId", authMiddleware, async (req, res) => {

    const userId = req.userId;
    const boardId = req.params.boardId;


    const board = await boardModel.findOne({
        _id: boardId
    });

    if (!board) {
        res.status(404).json({
            message: "No board found"
        });

        return;
    }
    
    const workspaceId = board.workspaceId;

    const workspace = await workspaceModel
        .findOne({
            _id: workspaceId
        })
        .populate("admin", "username");


    if (!workspace) {
        res.status(404).json({
            message: "The issues you are trying to find doesn't belong to this workspace"
        });

        return;
    }


    // 4. Check access
    const isAdmin =
        workspace.admin._id.toString() === userId;


    const isMember =
        workspace.members.some(
            id => id.toString() === userId
        );


    if (!isAdmin && !isMember) {

        res.status(403).json({
            message: "You don't have access to this workspace"
        });

        return;
    }

    const issues = await issueModel.find({
        boardId: boardId
    }).populate("createdBy", "username");

    res.status(200).json({

        board: board,

        workspace: workspace,

        issues: issues

    });

});

app.get("/members/:workspaceId", authMiddleware ,async (req,res) => {
    const userId = req.userId;
    const workspaceId = req.params.workspaceId;
    
    const workspace = await workspaceModel.findOne({_id : workspaceId});

    if(!workspace){
        res.status(404).json({message : "No workspace exists"});
        return;
    };

    const members = await userModel.find({
        _id: {$in: workspace.members}
    }).select("username");

    const admin = await userModel.findById(workspace.admin).select("username");

    const isAdmin = workspace.admin.toString() === userId;
    const isMember = workspace.members.some(id => id.toString() === userId);

    if(!isAdmin && !isMember){
        res.status(403).send("You don't have access to view members of this workspace");
        return;
    };


    res.status(200).json({
        isAdmin,
        admin: {
            username: admin.username
        },
        members
    });


});



// UPDATE endpoints
app.put("/issue" , authMiddleware , async (req,res) => {

    let userId = req.userId;
    let boardId = req.body.boardId;
    let issueId = req.body.issueId;
    let beforeState = req.body.beforeState;
    let afterState = req.body.afterState;
    
    let issue = await issueModel.findById(issueId);

    if(!issue){
        res.status(404).send("Issue not found");
        return;
    }

    if(issue.createdBy.toString() !== userId){
        return res.status(403).json({
            message: "Only the user who has created this issue can update it"
        })
    }
    
    let board = await boardModel.findById(boardId);
    if(!board){
        res.status(404).json({
            message:"No board with this id exists in our db"
        })
        return;
    };

    if(issue.boardId.toString() !== boardId){
        res.status(400).send("Issue does not belong to this board");
        return;
    }

    const validStates = [
        "To Do",
        "In-Progress",
        "Completed"
    ];

    if (!validStates.includes(afterState)) {
        return res.status(400).json({
            message: "Invalid issue state"
        });

    }

    const workspaceId = board.workspaceId;
    const workspace = await workspaceModel.findById(workspaceId);

    if(!workspace){
        res.status(404).json({message : "The issues you are trying to find doesn't belong to this workspace"});
        return;
    };

    const isAdmin = workspace.admin.toString() === userId;
    const isMember = workspace.members.some(Memberid => Memberid.toString() === userId);

    if(!isAdmin && !isMember){
        res.status(403).send("You don't have access");
        return;
    }

    // frontend mismatch
    if(issue.state !== beforeState){
        res.status(400).send("Issue state mismatch");             // DB expects - "In-Progress", frontend gives - "To Do"
        return;
    };

    // no state change
    if(issue.state === afterState){
        res.status(400).send("Issue is already in this state");    // "In-progress" -> "In-Progress"
        return;
    }

    issue.state = afterState;
    await issue.save();

    res.status(202).json({
        message:"issue updated",
        issue
    });
});


app.patch(
    "/issue/:issueId",
    authMiddleware,
    async (req, res) => {

        try {

            const userId = req.userId;

            const { issueId } = req.params;

            const { boardId, title } = req.body;


            if (!title || !title.trim()) {

                return res.status(400).json({
                    message:
                        "Issue title cannot be empty"
                });

            }


            const issue =
                await issueModel.findById(issueId);

            if (!issue) {

                return res.status(404).json({
                    message: "Issue not found"
                });

            }

                    
            if(issue.createdBy.toString() !== userId){
                return res.status(403).json({
                    message: "Only the user who has created this issue can update it"
                })
            }


            const board =
                await boardModel.findById(boardId);

            if (!board) {

                return res.status(404).json({
                    message:
                        "No board with this id exists"
                });

            }


            if (
                issue.boardId.toString() !==
                boardId
            ) {

                return res.status(400).json({
                    message:
                        "Issue does not belong to this board"
                });

            }


            const workspace =
                await workspaceModel.findById(
                    board.workspaceId
                );

            if (!workspace) {

                return res.status(404).json({
                    message:
                        "Workspace not found"
                });

            }


            const isAdmin =
                workspace.admin.toString() ===
                userId;

            const isMember =
                workspace.members.some(
                    memberId =>
                        memberId.toString() === userId
                );


            if (!isAdmin && !isMember) {

                return res.status(403).json({
                    message:
                        "You don't have access"
                });

            }


            issue.title =
                title.trim();

            await issue.save();


            return res.status(200).json({

                message:
                    "Issue title updated successfully",

                issue

            });

        } catch (error) {

            console.error(
                "Update issue title error:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to update issue title"
            });

        }

    }
);





// DELETE endpoint
app.delete("/members", authMiddleware , async (req,res) => {

    const userId = req.userId;
    const workspaceId = req.body.workspaceId;
    const memberUsername = req.body.memberUsername;


    // find if the workspace exists and if the user with ID "userId" is admin    
    const workspace = await workspaceModel.findOne({_id: workspaceId});

    if(!workspace || workspace.admin.toString() !== userId){
        res.status(411).json({
            message : "Either this workspace doesn't exists or you are not an admin"
        });
        return;
    };

    const memberUser = await userModel.findOne({username: memberUsername});

    if(!memberUser){
        res.status(411).json({
            message : "No user with this username exists in our DB"
        })
        return;
    }


    const isMember = workspace.members.some((memberId) => memberId.toString() === memberUser._id.toString());
    if(!isMember){
        res.status(411).send("member with this id is not a part of the workspace");
        return;
    } 
    
    await workspaceModel.updateOne({
        _id: workspaceId
    }, {
        $pull : {
            "members": memberUser._id
        }
    });

    res.json({
        message : "Member removed"
    }).status(200);

});