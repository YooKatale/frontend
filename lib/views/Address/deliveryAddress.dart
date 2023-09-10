// ignore_for_file: file_names

import 'package:flutter/material.dart';
import 'package:yookatale/views/Address/deliveryslot.dart';

class DeliveryAddress extends StatefulWidget {
  const DeliveryAddress({Key? key}) : super(key: key);

  @override
  State<DeliveryAddress> createState() => _DeliveryAddressState();
}

class _DeliveryAddressState extends State<DeliveryAddress> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        leading: InkWell(
          onTap: ()=> Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new_outlined)),
        title: const Text("Select a Delivery Address",style:TextStyle(color: Colors.black),),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20,vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
               const Row(
                 children:[
                  Icon(Icons.circle, color: Colors.black,),
                  SizedBox(width: 10,),
                   Text("Recently Used", style: TextStyle(fontSize: 16),),
                 ],
               ),
                      const TextField(
                        decoration: InputDecoration(
                          hintText: '86,B/ Ministers Village'
                        ),
                      ),
                      const SizedBox(height: 20),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 0),
                        child: Center(
                          child: SizedBox(
                            width: double.infinity,
                            height: 45,
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(5)
                                ),
                                backgroundColor:  Colors.green.shade700
                              ),
                              onPressed: ()=>Navigator.of(context).push(MaterialPageRoute(builder: (context)=>const DeliverySlot())),
                               child: const Text('Delivery to this address', style: TextStyle(color: Colors.white, fontSize: 18),)),
                          ),
                        ),
                      ),
                      const SizedBox(height: 15),
                      const Row(
                 children: [
                  Icon(Icons.circle, color: Colors.black,),
                  SizedBox(width: 10,),
                   Text("Home", style: TextStyle(fontSize: 16),),
                 ],
               ),
                      const TextField(
                        decoration: InputDecoration(
                          hintText: '86,B/ Ministers Village'
                        ),
                      ),
                      const SizedBox(height: 15),
                      const Row(
                 children: [
                  Icon(Icons.circle, color: Colors.black,),
                  SizedBox(width: 10,),
                   Text("Work", style: TextStyle(fontSize: 16),),
                 ],
               ),
                      const TextField(
                        decoration: InputDecoration(
                          hintText: 'Ntinda'
                        ),
                      ),
                      const SizedBox(height: 30),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 0),
                        child: Center(
                          child: SizedBox(
                            width: double.infinity,
                            height: 50,
                            child: ElevatedButton.icon(
                              icon: const Icon(Icons.location_pin, color: Colors.white,),
                              style: ElevatedButton.styleFrom(
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(5)
                                ),
                                backgroundColor: Colors.green.shade700
                              ),
                              onPressed: ()=>Navigator.of(context).push(MaterialPageRoute(builder: (context)=>const DeliverySlot())), label: const Text('Pick up from store address', style: TextStyle(color: Colors.white, fontSize: 18),)),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20,),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 0),
                        child: Center(
                          child: SizedBox(
                            width: double.infinity,
                            height: 50,
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(5)
                                ),
                                backgroundColor:Colors.green.shade700
                              ),
                              onPressed: (){}, child: const Text('Add a new Address', style: TextStyle(color: Colors.white, fontSize: 18),)),
                          ),
                        ),
                      ),
            ],
          ),
        ),
      ),
    );
  }
}