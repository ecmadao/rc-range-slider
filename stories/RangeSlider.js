import React from 'react';
import { storiesOf } from '@kadira/storybook';
import RangeSliderWrapper from '../examples/RangeSliderWrapper';

storiesOf('RangeSlider', module)
  .add('basical', () => (
    <RangeSliderWrapper
    />
  ));
