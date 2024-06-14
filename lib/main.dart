import 'dart:io';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:yookatale/views/login/getLocation.dart';
import 'package:yookatale/views/login/login.dart';
import 'package:yookatale/views/login/register.dart';
import 'package:yookatale/views/splashscreen/getSign.dart';
import 'package:yookatale/views/splashscreen/getStarted.dart';
import 'package:yookatale/views/splashscreen/splash.dart';
import 'firebase_options.dart';
import 'gradient/dashboard.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  ByteData data = await PlatformAssetBundle().load('assets/ca/lets-encrypt-r3.pem');
  SecurityContext.defaultContext.setTrustedCertificatesBytes(data.buffer.asUint8List());

  final channel = WebSocketChannel.connect(
    Uri.parse('ws://localhost:4400'), 
  );

  runApp(MyApp(channel: channel));
}

class MyApp extends StatelessWidget {
  final WebSocketChannel channel;

  const MyApp({super.key, required this.channel});

  
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        useMaterial3: true,
      ),
      home: StreamBuilder<User?>(
        stream: FirebaseAuth.instance.authStateChanges(),
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return const Dashboard();
          } else {
            return const SplashScreen();
          }
        },
      ),
      // initialRoute: ,// first route
      routes: {
        SplashScreen.id: (context) => const SplashScreen(),
        Register.id: (context) => const Register(),
        Login.id: (context) => const Login(),
        Dashboard.id: (context) => const Dashboard(),
        GetStartedScreen.id: (context) => const GetStartedScreen(),
        GetStartedSignIn.id: (context) => GetStartedSignIn(),
        GetLocationScreen.id: (context) => GetLocationScreen(),
      },
    );
  }
}
