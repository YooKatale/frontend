import 'package:email_validator/email_validator.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:yookatale/views/home.dart';

import '../../firebase_auth_implementation/auth_fire.dart';
import '../../gradient/dashboard.dart';
import 'login.dart';

class Register extends StatefulWidget {

  static const  String id='register';


  const Register({super.key});

  @override
  State<Register> createState() => _RegisterState();
}

class _RegisterState extends State<Register> {


  //final FirebaseAuthService _auth=FirebaseAuthService();
  // jude modifications
  // final FirebaseAuth _auth = FirebaseAuth.instance;
  // final GlobalKey<FormState> _formkey = GlobalKey<FormState>();
  // //final _formKey=GlobalKey<FormState>();
  // late String _email, _password, _name;
  // checkAuthentification() async {
  //   _auth.authStateChanges().listen((user) async {
  //     if (_auth.currentUser != null) {
  //       Navigator.push(
  //           context, MaterialPageRoute(builder: (context) => HomePage()));
  //     }
  //   });
  // }
  //
  //
  //
  // //final _formKey=GlobalKey<FormState>();
  //
  // //final _name=TextEditingController();
  // final _num=TextEditingController();
  // final _ema=TextEditingController();
  // final _pass=TextEditingController();
  // final _address=TextEditingController();
  // final _lon=TextEditingController();
  // final _lat=TextEditingController();
  //


  // bool verifyButton=false;
  //
  bool _secureText = true;
  showHide() {
    setState(() {
      _secureText = !_secureText;
    });
  }

  @override
  // void dispose() {
  //
  //   _ema.text;
  //   _pass.text;
  //   // TODO: implement dispose
  //   super.dispose();
  // }
  //

  // new method

  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GlobalKey<FormState> _formkey = GlobalKey<FormState>();
  late String _email, _password, _name;
  checkAuthentification() async {
    _auth.authStateChanges().listen((user) async {
      if (_auth.currentUser != null) {
        Navigator.push(
            context, MaterialPageRoute(builder: (context) => Login()));
      }
    });
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    this.checkAuthentification();
  }

  signup() async {
    if (_formkey.currentState!.validate()) {
      _formkey.currentState!.save();
      try {
        UserCredential user = await _auth.createUserWithEmailAndPassword(
            email: _email, password: _password);
        if (user != null) {
          await FirebaseAuth.instance.currentUser!
              .updateProfile(displayName: _name);
        }
      } catch (e) {
        showError(e.toString());
      }
    }
  }

  showError(String errormessage) {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text('error'),
            content: Text(errormessage),
            actions: [
              MaterialButton(
                color: Colors.blue,
                onPressed: () {},
                child: Text('ok'),
              )
            ],
          );
        });
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      child:Scaffold(
        //resizeToAvoidBottomInset: false,
        backgroundColor:Colors.white,
        body: SafeArea(
            child:Form(
              key: _formkey,
              child: ListView(
                padding:const EdgeInsets.only(left: 10,right: 10),
                children:  [
                  const Padding(
                    padding: EdgeInsets.only(top: 30.0,bottom: 30),
                    child: Center(child: Text('REGISTER',style: TextStyle(fontSize: 30,fontWeight: FontWeight.bold))),
                  ),

                  Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(
                        height: 30,
                      ),

                      Image.network('https://www.yookatale.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo1.54d97587.png&w=384&q=75',width: 115),

                      const SizedBox(height: 30,),
                    ],
                  ),


                  const SizedBox(height: 10,),

                  //email
                  TextFormField(
                      // controller: _ema,
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
                        value!.isEmpty ? 'Enter Email' : null;
                        bool _isValid= (EmailValidator.validate(value));

                        if(_isValid==false){
                          return 'Enter Valid Email Address';

                        }
                      },
                    onSaved: (value) => _email = value!,

                  ),

                  const SizedBox(height: 10,),

                  //password
                  TextFormField(
                      // controller: _pass,
                      cursorColor: Colors.blue.shade200,
                      obscureText: _secureText,
                      decoration: InputDecoration(
                          hintText: 'Password',
                          prefixIcon:const Icon(Icons.lock,size: 18,color:Colors.grey,),
                          suffixIcon: IconButton(
                            onPressed: showHide,
                            icon: _secureText
                                ? const Icon(
                              Icons.visibility_off,
                              color: Colors.grey,
                              size: 20,
                            )
                                : const Icon(
                              Icons.visibility,
                              color: Colors.grey,
                              size: 20,
                            ),
                          ),
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
                          return 'Enter your Password';
                        }
                      },
                    onSaved: (value) => _password = value!,

                    // validator: (value) =>
                    // value!.isEmpty ? 'Password cannot be blank' : null,
                    // onSaved: (value) => _password = value!,
                  ),

                  const SizedBox(height: 10,),


                  //sign up
                  Padding(
                    padding: const EdgeInsets.only(left: 20,right: 20),
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                      onPressed: signup,

                        //signUp(context);

                        //FirebaseAuth.instance.createUserWithEmailAndPassword(email:_ema.text.trim(), password:_pass.text.trim());

                       child:const Text('Sign Up',style: TextStyle(color: Colors.white),),
                    ),
                  ),



                  const SizedBox(height: 10,),


                  Align(
                    alignment: Alignment.center,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
                      onPressed: (){

                        Navigator.pushReplacementNamed(context,Login.id);

                      }, child:const Text('Already have account? Login',style: TextStyle(color: Colors.white),),
                    ),
                  ),
                  //


                  const SizedBox(height: 50,),
                ],
              ),
            )
        ),
      ),
      onWillPop:() async{

        return false;
      },
    );
  }



  // void _signUp(BuildContext context) async{
  //
  //   String email=_ema.text;
  //   String pass=_pass.text;
  //
  //
  //   User? user = await _auth.signUpWithEmailAndPassword(email, pass);
  //
  //   if(user != null){
  //
  //     print("user successfully registered");
  //
  //     if(context.mounted){
  //       Navigator.pushReplacementNamed(context,Dashboard.id);
  //     }
  //
  //   }else{
  //
  //     print("some error ocurred");
  //
  //   }
  //
  // }


}
