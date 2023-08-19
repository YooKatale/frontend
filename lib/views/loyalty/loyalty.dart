import 'package:flutter/material.dart';

import '../../gradient/grad.dart';

class LoyaltyPoints extends StatefulWidget {
  const LoyaltyPoints({super.key});

  @override
  State<LoyaltyPoints> createState() => _LoyaltyPointsState();
}

class _LoyaltyPointsState extends State<LoyaltyPoints> {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        backgroundColor:Colors.grey[100],
        appBar: AppBar(
          backgroundColor: Colors.lightGreen,
          title: const Text("Loyality Points",style:TextStyle(color: Colors.white),),
        ),
        body:ListView(
          padding: const EdgeInsets.only(left: 10,right: 10,top: 20),
          children: [
            const Padding(
              padding: EdgeInsets.only(top: 10.0,bottom: 10),
              child: Center(child: Text('Use your loyalty points to buy products',style: TextStyle(fontSize: 20,fontWeight: FontWeight.bold))),
            ),

            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(
                  height: 10,
                ),

                Image.network('https://www.yookatale.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo1.54d97587.png&w=384&q=75',width: 115),

                const SizedBox(height: 30,),
              ],
            ),


            //first name
            const Text('You have 2000 points'),

            const SizedBox(height: 10,),

            //sign up
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(5),
                gradient: LinearGradient(
                  colors:[
                    blueGradient.darkShade,
                    blueGradient.lightShade,
                  ],
                ),
              ),
              child: MaterialButton(
                //color: Colors.green.shade700,
                child:const Text("Use Points",style: TextStyle(color: Colors.white),),
                onPressed: () {



                },
              ),
            ),

            const SizedBox(height: 20,),



          ],
        ),
      ),
    );
  }
}
