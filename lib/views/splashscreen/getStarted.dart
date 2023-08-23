import 'package:flutter/material.dart';

class GetStartedScreen extends StatelessWidget {
  const GetStartedScreen({Key? key}) : super(key: key);

   static const  String id='getStarted';

  @override
  Widget build(BuildContext context) {   
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        mainAxisSize: MainAxisSize.max,
        children: [
          const SizedBox(height: 50,),
          Image.asset('images/logo.jpg',height: 200,),
          const SizedBox(height: 10,),
          const Spacer(),
          const Text('Welcome to YooKatale', style: TextStyle(color: Colors.green, fontWeight: FontWeight.w500, fontSize: 28, fontStyle: FontStyle.normal),),
          const SizedBox(height: 20),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.green[800]),
            onPressed: (){}, child: const Padding(
              padding: EdgeInsets.all(8.0),
              child: Text('Get Started',style: TextStyle(color: Colors.white, fontWeight: FontWeight.w400, fontSize: 25)),
            )),
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