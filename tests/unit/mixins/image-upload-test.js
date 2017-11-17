import EmberObject from '@ember/object';
import ImageUploadMixin from 'client/mixins/image-upload';
import { module, test } from 'qunit';

module('Unit | Mixin | image upload');

// Replace this with your real tests.
test('it works', function(assert) {
  let ImageUploadObject = EmberObject.extend(ImageUploadMixin);
  let subject = ImageUploadObject.create();
  assert.ok(subject);
});
