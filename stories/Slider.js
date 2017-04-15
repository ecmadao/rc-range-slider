import React from 'react';
import { storiesOf } from '@kadira/storybook';

import SliderWrapper from '../examples/SliderWrapper';

storiesOf('Others', module)
  .add('basical', () => (
    <SliderWrapper />
  ));
