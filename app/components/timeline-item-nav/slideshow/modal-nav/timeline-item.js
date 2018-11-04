import Component from '@ember/component';
import { sort } from '@ember/object/computed';

export default Component.extend({
  tagName: '',
  
  panelIndex: 0,

  sortedPanels: sort('timelineItem.panels', (a, b) => a.get('model.order') - b.get('model.order')),
  
  actions: {
    setPanelIndex(panelIndex) {
      this.set('panelIndex', panelIndex);
    }
  }
});
