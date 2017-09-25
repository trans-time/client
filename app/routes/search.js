import Ember from 'ember';
import RouteTitleMixin from 'client/mixins/route-title';

export default Ember.Route.extend(RouteTitleMixin, {
  intl: Ember.inject.service(),

  title: Ember.computed({
    get() {
      return this.get('intl').t('search.title');
    }
  })
});
