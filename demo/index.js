import React from 'react';
import {Gmaps, Marker} from '../dist';
import Events from '../dist/components/events';

let styles = {
  item: {
    backgroundColor: 'white',
    transition: 'background-color 0.2s linear'
  },
  cols: {
    float: 'left'
  }
};

let App = React.createClass({

  render() {

    let events = [];
    let handlers = {};
    for (let _event in Events) {
      if (Events.hasOwnProperty(_event)) {
        events.push(
          <li key={Events[_event]} ref={Events[_event]} style={styles.item}>
            {Events[_event]}
          </li>
        );
        handlers[_event] = this.handler.bind(this, Events[_event]);
      }
    }

    return (
      <div>
        <Gmaps 
          width={'50%'}
          height={'500px'}
          style={styles.cols}
          lat={51.5258541} 
          lng={-0.08040660000006028} 
          zoom={12} 
          {...handlers} />
        <ul style={styles.cols}>
          {events}
        </ul>
      </div>
    );

  },

  handler(_event) {
    let item = this.refs[_event].getDOMNode();
    item.style.backgroundColor = '#99ccff';
    setTimeout(function() {
      item.style.backgroundColor = styles.item.backgroundColor;
    }, 500);
  },

});

React.render(<App />, document.getElementById('gmaps'));
