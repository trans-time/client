import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
import { isEmpty } from '@ember/utils';

export function linkResources([text]) {
  if (isEmpty(text)) return;

  text.string = text.string.replace(/@([a-zA-Z0-9_]*)/g, '<a class="link undecorated" data-username=$1 tabindex="0">@$1</a>');
  text.string = text.string.replace(/#([a-zA-Z0-9_]*)/g, '<a class="link undecorated" data-tag=$1 tabindex="0">$1</a>');

  return htmlSafe(text);
}

export default helper(linkResources);
