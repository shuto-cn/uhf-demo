import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

declare const cordova: any
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  cardlist: Card[] = [];
  searchCardFlag = false;
  power: number;
  constructor(
    private navCtrl: NavController,
  ) { }

  singleSerchCard() {
    this.cardlist = [];
    cordova.plugin.uhf.searchCard(res => { this.cardlist = res }, err => { console.log(err); });
  }
  stopSerchCard() {
    this.searchCardFlag = false;
  }
  searchCard() {
    cordova.plugin.uhf.searchCard(res => {
      let removeFlag = false;
      for (const card of res) {
        removeFlag = false;
        for (const _card of this.cardlist) {
          if (card.mEpcBytes === _card.mEpcBytes) {
            removeFlag = true;
            _card.count++;
            break;
          }
        }
        if (!removeFlag) {
          this.cardlist.push({
            mEpcBytes: card.mEpcBytes,
            mRssi: card.mRssi,
            count: 0
          });
        }
      }
      if (this.searchCardFlag) {
        setTimeout(() => {
          this.searchCard();
        }, 300);
      } else {
        return;
      }
    }, err => { console.log(err); });

  }
  startSearchCard() {
    this.cardlist = [];
    this.searchCardFlag = true;
    this.searchCard();
  }
  selectCard(card: Card) {
    cordova.plugin.uhf.selectCard({ epc: card.mEpcBytes },
      res => { this.navCtrl.navigateRoot('card') },
      err => { console.log(err); }
    );
  }
  setPower() {
    cordova.plugin.uhf.setPower(this.power, res => { console.log(res); }, err => { console.log(err); })
  }
}

interface Card {
  mEpcBytes: string;
  mRssi: number;
  count?: number;
}
