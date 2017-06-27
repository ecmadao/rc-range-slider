import { configure, addDecorator } from '@kadira/storybook';

addDecorator((story) => {
  return (story());
});

function loadStories() {
  require('../stories/Slider');
  require('../stories/RangeSlider');
}

configure(loadStories, module);
