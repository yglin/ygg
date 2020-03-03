import { TheThing } from '@ygg/the-thing/core';
import { RelationAddition } from '@ygg/shopping/core';
import { ImitationPlay } from '@ygg/playwhat/core';
import { v4 as uuid } from 'uuid';
import { random } from 'lodash';
import { Album } from '@ygg/shared/omni-types/core';

export const MinimumPlay = ImitationPlay.createTheThing().fromJSON({
  name: uuid(),
  cells: {
    照片: {
      name: '照片',
      type: 'album',
      value: Album.forge().toJSON()
    },
    副標題: {
      name: '副標題',
      type: 'text',
      value:
        '臭雞味比賽'
    },
    簡介: {
      name: '簡介',
      type: 'longtext',
      value:
        '請帶上自家的傲嬌小肉雞，選出年度最臭雞味冠軍。評審為20年資歷鳥奴，現任3隻肉雞鏟屎官'
    },
    費用: {
      name: '費用',
      type: 'number',
      value: random(10, 300)
    },
    時長: {
      name: '時長',
      type: 'number',
      value: random(30, 120)
    },
    人數下限: {
      name: '人數下限',
      type: 'number',
      value: random(1, 10)
    },
    人數上限: {
      name: '人數上限',
      type: 'number',
      value: random(10, 50)
    }    
  }
});

export const SamplePlays = [
  {
    name: '巷弄騎乘派對',
    tags: ['體驗', 'play', '深度遊趣', '省府日常散策', '協力車'],
    cells: {
      副標題: {
        name: '副標題',
        type: 'text',
        value: '走尋巷弄的故事'
      },
      簡介: {
        name: '簡介',
        type: 'longtext',
        value:
          '騎乘協力車見證台灣近代史的文 化聚落,其中的特殊省府文化, 不只透過眼睛來看見中興新村, 更以美食的嗅覺、手心的觸覺、 耳朵的聽覺等,從全方位的重新 認識過往美好質樸的優閒生活。 (含導覽解說、冷泡茶一瓶)'
      },
      費用: {
        name: '費用',
        type: 'number',
        value: 300
      },
      時長: {
        name: '時長',
        type: 'number',
        value: 120
      },
      人數下限: {
        name: '人數下限',
        type: 'number',
        value: 4
      },
      人數上限: {
        name: '人數上限',
        type: 'number',
        value: 40
      }
    }
  },
  {
    name: '省府苔球風景體驗',
    tags: ['體驗', 'play', '深度遊趣', '省府日常散策', '苔球'],
    cells: {
      副標題: {
        name: '副標題',
        type: 'text',
        value: '帶走中興的一片記憶'
      },
      簡介: {
        name: '簡介',
        type: 'longtext',
        value:
          '透過環境中的花草樹木感受省府 的生命之美,講師將帶領學員認 識環境的植物風景,以手作苔球 將迷人的植物濃縮成一個深邃、 引人駐足的迷你世界,呈現出苔 球獨有寂靜、律動的魅力姿態(學 員可製作帶回一顆苔球)。'
      },
      費用: {
        name: '費用',
        type: 'number',
        value: 350
      },
      時長: {
        name: '時長',
        type: 'number',
        value: 90
      },
      人數下限: {
        name: '人數下限',
        type: 'number',
        value: 2
      },
      人數上限: {
        name: '人數上限',
        type: 'number',
        value: 40
      }
    }
  },
  {
    name: '職人手沖咖啡評鑑體驗',
    tags: ['體驗', 'play', '深度遊趣', '省府日常散策', '咖啡'],
    cells: {
      副標題: {
        name: '副標題',
        type: 'text',
        value: '品味中興職人咖啡'
      },
      簡介: {
        name: '簡介',
        type: 'longtext',
        value:
          '體驗世界咖啡各式品種及口味差 異,藉由實際手作感受不一樣的 香氣,領略一場咖啡的氣味旅行。 (課程學員可自行體驗一杯手沖 咖啡與帶回一包耳掛式)。'
      },
      費用: {
        name: '費用',
        type: 'number',
        value: 450
      },
      時長: {
        name: '時長',
        type: 'number',
        value: 120
      },
      人數下限: {
        name: '人數下限',
        type: 'number',
        value: 6
      },
      人數上限: {
        name: '人數上限',
        type: 'number',
        value: 10
      }
    }
  }
].map(jsonItem => new TheThing().fromJSON(jsonItem));

export const SampleAdditions = [
  {
    name: '四人協力車',
    tags: ['addition', '設備'],
    cells: {
      費用: {
        name: '費用',
        type: 'number',
        value: 100
      }
    }
  },
  {
    name: '二人協力車',
    tags: ['addition', '設備'],
    cells: {
      費用: {
        name: '費用',
        type: 'number',
        value: 75
      }
    }
  }
].map(jsonItem => new TheThing().fromJSON(jsonItem));

SamplePlays[0].addRelations(RelationAddition, SampleAdditions);

export const PlayWithAdditions = SamplePlays[0];