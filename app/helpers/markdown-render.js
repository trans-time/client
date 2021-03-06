
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
import { isEmpty } from '@ember/utils';
import markdownit from 'markdown-it';

export function markdownRender([markdown]) {
  if (isEmpty(markdown)) return;

  let html = markdownit().render(markdown).replace(/<a /g, '<a target="_blank"');

  return htmlSafe(linkifyHtml(html));
}

export default helper(markdownRender);
