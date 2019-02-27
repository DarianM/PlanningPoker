import React from "react";

const SessionStories = props => (
  <div className="stories">
    <ul className="nav-story">
      <li>
        <span className="active-story">Active Story</span>
      </li>
      <li>
        <span>Completed</span>
      </li>
      <li>
        <span>All Stories</span>
      </li>
    </ul>
    <StorysMenu />
    <StoryDescription />
  </div>
);

export default SessionStories;

const StorysMenu = props => <div className="story-menu" />;

const StoryDescription = props => (
  <div id="roomstory" className="todaystory">
    <p>Story Description:</p>
    <textarea id="storyTeller" value="{state.history.story}" />
  </div>
);
