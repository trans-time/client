
import Ember from 'ember';
import markdownit from 'markdown-it';

export function markdownRender([markdown]) {
  if (Ember.isEmpty(markdown)) return;

  const html = markdownit().render(markdown).replace(/<a /g, '<a target="_blank"');

  return Ember.String.htmlSafe(html);
}

export default Ember.Helper.helper(markdownRender);
