import React from 'react';
import Slider from '../components/index';

class RangeSliderWrapper extends React.Component {
  render() {
    return (
      <div id="components-container">
        <h3>Range Slider</h3>
        <br />
        <div>
          <Slider value={[15, 35]} />
          <Slider value={[10, 35, 60]} />
        </div>
        <br />
        <h4>...with min range</h4>
        <div>
          <Slider
            value={[15, 35]}
            minRange={5}
          />
        </div>
        <br />
        <h4>...with jump</h4>
        <div>
          <Slider
            jump
            min={0}
            max={20}
            value={[2, 8]}
            minRange={1}
            minJump={2}
          />
        </div>
        <br />
        <h4>...with drag section</h4>
        <div>
          <Slider
            jump
            min={0}
            max={20}
            clickable
            value={[2, 8]}
            minRange={1}
            minJump={2}
          />
        </div>
        <br />
        <h4>Multi drag with section</h4>
        <div>
          <Slider
            jump
            min={0}
            max={20}
            clickable
            value={[2, 6, 10, 15]}
            minRange={1}
            minJump={2}
          />
        </div>
      </div>
    );
  }
}

export default RangeSliderWrapper;
