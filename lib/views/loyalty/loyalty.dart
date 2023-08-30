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
    return Scaffold(
      backgroundColor:Colors.white,
      appBar: AppBar(
        title: const Text("Loyality Points",style:TextStyle(),),
        backgroundColor:Colors.white,
        leading: InkWell(
          onTap: ()=> Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new_outlined)),
      ),
      body:ListView(
        padding: const EdgeInsets.only(left: 10,right: 10,top: 20),
        children: [
          const Padding(
            padding: EdgeInsets.only(top: 10.0,bottom: 10),
            child: Center(child: Text('Use your loyalty points to buy products',style: TextStyle(fontSize: 20,fontWeight: FontWeight.bold), textAlign: TextAlign.center,)),
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
          const Center(child: Text('You have 2000 points')),

          const SizedBox(height: 10,),

          //sign up
          Padding(
            padding: const EdgeInsets.all(25.0),
            child: Container(
              width: 200,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(15),
                color: Colors.green[600]
                // gradient: LinearGradient(
                //   colors:[
                //     blueGradient.darkShade,
                //     blueGradient.lightShade,
                //   ],
                // ),
              ),
              child: MaterialButton(
                child:const Text("Use Points",style: TextStyle(color: Colors.white, fontSize: 18),),
                onPressed: () {



                },
              ),
            ),
          ),

          const SizedBox(height: 20,),



        ],
      ),
    );
  }
}
