// ignore_for_file: file_names

import 'package:faqflutter/faqflutter.dart';
import 'package:flutter/material.dart';

class FAQScreen extends StatefulWidget {
  const FAQScreen({Key? key}) : super(key: key);

  @override
  State<FAQScreen> createState() => _FAQScreenState();
}

class _FAQScreenState extends State<FAQScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'FAQs Sections', 
          style: TextStyle(fontWeight: FontWeight.bold),),
        leading: InkWell(
          onTap: ()=> Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new_outlined)),
      ),
      body: Center(
        child: FaqFlutter(
          data: const [
      [
        'Yookatale Shopping?',
        'the method is very easy, you just choose the category advisor, and choose the professional you want to consult after seeing the professional details you can buy the available timeslot, and after the purchase is confirmed please wait for the consultation time, the professional will immediately call you'
      ],
      [
        'Payment Methods Allowed?',
        'the method is very easy, you just choose the category advisor, and choose the professional you want to consult after seeing the professional details you can buy the available timeslot, and after the purchase is confirmed please wait for the consultation time, the professional will immediately call you'
      ],
       [
        'Can I track my delivery?',
        'the method is very easy, you just choose the category advisor, and choose the professional you want to consult after seeing the professional details you can buy the available timeslot, and after the purchase is confirmed please wait for the consultation time, the professional will immediately call you'
      ],
       [
        'I can\t pay ?',
        'the method is very easy, you just choose the category advisor, and choose the professional you want to consult after seeing the professional details you can buy the available timeslot, and after the purchase is confirmed please wait for the consultation time, the professional will immediately call you'
      ],
       [
        'How to reset my pasword?',
        'the method is very easy, you just choose the category advisor, and choose the professional you want to consult after seeing the professional details you can buy the available timeslot, and after the purchase is confirmed please wait for the consultation time, the professional will immediately call you'
      ], 
      [
        'How long does delivery Take ?',
        'the method is very easy, you just choose the category advisor, and choose the professional you want to consult after seeing the professional details you can buy the available timeslot, and after the purchase is confirmed please wait for the consultation time, the professional will immediately call you'
      ]
          ],
          title: 'FAQ',
        ),
      ),
    );
  }
}