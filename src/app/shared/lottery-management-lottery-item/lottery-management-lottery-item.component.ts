import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IdentityName } from '@gg/core/src/decorators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MenuNode, LotteryGame } from '@gg/core/src/types/schema';
import { mapTo , map} from 'rxjs/operators';
import { F2eHelper } from '@gg/core';

@IdentityName('gg-lottery-management-lottery-item')
@Component({
  selector: 'gg-lottery-management-lottery-item',
  templateUrl: './lottery-management-lottery-item.component.html',
  styleUrls: ['./lottery-management-lottery-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LotteryManagementLotteryItemComponent {

  private _countDownBs:BehaviorSubject<number> = new BehaviorSubject<number>(0);
  countDown$ = this._countDownBs.pipe(
    map(time=>{
      if(time <= 0) return '--:--:--';
      return F2eHelper.secToHHMMSS(time);
    })
  )


  @Input() lotteryName:string;
  @Input() lottery:MenuNode;
  @Input() lotteryGame:LotteryGame;
  @Input() bgUrl:string;
  @Input() set time(value:number){
    this._countDownBs.next(value);
  }
  constructor() {
  }


}

