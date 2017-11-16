import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import objectAssign from 'object-assign';
import Tipso from 'rc-tipso';
import Dragger from './Dragger';
import ProgressBar from './ProgressBar';
import styles from './slider.css';
import Utils from '../shared/utils';

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
    this.onChange = this.onChange.bind(this);
    this.onDraging = this.onDraging.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.resetOrigin = this.resetOrigin.bind(this);
    this.changePosition = this.changePosition.bind(this);
  }

  componentDidMount() {
    this.resetOrigin();
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
      values
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

  onDraging(index) {
    const { updateWhenDrag } = this.props;
    return left => {
      const pos = this.changePosition(index, { left });
      if (updateWhenDrag) {
        this.onChange({
          index,
          left,
          pos
        });
      }
    };
  }

  onDragEnd(index) {
    return left => {
      const pos = this.changePosition(index, { left });
      this.onChange({
        index,
        left,
        pos
      });
    };
  }

  onDragMove(leftPos) {
    const index = this.getIndexByPos(leftPos);
    return () => {
      this.onDragEnd(index)(leftPos);
    };
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
    const { positions, maxDis, maxLeft } = this.state;
    const {
      max,
      min,
      jump,
      color,
      jumpRange,
      useTipso,
      showTipso,
      tipsoClass,
      draggerClass,
      tipFormatter,
    } = this.props;
    const minDis = jumpRange / (max - min);
    return positions.map((item, index) => {
      const { left } = item;
      const value = this.getValue(left);
      const minPosition = index - 1 >= 0
        ? positions[index - 1].left + minDis
        : 0;
      const maxPosition = index + 1 < positions.length
        ? positions[index + 1].left - minDis
        : 1;

      return (
        <Dragger
          jump={jump}
          key={index}
          left={left}
          useTipso={useTipso}
          showTipso={showTipso}
          maxDis={maxDis}
          maxLeft={maxLeft}
          color={color}
          value={value}
          max={maxPosition}
          min={minPosition}
          maxValue={max}
          minValue={min}
          jumpRange={jumpRange}
          draggerClass={draggerClass}
          tipsoClass={tipsoClass}
          onDragEnd={this.onDragEnd(index)}
          onDraging={this.onDraging(index)}
          tipFormatter={tipFormatter}
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

  renderSections() {
    const {
      max,
      min,
      jump,
      jumpRange,
      clickable,
      tipsoClass,
      tipFormatter,
      sectionRange,
    } = this.props;
    if (!clickable || !jump || jumpRange <= 0 || sectionRange <= 0) return null;
    const { positions } = this.state;
    const lefts = positions.map(position => position.left);
    let maxLeft = Math.min(...lefts);
    const maxRight = Math.max(...lefts);
    if (positions.length === 1) {
      maxLeft = 0;
    }
    const length = Math.ceil((max - min) / jumpRange);
    return Utils.createArray(length + 2).map((val, i) => {
      const left = i / length;
      const value = this.getValue(left);
      const tipsoValue = tipFormatter ? tipFormatter(value) : value;
      return (
        <Tipso
          key={i}
          theme="dark"
          tipsoContent={(
            <div
              style={{
                textAlign: 'center',
                minWidth: `${(tipsoValue.length + 1) * 5}px`
              }}
            >{tipsoValue}</div>
          )}
          className={cx(
            styles.tipso,
            styles.sectionTipso,
            tipsoClass
          )}
          wrapperClass={cx(
            styles.draggerContainer,
            styles.draggerSectionContainer
          )}
          wrapperStyle={{
            left: `${left * 100}%`
          }}>
          <div
            className={cx(
              styles.dragSection,
              i % sectionRange === 0 && styles.dragSectionEnable,
              left >= maxLeft && left <= maxRight && styles.light
            )}
            onClick={this.onDragMove(left)}
          />
        </Tipso>
      );
    });
  }

  render() {
    const { className } = this.props;
    const containerClass = cx(
      styles.container,
      className
    );
    return (
      <div className={containerClass}>
        <div
          className={styles.pathway}
          id="pathway"
          ref={(ref) => this.pathway = ref}>
          {this.renderSections()}
          {this.renderDrager()}
          {this.renderProgressBar()}
        </div>
      </div>
    );
  }
}

Slider.propTypes = {
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
  onChange: PropTypes.func,
  useTipso: PropTypes.bool,
  showTipso: PropTypes.bool,
  jump: PropTypes.bool,
  jumpRange: PropTypes.number,
  sectionRange: PropTypes.number,
  clickable: PropTypes.bool,
  updateWhenDrag: PropTypes.bool,
};

Slider.defaultProps = {
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
  jump: false,
  jumpRange: 1,
  sectionRange: 1,
  clickable: false,
  updateWhenDrag: false,
};

export default Slider;
