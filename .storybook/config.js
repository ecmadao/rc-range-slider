import { configure, addDecorator } from '@storybook/react';

addDecorator((story) => {
  return (story());
});

function loadStories() {
  require('../stories/Slider');
  require('../stories/RangeSlider');
}

configure(loadStories, module);
