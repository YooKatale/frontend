import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:yookatale/views/login/register.dart';

import 'package:country_picker/country_picker.dart';
import 'package:get/get.dart';

import 'package:firebase_auth/firebase_auth.dart';

import 'otp_page.dart';

class GetStartedSignIn extends StatefulWidget {
  static const String id = 'getSignIn';
  GetStartedSignIn({Key? key}) : super(key: key);

  @override
  State<GetStartedSignIn> createState() => _GetStartedSignInState();
}

class _GetStartedSignInState extends State<GetStartedSignIn> {
  final TextEditingController phoneController = TextEditingController();

  // Function to sign in with Phone number
  Future<void> signInWithPhoneNumber(String phoneNumber) async {
    FirebaseAuth auth = FirebaseAuth.instance;

    await auth.verifyPhoneNumber(
      phoneNumber: phoneNumber,
      verificationCompleted: (PhoneAuthCredential credential) async {
        await auth.signInWithCredential(credential);
        // authentication successful just show message
        print('Phone number verified successfully.');
      },
      verificationFailed: (FirebaseAuthException e) {
        // authentication failed just show message
        print('Phone number verification failed: ${e.code}, ${e.message}');
      },
      codeSent: (String verificationId, int? resendToken) async {
        // Code sent to phone number, save verificationId for later use
        String smsCode = ''; //get sms code from user
        PhoneAuthCredential credential = PhoneAuthProvider.credential(
          verificationId: verificationId,
          smsCode: smsCode,
        );
        Get.to(OtpPage(), arguments: [verificationId]);
        await auth.signInWithCredential(credential);
        // authentication successful, show a message
      },
      codeAutoRetrievalTimeout: (String verificationId) {},
    );
  }

  // Selected Country
  Country selectedCountry = Country(
    phoneCode: "256",
    countryCode: "UG",
    e164Sc: 0,
    geographic: true,
    level: 1,
    name: "Uganda",
    example: "Uganda",
    displayName: "Uganda",
    displayNameNoCountryCode: "UG",
    e164Key: "",
  );

  // user login
  void _userLogin() async {
    String mobile = phoneController.text;
    if (mobile == "") {
      Get.snackbar(
        "Please enter the mobile number!",
        "Failed",
        colorText: Colors.amberAccent,
      );
    } else {
      signInWithPhoneNumber("+${selectedCountry.phoneCode}$mobile");
    }
  }

  @override
  void dispose() {
    phoneController.dispose();
    super.dispose();
  }

  void signFacebook() {
    // signInWithFacebook();
  }

  void signGoogle() {
    // signInWithGoogle();
  }

  @override
  Widget build(BuildContext context) {
    phoneController.selection = TextSelection.fromPosition(
      TextPosition(
        offset: phoneController.text.length,
      ),
    );
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Container(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const SizedBox(
                height: 50,
              ),
              Image.asset(
                'images/logo.jpg',
                height: 200,
              ),
              const SizedBox(
                height: 30,
              ),
              const Text(
                'Sign In',
                style: TextStyle(
                    color: Colors.green,
                    fontWeight: FontWeight.w500,
                    fontSize: 28,
                    fontStyle: FontStyle.normal),
              ),
              const SizedBox(height: 30),
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 40, vertical: 0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Country code
                    const Text(
                      '+256',
                      style: TextStyle(
                          color: Colors.black,
                          fontSize: 18,
                          fontStyle: FontStyle.normal),
                    ),
                    const SizedBox(width: 15),
                    Container(
                      width: 200,
                      child: const TextField(
                        style: TextStyle(fontSize: 18),
                        keyboardType: TextInputType.phone,
                        decoration: InputDecoration(
                            hintText: 'Enter your Mobile No',
                            hintStyle: TextStyle(color: Colors.grey)),
                      ),
                    )
                  ],
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'We  will send you a verification code',
                style: TextStyle(
                    color: Colors.grey,
                    fontWeight: FontWeight.w400,
                    fontSize: 18,
                    fontStyle: FontStyle.normal),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                  style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green[800]),
                  onPressed: () {},
                  child: const Padding(
                    padding: EdgeInsets.all(8.0),
                    child: Text('Continue',
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w400,
                            fontSize: 25)),
                  )),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 15, vertical: 8),
                child: Text.rich(TextSpan(
                    text: 'By clicking on Continue you are agreeing to our  ',
                    style: TextStyle(
                      color: Colors.grey,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                    children: <InlineSpan>[
                      TextSpan(
                        text: 'terms of use',
                        style: TextStyle(
                            color: Colors.green,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            decoration: TextDecoration.underline),
                      )
                    ])),
              ),
              Text('Or With',
                  style: TextStyle(
                      fontSize: 20,
                      color: Colors.green[400],
                      fontWeight: FontWeight.w400)),
              const SizedBox(
                height: 10,
              ),
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    FontAwesomeIcons.facebook,
                    color: Colors.blue,
                    size: 30,
                  ),
                  const SizedBox(
                    width: 10,
                  ),
                  CachedNetworkImage(
                    imageUrl:
                        "https://www.tramvietnam.com.au/wp-content/uploads/2021/07/Illustration-of-Google-icon-on-transparent-background-PNG.png",
                    width: 40,
                    height: 30,
                  ),
                  // const Icon(
                  //   FontAwesomeIcons.google,
                  //   color: Colors.red,
                  //   size: 30,
                  // ),
                ],
              ),
              const SizedBox(
                height: 100,
              ),
              Align(
                  alignment: Alignment.bottomCenter,
                  child: InkWell(
                      onTap: () {
                        Navigator.pushNamed(context, Register.id);
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
    );
  }
}
