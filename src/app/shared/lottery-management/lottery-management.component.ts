import { Component,ChangeDetectionStrategy ,OnInit} from '@angular/core';
import { IdentityName } from '@gg/core/src/decorators';
import { LotteryManagementMenuService } from 'src/app/shared/services/lottery-management-menu.service';
import { pluck } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BaseObservableComponent } from '@gg/core/src/component';
import { LotteryFavoriteService } from 'src/app/shared/services/lottery-favorite.service';
@IdentityName('gg-lottery-management')
@Component({
  selector: 'gg-lottery-management',
  templateUrl: './lottery-management.component.html',
  styleUrls: ['./lottery-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LotteryManagementComponent extends BaseObservableComponent implements OnInit  {

  //收藏介面是否開啟中
  private loadFavSub:Subject<boolean> = new Subject<boolean>();
  loadFavSub$ = this.loadFavSub.asObservable();

  //是否在收藏模式
  inCollection$ = this.lotteryManagementSer.isCollectionMode$;
  //目前選中主模式的後台設定Menu資料 
  genreNode$ = this.lotteryManagementSer.genreNode$;
  //根據收藏/彩種模式，切換標題
  genreTitle$ = this.lotteryManagementSer.genreTitle$;
  //後台ＡＰＩ回來的設定菜單資訊
  lotteryMenus$ = this.lotteryManagementSer.lotteryMenus$;
  //目前模式中，設定的子菜單資料
  subGamesOfCurrentMenu$ = this.lotteryManagementSer.subGamesOfCurrentMenu$;

  //目前的最愛資料
  favMenu$ = this.LotteryFavSer.favMenu$;
  fav$ = this.favMenu$.pipe(pluck('myFavGames'));

  readonly strGerneBg:string = 'assets/images/pkv/management/genre_bg';

  standardizeTime(time:number) {
    const now = new Date();
    const endTime = new Date(now.getTime() + (time * 1000));
    const remain = Math.floor((endTime.getTime() - now.getTime()) / 1000);
    return remain;
  }

  constructor(
    private LotteryFavSer:LotteryFavoriteService,
    private lotteryManagementSer:LotteryManagementMenuService) {
      super();
  }

  ngOnInit(): void {
    this.LotteryFavSer.updateFav();
    this.LotteryFavSer.countDown$.subscribe().toUnsubscription(this);
  }

  showMyFav() {
    this.LotteryFavSer.showMyFavModal();
  }

}

