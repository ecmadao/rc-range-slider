import React from 'react';
import Slider from '../components/index';
import styles from './styles.css';

class SliderWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val: 0
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(val) {
    this.setState({ val });
  }

  render() {
    const { jump, clickable } = this.props;
    const { val } = this.state;
    return (
      <div id="components-container">
        <h4>Default</h4>
        <div>
          <Slider
            value={15}
            clickable={clickable}
          />
        </div>
        <br />
        <h4>Update when dragging</h4>
        <div>
          <div>{val}</div>
          <Slider
            jump={jump}
            minJump={4}
            updateWhenDrag
            value={val}
            clickable={clickable}
            onChange={this.onChange}
          />
        </div>
        <br />
        <h4>Custom (Without tip, curstom dragger style)</h4>
        <div>
          <Slider
            min={1}
            max={24}
            value={24}
            jump={jump}
            clickable={clickable}
            useTipso={false}
            draggerClass={styles.dragger}
          />
        </div>
      </div>
    );
  }
}

export default SliderWrapper;
