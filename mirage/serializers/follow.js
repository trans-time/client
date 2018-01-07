import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  include: ['follower', 'follower.userProfile', 'followed', 'followed.userProfile']
});
