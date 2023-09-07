// ignore_for_file: file_names

import 'package:flutter/material.dart';
import 'package:yookatale/views/home.dart';

class TermsPolicy extends StatefulWidget {
  const TermsPolicy({Key? key}) : super(key: key);

  @override
  State<TermsPolicy> createState() => _TermsPolicyState();
}

class _TermsPolicyState extends State<TermsPolicy> {
  bool agreedToTerms = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Terms & Conditions',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        leading: InkWell(
          onTap: () => Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new_outlined),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 15),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Terms and Condition',
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: Colors.green),
                  ),
                  SizedBox(height: 10,),
                  Text(
                    'These terms and conditions outline the rules and regulations for the use of Flutter Today’s Website, located at https://www.flutterdecode.com/. By accessing this website we assume you accept these terms and conditions. Do not continue to use Flutter Today if you do not agree to take all of the terms and conditions stated on this page.',
                  ),
                  SizedBox(height: 10,),
                  Text(
                    'These terms and conditions outline the rules and regulations for the use of Flutter Today’s Website, located at https://www.flutterdecode.com/. By accessing this website we assume you accept these terms and conditions. Do not continue to use Flutter Today if you do not agree to take all of the terms and conditions stated on this page.',
                  ),
                  SizedBox(height: 10,),
                  Text(
                    'These terms and conditions outline the rules and regulations for the use of Flutter Today’s Website, located at https://www.flutterdecode.com/. By accessing this website we assume you accept these terms and conditions. Do not continue to use Flutter Today if you do not agree to take all of the terms and conditions stated on this page.',
                  ),
                ],
              ),
            ),
            const Spacer(),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
              child: Column(
                children: [
                  Row(
                    children: [
                      Checkbox(
                        value: agreedToTerms,
                        onChanged: (value) {
                          setState(() {
                            agreedToTerms = value!;
                          });
                        },
                      ),
                      const Text('I agree to the terms and conditions'),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                          ),
                          onPressed: () {
                            // what to do when user declines the terms
                            Navigator.of(context).pop();
                          },
                          child: const Text(
                            "Decline",
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ),
                      const SizedBox(width: 20),
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                          ),
                          onPressed: agreedToTerms
                              ? () {
                                  // Handle agreement action
                                  // You can navigate to the next screen or perform any other action here.
                                  Navigator.of(context).push(MaterialPageRoute(builder: (_) => const HomePage()));
                                }
                              : null, // Disable button if not agreed
                          child: const Text(
                            "I Agree",
                            style: TextStyle(color: Colors.white),
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
      ),
    );
  }
}
