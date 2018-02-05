import React from 'react';
import { storiesOf } from '@storybook/react';
import RangeSliderWrapper from '../examples/RangeSliderWrapper';

storiesOf('RangeSlider', module)
  .add('basical', () => (
    <RangeSliderWrapper />
  ));
