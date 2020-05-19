import { ShoppingCartButtonPageObject } from '@ygg/shopping/ui';
import { MatBadgePageObjectCypress } from '@ygg/shared/test/cypress';

export class ShoppingCartButtonPageObjectCypress extends ShoppingCartButtonPageObject {
  matBadgePO: MatBadgePageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.matBadgePO = new MatBadgePageObjectCypress(this.getSelector());
  }
  
  expectBadge(badge: number | 'hide'): void {
    if (badge === 'hide') {
      this.matBadgePO.expectHide();
    } else if (typeof badge === 'number') {
      this.matBadgePO.expectNumber(badge);
    }
  }
}
