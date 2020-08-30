import {
  ImitationEquipment,
  ImitationEquipmentCellDefines,
  ImitationPlay,
  ImitationPlayCellDefines,
  RelationshipEquipment
} from '@ygg/playwhat/core';
import {
  Album,
  BusinessHours,
  Location,
  TimeLength,
  Image
} from '@ygg/shared/omni-types/core';
import { random } from 'lodash';

export const MinimumPlay = ImitationPlay.createTheThing().fromJSON({
  name: `溜鳥鳥體驗(最少需求資料欄位)_${Date.now()}`,
  image: Image.forge().src,
  cells: [
    ImitationPlayCellDefines.album.createCell(Album.forge()),
    ImitationPlayCellDefines.introduction.createCell(
      '請帶上自家的傲嬌小肉雞，選出年度最臭雞味冠軍。評審為20年資歷鳥奴，現任3隻肉雞鏟屎官'
    ),
    ImitationPlayCellDefines.price.createCell(random(10, 300)),
    ImitationPlayCellDefines.timeLength.createCell(
      new TimeLength(random(30, 120))
    ),
    ImitationPlayCellDefines.minimum.createCell(random(1, 10)),
    ImitationPlayCellDefines.maximum.createCell(random(10, 50)),
    ImitationPlayCellDefines.location.createCell(Location.forge())
  ].map(cell => cell.toJSON())
});

export const PlayFull = MinimumPlay.clone();
PlayFull.name = `測試體驗溜鳥鳥(所有資料欄位)_${Date.now()}`;
PlayFull.upsertCells([
  ImitationPlayCellDefines.businessHours.createCell(BusinessHours.forge())
]);

export const SamplePlays = [
  {
    name: `巷弄騎乘派對_${Date.now()}`,
    image: Image.forge().src,
    tags: ['體驗', 'play', '深度遊趣', '省府日常散策', '協力車'],
    cells: [
      ImitationPlayCellDefines.subtitle.createCell('走尋巷弄的故事'),
      ImitationPlayCellDefines.album.createCell(Album.forge()),
      ImitationPlayCellDefines.introduction.createCell(
        '騎乘協力車見證台灣近代史的文 化聚落,其中的特殊省府文化, 不只透過眼睛來看見中興新村, 更以美食的嗅覺、手心的觸覺、 耳朵的聽覺等,從全方位的重新 認識過往美好質樸的優閒生活。 (含導覽解說、冷泡茶一瓶)'
      ),
      ImitationPlayCellDefines.price.createCell(300),
      ImitationPlayCellDefines.timeLength.createCell(new TimeLength(120)),
      ImitationPlayCellDefines.minimum.createCell(4),
      ImitationPlayCellDefines.maximum.createCell(40),
      ImitationPlayCellDefines.location.createCell(Location.forge()),
      ImitationPlayCellDefines.businessHours.createCell(BusinessHours.forge())
    ].map(cell => cell.toJSON())
  },
  {
    name: `省府苔球風景體驗_${Date.now()}`,
    image: Image.forge().src,
    tags: ['體驗', 'play', '深度遊趣', '省府日常散策', '苔球'],
    cells: [
      ImitationPlayCellDefines.subtitle.createCell('帶走中興的一片記憶'),
      ImitationPlayCellDefines.album.createCell(Album.forge()),
      ImitationPlayCellDefines.introduction.createCell(
        '透過環境中的花草樹木感受省府 的生命之美,講師將帶領學員認 識環境的植物風景,以手作苔球 將迷人的植物濃縮成一個深邃、 引人駐足的迷你世界,呈現出苔 球獨有寂靜、律動的魅力姿態(學 員可製作帶回一顆苔球)。'
      ),
      ImitationPlayCellDefines.price.createCell(350),
      ImitationPlayCellDefines.timeLength.createCell(new TimeLength(90)),
      ImitationPlayCellDefines.minimum.createCell(2),
      ImitationPlayCellDefines.maximum.createCell(40),
      ImitationPlayCellDefines.location.createCell(Location.forge()),
      ImitationPlayCellDefines.businessHours.createCell(BusinessHours.forge())
    ].map(cell => cell.toJSON())
  },
  {
    name: `職人手沖咖啡評鑑體驗_${Date.now()}`,
    image: Image.forge().src,
    tags: ['體驗', 'play', '深度遊趣', '省府日常散策', '咖啡'],
    cells: [
      ImitationPlayCellDefines.subtitle.createCell('品味中興職人咖啡'),
      ImitationPlayCellDefines.album.createCell(Album.forge()),
      ImitationPlayCellDefines.introduction.createCell(
        '體驗世界咖啡各式品種及口味差 異,藉由實際手作感受不一樣的 香氣,領略一場咖啡的氣味旅行。 (課程學員可自行體驗一杯手沖 咖啡與帶回一包耳掛式)。'
      ),
      ImitationPlayCellDefines.price.createCell(450),
      ImitationPlayCellDefines.timeLength.createCell(new TimeLength(120)),
      ImitationPlayCellDefines.minimum.createCell(6),
      ImitationPlayCellDefines.maximum.createCell(10),
      ImitationPlayCellDefines.location.createCell(Location.forge()),
      ImitationPlayCellDefines.businessHours.createCell(BusinessHours.forge())
    ].map(cell => cell.toJSON())
  },
  {
    name: `省府植物拓印體驗_${Date.now()}`,
    image: Image.forge().src,
    tags: ['體驗', 'play', '深度遊趣', '省府日常散策', '拓印'],
    cells: [
      ImitationPlayCellDefines.subtitle.createCell('封存美好記憶'),
      ImitationPlayCellDefines.album.createCell(Album.forge()),
      ImitationPlayCellDefines.introduction.createCell(
        '撿拾環境中的落葉、花草,運用畫筆顏料拓印至白紙保留植物的葉脈紋理,透過色彩堆疊與手作溫度保留旅行的記憶,最終親手寫上祝福,替旅行留下最美好句點'
      ),
      ImitationPlayCellDefines.price.createCell(350),
      ImitationPlayCellDefines.timeLength.createCell(new TimeLength(90)),
      ImitationPlayCellDefines.minimum.createCell(2),
      ImitationPlayCellDefines.maximum.createCell(15),
      ImitationPlayCellDefines.location.createCell(Location.forge()),
      ImitationPlayCellDefines.businessHours.createCell(BusinessHours.forge())
    ].map(cell => cell.toJSON())
  },
  {
    name: `省府草地野餐(建議秋冬時節)_${Date.now()}`,
    // tags: ['體驗', 'play', '深度遊趣', '省府日常散策', '野餐'],
    image: Image.forge().src,
    cells: [
      ImitationPlayCellDefines.subtitle.createCell('草地野餐派對'),
      ImitationPlayCellDefines.album.createCell(Album.forge()),
      ImitationPlayCellDefines.introduction.createCell(
        '在最具森林風情的中興野地用餐,簡單的沙拉、熱壓吐司漢堡、湯品、飲品,搭配美好的森林草地,自由自在地徜徉在綠地與樹下,是中興新村最美味的中餐!!'
      ),
      ImitationPlayCellDefines.price.createCell(500),
      ImitationPlayCellDefines.timeLength.createCell(new TimeLength(120)),
      ImitationPlayCellDefines.minimum.createCell(10),
      ImitationPlayCellDefines.maximum.createCell(40),
      ImitationPlayCellDefines.location.createCell(Location.forge()),
      ImitationPlayCellDefines.businessHours.createCell(BusinessHours.forge())
    ].map(cell => cell.toJSON())
  }
].map(jsonItem => ImitationPlay.createTheThing().fromJSON(jsonItem));

export const SampleEquipments = [
  {
    name: `四人協力車_${Date.now()}`,
    image: Image.forge().src,
    tags: ['addition', '設備'],
    cells: [
      ImitationEquipmentCellDefines.price.createCell(100),
      ImitationEquipmentCellDefines.maximum.createCell(6),
      ImitationEquipmentCellDefines.minimum.createCell(1),
      ImitationEquipmentCellDefines.album.createCell(Album.forge())
    ].map(cell => cell.toJSON())
  },
  {
    name: `二人協力車_${Date.now()}`,
    image: Image.forge().src,
    tags: ['addition', '設備'],
    cells: [
      ImitationEquipmentCellDefines.price.createCell(60),
      ImitationEquipmentCellDefines.maximum.createCell(5),
      ImitationEquipmentCellDefines.minimum.createCell(1),
      ImitationEquipmentCellDefines.album.createCell(Album.forge())
    ].map(cell => cell.toJSON())
  }
].map(jsonItem => ImitationEquipment.createTheThing().fromJSON(jsonItem));

SamplePlays[0].addRelations(RelationshipEquipment.name, SampleEquipments);

export const PlaysWithEquipment = SamplePlays.filter(p =>
  p.hasRelation(RelationshipEquipment.name)
);
export const PlaysWithoutEquipment = SamplePlays.filter(
  p => !p.hasRelation(RelationshipEquipment.name)
);
