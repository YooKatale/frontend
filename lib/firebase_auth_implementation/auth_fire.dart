// ignore_for_file: avoid_print, use_build_context_synchronously
import 'package:firebase_auth/firebase_auth.dart';
// ignore: unused_import
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
// ignore: unused_import
import 'package:local_auth/local_auth.dart';
// ignore: unused_import
import 'package:yookatale/gradient/dashboard.dart';

class FirebaseAuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // final FirebaseAuth _auth=FirebaseAuth.instance;
  Future<User?> signUpWithEmailAndPassword(
      String email, String password) async {
    try {
      UserCredential credential = await _auth.createUserWithEmailAndPassword(
          email: email, password: password);
      return credential.user;
    } catch (e) {
      print("some error occured");
    }

    return null;
  }

  Future<User?> signInWithEmailAndPassword(
      String email, String password) async {
    try {
      UserCredential credential = await _auth.signInWithEmailAndPassword(
          email: email, password: password);

      return credential.user;
    } catch (e) {
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
}
