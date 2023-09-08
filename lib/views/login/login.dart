
// ignore_for_file: avoid_print, use_build_context_synchronously

import 'package:email_validator/email_validator.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:yookatale/views/login/register.dart';

import '../../firebase_auth_implementation/auth_fire.dart';
import '../../gradient/dashboard.dart';

class Login extends StatefulWidget {

  static const  String id='login';

  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {

  final FirebaseAuthService _auth=FirebaseAuthService();

  final _formKey=GlobalKey<FormState>();
  final _ema=TextEditingController();
  final _pass=TextEditingController();



  bool _secureText = true;

  showHide() {
    setState(() {
      _secureText = !_secureText;
    });
  }

  @override
  void dispose() {

    _ema.text;
    _pass.text;
    // TODO: implement dispose
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      child: Scaffold(
        //resizeToAvoidBottomInset: false,
        backgroundColor:Colors.white,
        body: SingleChildScrollView(
          child: Column(
            children: [
              const SizedBox(height: 40,),
                  Image.asset('images/logo.jpg',height: 200,),
                  // const SizedBox(height: 10,),
                  const Text('Sign In', style: TextStyle(color: Colors.green, fontWeight: FontWeight.w500, fontSize: 28, fontStyle: FontStyle.normal),),
                  const SizedBox(height: 20),
            Form(
            key: _formKey,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                // padding:const EdgeInsets.only(left: 10,right: 10),
                children:  [                    
                  //email
                  TextFormField(
                      controller: _ema,
                      cursorColor: Colors.blue.shade200,
                      decoration: InputDecoration(
                          hintText: 'Email',
                          prefixIcon: const Icon(Icons.email,size: 18,color:Colors.green,),
                          filled: true,
                          fillColor:Colors.white,
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15),
                            borderSide: const BorderSide(color: Colors.grey, width: 1),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15),
                            borderSide: const BorderSide(color: Colors.green, width: 2),
                          )
                      ),
                      validator: (value){
                        if(value!.isEmpty){        
                          return 'Enter Email';
                        }
                        bool isValid= (EmailValidator.validate(value));
                        if(isValid==false){
                          return 'Enter Valid Email Address';
        
                        }
                        return null;
        
                      }
                  ),
        
                  const SizedBox(height: 20,),        
                  //password
                  TextFormField(
                      controller: _pass,
                      cursorColor: Colors.blue.shade200,
                      obscureText: _secureText,
                      decoration: InputDecoration(
                          hintText: 'Password',
                          prefixIcon:const Icon(Icons.lock,size: 18,color:Colors.green,),
                          suffixIcon: IconButton(
                            onPressed: showHide,
                            icon: _secureText
                                ? const Icon(
                              Icons.visibility_off,
                              color: Colors.green,
                              size: 20,
                            )
                                : const Icon(
                              Icons.visibility,
                              color: Colors.green,
                              size: 20,
                            ),
                          ),
                          filled: true,
                          fillColor:Colors.white,
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15),
                            borderSide: const BorderSide(color: Colors.grey, width: 1),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15),
                            borderSide: const BorderSide(color: Colors.green, width: 2),
                          )
                      ),
        
                      validator: (value){
                        if(value!.isEmpty){
                          return 'Enter your Password';
        
                        }
                        return null;
                      }
        
                  ),
        
                  const SizedBox(height: 10,),  
                ],
              ),
            ),
          ),
          Align(
                      alignment: Alignment.centerRight,
                      child: InkWell(
                        onTap: (){
                        },
                        child:  const Padding(
                          padding: EdgeInsets.only(right: 15.0),
                          child: Text('Forgot password?',style: TextStyle(color: Colors.grey),
                          ),
                        ),
                      )),

                  const SizedBox(height: 20,),
                  Padding(
                    padding: const EdgeInsets.only(left: 20,right: 20),
                    child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: Colors.green[800]),
                onPressed: (){
                  _signIn(context);        
                        FirebaseAuth.instance.createUserWithEmailAndPassword(email:_ema.text.trim(), password:_pass.text.trim());
                }, child: const Padding(
                  padding: EdgeInsets.all(8.0),
                  child: Text('Login',style: TextStyle(color: Colors.white, fontWeight: FontWeight.w400, fontSize: 25)),
                )), ),

                  const SizedBox(height: 20,),
                 Align(
                      alignment: Alignment.center,
                      child: InkWell(
                        onTap: (){

                          Navigator.pushReplacementNamed(context,Register.id);

                        },
                        child:   const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 15),
                          child: Text('Dont have an account? ${'Sign Up'}',style: TextStyle(color: Colors.grey, fontSize: 16),
                          ),
                        ),
                      )),          
            ],
          ),
        ),
      ),
      // child: Scaffold(
      //   //resizeToAvoidBottomInset: false,
      //   backgroundColor:Colors.white,
      //   body: SafeArea(

      //       child:Form(
      //         key: _formKey,
      //         child: ListView(
      //           padding:const EdgeInsets.only(left: 10,right: 10),
      //           children:  [
      //             const Padding(
      //               padding: EdgeInsets.only(top: 30.0,bottom: 30),
      //               child: Center(child: Text('LOGIN',style: TextStyle(fontSize: 30,fontWeight: FontWeight.bold))),
      //             ),



      //             Column(
      //               mainAxisAlignment: MainAxisAlignment.start,
      //               crossAxisAlignment: CrossAxisAlignment.start,
      //               children: [
      //                 const SizedBox(
      //                   height: 30,
      //                 ),

      //                 Image.network('https://www.yookatale.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo1.54d97587.png&w=384&q=75',width: 115),

      //                 const SizedBox(height: 30,),
      //               ],
      //             ),


      //             //email textfield
      //             TextFormField(
      //                 controller: _ema,
      //                 cursorColor: Colors.blue.shade200,
      //                 decoration: InputDecoration(
      //                     hintText: 'Email',
      //                     prefixIcon:const Icon(Icons.email,size: 18,color:Colors.grey,),
      //                     filled: true,
      //                     fillColor:Colors.grey.shade200,
      //                     enabledBorder: UnderlineInputBorder(
      //                       borderRadius: BorderRadius.circular(4),
      //                       borderSide: BorderSide.none,
      //                     ),
      //                     focusedBorder: OutlineInputBorder(
      //                       borderRadius: BorderRadius.circular(4),
      //                       borderSide: const BorderSide(color: Colors.blue),
      //                     )
      //                 ),
      //                 validator: (value){
      //                   if(value!.isEmpty){

      //                     return 'Enter Email';
      //                   }
      //                   bool _isValid= (EmailValidator.validate(value));
      //                   if(_isValid==false){
      //                     return 'Enter Valid Email Address';

      //                   }
      //                   return null;

      //                 }
      //             ),

      //             const SizedBox(height: 10,),


      //             //password textfiled
      //             TextFormField(
      //                 controller: _pass,
      //                 cursorColor: Colors.blue.shade200,
      //                 obscureText: _secureText,
      //                 decoration: InputDecoration(
      //                     hintText: 'Password',
      //                     prefixIcon: const Icon(Icons.lock,size: 18,color:Colors.grey,),
      //                     suffixIcon: IconButton(
      //                       onPressed: showHide,
      //                       icon: _secureText
      //                           ? const Icon(
      //                         Icons.visibility_off,
      //                         color: Colors.grey,
      //                         size: 20,
      //                       )
      //                           : const Icon(
      //                         Icons.visibility,
      //                         color: Colors.grey,
      //                         size: 20,
      //                       ),
      //                     ),
      //                     filled: true,
      //                     fillColor:Colors.grey.shade200,
      //                     enabledBorder: UnderlineInputBorder(
      //                       borderRadius: BorderRadius.circular(4),
      //                       borderSide: BorderSide.none,
      //                     ),
      //                     focusedBorder: OutlineInputBorder(
      //                       borderRadius: BorderRadius.circular(4),
      //                       borderSide: const BorderSide(color: Colors.blue),
      //                     )
      //                 ),

      //                 validator: (value){
      //                   if(value!.isEmpty){
      //                     return 'Enter your Password';

      //                   }
      //                   return null;
      //                 }

      //             ),

      //             const SizedBox(height: 10,),

      //             Align(
      //                 alignment: Alignment.centerRight,
      //                 child: InkWell(
      //                   onTap: (){


      //                   },
      //                   child:  const Text('Forgot password?',style: TextStyle(color: Colors.blue),
      //                   ),
      //                 )),

      //             const SizedBox(height: 20,),

      //           Padding(
      //       padding: const EdgeInsets.only(left: 20,right: 20),
      //       child: ElevatedButton(
      //         style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
      //         onPressed: (){

      //           _signIn(context);


      //           //FirebaseAuth.instance.signInWithEmailAndPassword(email:_ema.text, password:_pass.text);


      //         }, child:const Text('Login',style: TextStyle(color: Colors.white),),
      //       ),
      //     ),

      //             const SizedBox(height: 20,),

      //             Align(
      //                 alignment: Alignment.centerLeft,
      //                 child: InkWell(
      //                   onTap: (){

      //                     Navigator.pushReplacementNamed(context,Register.id);

      //                   },
      //                   child:   const Text('Dont have an account? ${'Sign Up'}',style: TextStyle(color: Colors.blue),
      //                   ),
      //                 )),

      //             const SizedBox(height: 50,),
      //           ],
      //         ),
      //       )
      //   ),
      // ),
      onWillPop:() async{

        return false;
      },
    );
  }

  void _signIn(BuildContext context) async{

    String email=_ema.text;
    String pass=_pass.text;


    User? user = await _auth.signInWithEmailAndPassword(email,pass);

    if(user != null){

      print("user successfully signed in");

      // if(context.mounted){
        Navigator.pushReplacementNamed(context,Dashboard.id);
      // }


    }else{

      print("some error ocurred");

    }




  }

}
