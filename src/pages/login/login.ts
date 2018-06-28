import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
//import { AuthProvider } from '../providers/auth/auth';
import { AuthProvider } from '../../providers/providers';
import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  @ViewChild('player') player;

  constructor(public navCtrl: NavController, private auth: AuthProvider) { }

  // It's interesting to remove the src and put it back
  // when entering and leaving the page so there are no memory leaks.
  ionViewWillLeave() {
    // the .nativeElement property of the ViewChild is the reference to the tag <video>
    this.player.nativeElement.src = '';
    this.player.nativeElement.load();
  }

  ionViewWillEnter() {
    this.player.nativeElement.src = 'assets/video/background-480.mp4';
    this.player.nativeElement.load();
  }

  ionViewDidLoad() {
    console.log('Hello Login Page');
  }

  goToLogin(){
    this.navCtrl.push(MainPage);
  }

  goToSignup() {
    console.log('Signup clicked');
  }

  goToFacebookLogin() {
    this.auth.loginWithFacebook().subscribe((success) => {
      console.log(success);
      this.navCtrl.push(MainPage);
      }, err => {
        console.log(err);
    });
  }

  goToGoogleLogin() {
    this.auth.loginWithGoogle().subscribe((success) => {
      console.log(success);
      this.navCtrl.push(MainPage);
      }, err => {
        console.log(err);
    });
  }
}
