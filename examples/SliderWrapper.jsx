import React from 'react';
import Slider from '../components/index';
import styles from './styles.css';

const MAX = 23;
const MIN = 0;

class SliderWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val: 0
    };
    this.onChange = this.onChange.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
  }

  onChange(val) {
    this.setState({ val });
  }

  componentDidMount() {
    if (document.addEventListener) {
      document.addEventListener('keydown', this.onKeydown, true);
    } else {
      document.attachEvent('onkeydown', this.onKeydown);
    }
  }

  componentWillUnmount() {
    if (document.removeEventListener) {
      document.removeEventListener('keydown', this.onKeydown, true);
    } else {
      document.detachEvent('onkeydown', this.onKeydown);
    }
  }

  onKeydown(e) {
    const { val } = this.state;
    const { keyCode } = e;
    if ((keyCode === 37 || keyCode === 65) && val >= MIN + 1) {
      // left
      this.onChange(val - 1);
    }
    if ((keyCode === 39 || keyCode === 68) && val < MAX) {
      // right
      this.onChange(val + 1);
    }
    return false;
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
            jump={jump}
          />
          <br />
          <Slider
            jump
            clickable={clickable}
            updateWhenDrag
            max={MAX}
            min={MIN}
            value={val}
            draggerClass={styles.dragger}
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
            max={MAX}
            min={MIN}
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
