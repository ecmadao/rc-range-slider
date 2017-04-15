import React from 'react';
import Slider from '../components/index';

class SliderWrapper extends React.Component {
  render() {
    return (
      <div id="components-container">
        <h3>Slider</h3>
        <h4>Base Slider</h4>
        <div>
          <Slider value={15} />
        </div>
        <h4>Range Slider</h4>
        <div>
          <Slider value={[15, 35]} />
          <Slider value={[10, 35, 60]} />
        </div>
        <h4>...with min range</h4>
        <div>
          <Slider value={[15, 35]} minRange={5}/>
        </div>
      </div>
    );
  }
}

export default SliderWrapper;
