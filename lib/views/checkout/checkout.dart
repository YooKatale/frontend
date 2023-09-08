
import 'package:flutter/material.dart';
import 'package:yookatale/gradient/dashboard.dart';


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
        automaticallyImplyLeading: false,
      ),
      body:Center(
        child: Column(
          children: [
          const SizedBox(height: 50,),
            Icon(Icons.check_circle, color: Colors.green.shade400, size: 200,),
            const SizedBox(
                  height: 30,
                ),
         const Text("Order Placed Successfully", style:TextStyle(fontSize: 20, color: Colors.green),
           textAlign: TextAlign.center,
                    ),

                    
                const SizedBox(
                  height: 70,
                ),

                Padding(
                  padding: const EdgeInsets.only(left: 20,right: 20),
                  child: Container(
                    width: 200,
                    height: 50,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(25),
                      
                    ),
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green.shade700,
                      ),
                      child:const Text("Keep shopping",style: TextStyle(color: Colors.white, fontSize: 18),),
                      onPressed: () {

                        Navigator.push(context, MaterialPageRoute(builder: (context)=>const Dashboard()));

                      },
                    ),
                  ),
                ),
              
          ],
        ),
      ),
    );
  }
}
