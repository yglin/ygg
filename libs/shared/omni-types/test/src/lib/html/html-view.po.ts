import { Html } from '@ygg/shared/omni-types/core';
import { HtmlViewPageObject } from '@ygg/shared/omni-types/ui';

function decodeHtmlEntity(str: string): string {
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
}

function encodeHtmlEntity(str: string) {
  const buf = [];
  for (let i = str.length - 1; i >= 0; i--) {
    buf.unshift(['&#', str.charCodeAt(i), ';'].join(''));
  }
  return buf.join('');
}

export class HtmlViewPageObjectCypress extends HtmlViewPageObject {
  expectValue(html: Html) {
    cy.get(this.getSelector('content')).should('have.text', html.content);
  }
}
