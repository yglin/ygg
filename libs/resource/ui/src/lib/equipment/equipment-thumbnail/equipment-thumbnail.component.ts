import { Component, OnInit, Input } from '@angular/core';
import { Equipment } from '@ygg/resource/core';

@Component({
  selector: 'ygg-equipment-thumbnail',
  templateUrl: './equipment-thumbnail.component.html',
  styleUrls: ['./equipment-thumbnail.component.css']
})
export class EquipmentThumbnailComponent implements OnInit {
  @Input() equipment: Equipment;
  iconSrc: string;

  constructor() { }

  ngOnInit() {
    this.iconSrc = this.equipment && this.equipment.album && this.equipment.album.cover.src;
  }

}
