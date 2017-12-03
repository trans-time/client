import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('auth-modal/join', 'Integration | Component | auth modal/join', {
  integration: true,
  setup() {
    this.container.lookup('service:intl').setLocale('en-us');
  }
});

test('it begins in a blank, unsubmittable state', function(assert) {
  assert.expect(1);

  this.render(hbs`{{auth-modal/join}}`);

  assert.ok(this.$('[data-test-form-controls-submit]').attr('disabled'), 'submit button is disabled');
});
