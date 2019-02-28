import React from "react";
import StoreState from "../../stores/stateStore";
import Run from "../..";

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
    <StoryDescription story={props.stories.history.story} />
  </div>
);

export default SessionStories;

const StorysMenu = props => <div className="story-menu" />;

const StoryDescription = props => (
  <div id="roomstory" className="todaystory">
    <p>Story Description:</p>
    <textarea
      id="storyTeller"
      value={props.story}
      onChange={e => {
        StoreState.setStory(e.target.value);
        Run(StoreState.getState());
        console.log(StoreState.getState());
      }}
    />
  </div>
);
