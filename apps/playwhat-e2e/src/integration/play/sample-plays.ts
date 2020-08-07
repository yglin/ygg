import { TheThingCell } from '@ygg/the-thing/core';
import {
  RelationAddition,
  CellNames as ShoppingCellNames
} from '@ygg/shopping/core';
import {
  ImitationPlay,
  ImitationEquipmentCellDefines,
  ImitationEquipment,
  RelationshipEquipment,
  ImitationPlayCellDefines
} from '@ygg/playwhat/core';
import { random } from 'lodash';
import {
  Album,
  Location,
  BusinessHours,
  OmniTypes
} from '@ygg/shared/omni-types/core';

export const MinimumPlay = ImitationPlay.createTheThing().fromJSON({
  name: `溜鳥鳥體驗(最少需求資料欄位)_${Date.now()}`,
  cells: [
    {
      name: '照片',
      type: 'album',
      value: Album.forge().toJSON()
    },
    {
      name: '簡介',
      type: 'html',
      value:
        '請帶上自家的傲嬌小肉雞，選出年度最臭雞味冠軍。評審為20年資歷鳥奴，現任3隻肉雞鏟屎官'
    },
    {
      name: ShoppingCellNames.price,
      type: 'number',
      value: random(10, 300)
    },
    {
      name: '時長',
      type: 'number',
      value: random(30, 120)
    },
    {
      name: ImitationPlayCellDefines.minParticipants.name,
      type: 'number',
      value: random(1, 10)
    },
    {
      name: ImitationPlayCellDefines.maxParticipants.name,
      type: 'number',
      value: random(10, 50)
    },
    {
      name: ImitationPlayCellDefines.location.name,
      type: 'location',
      value: Location.forge().toJSON()
    },
  ]
});

export const PlayFull = MinimumPlay.clone();
PlayFull.name = `測試體驗溜鳥鳥(所有資料欄位)_${Date.now()}`;
PlayFull.addCells(
  [
    {
      name: '服務時段',
      type: 'business-hours',
      value: BusinessHours.forge().toJSON()
    }
  ].map(cellData => new TheThingCell().fromJSON(cellData))
);

export const SamplePlays = [
  {
    name: `巷弄騎乘派對_${Date.now()}`,
    tags: ['體驗', 'play', '深度遊趣', '省府日常散策', '協力車'],
    cells: [
      {
        name: '副標題',
        type: 'text',
        value: '走尋巷弄的故事'
      },
      {
        name: '照片',
        type: 'album',
        value: Album.forge().toJSON()
      },
      {
        name: '簡介',
        type: 'html',
        value:
          '騎乘協力車見證台灣近代史的文 化聚落,其中的特殊省府文化, 不只透過眼睛來看見中興新村, 更以美食的嗅覺、手心的觸覺、 耳朵的聽覺等,從全方位的重新 認識過往美好質樸的優閒生活。 (含導覽解說、冷泡茶一瓶)'
      },
      {
        name: ShoppingCellNames.price,
        type: 'number',
        value: 300
      },
      {
        name: '時長',
        type: 'number',
        value: 120
      },
      {
        name: ImitationPlayCellDefines.minParticipants.name,
        type: 'number',
        value: 4
      },
      {
        name: ImitationPlayCellDefines.maxParticipants.name,
        type: 'number',
        value: 40
      },
      {
        name: ImitationPlayCellDefines.location.name,
        type: 'location',
        value: Location.forge().toJSON()
      },
      {
        name: ImitationPlayCellDefines.businessHours.name,
        type: OmniTypes['business-hours'].id,
        value: BusinessHours.forge().toJSON()
      }
    ]
  },
  {
    name: `省府苔球風景體驗_${Date.now()}`,
    tags: ['體驗', 'play', '深度遊趣', '省府日常散策', '苔球'],
    cells: [
      {
        name: '副標題',
        type: 'text',
        value: '帶走中興的一片記憶'
      },
      {
        name: '照片',
        type: 'album',
        value: Album.forge().toJSON()
      },
      {
        name: '簡介',
        type: 'html',
        value:
          '透過環境中的花草樹木感受省府 的生命之美,講師將帶領學員認 識環境的植物風景,以手作苔球 將迷人的植物濃縮成一個深邃、 引人駐足的迷你世界,呈現出苔 球獨有寂靜、律動的魅力姿態(學 員可製作帶回一顆苔球)。'
      },
      {
        name: ShoppingCellNames.price,
        type: 'number',
        value: 350
      },
      {
        name: '時長',
        type: 'number',
        value: 90
      },
      {
        name: ImitationPlayCellDefines.minParticipants.name,
        type: 'number',
        value: 2
      },
      {
        name: ImitationPlayCellDefines.maxParticipants.name,
        type: 'number',
        value: 40
      },
      {
        name: ImitationPlayCellDefines.location.name,
        type: 'location',
        value: Location.forge().toJSON()
      },      {
        name: ImitationPlayCellDefines.businessHours.name,
        type: OmniTypes['business-hours'].id,
        value: BusinessHours.forge().toJSON()
      }
    ]
  },
  {
    name: `職人手沖咖啡評鑑體驗_${Date.now()}`,
    tags: ['體驗', 'play', '深度遊趣', '省府日常散策', '咖啡'],
    cells: [
      {
        name: '副標題',
        type: 'text',
        value: '品味中興職人咖啡'
      },
      {
        name: '照片',
        type: 'album',
        value: Album.forge().toJSON()
      },
      {
        name: '簡介',
        type: 'html',
        value:
          '體驗世界咖啡各式品種及口味差 異,藉由實際手作感受不一樣的 香氣,領略一場咖啡的氣味旅行。 (課程學員可自行體驗一杯手沖 咖啡與帶回一包耳掛式)。'
      },
      {
        name: ShoppingCellNames.price,
        type: 'number',
        value: 450
      },
      {
        name: '時長',
        type: 'number',
        value: 120
      },
      {
        name: ImitationPlayCellDefines.minParticipants.name,
        type: 'number',
        value: 6
      },
      {
        name: ImitationPlayCellDefines.maxParticipants.name,
        type: 'number',
        value: 10
      },
      {
        name: ImitationPlayCellDefines.location.name,
        type: 'location',
        value: Location.forge().toJSON()
      },      {
        name: ImitationPlayCellDefines.businessHours.name,
        type: OmniTypes['business-hours'].id,
        value: BusinessHours.forge().toJSON()
      }
    ]
  },
  {
    name: `省府植物拓印體驗_${Date.now()}`,
    tags: ['體驗', 'play', '深度遊趣', '省府日常散策', '拓印'],
    cells: [
      {
        name: '副標題',
        type: 'text',
        value: '封存美好記憶'
      },
      {
        name: '照片',
        type: 'album',
        value: Album.forge().toJSON()
      },
      {
        name: '簡介',
        type: 'html',
        value:
          '撿拾環境中的落葉、花草,運用畫筆顏料拓印至白紙保留植物的葉脈紋理,透過色彩堆疊與手作溫度保留旅行的記憶,最終親手寫上祝福,替旅行留下最美好句點'
      },
      {
        name: ShoppingCellNames.price,
        type: 'number',
        value: 350
      },
      {
        name: '時長',
        type: 'number',
        value: 90
      },
      {
        name: ImitationPlayCellDefines.minParticipants.name,
        type: 'number',
        value: 2
      },
      {
        name: ImitationPlayCellDefines.maxParticipants.name,
        type: 'number',
        value: 15
      },
      {
        name: ImitationPlayCellDefines.location.name,
        type: 'location',
        value: Location.forge().toJSON()
      },      {
        name: ImitationPlayCellDefines.businessHours.name,
        type: OmniTypes['business-hours'].id,
        value: BusinessHours.forge().toJSON()
      }
    ]
  },
  {
    name: `省府草地野餐(建議秋冬時節)_${Date.now()}`,
    // tags: ['體驗', 'play', '深度遊趣', '省府日常散策', '野餐'],
    cells: [
      {
        name: '副標題',
        type: 'text',
        value: '草地野餐派對'
      },
      {
        name: '照片',
        type: 'album',
        value: Album.forge().toJSON()
      },
      {
        name: '簡介',
        type: 'html',
        value:
          '在最具森林風情的中興野地用餐,簡單的沙拉、熱壓吐司漢堡、湯品、飲品,搭配美好的森林草地,自由自在地徜徉在綠地與樹下,是中興新村最美味的中餐!!'
      },
      {
        name: ShoppingCellNames.price,
        type: 'number',
        value: 500
      },
      {
        name: '時長',
        type: 'number',
        value: 120
      },
      {
        name: ImitationPlayCellDefines.minParticipants.name,
        type: 'number',
        value: 10
      },
      {
        name: ImitationPlayCellDefines.maxParticipants.name,
        type: 'number',
        value: 40
      },
      {
        name: ImitationPlayCellDefines.location.name,
        type: 'location',
        value: Location.forge().toJSON()
      },      {
        name: ImitationPlayCellDefines.businessHours.name,
        type: OmniTypes['business-hours'].id,
        value: BusinessHours.forge().toJSON()
      }
    ]
  }
].map(jsonItem => ImitationPlay.createTheThing().fromJSON(jsonItem));

export const SampleEquipments = [
  {
    name: `四人協力車_${Date.now()}`,
    tags: ['addition', '設備'],
    cells: [
      {
        name: ShoppingCellNames.price,
        type: 'number',
        value: 100
      },
      {
        name: ImitationEquipmentCellDefines.maximum.name,
        type: 'number',
        value: 6
      },
      {
        name: ImitationEquipmentCellDefines.minimum.name,
        type: 'number',
        value: 1
      },
      {
        name: '照片',
        type: 'album',
        value: Album.forge().toJSON()
      }
    ]
  },
  {
    name: `二人協力車_${Date.now()}`,
    tags: ['addition', '設備'],
    cells: [
      {
        name: ShoppingCellNames.price,
        type: 'number',
        value: 60
      },
      {
        name: ImitationEquipmentCellDefines.maximum.name,
        type: 'number',
        value: 5
      },
      {
        name: ImitationEquipmentCellDefines.minimum.name,
        type: 'number',
        value: 1
      },
      {
        name: '照片',
        type: 'album',
        value: Album.forge().toJSON()
      }
    ]
  }
].map(jsonItem => ImitationEquipment.createTheThing().fromJSON(jsonItem));

SamplePlays[0].addRelations(RelationshipEquipment.name, SampleEquipments);

export const PlaysWithEquipment = SamplePlays.filter(p =>
  p.hasRelation(RelationshipEquipment.name)
);
export const PlaysWithoutEquipment = SamplePlays.filter(
  p => !p.hasRelation(RelationshipEquipment.name)
);
