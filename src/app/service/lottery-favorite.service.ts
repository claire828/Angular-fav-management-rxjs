
import { Injectable } from '@angular/core';
import { BehaviorSubject,combineLatest, EMPTY, interval, of, Subject } from 'rxjs';
import { filter, map, tap, pluck, withLatestFrom, distinctUntilChanged, switchMap, delay } from 'rxjs/operators';
import { MenuService } from './menu.service';
import { MenuTypeEnum, MenuNode, LotteryGame, Query } from '@gg/core/src/types/schema';
import { F2eHelper, ModalService } from '@gg/core';
import { MyFavGameComponent } from 'src/app/ui/lottery/my-fav-game/my-fav-game.component';

@Injectable({
  providedIn: 'root'
})
export class LotteryFavoriteService {
  
  private loadFavSub:Subject<boolean> = new Subject<boolean>();
  private favMenu:BehaviorSubject<{configGames:LotteryGame[], myFavGames:LotteryGame[]}> = new BehaviorSubject<{configGames:LotteryGame[], myFavGames:LotteryGame[]}>({configGames:[],myFavGames:[]});
  //[開放取得] 收藏最愛資料
  favMenu$ = this.favMenu.asObservable();
  fav$ = this.favMenu$.pipe(pluck('myFavGames'));


  //[開放註冊]： 如需要倒數秒數, 並且過期進行更新，註冊此即可
  countDown$ = interval(1000).pipe(
    withLatestFrom(this.fav$),
    map(([count,fav])=> fav),
    map(fav=>{
      let timeOut:boolean;
      const after = fav.map(myFavItem=>{
        if (myFavItem.lottery_cycle_now && myFavItem.lottery_cycle_now.now_cycle_count_down >= 0) {
          const remain = this.standardizeTime(myFavItem.lottery_cycle_now.now_cycle_count_down) - 1;
          myFavItem.lottery_cycle_now.now_cycle_count_down = remain;
          if (remain < 0) timeOut=true;
        }
        return myFavItem;
      });
      this.favMenu.next({ configGames:this.favMenu.value.configGames, myFavGames:after } );
      return timeOut;
    }),
    filter(Boolean),
    switchMap( ()=>{
      this.updateFav();
     return of(EMPTY);
    })
  )

  //打開收藏modal
  showMyFavModal() {
    this.loadFavSub.next(true);
  }

  //取得更新我的收藏資料
  updateFav(){
    const sub = this.menuSer.getFavoriteLotterysV2().valueChanges.pipe(
      pluck('data'),
      filter(Boolean),
      map(data=> data as Query),
      map(data=> {
        const configGames = data.Config.favorite_lottery;
        const myFavGames = data.User.favorite_lottery.reduce((acc, curr) => {
          if (!acc.find(fav => fav.game_id === curr.game_id)) acc.push(curr); 
          return acc;
        }, F2eHelper.recursiveDeepCopy<LotteryGame[]>(configGames));
        return { configGames, myFavGames}
      }),
      tap(x=>{
        this.favMenu.next(x);
      }),
      delay(3000), //給予一點緩衝時間再刪除，避免detection life cycle還沒結束
    ).subscribe(x=>{
      sub.unsubscribe();
    });
  }
 
  //打開收藏面板監聽
  private openFavoriteModal$ = this.loadFavSub.pipe(
    distinctUntilChanged(),
    filter(Boolean),
    withLatestFrom(this.favMenu$),
    tap(([loading,{configGames, myFavGames}])=>{
      this.modalSer.open(MyFavGameComponent, {
        closeOnBackdropClick: true
      }, component => {
        component.lotteryList = this.menuSer.lotteryMainMenu;
        component.configGames = configGames;
        component.myFavList = myFavGames;
        component.callAfterClose = ()=>{
         // console.log('close modal')
          this.loadFavSub.next(false);
          this.updateFav();
        }
      });
    })
  )

  private standardizeTime(time:number) {
    const now = new Date();
    const endTime = new Date(now.getTime() + (time * 1000));
    const remain = Math.floor((endTime.getTime() - now.getTime()) / 1000);
    return remain;
  }
  constructor(private menuSer:MenuService, private modalSer: ModalService,) {
    this.openFavoriteModal$.subscribe()
  }
}

