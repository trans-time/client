import Mixin from '@ember/object/mixin';
import { oneWay } from '@ember/object/computed';

export default Mixin.create({
  classNames: ['timeline-item-nav-slideshow-panel'],
  attributeBindings: ['dataPanelId:data-panel-id', 'style'],

  dataPanelId: oneWay('panel.model.id'),

  didInsertElement(...args) {
    this._super(...args);

    this.loadPanel();
  },

  loadPanel() {
    this.set('panel.isLoaded', true);
  },

  doubleClick() {
    this.openModalNav(this.panel);
  }
});
