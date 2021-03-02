import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

declare const cordova: any
@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {

  readmsg: string;
  writemsg: string;
  constructor(
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  back() {
    this.navCtrl.back();
  }

  readCard() {
    cordova.plugin.uhf.readCard(
      res => { this.readmsg = res; },
      err => { this.readmsg = err; }
    );
  }

  writeCard() {
    console.log(this.writemsg);
    cordova.plugin.uhf.writeCard({ data: this.writemsg }, res => { this.readmsg = res; }, err => { this.readmsg = err;});
  }
}
