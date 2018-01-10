import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('top-bar/search/result-group', 'Integration | Component | top bar/search/result group', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{top-bar/search/result-group}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#top-bar/search/result-group}}
      template block text
    {{/top-bar/search/result-group}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
