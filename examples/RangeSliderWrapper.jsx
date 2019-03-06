import React from 'react';
import Slider from '../components/index';
import styles from './styles.css';

class RangeSliderWrapper extends React.Component {
  render() {
    return (
      <div id="components-container">
        <h3>Range Slider</h3>
        <br />
        <div>
          <Slider value={[15, 35]} id="1" />
          <Slider value={[10, 35, 60]} id="2" />
        </div>
        <br />
        <h4>...with min range</h4>
        <div>
          <Slider
            id="3"
            value={[15, 35]}
            minRange={5}
          />
        </div>
        <br />
        <h4>...with jump</h4>
        <div>
          <Slider
            jump
            id="4"
            min={0}
            max={20}
            value={[2, 8]}
            minRange={1}
            sectionRange={2}
          />
        </div>
        <br />
        <h4>...with drag section</h4>
        <div>
          <Slider
            jump
            id="5"
            min={0}
            max={20}
            clickable
            value={[2, 8]}
            minRange={1}
            sectionRange={3}
          />
        </div>
        <br />
        <h4>Multi drag with section</h4>
        <div>
          <Slider
            jump
            id="6"
            min={0}
            max={20}
            clickable
            value={[2, 6, 10, 15]}
            minRange={1}
            sectionRange={4}
          />
          <Slider
            jump
            id="6"
            min={0}
            max={20}
            clickable
            value={[2, 6, 10, 15]}
            minRange={1}
            tipsoPosition="bottom"
            sectionRange={4}
          />
          <Slider
            jump
            id="6"
            min={0}
            max={20}
            clickable
            value={[2, 6, 10, 15]}
            minRange={1}
            tipsoPosition="bottom"
            sectionRange={4}
            tipsoClass={styles.tipsoClass2}
          />
        </div>
      </div>
    );
  }
}

export default RangeSliderWrapper;
