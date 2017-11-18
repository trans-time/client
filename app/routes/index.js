import Route from '@ember/routing/route';
import RouteTitleMixin from 'client/mixins/route-title';

export default Route.extend(RouteTitleMixin, {
  afterModel() {
    this.set('meta.title', null);
  }
});
