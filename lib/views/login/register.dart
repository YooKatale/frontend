import 'package:email_validator/email_validator.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:yookatale/views/login/getLocation.dart';

import '../../firebase_auth_implementation/auth_fire.dart';
import '../../gradient/dashboard.dart';
import 'login.dart';

class Register extends StatefulWidget {
  static const String id = 'register';

  const Register({super.key});

  @override
  State<Register> createState() => _RegisterState();
}

class _RegisterState extends State<Register> {
  final FirebaseAuthService _auth = FirebaseAuthService();

  final _formKey = GlobalKey<FormState>();

  final _name = TextEditingController();
  final _num = TextEditingController();
  final _ema = TextEditingController();
  final _pass = TextEditingController();
  final _address = TextEditingController();
  final _lon = TextEditingController();
  final _lat = TextEditingController();

  bool verifyButton = false;

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
        backgroundColor: Colors.white,
        body: SingleChildScrollView(
          child: Column(
            children: [
              const SizedBox(
                height: 40,
              ),
              Image.asset(
                'images/logo.jpg',
                height: 200,
              ),
              // const SizedBox(height: 10,),
              const Text(
                'Sign Up for free',
                style: TextStyle(
                    color: Colors.green,
                    fontWeight: FontWeight.w500,
                    fontSize: 28,
                    fontStyle: FontStyle.normal),
              ),
              const SizedBox(height: 20),
              Form(
                key: _formKey,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    // padding:const EdgeInsets.only(left: 10,right: 10),
                    children: [
                      //Username
                      TextFormField(
                          controller: _name,
                          cursorColor: Colors.blue.shade200,
                          decoration: InputDecoration(
                              hintText: 'Full Name',
                              prefixIcon: const Icon(
                                Icons.person,
                                size: 18,
                                color: Colors.green,
                              ),
                              filled: true,
                              fillColor: Colors.white,
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(15),
                                borderSide: const BorderSide(
                                    color: Colors.grey, width: 1),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                    color: Colors.green, width: 2),
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide:
                                    const BorderSide(color: Colors.grey),
                              )),
                          validator: (value) {
                            if (value!.isEmpty) {
                              return 'Enter Email';
                            }
                            bool _isValid = (EmailValidator.validate(value));
                            if (_isValid == false) {
                              return 'Enter Valid Email Address';
                            }
                            return null;
                          }),
                      const SizedBox(
                        height: 10,
                      ),
                      //email
                      TextFormField(
                          controller: _ema,
                          cursorColor: Colors.blue.shade200,
                          decoration: InputDecoration(
                              hintText: 'Email',
                              prefixIcon: const Icon(
                                Icons.email,
                                size: 18,
                                color: Colors.green,
                              ),
                              filled: true,
                              fillColor: Colors.white,
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(15),
                                borderSide: const BorderSide(
                                    color: Colors.grey, width: 1),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(15),
                                borderSide: const BorderSide(
                                    color: Colors.green, width: 2),
                              )),
                          validator: (value) {
                            if (value!.isEmpty) {
                              return 'Enter Email';
                            }
                            bool _isValid = (EmailValidator.validate(value));
                            if (_isValid == false) {
                              return 'Enter Valid Email Address';
                            }
                            return null;
                          }),

                      const SizedBox(
                        height: 10,
                      ),
                      //password
                      TextFormField(
                          controller: _pass,
                          cursorColor: Colors.blue.shade200,
                          obscureText: _secureText,
                          decoration: InputDecoration(
                              hintText: 'Password',
                              prefixIcon: const Icon(
                                Icons.lock,
                                size: 18,
                                color: Colors.green,
                              ),
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
                              fillColor: Colors.white,
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(15),
                                borderSide: const BorderSide(
                                    color: Colors.grey, width: 1),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(15),
                                borderSide: const BorderSide(
                                    color: Colors.green, width: 2),
                              )),
                          validator: (value) {
                            if (value!.isEmpty) {
                              return 'Enter your Password';
                            }
                            return null;
                          }),

                      const SizedBox(
                        height: 10,
                      ),
                    ],
                  ),
                ),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                child: Text.rich(TextSpan(
                    text: 'By sign up you agree to our  ',
                    style: TextStyle(
                      color: Colors.grey,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                    children: <InlineSpan>[
                      TextSpan(
                        text: 'terms of use ',
                        style: TextStyle(
                            color: Colors.green,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            decoration: TextDecoration.underline),
                      ),
                      TextSpan(
                        text: ' and Privacy policy',
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      )
                    ])),
              ),
              const SizedBox(
                height: 50,
              ),
              Padding(
                padding: const EdgeInsets.only(left: 20, right: 20),
                child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green[800]),
                    onPressed: () {
                      _signUp(context);
                      FirebaseAuth.instance.createUserWithEmailAndPassword(
                          email: _ema.text.trim(), password: _pass.text.trim());
                    },
                    child: const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text('Sign up',
                          style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w400,
                              fontSize: 25)),
                    )),
              ),

              const SizedBox(
                height: 10,
              ),

              const SizedBox(
                height: 50,
              ),
              Align(
                  alignment: Alignment.bottomCenter,
                  child: InkWell(
                      onTap: () {
                        Navigator.pushNamed(context, GetLocationScreen.id);
                      },
                      child: Text(
                        "Skip >",
                        style: TextStyle(
                            fontSize: 20,
                            color: Colors.green[400],
                            fontWeight: FontWeight.w400),
                      )))
            ],
          ),
        ),
      ),
      onWillPop: () async {
        return false;
      },
    );
  }

  void _signUp(BuildContext context) async {
    String email = _ema.text;
    String pass = _pass.text;

    User? user = await _auth.signUpWithEmailAndPassword(email, pass);

    if (user != null) {
      print("user successfully registered");

      // if(context.mounted){
      // ignore: use_build_context_synchronously
      Navigator.pushReplacementNamed(context, Dashboard.id);
      // }
    } else {
      print("some error ocurred");
    }
  }
}
