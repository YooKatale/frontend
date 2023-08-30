import 'package:flutter/material.dart';

class TermsPolicy extends StatefulWidget {
  TermsPolicy({Key? key}) : super(key: key);

  @override
  State<TermsPolicy> createState() => _TermsPolicyState();
}

class _TermsPolicyState extends State<TermsPolicy> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Terms & Conditions', style: TextStyle(fontWeight: FontWeight.bold),),
        leading: InkWell(
          onTap: ()=> Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new_outlined)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 15),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Terms and Condition', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.green),),
                    SizedBox(height: 10,),
                    Text('These terms and conditions outline the rules and regulations for the use of Flutter Today’s Website, located at https://www.flutterdecode.com/.By accessing this website we assume you accept these terms and conditions. Do not continue to use Flutter Today if you do not agree to take all of the terms and conditions stated on this page.'),
                    SizedBox(height: 10,),
                    Text('These terms and conditions outline the rules and regulations for the use of Flutter Today’s Website, located at https://www.flutterdecode.com/.By accessing this website we assume you accept these terms and conditions. Do not continue to use Flutter Today if you do not agree to take all of the terms and conditions stated on this page.'),
                    SizedBox(height: 10,),
                    Text('These terms and conditions outline the rules and regulations for the use of Flutter Today’s Website, located at https://www.flutterdecode.com/.By accessing this website we assume you accept these terms and conditions. Do not continue to use Flutter Today if you do not agree to take all of the terms and conditions stated on this page.'),
                  ],
                ),
              ),

              const Spacer(),
            
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
              child: Row(
                children: [
                  Expanded(child: ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                    onPressed: (){}, child: const Text("Decline", style: TextStyle(color: Colors.white),))),
                  const SizedBox(width: 20,),
                  Expanded(child: ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                    onPressed: (){}, child: const Text("I Agree",style: TextStyle(color: Colors.white)))),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}