import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IdentityName } from '@gg/core/src/decorators';

@IdentityName('gg-lottery-management-menu-item')
@Component({
  selector: 'gg-lottery-management-menu-item',
  templateUrl: './lottery-management-menu-item.component.html',
  styleUrls: ['./lottery-management-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LotteryManagementMenuItemComponent {
  @Output() switchMenu = new EventEmitter<number>();
  @Input() id: number;
  @Input() focus:boolean;
  @Input() iconPath:string;
  constructor() {
  }

  onClick(){
    if(this.focus) return;
    this.switchMenu.emit(this.id);
  }


}

