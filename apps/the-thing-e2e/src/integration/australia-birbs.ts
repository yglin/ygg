import { TheThing, TheThingCell, TheThingImitation } from '@ygg/the-thing/core';
import { Album, Image } from '@ygg/shared/omni-types/core';

export const imitationAustralianBirb = new TheThingImitation().fromJSON(
  {
    name: 'Australian Birb',
    image: 'https://nextstateprint.com/wp-content/uploads/Native-07-450x450.jpg',
    description: 'Birbs live in Australia',
    filter: {
      tags: ['birb', 'australia']
    },
    cellsDef: {
      'Hobitat': {
        name: 'Hobitat',
        type: 'text',
        required: true
      },
      'Height': {
        name: 'Height',
        type: 'number',
        required: true
      },
      'Photos': {
        name: 'Photos',
        type: 'album',
        required: true
      },
      'Life span': {
        name: 'Life span',
        type: 'number'
      }
    }
  }
);

export const littlePenguin = TheThing.forge({
  name: 'Little Penguin',
  tags: ['birb', 'penguin', 'small', 'amphibian'],
  cells: {
    照片: TheThingCell.forge({
      name: '照片',
      type: 'album',
      value: Album.forge({
        photos: [
          'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Eudyptula_minor_Bruny_1.jpg/330px-Eudyptula_minor_Bruny_1.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Little_Penguin_Feb09.jpg/330px-Little_Penguin_Feb09.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/20091121_Little_Penguin_on_rock_at_St_Kilda_Breakwater_%28left_side_view%29.jpg/330px-20091121_Little_Penguin_on_rock_at_St_Kilda_Breakwater_%28left_side_view%29.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Eudyptula_minor_family_exiting_burrow.jpg/330px-Eudyptula_minor_family_exiting_burrow.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Fairy_penguin_feeding_-_melbourne_zoo.jpg/330px-Fairy_penguin_feeding_-_melbourne_zoo.jpg'
        ].map(src => new Image(src))
      })
    }),
    Hobitat: TheThingCell.forge({
      name: '棲地',
      type: 'text',
      value: 'Australia, New Zealand'
    }),
    主食: TheThingCell.forge({
      name: '主食',
      type: 'text',
      value: '魚類、魷魚及其他小型的水生動物'
    })
  }
});

export const kiwi: TheThing = TheThing.forge({
  name: 'KIWI',
  tags: ['birb', 'flightless', 'terrestrial', 'not fruit'],
  cells: {
    Photos: TheThingCell.forge({
      name: 'Photos',
      type: 'album',
      value: Album.forge({
        cover: new Image(
          'https://www.goodfreephotos.com/albums/new-zealand/other-new-zealand/flightless-kiwi-apteryx-mantelli-symbol-of-new-zealand.jpg'
        ),
        photos: [
          'https://upload.wikimedia.org/wikipedia/commons/0/09/Kiwi_hg.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/20180703_kiwi-sonya9_959_DxO.jpg/1200px-20180703_kiwi-sonya9_959_DxO.jpg',
          'https://live.staticflickr.com/7053/6964868751_f401c0d104_b.jpg',
          'https://live.staticflickr.com/7451/12277778395_26529e32e9_b.jpg',
          'https://www.goodfreephotos.com/albums/new-zealand/other-new-zealand/flightless-kiwi-apteryx-mantelli-symbol-of-new-zealand.jpg'
        ].map(src => new Image(src))
      })
    }),
    Hobitat: TheThingCell.forge({
      name: '棲地',
      type: 'text',
      value: 'Australia, New Zealand'
    })
  }
});

export const kakapo: TheThing = TheThing.forge({
  name: 'KAKAPO',
  tags: ['birb', 'parrot', 'terrestrial', 'round', 'green', 'dumbdumb'],
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

export const relationName = '鄰居';
kakapo.addRelations(relationName, [kiwi, littlePenguin]);
