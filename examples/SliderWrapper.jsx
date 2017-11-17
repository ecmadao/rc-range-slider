import React from 'react';
import Slider from '../components/index';
import styles from './styles.css';

const MAX = 24;
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
    const { jump, clickable, showTipso = false } = this.props;
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
            showTipso
            value={15}
            jump={jump}
          />
          <br />
          <Slider
            jump
            max={MAX}
            min={MIN}
            value={val}
            updateWhenDrag
            showTipso={showTipso}
            clickable={clickable}
            draggerClass={styles.dragger}
          />
          <br/>
          <Slider
            jump
            max={MAX}
            min={MIN}
            value={val}
            showTipso
            updateWhenDrag
            clickable={clickable}
            draggerClass={styles.dragger}
          />
        </div>
        <br />
        <h4>Update when dragging</h4>
        <div>
          <div>{val}</div>
          <Slider
            max={MAX}
            min={MIN}
            jump={jump}
            sectionRange={4}
            value={val}
            updateWhenDrag
            clickable={clickable}
            showTipso={showTipso}
            onChange={this.onChange}
          />
        </div>
        <br />
        <h4>...with drag section</h4>
        <div>
          <Slider
            jump
            min={0}
            max={24}
            clickable
            sectionRange={4}
          />
        </div>
        <br />
        <h4>Support given different section range</h4>
        <div>
          <Slider
            jump
            min={0}
            max={24}
            clickable
            sectionRange={[1, 2, 3, 4]}
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
            useTipso={false}
            clickable={clickable}
            showTipso={showTipso}
            draggerClass={styles.dragger}
          />
        </div>
      </div>
    );
  }
}

export default SliderWrapper;
