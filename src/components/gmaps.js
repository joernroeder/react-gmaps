import React from 'react';
import cloneWithProps from 'react/lib/cloneWithProps';
import assign from 'react/lib/Object.assign';
import Events from './events';

// @see https://developers.google.com/maps/documentation/javascript/reference#MapOptions 
let gmapsMapOptionProperties = [
  'backgroundColor',
  'center',
  'disableDefaultUI',
  'disableDoubleClickZoom',
  'draggable',
  'draggableCursor',
  'draggingCursor',
  'heading',
  'keyboardShortcuts',
  'mapMaker',
  'mapTypeControl',
  'mapTypeControlOptions',
  'mapTypeId',
  'maxZoom',
  'minZoom',
  'noClear',
  'overviewMapControl',
  'overviewMapControlOptions',
  'panControl',
  'panControlOptions',
  'rotateControl',
  'rotateControlOptions',
  'scaleControl',
  'scaleControlOptions',
  'scrollwheel',
  'streetView',
  'streetViewControl',
  'streetViewControlOptions',
  'styles',
  'tilt',
  'zoom',
  'zoomControl',
  'zoomControlOptions'
];

let Gmaps = React.createClass({

  map: null,
  events: [],

  getMap() {
    return this.map;
  },

  componentDidMount() {
    this.loadMaps();
  },

  componentWillUnmount() {
    this.unbindEvents();
  },

  componentWillReceiveProps: (nextProps) {
    this.createChildren(nextProps);
  },
  
  render() {
    let style = assign({
      width: this.props.width,
      height: this.props.height
    }, this.props.style);
    return (
      <div style={style} className={this.props.className}>
        Loading...
        {this.state ? this.state.children : null}
      </div>
    );
  },

  loadMaps() {
    if (!window.google) {
      window.mapsCallback = this.mapsCallback;
      let src = `https://maps.googleapis.com/maps/api/js?callback=mapsCallback&libraries=${this.props.libraries || ''}`;
      let script = document.createElement('script');
      script.setAttribute('src', src);
      document.head.appendChild(script);
    } else {
      this.mapsCallback();
    }
  },
  
  mapsCallback() {
    delete window.mapsCallback;
    this.createMap();
    this.createChildren(this.props);
    this.bindEvents();
  },

  createMap() {
    let propKeys = Object.keys(this.props);
    let mapOptions = {
      center: new google.maps.LatLng(this.props.lat, this.props.lng),
      zoom: this.props.zoom
    };

    propKeys.forEach(function (key) {
      if (~gmapsMapOptionProperties.indexOf(key)) {
        mapOptions[key] = this.props[key];
      }
    });

    this.map = new google.maps.Map(this.getDOMNode(), {
      center: new google.maps.LatLng(this.props.lat, this.props.lng),
      zoom: this.props.zoom
    });
    if (this.props.onMapCreated) {
      this.props.onMapCreated();
    }
  },

  createChildren(props) {
    let children = React.Children.map(props.children, (child) => {
      if (!React.isValidElement(child)) {
        return child;
      }
      return cloneWithProps(child, {
        map: this.map
      });
    });
    this.setState({
      children: children
    });
  },

  bindEvents() {
    for (let prop in this.props) {
      if (this.props.hasOwnProperty(prop) && Events[prop]) {
        let e = google.maps.event.addListener(this.map, Events[prop], this.props[prop]);
        this.events.push(e);
      }
    }
  },

  unbindEvents() {
    this.events.forEach((e) => {
      google.maps.event.removeListener(e);
    });
  }

});

export default Gmaps;
