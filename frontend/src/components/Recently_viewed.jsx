import React from 'react'
import {Clock4} from "lucide-react"

const Recently_viewed = () => {
  return (
    <div>
        <section className="home-section">
      
            <div className="section-title">
                <span className="clock-icon"><Clock4  size={"22px"}/></span>
                <h3 style={{ "fontSize": "22px", "color": "blue", "fontWeight": "normal"}}>Recently viewed</h3>
            </div>
      
            <div className="recent-board">

                <div className="recent-board-color"></div>

                <div className="recent-board-info">
                <h4>My Trello Board</h4>
                <p>Trello Workspace</p>
                </div>

            </div>
      
        </section>
    </div>
  )
}

export default Recently_viewed
