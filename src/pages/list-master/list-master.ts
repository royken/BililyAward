import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { ActuProvider } from '../../providers/providers';
import { AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { Item } from '../../models/item';
import { Items } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];
  public actus: any[];
  loading: any;

  constructor(public navCtrl: NavController, public items: Items, public modalCtrl: ModalController, public db: ActuProvider, public loadingCtrl: LoadingController) {
    //this.currentItems = this.items.query();
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.showLoader();
    this.db.listNews()   // DB List
                              .snapshotChanges()   // Key Value Pairs
                              .map(
                                  changes => {
                                    return changes.map(c => ({
                                      key: c.payload.key, ...c.payload.val()
                                    }))
                                  }
                                ).subscribe(actus => {
                                  this.actus = actus;
                                  console.log('events :', this.actus);
                                  this.hideLoader();
                              })
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item);
      }
    })
    addModal.present();
  }

  showLoader(){
    this.loading.present();
  }

  hideLoader(){
    this.loading.dismiss();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }

  detailPage(actu){
    this.navCtrl.push('ItemDetailPage',{actu: actu});
  }
}
