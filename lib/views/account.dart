// ignore_for_file: no_leading_underscores_for_local_identifiers, avoid_print

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:in_app_review/in_app_review.dart';
import 'package:rating_dialog/rating_dialog.dart';
import 'package:yookatale/views/Widgets/editProfile.dart';
import 'package:yookatale/views/Widgets/faqScreen.dart';
import 'package:yookatale/views/Widgets/inviteFriend.dart';
import 'package:yookatale/views/Widgets/termsPolicy.dart';
import 'package:yookatale/views/Widgets/trackDelivery.dart';
import 'package:yookatale/views/account_tiles.dart';
import 'package:yookatale/views/cart.dart';
import 'package:yookatale/views/contactus.dart';
import 'package:yookatale/views/login/login.dart';
import 'package:yookatale/views/loyalty/loyalty.dart';
import 'package:yookatale/views/orders/orders.dart';
import 'package:yookatale/views/pdfs/invoicelist.dart';

class AccountPage extends StatefulWidget {
  const AccountPage({super.key});

  @override
  State<AccountPage> createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
    void _showRatingDialog() {
    // actual store listing review & rating
    void _rateAndReviewApp() async {
      // refer to: https://pub.dev/packages/in_app_review
      final inAppReview = InAppReview.instance;

      if (await inAppReview.isAvailable()) {
        print('request actual review from store');
        inAppReview.requestReview();
      } else {
        print('open actual store listing');
        inAppReview.openStoreListing(
          appStoreId: '<your app store id>',
          microsoftStoreId: '<your microsoft store id>',
        );
      }
    }

    final dialog = RatingDialog(
      initialRating: 1.0,
      // your app's name?
      title: const Text(
        'Rating Dialog',
        textAlign: TextAlign.center,
        style: TextStyle(
          fontSize: 25,
          fontWeight: FontWeight.bold,
        ),
      ),
      // encourage your user to leave a high rating?
      message: const Text(
        'Tap a star to set your rating. Add more description here if you want.',
        textAlign: TextAlign.center,
        style: TextStyle(fontSize: 15),
      ),
      // your app's logo?
      image: Image.asset('images/logo.jpg'),
      submitButtonText: 'Submit',
      commentHint: 'Set your custom comment hint',
      onCancelled: () => print('cancelled'),
      onSubmitted: (response) {
        print('rating: ${response.rating}, comment: ${response.comment}');
        Fluttertoast.showToast(msg: "Thank You!. You have sucessfully submited your feedback");

        // TODO: add your own logic
        if (response.rating < 3.0) {
          // send their comments to your email or anywhere you wish
          // ask the user to contact you instead of leaving a bad review
        } else {
          _rateAndReviewApp();
        }
      },
    );

    // show the dialog
    showDialog(
      context: context,
      barrierDismissible: true, // set to false if you want to force a rating
      builder: (context) => dialog,
    );
  }
  @override
  Widget build(BuildContext context) {
    final User? user = FirebaseAuth.instance.currentUser;
    final displayName = user?.displayName ?? 'YooKatale';
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        toolbarHeight: 70,
        automaticallyImplyLeading: false,        
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        title:Column(
          children:   [
            const SizedBox(height: 10,),
            ListTile(
                  leading: const CircleAvatar(
                     backgroundColor: Colors.grey,
                     radius: 33,
                    child: CircleAvatar(
                      radius: 30,
                      backgroundImage: AssetImage('images/logo.jpg'),
                    ),
                  ),
                  title: Text(
                    displayName,style: const TextStyle(fontSize: 20),),
                  // subtitle: InkWell(
                  //   onTap: ()=> Navigator.of(context).push(MaterialPageRoute(builder: (context)=>EditProfile())),
                  //   child: const Text('Edit Profile')),
                ),
          ],
        )
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(10),
            child: Column(
              children: [
                AccountPageTiles(
                  withArrow: true,
                  icon: Icons.person, 
                  title: 'Edit Profile',
                  onTap: () =>
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => EditProfile())),                
                  ),
                  AccountPageTiles(
                    withArrow: true,
                    icon: Icons.delivery_dining, 
                    title: 'Track Delivery',
                    onTap: () {
                      Navigator.of(context).push(
                        // orderId update
                        MaterialPageRoute(builder: (context)=> const TrackDelivery(orderId: '',)));
                    },
                    ),
                    AccountPageTiles(
                      icon:Icons.subscriptions_outlined, 
                      title: 'Subscription',
                      withArrow: true,
                      onTap: () {
                        Navigator.push(context,MaterialPageRoute(builder: (context)=> const CartPage()));
                      },
                      ),
                      AccountPageTiles(
                        withArrow: true,
                        onTap: () {
                          Navigator.push(context,MaterialPageRoute(builder: (context)=> const Orders()));
                        },
                        icon: Icons.shop_two, 
                        title: 'Orders',
                        ),
                        AccountPageTiles(
                          withArrow: true,
                          onTap: () {
                            Navigator.push(context,MaterialPageRoute(builder: (context)=> const InvoiceList()));
                          },
                          icon: CupertinoIcons.money_pound, 
                          title: 'Invoices',
                          ),
                          AccountPageTiles(
                            withArrow: true,
                            onTap: () {
                               Navigator.push(context,MaterialPageRoute(builder: (context)=> const LoyaltyPoints()));
                            },
                            icon: CupertinoIcons.hand_point_right_fill, 
                            title: 'Loyalty points'
                            ),
                            AccountPageTiles(
                              onTap: () {
                                Navigator.push(context, MaterialPageRoute(builder:(context)=>const ContactUs()));
                              },
                              icon:Icons.mail, 
                              title:'Customer Support',
                              withArrow: true,
                              ),
                            AccountPageTiles(
                              icon: Icons.share,
                              title: 'Invite a Friend',
                              onTap: () {
                                Navigator.of(context).push(MaterialPageRoute(builder: (_) => InviteFriend()));
                              },
                              withArrow: true,
                            ),
                            AccountPageTiles(
                              icon: Icons.feedback_outlined, 
                              title: 'FeedBack',
                              withArrow: true,
                              onTap:  _showRatingDialog,
                              ),
                            AccountPageTiles(
                              icon: Icons.share,
                              title: 'FAQS',
                              withArrow: true,
                              onTap: () {
                                Navigator.of(context).push(MaterialPageRoute(builder: (_) => FAQScreen()));
                              },
                            ),
                            AccountPageTiles(
                              icon: Icons.policy, 
                              title: 'Terms & Conditions',
                              withArrow: true,
                              onTap: () {
                                Navigator.of(context).push(MaterialPageRoute(builder: (_) => TermsPolicy()));
                              },
                              ),
                            AccountPageTiles(
                              icon: Icons.logout, 
                              title: 'Log out',
                              withArrow: true,
                              onTap: () {
                                FirebaseAuth.instance.signOut();
                                Navigator.pushReplacementNamed(context,Login.id);
                              },
                              )
              ],
            ),
          ),
        ),
      ),
    );
  }
}