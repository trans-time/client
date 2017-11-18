import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import RouteTitleMixin from 'client/mixins/route-title';

export default Route.extend(RouteTitleMixin, {
  intl: service(),

  titleToken: computed({
    get() {
      return this.get('intl').t('search.title');
    }
  })
});
