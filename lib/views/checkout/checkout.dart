
import 'package:flutter/material.dart';
import 'package:yookatale/gradient/dashboard.dart';

import '../../gradient/grad.dart';
import '../../main.dart';


class Checkout extends StatefulWidget {
  const Checkout({super.key});

  @override
  State<Checkout> createState() => _CheckoutState();
}

class _CheckoutState extends State<Checkout> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.lightGreen,
        title: const Text("Checkout",style:TextStyle(color: Colors.white),),
      ),
      body:ListView(
        children: [
          Center(
            child: Column(
              children: [

                const SizedBox(
                  height: 20,
                ),
                Image.network(
                  "https://www.yookatale.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo1.54d97587.png&w=384&q=75",
                  width: 115,
                ),
                ListView(
                  shrinkWrap: true,
                  padding: const EdgeInsets.all(24),
                  children: [
                    const SizedBox(
                      height: 20,
                    ),

                    Column(
                      children: [
                        Image.asset(
                          'assets/images/successful.png',
                          width: 250,
                        ),

                        const SizedBox(
                          height: 15,
                        ),

                        const Text(
                          "Your order was successful",
                          style:TextStyle(fontSize: 25),
                          textAlign: TextAlign.center,
                        ),

                        const SizedBox(
                          height: 16,
                        ),

                        const Text(
                          'continue shopping',
                          style:TextStyle(
                              fontSize: 15, color:Colors.grey),
                        ),

                        const SizedBox(
                          height: 8,
                        ),

                      ],
                    ),

                    const SizedBox(
                      height: 30,
                    ),

                    Padding(
                      padding: const EdgeInsets.only(left: 20,right: 20),
                      child: Container(
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
                          child:const Text("Continue shopping",style: TextStyle(color: Colors.white),),
                          onPressed: () {

                            Navigator.push(context, MaterialPageRoute(builder: (context)=>const Dashboard()));

                          },
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
