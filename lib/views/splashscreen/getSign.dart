import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class GetStartedSignIn extends StatefulWidget {
  GetStartedSignIn({Key? key}) : super(key: key);
  static const  String id='getSignIn';

  @override
  State<GetStartedSignIn> createState() => _GetStartedSignInState();
}

class _GetStartedSignInState extends State<GetStartedSignIn> {
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Container(
          child: Column(
            // mainAxisSize: MainAxisSize.max,
            children: [
              const SizedBox(height: 50,),
              Image.asset('images/logo.jpg',height: 200,),
              const SizedBox(height: 10,),
              const SizedBox(height: 30,),
              const Text('Sign In', style: TextStyle(color: Colors.green, fontWeight: FontWeight.w500, fontSize: 28, fontStyle: FontStyle.normal),),
              const SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal:40, vertical: 0),
                child: Row(
                  children: [
                    const Text('+256', style: TextStyle(color: Colors.black, fontSize: 18, fontStyle: FontStyle.normal),),
                const SizedBox(width: 5),
                Container(
                  width: 200,
                  child: const TextField(
                    style: TextStyle(fontSize: 18),
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                      hintText: 'Enter your Mobile No',
                      hintStyle: TextStyle(color: Colors.grey)
                    ),
                  ),
                )
                  ],
                ),
              ),
              const SizedBox(height: 20),
              const Text('We  will send you a verification code', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.w400, fontSize: 18, fontStyle: FontStyle.normal),),
              const SizedBox(height: 20),
              ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: Colors.green[800]),
                onPressed: (){}, child: const Padding(
                  padding: EdgeInsets.all(8.0),
                  child: Text('Continue',style: TextStyle(color: Colors.white, fontWeight: FontWeight.w400, fontSize: 25)),
                )),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20,vertical: 8),
                    child: Text.rich(
                      TextSpan(
                                  text: 'By clicking on Continue you are agree to our  ',
                                  style: TextStyle(color: Colors.grey,fontSize: 12,fontWeight: FontWeight.bold,),
                                  children: <InlineSpan>[
                                    TextSpan(
                                      text: 'terms of use',
                                      style: TextStyle(color: Colors.green,fontSize: 12,fontWeight: FontWeight.bold, decoration: TextDecoration.underline),
                                    )
                                  ]
                                )
                    ),
                  ),
              
              Text('Or With', style: TextStyle(fontSize: 20, color: Colors.green[400], fontWeight: FontWeight.w400)),
              
              const SizedBox(height: 10,),
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                   const Icon(
        FontAwesomeIcons.facebook,
        color: Colors.blue,
        size: 30,
          ),
          const SizedBox(width: 10,),
          CachedNetworkImage(imageUrl: "https://www.tramvietnam.com.au/wp-content/uploads/2021/07/Illustration-of-Google-icon-on-transparent-background-PNG.png", width: 40,height: 30,)
          
                ],
              ),
              const SizedBox(height: 30,),
              Text("Skip >", style: TextStyle(fontSize: 20, color: Colors.green[400], fontWeight: FontWeight.w400),)
             
            ],
          ),
        ),
      ),
    );
  }
}