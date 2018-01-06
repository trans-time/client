import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
import { isEmpty } from '@ember/utils';

export function linkResources([text]) {
  if (isEmpty(text)) return;

  text.string = text.string.replace(/@(\S*)/g, '<a class="linked-resource" data-username=$1 tabindex="0">@$1</a>');
  text.string = text.string.replace(/(#\S*)/g, '<a class="linked-resource" data-tag=$1 tabindex="0">$1</a>');

  return htmlSafe(text);
}

export default helper(linkResources);
