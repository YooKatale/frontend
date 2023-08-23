import 'dart:io';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:yookatale/views/account.dart';
import 'package:yookatale/views/cart.dart';
import 'package:yookatale/views/home.dart';
import 'package:yookatale/views/login/login.dart';
import 'package:yookatale/views/login/register.dart';
import 'package:yookatale/views/splashscreen/getSign.dart';
import 'package:yookatale/views/splashscreen/getStarted.dart';
import 'package:yookatale/views/splashscreen/splash.dart';

import 'firebase_options.dart';
import 'gradient/dashboard.dart';
import 'views/dynamic/categories.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  ByteData data = await PlatformAssetBundle().load('assets/ca/lets-encrypt-r3.pem');
  SecurityContext.defaultContext.setTrustedCertificatesBytes(data.buffer.asUint8List());
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        useMaterial3: true,
      ),
      home:StreamBuilder<User?>(
        stream: FirebaseAuth.instance.authStateChanges(),
        builder: (context,snapshot){

          if(snapshot.hasData){

            return const Dashboard();

          }else{

            return const SplashScreen();
          }
        },
      ),
      // initialRoute: ,// first route
      routes: {
        SplashScreen.id:(context)=>const SplashScreen(),
        Register.id:(context)=>const Register(),
        Login.id:(context)=>const Login(),
        Dashboard.id:(context)=>const Dashboard(),
        GetStartedScreen.id:(context) =>const GetStartedScreen(),
        GetStartedSignIn.id:(context) =>  GetStartedSignIn()
      },
    );
  }
}




