
import 'package:email_validator/email_validator.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../gradient/grad.dart';
import '../checkout/checkout.dart';
class DeliveryDetails extends StatefulWidget {
  const DeliveryDetails({super.key});

  @override
  State<DeliveryDetails> createState() => _DeliveryDetailsState();
}

class _DeliveryDetailsState extends State<DeliveryDetails> {

  bool positive = false;
  final _formKey=GlobalKey<FormState>();


  final _fi=TextEditingController();
  final _las=TextEditingController();
  final _phon=TextEditingController();
  final _coun=TextEditingController();
  final _add=TextEditingController();
  final _ema=TextEditingController();
  final _city=TextEditingController();


  @override
  Widget build(BuildContext context) {

    return SafeArea(
      child: Scaffold(
        backgroundColor:Colors.grey[100],
        appBar: AppBar(
          backgroundColor: Colors.lightGreen,
          title: const Text("Delivery Details",style:TextStyle(color: Colors.white),),
        ),
        body:Form(
          key: _formKey,
          child:ListView(
            padding: const EdgeInsets.only(left: 10,right: 10,top: 20),
            children: [
              const Padding(
                padding: EdgeInsets.only(top: 10.0,bottom: 10),
                child: Center(child: Text('Where do you want your Ordered items Delivered????',style: TextStyle(fontSize: 20,fontWeight: FontWeight.bold))),
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
              TextFormField(
                  controller: _fi,
                  cursorColor: Colors.blue.shade200,
                  decoration: InputDecoration(
                      hintText: 'First Name',
                      prefixIcon:const Icon(Icons.person,size: 18,color:Colors.grey,),
                      filled: true,
                      fillColor:Colors.grey.shade200,
                      enabledBorder: UnderlineInputBorder(
                        borderRadius: BorderRadius.circular(4),
                        borderSide: BorderSide.none,
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(4),
                        borderSide: const BorderSide(color: Colors.blue),
                      )
                  ),

                  validator: (value){
                    if(value!.isEmpty){
                      return 'Enter your First Name';

                    }
                    return null;
                  }

              ),

              const SizedBox(height: 10,),

              //lastname
              TextFormField(
                  controller: _las,
                  cursorColor: Colors.blue.shade200,
                  decoration: InputDecoration(
                      hintText: 'Last Name',
                      prefixIcon: const Icon(Icons.person,size: 18,color:Colors.grey,),
                      filled: true,
                      fillColor:Colors.grey.shade200,
                      enabledBorder: UnderlineInputBorder(
                        borderRadius: BorderRadius.circular(4),
                        borderSide: BorderSide.none,
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(4),
                        borderSide: const BorderSide(color: Colors.blue),
                      )
                  ),
                  validator: (value){
                    if(value!.isEmpty){

                      return 'Enter Last Name';
                    }
                    return null;

                  }
              ),

              const SizedBox(height: 10,),

              //phone number
              TextFormField(
                  controller: _phon,
                  cursorColor: Colors.blue.shade200,
                  decoration: InputDecoration(
                      hintText: 'Phone Number',
                      prefixIcon: const Icon(Icons.phone,size: 18,color:Colors.grey,),
                      filled: true,
                      fillColor:Colors.grey.shade200,
                      enabledBorder: UnderlineInputBorder(
                        borderRadius: BorderRadius.circular(4),
                        borderSide: BorderSide.none,
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(4),
                        borderSide: const BorderSide(color: Colors.blue),
                      )
                  ),

                  validator: (value){
                    if(value!.isEmpty){
                      return 'Enter your Phone Number';

                    }
                    return null;
                  }

              ),


              const SizedBox(height: 10,),

              //address
              TextFormField(
                  controller: _add,
                  cursorColor: Colors.blue.shade200,
                  decoration: InputDecoration(
                      hintText: 'Address',
                      prefixIcon: const Icon(Icons.place,size: 18,color:Colors.grey,),
                      filled: true,
                      fillColor:Colors.grey.shade200,
                      enabledBorder: UnderlineInputBorder(
                        borderRadius: BorderRadius.circular(4),
                        borderSide: BorderSide.none,
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(4),
                        borderSide: const BorderSide(color: Colors.blue),
                      )
                  ),

                  validator: (value){
                    if(value!.isEmpty){
                      return 'Enter your Address';

                    }
                    return null;
                  }

              ),

              const SizedBox(height: 10,),

              //email
              TextFormField(
                  controller: _ema,
                  cursorColor: Colors.blue.shade200,
                  decoration: InputDecoration(
                      hintText: 'Email',
                      prefixIcon: const Icon(Icons.email,size: 18,color:Colors.grey,),
                      filled: true,
                      fillColor:Colors.grey.shade200,
                      enabledBorder: UnderlineInputBorder(
                        borderRadius: BorderRadius.circular(4),
                        borderSide: BorderSide.none,
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(4),
                        borderSide: const BorderSide(color: Colors.blue),
                      )
                  ),
                  validator: (value){
                    if(value!.isEmpty){

                      return 'Enter Email';
                    }
                    bool _isValid= (EmailValidator.validate(value));
                    if(_isValid==false){
                      return 'Enter Valid Email Address';

                    }
                    return null;

                  }
              ),

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
                  child:const Text("Continue",style: TextStyle(color: Colors.white),),
                  onPressed: () {



                    Navigator.push(context,MaterialPageRoute(builder: (context)=> const Checkout()));

                  },
                ),
              ),

              const SizedBox(height: 20,),



            ],
          ),
        ),
      ),
    );
  }
}
