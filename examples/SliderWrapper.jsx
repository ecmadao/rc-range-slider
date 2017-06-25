import React from 'react';
import Slider from '../components/index';
import styles from './styles.css';

class SliderWrapper extends React.Component {
  render() {
    return (
      <div id="components-container">
        <h3>Slider</h3>
        <h4>Base Slider</h4>
        <div>
          <Slider value={15} />
        </div>
        <h4>Custom (Without tip, curstom dragger style)</h4>
        <div>
          <Slider
            value={24}
            max={24}
            min={1}
            useTipso={false}
            draggerClass={styles.dragger}
          />
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
