import { configure, addDecorator } from '@kadira/storybook';

addDecorator((story) => {
  return (story());
});

function loadStories() {
  require('../stories/Slider');
}

configure(loadStories, module);
