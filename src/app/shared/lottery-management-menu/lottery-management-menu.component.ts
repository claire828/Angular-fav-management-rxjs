import { Component,ChangeDetectionStrategy ,Input} from '@angular/core';
import { IdentityName } from '@gg/core/src/decorators';
import { Observable } from 'rxjs';
import { LotteryManagementMenuService } from 'src/app/shared/services/lottery-management-menu.service';
import { IMenuNode } from 'src/app/shared/services/menu.service';

@IdentityName('gg-lottery-management-menu')
@Component({
  selector: 'gg-lottery-management-menu',
  templateUrl: './lottery-management-menu.component.html',
  styleUrls: ['./lottery-management-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LotteryManagementMenuComponent  {

  focusId$ = this.lotteryManagementSer.focusId$;
  get lotteryMenus$():Observable<IMenuNode[]> { return this.lotteryManagementSer.lotteryMenus$ };
  get collectionID():number{return this.lotteryManagementSer.CollectionModeId;}
  constructor(
    private lotteryManagementSer:LotteryManagementMenuService
  ) {
  }


  onSwitchMenu(id:number){
    this.lotteryManagementSer.resetFocusId(id);
  }


}

