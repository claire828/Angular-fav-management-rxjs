
import { Injectable } from '@angular/core';
import { BehaviorSubject,combineLatest } from 'rxjs';
import { filter, map, tap, pluck, withLatestFrom, distinctUntilChanged } from 'rxjs/operators';
import { MenuService } from './menu.service';
import { MenuTypeEnum, MenuNode } from '@gg/core/src/types/schema';

@Injectable({
  providedIn: 'root'
})
export class LotteryManagementMenuService {
  public readonly CollectionModeId:number = 0;

  private focusId:BehaviorSubject<number> = new BehaviorSubject<number>(this.CollectionModeId);
  focusId$ = this.focusId.asObservable();

  //收藏模式 or 彩種模式
  isCollectionMode$ = this.focusId$.pipe(
    distinctUntilChanged(),
    map(id => id === 0));
  
  //菜單管理中，篩選出純彩種的主類別
  lotteryMenus$ = this.menuSer.leftSideMenu$.pipe(
    map(menus=> menus.filter(x=>x.type === MenuTypeEnum.Title )),
    map(menus=> menus.filter(x=> !['菜单'].includes(x.name) )),
   // tap(x=>console.log(`print:${JSON.stringify(x)}`))
  )

  mainGenreOfCurrentMenu$ = combineLatest([this.focusId$, this.lotteryMenus$]).pipe(
    filter(([id,menus])=> id !== this.CollectionModeId),
    map(([id,menus])=> {
      const nodes = menus as MenuNode[];
      return nodes.find(x=>x.id === id);
    })
  );
  
  //根據彩種類別，內部的彩種遊戲資料
  subGamesOfCurrentMenu$ = this.mainGenreOfCurrentMenu$.pipe(
    map(mainMenu=>mainMenu?.tree)
  )


  //目前選中主模式的後台設定Menu資料 
  genreNode$ = this.focusId$.pipe(
    withLatestFrom(this.lotteryMenus$),
    map(([id,menus])=>{
      return menus.find(x=>x.id === id);
    })
  );
  
  //根據收藏/彩種模式，切換標題
  genreTitle$ = this.focusId$.pipe(
    withLatestFrom(this.lotteryMenus$, this.isCollectionMode$),
    map(([id,menus,inCollection])=>{
      if(inCollection) return '我的收藏';
      return menus.find(x=>x.id === id).name;
    })
  );

  constructor(private menuSer:MenuService) {
  }

  public resetFocusId(id:number){
    this.focusId.next(id);
  }

}

