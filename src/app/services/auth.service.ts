// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, from, of, throwError } from 'rxjs';
// import { map, catchError, tap, switchMap } from 'rxjs/operators';
// import { 
//   User, 
//   RegisterData, 
//   LoginData, 
//   UpdateProfileData, 
//   ChangePasswordData 
// } from '../models/user.model';
// import { RxDBService } from '../repository/user-repository-service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   currentUserSubject = new BehaviorSubject<User | null>(null);
//   public currentUser = this.currentUserSubject.asObservable();
//   private userKey = 'acl_recovery_user';
//   private DATABASE_NAME = 'acl_recovery';
//   private USERS_COLLECTION = 'users';

//   constructor(private userRepo: RxDBService) {
//     this.loadUserFromStorage();
//     this.userRepo.subscribe(user => {
//       if (!user) {
//         this.currentUserSubject.next(null);
//       }
//     });
//   }

//   private loadUserFromStorage() {
//     const userJson = localStorage.getItem(this.userKey);
//     if (userJson) {
//       try {
//         const userData = JSON.parse(userJson);
//         this.currentUserSubject.next(userData);
//       } catch (error) {
//         console.error('Invalid user data in storage', error);
//         this.logout();
//       }
//     }
//   }

//   register(userData: RegisterData): Observable<User> {
//     // First register with email/password auth
//     return from(this.userRepo.registerEmailPassword(userData.email, userData.password)).pipe(
//       // Then login to get the user
//       tap(() => console.log('User registered, now logging in')),
//       switchMap(() => this.createUserProfile(userData)),
//       catchError(error => {
//         console.error('Registration error:', error);
//         return throwError(() => new Error(error.message || 'Registration failed'));
//       })
//     );
//   }

//   private createUserProfile(userData: RegisterData): Observable<User> {
//     return from(this.userRepo.loginEmailPassword(userData.email, userData.password)).pipe(
//       switchMap(user => {
//         // Create a new user document in the users collection
//         const userProfile: User = {
//           id: user.id,
//           email: userData.email,
//           firstName: userData.firstName,
//           lastName: userData.lastName,
//           role: 'patient',
//           surgeryDate: userData.surgeryDate,
//           userProfile: userData.userProfile
//         };
        
//         return from(this.getUsersCollection().insertOne(userProfile)).pipe(
//           map(() => {
//             this.setUserSession(userProfile);
//             return userProfile;
//           })
//         );
//       }),
//       catchError(error => {
//         console.error('Error creating user profile:', error);
//         return throwError(() => new Error(error.message || 'Failed to create user profile'));
//       })
//     );
//   }

//   login(loginData: LoginData): Observable<User> {
//     return from(this.userRepo.loginEmailPassword(loginData.email, loginData.password)).pipe(
//       switchMap(user => {
//         return from(this.getUsersCollection().findOne({ id: user.id })).pipe(
//           map(userDoc => {
//             if (!userDoc) {
//               throw new Error('User profile not found');
//             }
//             const userProfile = userDoc as unknown as User;
//             this.setUserSession(userProfile);
//             return userProfile;
//           })
//         );
//       }),
//       catchError(error => {
//         console.error('Login error:', error);
//         return throwError(() => new Error(error.message || 'Login failed'));
//       })
//     );
//   }

//   getCurrentUser(): Observable<User | null> {
//     const currentRealmUser = this.userRepo.getCurrentUser();
//     if (!currentRealmUser) {
//       return of(null);
//     }
    
//     return from(this.getUsersCollection().findOne({ id: currentRealmUser.id })).pipe(
//       map(userDoc => {
//         if (!userDoc) {
//           return null;
//         }
//         const userProfile = userDoc as unknown as User;
//         this.currentUserSubject.next(userProfile);
//         return userProfile;
//       }),
//       catchError(error => {
//         console.error('Error getting current user:', error);
//         return of(null);
//       })
//     );
//   }

//   updateProfile(updateData: UpdateProfileData): Observable<User> {
//     const currentUser = this.currentUserSubject.value;
//     if (!currentUser) {
//       return throwError(() => new Error('No user is logged in'));
//     }
    
//     const updatedUser = { ...currentUser, ...updateData };
    
//     return from(this.getUsersCollection().updateOne(
//       { id: currentUser.id },
//       { $set: updateData }
//     )).pipe(
//       map(() => {
//         this.setUserSession(updatedUser);
//         return updatedUser;
//       }),
//       catchError(error => {
//         console.error('Profile update error:', error);
//         return throwError(() => new Error(error.message || 'Profile update failed'));
//       })
//     );
//   }

//   changePassword(passwordData: ChangePasswordData): Observable<boolean> {
//     // MongoDB Realm doesn't have a direct method to change password
//     // You would need a function in Atlas App Services to handle this
//     // This is a placeholder for that functionality
//     return throwError(() => new Error('Password change not implemented in this version'));
//   }

//   logout(): Observable<void> {
//     localStorage.removeItem(this.userKey);
//     this.currentUserSubject.next(null);
//     return from(this.userRepo.logout());
//   }

//   isLoggedIn(): boolean {
//     return this.userRepo.isLoggedIn() && !!this.currentUserSubject.value;
//   }

//   private setUserSession(user: User): void {
//     localStorage.setItem(this.userKey, JSON.stringify(user));
//     this.currentUserSubject.next(user);
//   }

//   private getUsersCollection() {
//     return this.userRepo.getCollection(this.DATABASE_NAME, this.USERS_COLLECTION);
//   }
// }