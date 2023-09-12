// ignore_for_file: avoid_print, use_build_context_synchronously
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:local_auth/local_auth.dart';
import 'package:yookatale/gradient/dashboard.dart';

class FirebaseAuthService{

  final FirebaseAuth _auth=FirebaseAuth.instance;
  Future<User?> signUpWithEmailAndPassword(String email,String password) async{
    try{
      UserCredential credential =await _auth.createUserWithEmailAndPassword(email: email, password: password);
      return credential.user;
    }catch(e){
      print("some error occured");
    }
    return null;
  }

  Future<User?> signInWithEmailAndPassword(String email,String password) async{
    try{
      UserCredential credential =await _auth.signInWithEmailAndPassword(email: email, password: password);
      return credential.user;
    }catch(e){
      print("some error occured");
    }
    return null;
    }
  
  signInWithGoogle() async {
    // triggers authentication flow
    final GoogleSignInAccount? googleUser =
        await GoogleSignIn(scopes: <String>['email']).signIn();
    // gets auth details from the request
    final GoogleSignInAuthentication googleAuth =
        await googleUser!.authentication;
    // creates new credential
    final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken, idToken: googleAuth.idToken);
    // return user credential after sign in
    return await FirebaseAuth.instance.signInWithCredential(credential);
  }

  Future<void> checkBiometricAvailability() async {
    final localAuth = LocalAuthentication();
    try{
      bool canCheckBiometrics = await localAuth.canCheckBiometrics;
      print('Biometric available : $canCheckBiometrics');
    } catch (e) {
      print('Error checking biomterics');
    }
  }
  // to authenticate using fingerprint
  Future<void> authenticateWithFingerprint(BuildContext context) async {
    final localAuth= LocalAuthentication();
    try{
     bool didAuthenticate = await localAuth.authenticate(
      localizedReason: 'Authenticate to access your account',
     );
     if(didAuthenticate) {
      Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => const Dashboard()));
     } else {
      showDialog(
        context: context, 
        builder: (context) {
          return AlertDialog(
            title: const Text('Authenticate'),
            content: const Text('Authentication unsuccessful. Try again'),
            actions: [
              ElevatedButton(onPressed: () {
                Navigator.pop(context);
              }, child: const Text('Ok'))
            ],
          );
        },
        );
     }
    } catch (e) {
     showDialog(
        context: context, 
        builder: (context) {
          return AlertDialog(
            title: const Text('Authenticate'),
            content: const Text('Authentication unsuccessful. Try again'),
            actions: [
              ElevatedButton(onPressed: () {
                Navigator.pop(context);
              }, child: const Text('Ok'))
            ],
          );
        },
        );
    }
  }
}