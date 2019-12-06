import { extend } from 'lodash';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Accommodation, AccommodationFormGroupModel } from '@ygg/resource/core';
import { FormGroupModel } from '@ygg/shared/ui/dynamic-form';
import { AccommodationService } from '@ygg/resource/data-access';

@Component({
  selector: 'ygg-accommodation-control',
  templateUrl: './accommodation-control.component.html',
  styleUrls: ['./accommodation-control.component.css']
})
export class AccommodationControlComponent implements OnInit {
  @Input() accommodation: Accommodation;
  @Output() saved: EventEmitter<Accommodation> = new EventEmitter();
  formGroupModel: FormGroupModel = AccommodationFormGroupModel;

  constructor(private accommodationService: AccommodationService) {}

  ngOnInit() {}

  async onSubmit(accommodation: Accommodation) {
    if (accommodation && confirm(`確定要修改/新增 ${accommodation.name}？`)) {
      delete accommodation.id;
      extend(this.accommodation, accommodation);
      try {
        await this.accommodationService.upsert(this.accommodation);
        alert(`修改/新增 ${accommodation.name} 完成`);
        this.saved.emit(this.accommodation);
      } catch (error) {
        alert(`修改/新增 ${accommodation.name} 失敗，錯誤：\n${error.message}`);
      }
    }
  }
}
