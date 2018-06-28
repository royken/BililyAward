import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase} from 'angularfire2/database';
import { Observable } from "rxjs/Observable";
import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook'; //Added Facebook
import { GooglePlus } from '@ionic-native/google-plus'; //Added Google
import * as firebase from 'firebase';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

	authState: any = null;

  	constructor(private af: AngularFireAuth, private fb: Facebook,private googlePlus: GooglePlus ,private platform: Platform, private db: AngularFireDatabase) {
    	console.log('Hello AuthProvider Provider');
    	this.af.authState.subscribe((auth) => {
              this.authState = auth
		});
  	}

	loginWithFacebook() {
		return Observable.create(observer => {
			if (this.platform.is('cordova')) {
				return this.fb.login(['email', 'public_profile']).then(res => {
					const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
					this.af.auth.signInWithCredential(facebookCredential).then(() => {
						console.log("Firebase success: ");
						//this.updateUserData();
						observer.next();
					}).catch(error => {
					//console.log(error);
						observer.error(error);
					});
				});
			} else {
				return this.af.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(()=>{
					observer.next();
				}).catch(error => {
					observer.error(error);
				});
			}
		});
	}



	loginWithGoogle() {
		return Observable.create(observer => {
			if (this.platform.is('cordova')) {
				return this.googlePlus.login({
    						'webClientId': '639803807192-vuc97f91p13mu6es2g381qiuul5j0854.apps.googleusercontent.com',
    						'offline': true,
    						'scopes': 'profile email'
  						}).then(res => {
  							console.log("start");
							const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
							console.log("have credential");
							this.af.auth.signInWithCredential(googleCredential).then(() => {
								console.log("Firebase success: ");
								//this.updateUserData();
								observer.next();
							}).catch(error => {
							console.log("Erreur 1" + JSON.stringify(error));
							observer.error(error);
						});
				}).catch(error => {
							console.log("Erreur 2" + JSON.stringify(error));
							observer.error(error);
						});
			} else {
				return this.af.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(()=>{
					observer.next();
				}).catch(error => {
				console.log(error);
					observer.error(error);
				});
			}
		});
	}





 	// Returns true if user is logged in
  	get authenticated(): boolean {
    	return this.authState !== null;
	}

	//// Sign Out ////
  	signOut(): void {
    	this.af.auth.signOut();
    	//this.router.navigate(['/'])
	}

  	logout() {
		//this.af.auth.logout();
  	}

  	get currentUser(): any {
    	return this.authenticated ? this.authState : null;
	}

  	// Returns
  	get currentUserObservable(): any {
    	return this.af.authState;
  	}

  	// Returns current user UID
  	get currentUserId(): string {
    	return this.authenticated ? this.authState.uid : '';
	}

	// Returns current user display name or Guest
  	get currentUserDisplayName(): string {
    	if (!this.authState) { return 'Guest' }
    	//else if (this.currentUserAnonymous) { return 'Anonymous' }
    	else { return this.authState['displayName'] || 'User without a Name' }
	}

	//// Helpers ////
  	private updateUserData(): void {
  		// Writes user name and email to realtime db
  		// useful if your app displays information about users or for admin features
    	let path = `users/${this.currentUserId}`; // Endpoint on firebase
    	let data = {
                  email: this.authState.email,
                  name: this.authState.displayName
        }

    	this.db.object(path).update(data).catch(error => console.log(error));

}

}
