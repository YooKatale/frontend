
import 'dart:async';

import 'package:flutter/material.dart';

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


    Timer( const Duration(seconds: 3,),(){


      Navigator.pushReplacementNamed(context,Login.id);


    });

    super.initState();
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(

      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.network('https://www.yookatale.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo1.54d97587.png&w=384&q=75',height: 200,),
            const SizedBox(height: 10,),
          ],
        ),
      ),
    );
  }
}
