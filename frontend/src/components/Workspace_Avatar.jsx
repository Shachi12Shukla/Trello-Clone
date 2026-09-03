import React, { children } from 'react'
import "./Workspace_Avatar.css"

const Workspace_Avatar = ({size="medium", children}) => {
  // children can be a letter or an image
  return (
    <div>
      <div className={`workspace-avatar workspace-avatar--${size}`} >
        {children}
      </div>
    </div>
  )
}

export default Workspace_Avatar
