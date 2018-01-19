import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('top-bar/notifications/type/notification-moderation-resolved', 'Integration | Component | top bar/notifications/type/notification moderation resolved', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{top-bar/notifications/type/notification-moderation-resolved}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#top-bar/notifications/type/notification-moderation-resolved}}
      template block text
    {{/top-bar/notifications/type/notification-moderation-resolved}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
