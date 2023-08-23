
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:yookatale/views/splashscreen/getStarted.dart';

import '../login/login.dart';


class SplashScreen extends StatefulWidget {

  static const  String id='splash';


  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {


  @override
  void initState() {


    Timer( const Duration(seconds: 4,),(){


      Navigator.pushReplacementNamed(context,GetStartedScreen.id);


    });

    super.initState();
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        mainAxisSize: MainAxisSize.max,
        children: [
          const SizedBox(height: 200,),
          Image.asset('images/logo.jpg',height: 200,),          
          const SizedBox(height: 10,),
          const Spacer(),
          Container(
            height: 200,
            width: double.infinity,
            decoration:  const BoxDecoration(
              image: DecorationImage(
                  image: AssetImage('images/fruits.png'),
                  fit: BoxFit.cover),
            ),)
        ],
      ),
    );
  }
}
