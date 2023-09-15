// ignore_for_file: avoid_print, use_build_context_synchronously
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:local_auth/local_auth.dart';
import 'package:yookatale/gradient/dashboard.dart';

class FirebaseAuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;

  final LocalAuthentication localAuth = LocalAuthentication();

  // final LocalAuthentication localAuth = LocalAuthentication();

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

  Future<bool> checkBiometricAvailability() async {
    try {
      // Check if biometric authentication is available on the device
      bool canCheckBiometrics = await localAuth.canCheckBiometrics;

      // Check if any biometric methods are available (fingerprint, face, etc.)
      List<BiometricType> availableBiometrics =
          await localAuth.getAvailableBiometrics();

      if (canCheckBiometrics && availableBiometrics.isNotEmpty) {
        // Biometric authentication is available
        return true;
      } else {
        // No biometric methods are available or biometric authentication is not supported
        return false;
      }
    } catch (e) {
      // An error occurred while checking biometric availability
      print("Error checking biometric availability: $e");
      return false;
    }
  }

  Future<bool> authenticateWithFingerprint(BuildContext context) async {
    try {
      // Check if the device supports biometric authentication
      bool canCheckBiometrics = await localAuth.canCheckBiometrics;

      if (canCheckBiometrics) {
        // Perform biometric authentication
        bool isAuthenticated = await localAuth.authenticate(
          localizedReason: 'Authenticate to access your account',
        );

        if (isAuthenticated) {
          // Authentication was successful
          return true;
        } else {
          // Authentication failed or was canceled by the user
          // You can handle errors here, e.g., display a custom error message
          showDialog(
            context: context,
            builder: (context) {
              return AlertDialog(
                title: const Text('Authentication Failed'),
                content: const Text('Biometric authentication failed.'),
                actions: <Widget>[
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                    child: const Text('OK'),
                  ),
                ],
              );
            },
          );

          return false;
        }
      } else {
        // Biometric authentication is not available on the device
        return false;
      }
    } catch (e) {
      // Handle any other errors that may occur
      print("Error during biometric authentication: $e");
      return false;
    }
  }
}
