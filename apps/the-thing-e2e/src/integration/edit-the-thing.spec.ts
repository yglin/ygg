import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { Album, Image } from '@ygg/shared/types';
import { login, MockDatabase } from '@ygg/shared/test/cypress';
import {
  TheThingEditorPageObjectCypress,
  TheThingViewPageObjectCypress
} from '../page-objects/the-thing';

describe('Edit exist the-thing', () => {
  const kakapo: TheThing = TheThing.forge({
    name: 'KAKAPO',
    tags: ['parrot', 'terrestrial', 'round', 'green', 'dumbdumb'],
    cells: {
      圖片: TheThingCell.forge({
        name: '圖片',
        type: 'album',
        value: Album.forge({
          cover: new Image(
            'https://upload.wikimedia.org/wikipedia/commons/7/7c/Kakapo2.jpg'
          ),
          photos: [
            'https://upload.wikimedia.org/wikipedia/commons/b/b1/Kakapo_Sirocco_1.jpg',
            'https://live.staticflickr.com/8226/8528275645_cb4e2a5769.jpg',
            'https://live.staticflickr.com/8108/8528282263_33660a24fa_b.jpg',
            'https://live.staticflickr.com/8517/8528297619_a3a7092ee8_z.jpg',
            'https://live.staticflickr.com/3523/4054780290_fe70766a77_b.jpg',
            'https://live.staticflickr.com/2717/4015129651_130f32b3d6.jpg'
          ].map(src => new Image(src))
        })
      }),
      棲地: TheThingCell.forge({
        name: '棲地',
        type: 'text',
        value: 'Australia, New Zealand'
      }),
      習性: TheThingCell.forge({
        name: '習性',
        type: 'longtext',
        value:
          '鴞鸚鵡晝伏夜出，日間棲息於大樹庇蔭下或地上，到了晚上才在牠們的領域徘徊[4]。儘管不能飛，雙翼也不是全無用處，透過展開雙翅牠們能輕微滑翔，並提供平衡及制動力[19]。此外牠們發展出強壯的雙腿，善於攀爬，能登上高聳的樹冠，移動時則利用快速輕搖的步姿走上好幾公里的路[10]。雌性在孵卵期間，每晚仍會在一公里範圍內尋覓食物，並來回兩次[20]，雄性則在求偶季節（10月到翌年1月）走到最遠五公里內的求偶場進行求偶活動[21]。鴞鸚鵡好奇心重，因此與人類互動的紀錄古已有之。曾協助保育的職員及義工們與個別鴞鸚鵡認識較深，發現牠們有不同的性格，如其中一隻叫Sinbad的鴞鸚鵡每晚均會與職員們打招呼，而Hoki則略為有「大小姐脾氣」'
      }),
      數量: TheThingCell.forge({
        name: '數量',
        type: 'number',
        value: 213
      })
    }
  });
  const mockDatabase = new MockDatabase();

  before(() => {
    login();
    mockDatabase.insert(`${TheThing.collection}/${kakapo.id}`, kakapo.toJSON());
  });

  after(() => {
    mockDatabase.clear();
  });

  beforeEach(function() {
    cy.visit(`the-things/${kakapo.id}/edit`);
  });

  it('Can change tags', () => {
    const newTags = ['horny', 'cute', 'clumsy', 'shag camera man'];
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    theThingEditorPO.setTags(newTags);
    theThingEditorPO.submit();
    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectVisible();
    theThingViewPO.expectTags(newTags);
  });

  it('Can change name', () => {
    const newName = '鴞鸚鵡';
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    theThingEditorPO.setName(newName);
    theThingEditorPO.submit();
    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectVisible();
    theThingViewPO.expectName(newName);    
  });

  it('Can remove a cell', () => {
    const theCell = kakapo.cells['數量'];
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    theThingEditorPO.deleteCell(theCell);
    theThingEditorPO.submit();
    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectVisible();
    theThingViewPO.expectNoCell(theCell);
  });
  
  
});
