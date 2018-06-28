import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import 'rxjs/add/operator/map';

/*
  Generated class for the ActuProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ActuProvider {

  private actuRef = this._af.list('news');

  constructor(private _af: AngularFireDatabase) {
    console.log('Hello ActuProvider Provider');
  }

  public listNews(){
    return this.actuRef;

}

}
