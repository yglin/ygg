import { SerializableJSON } from '@ygg/shared/infra/core';
import { extend, sample } from 'lodash';

export class Html implements SerializableJSON {
  content: string;

  static isHtml(value: any): value is Html {
    return value && value.content !== undefined;
  }

  static forge(options: any = {}): Html {
    const tag = sample(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre']);
    const textContent = sample([
      '這是一段HTML',
      '經過幾番嘗試，我們發現，蚯蚓等土棲動物並沒有完全消失，而是躲進更深層的土壤之中。這種因應黑冠麻鷺強大捕食壓力的適應行為，並沒有解除我們對找不到蚯蚓這件事的憂慮。',
      '貝魯特160年歷史的蘇索克宮，是當地知名地標，挺過兩次世界大戰，與內戰15年烽火，花了20年恢復往日輝煌，卻在大爆炸短短幾秒之間毀壞，精美的骨董文物碎一地，穹頂破了大洞。',
      '台東林管處在這隻母黑熊身上配掛了衛星發報頸圈，至少能追蹤半年的時間，搜集牠在森林的活動軌跡，進行生態分析。而這次成功野放的台灣黑熊，是台東林管處的第二隻，第一隻是在今年5月野放的廣原小黑熊Mulas，也是母熊，到現在仍能追縱到牠活動的軌跡。',
      '世界上40%以上的蛙處在滅絕的邊緣上，台灣有36種蛙，得天獨厚的，其中有14種是特有種，也就是全世界只在台灣才有。',
      '墾丁國家公園的陸蟹數量以及種類，在世界同棲地是名列前茅。近期有學者更發現5個世界新種，與2個台灣本島新紀錄種其中4個世界新種，來自屏東滿州鄉港口溪。不過學者擔心，因為當地部分河段、沖蝕嚴重，鄉公所規畫堤岸整治工程，恐怕會對生態保育造成危害。',
      '鯨豚家族裡面有一條小齒鯨，可能是基於保護牠的家族，牠的天性，牠們去攻擊了這條鯊魚，這是非常非常難得的紀錄，過去是沒有的',
      '因為獼猴事實上是靈長類動物，牠會有人畜共通傳染病的危險。那獼猴牠是社會性的動物，所以在小時候看起來可能還溫馴可愛，可是牠成年之後會有具有一定的野性。',
      '為了保護珍貴的螢火蟲棲地，金門縣政府和螢火蟲復育團隊藉由推動友善農法，提供農民生態補貼，改善田間生態。他們也將廢棄營區改造成螢火蟲保種中心，希望透過人工飼養來增加螢火蟲的數量，並且將一部分的條背螢送到台北市立動物園昆蟲館飼養，以分散風險。',
      '當海水超過30度，珊瑚就會白化；超過32度，就會真正死亡。夏季已經到了7月份，都還沒有颱風過境、降溫，如果高溫沒有緩解，白化的珊瑚，可能就會邁向死亡。'
    ]);
    return new Html().fromJSON(`<div><${tag}>${textContent}</${tag}></div>`);
  }

  constructor(content?: string) {
    this.content = content;
  }

  fromJSON(data: any): this {
    if (typeof data === 'string') {
      this.content = data;
    } else if (Html.isHtml(data)) {
      extend(this, data);
    }
    return this;
  }

  toJSON(): string {
    return this.content;
  }
}
