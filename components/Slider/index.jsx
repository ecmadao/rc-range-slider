import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import objectAssign from 'object-assign';
import Tipso from 'rc-tipso';
import { ResizeSensor } from 'css-element-queries';
import Dragger from './Dragger';
import ProgressBar from './ProgressBar';
import styles from './slider.css';
import Utils from '../shared/utils';

const getTipsoPosition = (position) => {
  let pos = position
  if (!new Set(['top', 'bottom']).has(position)) {
    pos = 'top'
  }

  return {
    position: pos,
    style: pos === 'top' ? styles.sliderTipsoTop : styles.sliderTipsoBottom
  }
}

class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = objectAssign(
      {},
      this.initialState(props),
      {
        maxDis: 0
      }
    );
    this.readyGoBack = false;
    this.onChange = this.onChange.bind(this);
    this.onDraging = this.onDraging.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onSectionClick = this.onSectionClick.bind(this);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.resetOrigin = this.resetOrigin.bind(this);
    this.changePosition = this.changePosition.bind(this);
  }

  componentDidMount() {
    this.resetOrigin();
    const id = this.props.id || 'light-ui-slider';
    new ResizeSensor(document.getElementById(id), this.resetOrigin); // eslint-disable-line no-new

    if (window.addEventListener) {
      window.addEventListener('resize', this.resetOrigin, true);
    } else {
      window.addEventListener('onresize', this.resetOrigin);
    }
  }

  componentWillUnmount() {
    if (window.addEventListener) {
      window.removeEventListener('resize', this.resetOrigin, true);
    } else {
      window.detachEvent('onresize', this.resetOrigin);
    }
  }

  componentWillReceiveProps(nextProps) {
    const values = this.validateValues(nextProps);
    if (!Utils.isEqual(values, this.state.values)) {
      this.setState({
        ...this.initialState(nextProps)
      });
    }
  }

  validateValues(props) {
    const { value } = props;
    const values = Utils.isArray(value) ? value : [value];
    return values;
  }

  initialState(props) {
    const { max, min } = props;
    const values = this.validateValues(props);
    const positions = values.map((item) => {
      const left = (item - min) / (max - min);
      return { left };
    });
    return {
      positions,
      values,
      tipsoPosition: positions[0].left
    };
  }

  resetOrigin() {
    const pathwayDOM = ReactDOM.findDOMNode(this.pathway);
    const pathway = pathwayDOM.getBoundingClientRect();

    const maxDis = pathway.width;
    const maxLeft = pathway.left;
    this.setState({ maxDis, maxLeft });
  }

  onChange(options = {}) {
    const {
      index,
      left,
      pos = null
    } = options;
    const positions = pos || this.state.positions;
    const { onChange } = this.props;
    const value = this.getValue(left);
    const returnValue = position => this.getValue(position.left);
    const results = [
      ...positions.slice(0, index).map(returnValue),
      value,
      ...positions.slice(index + 1).map(returnValue)
    ];
    if (!Utils.checkSameArray(results, this.validateValues(this.props))) {
      const result = results.length > 1 ? results : results[0];
      onChange(result);
    }
  }

  getValue(left) {
    const { max, min } = this.props;
    return Math.round(left * (max - min) + min);
  }

  getIndexByPos(pos) {
    const { positions } = this.state;
    const leftOffsets = positions.map(position => Math.abs(position.left - pos));
    const minLeftOffset = Math.min(...leftOffsets).toFixed(2);
    const index = Utils.findFirstIndex({
      array: positions,
      getVal: (position) => position.left,
      check: val => Math.abs(val - pos).toFixed(2) === minLeftOffset
    });
    return index;
  }

  onDraging(index, left) {
    const { updateWhenDrag } = this.props;
    const pos = this.changePosition(index, { left });
    if (updateWhenDrag) {
      this.onChange({
        index,
        left,
        pos
      });
    }
  }

  onDragEnd(index, left) {
    const pos = this.changePosition(index, { left });
    this.onChange({
      index,
      left,
      pos
    });
  }

  onSectionClick(leftPos) {
    const index = this.getIndexByPos(leftPos);
    return () => {
      this.onDragEnd(index, leftPos);
    };
  }

  getValidateLeft(offsetLeft, index = null) {
    const { maxDis, maxLeft, positions } = this.state;
    const {
      max,
      min,
      jump,
      jumpRange,
    } = this.props;

    const minDis = jumpRange / (max - min);
    const minPosition = index !== null && index - 1 >= 0
      ? positions[index - 1].left + minDis
      : 0;
    const maxPosition = index !== null && index + 1 < positions.length
      ? positions[index + 1].left - minDis
      : 1;

    const leftLength = offsetLeft - maxLeft;
    const offsetPercentage = leftLength / maxDis;

    let validateLeft = Utils.validatePosition(
      offsetPercentage, minPosition, maxPosition);
    if (jump) {
      let val = validateLeft * (max - min);
      const offset = val % jumpRange;
      val = offset > (jumpRange / 2)
        ? val - offset + jumpRange
        : val - offset;
      validateLeft = val / (max - min);
    }
    return validateLeft;
  }

  onMouseUp(index, pos) {
    const validateLeft = this.getValidateLeft(pos.x, index);
    this.onDraging(index, validateLeft);
    this.onDragEnd(index, validateLeft);
  }

  onMouseMove(index, pos) {
    const validateLeft = this.getValidateLeft(pos.x, index);
    this.onDraging(index, validateLeft);
  }

  handleTipsoMove(e) {
    const event = e || window.event;
    const pos = Utils.mousePosition(event);
    const validateLeft = this.getValidateLeft(pos.x);
    this.setState({
      tipsoPosition: validateLeft
    });
    return validateLeft;
  }

  onMouseLeave() {
    const { positions } = this.state;
    // give some time to avoid to quick to go back
    this.readyGoBack = true;
    setTimeout(() => {
      if (this.readyGoBack) {
        this.setState({
          tipsoPosition: positions[0].left
        });
      }
    }, 1000);
  }

  onMouseOver(e) {
    this.readyGoBack = false;
    this.handleTipsoMove(e);
  }

  onMouseDown(e) {
    const validateLeft = this.handleTipsoMove(e);
    // get closest index
    const { positions } = this.state;
    const offsets = positions.map(
      item => Math.abs(item.left - validateLeft)
    );
    let index = 0;
    let minOffset = offsets[index];
    for (let i = 1; i < offsets.length; i += 1) {
      if (offsets[i] < minOffset) {
        index = i;
        minOffset = offsets[i];
      }
    }
    this.onDragEnd(index, validateLeft);
  }

  changePosition(index, position) {
    if (index <= -1) return null;
    const { positions } = this.state;
    const newPos = [
      ...positions.slice(0, index),
      objectAssign({}, positions[index], position),
      ...positions.slice(index + 1)
    ];
    this.setState({
      positions: newPos
    });
    return newPos;
  }

  renderDrager() {
    const { positions } = this.state;
    const {
      max,
      min,
      color,
      jumpRange,
      draggerClass,
    } = this.props;
    const minDis = jumpRange / (max - min);
    return positions.map((item, index) => {
      const { left } = item;
      const minPosition = index - 1 >= 0
        ? positions[index - 1].left + minDis
        : 0;
      const maxPosition = index + 1 < positions.length
        ? positions[index + 1].left - minDis
        : 1;

      return (
        <Dragger
          key={index}
          left={left}
          index={index}
          color={color}
          max={maxPosition}
          min={minPosition}
          draggerClass={draggerClass}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
        />
      );
    });
  }

  renderProgressBar() {
    const { positions } = this.state;
    const { color } = this.props;
    const left = positions.length > 1 ? positions[0].left : 0;
    const right = 1 - positions.slice(-1)[0].left;
    return (
      <ProgressBar
        color={color}
        left={left}
        right={right}
      />
    );
  }

  get validateSectionRange() {
    const { sectionRange, max, min } = this.props;
    const arr = [];
    if (Utils.isArray(sectionRange)) {
      let sum = min;
      arr.push(0);
      for (let i = 0; i < sectionRange.length; i += 1) {
        const range = sectionRange[i];
        if (sum + range <= max) {
          arr.push(range);
          sum += range;
          if (sum === max) break;
        } else {
          arr.push(max - sum);
          break;
        }
      }
      return arr;
    } else if (Utils.isNumber(sectionRange)) {
      arr.push(0);
      const count = Math.ceil((max - min) / sectionRange);
      for (let i = 1; i <= count; i += 1) {
        if (i === count) {
          arr.push(max - min - (i - 1) * sectionRange);
        } else {
          arr.push(sectionRange);
        }
      }
      return arr;
    }
    return arr;
  }

  renderSections() {
    const {
      jump,
      jumpRange,
      clickable,
    } = this.props;
    const sectionRange = this.validateSectionRange;

    if (!clickable || !jump || jumpRange <= 0 || !sectionRange.length) return null;
    const { positions } = this.state;
    const lefts = positions.map(position => position.left);
    let maxLeft = Math.min(...lefts);
    const maxRight = Math.max(...lefts);
    if (positions.length === 1) {
      maxLeft = 0;
    }

    let offsetLeft = 0;
    const sum = sectionRange.reduce((pre, cur) => pre + cur, 0);
    return sectionRange.map((section, index) => {
      offsetLeft += section;
      const left = offsetLeft / sum;
      return (
        <div
          key={index}
          style={{ left: `${left * 100}%` }}
          className={cx(
            styles.dragSection,
            styles.dragSectionEnable,
            left >= maxLeft && left <= maxRight && styles.light
          )}
          onClick={this.onSectionClick(left)}
        />
      );
    });
  }

  render() {
    const {
      id,
      useTipso,
      showTipso,
      className,
      tipsoClass,
      pathwayClass,
      tipFormatter,
    } = this.props;
    const { tipsoPosition } = this.state;
    const posOption = getTipsoPosition(this.props.tipsoPosition)

    const containerClass = cx(
      styles.container,
      className
    );
    const value = this.getValue(tipsoPosition);
    const tipsoValue = tipFormatter ? tipFormatter(value) : value;
    return (
      <div
        id={id || 'light-ui-slider'}
        className={containerClass}
        onMouseOver={this.onMouseOver}
        onMouseMove={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
      >
        <Tipso
          theme="dark"
          show={showTipso}
          disabled={!useTipso}
          position={posOption.position}
          tipsoContent={(
            <div
              style={{
                textAlign: 'center',
                minWidth: `${(tipsoValue.length + 1) * 5}px`
              }}
            >
              {tipsoValue}
            </div>
          )}
          className={cx(
            posOption.style,
            tipsoClass
          )}
          tipsoStyle={{
            left: `${tipsoPosition * 100}%`
          }}
          wrapperClass={styles.sliderContainer}
        >
          <div
            className={cx(
              styles.pathway,
              pathwayClass
            )}
            id="pathway"
            ref={(ref) => this.pathway = ref}
            onMouseDown={this.onMouseDown}
          >
            {this.renderSections()}
            {this.renderDrager()}
            {this.renderProgressBar()}
          </div>
        </Tipso>
      </div>
    );
  }
}

Slider.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  tipFormatter: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array
  ]),
  minRange: PropTypes.number,
  color: PropTypes.string,
  draggerClass: PropTypes.string,
  tipsoClass: PropTypes.string,
  tipsoPosition: PropTypes.string,
  pathwayClass: PropTypes.string,
  onChange: PropTypes.func,
  useTipso: PropTypes.bool,
  showTipso: PropTypes.bool,
  jump: PropTypes.bool,
  jumpRange: PropTypes.number,
  sectionRange: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array
  ]),
  clickable: PropTypes.bool,
  updateWhenDrag: PropTypes.bool,
};

Slider.defaultProps = {
  id: null,
  className: '',
  tipFormatter: null,
  min: 0,
  max: 100,
  value: 10,
  minRange: 1,
  color: 'green',
  onChange: () => {},
  useTipso: true,
  showTipso: false,
  draggerClass: '',
  tipsoClass: '',
  tipsoPosition: 'top',
  pathwayClass: '',
  jump: false,
  jumpRange: 1,
  sectionRange: null,
  clickable: false,
  updateWhenDrag: false,
};

export default Slider;
