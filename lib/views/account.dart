import 'package:badges/badges.dart' as badges;
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:yookatale/views/Widgets/editProfile.dart';
import 'package:yookatale/views/pdfs/invoicelist.dart';


import 'cart.dart';
import 'contactus.dart';
import 'login/login.dart';
import 'loyalty/loyalty.dart';
import 'orders/orders.dart';

class AccountPage extends StatefulWidget {
  const AccountPage({super.key});

  @override
  State<AccountPage> createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {


  cart(){
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor:Colors.cyan.withOpacity(0.8),
          title: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Image.network('https://www.yookatale.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo1.54d97587.png&w=384&q=75',height: 50,width: 50,)
            ],
          ),
          content: const Text('Saved to cart',style:TextStyle(color:Colors.white),),
          actions: [

            MaterialButton(
              color: Colors.red,
              textColor: Colors.white,
              onPressed: () {

                Navigator.pop(context);
              },
              child: const Text('Cancel'),
            ),
          ],
        );
      },
    );

  }

  save(){
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor:Colors.cyan.withOpacity(0.8),
          title: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Image.network('https://www.yookatale.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo1.54d97587.png&w=384&q=75',height: 50,width: 50,)
            ],
          ),
          content: const Text('Saved for later',style:TextStyle(color:Colors.white),),
          actions: [

            MaterialButton(
              color: Colors.red,
              textColor: Colors.white,
              onPressed: () {

                Navigator.pop(context);
              },
              child: const Text('Cancel'),
            ),
          ],
        );
      },
    );

  }


  @override
  Widget build(BuildContext context) {
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
                  title: const Text('Profile',style: TextStyle(fontSize: 20),),
                  subtitle: InkWell(
                    onTap: ()=> Navigator.of(context).push(MaterialPageRoute(builder: (context)=>EditProfile())),
                    child: const Text('Edit Profile')),
                ),
          ],
        )
      ),

      body: ListView(
        padding: const EdgeInsets.only(left: 10,right: 10,top:10,bottom: 60),
        children:  [         
          const SizedBox(height: 5),
          const Divider(height: 5,thickness: 5,),

          const SizedBox(height: 5),
          Container(
            decoration: BoxDecoration(
              color:Colors.grey.shade200,
              borderRadius: BorderRadius.circular(4),
            ),
            child: Column(
              children: [
                //profile
                ListTile(
                  onTap: (){



                  },
                  leading: Container(
                    decoration: const BoxDecoration(
                      color:Colors.transparent,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.person,color: Colors.blue,size: 35,),
                  ),
                  title: const Text('Account',style: TextStyle(fontSize: 18),),
                  trailing:const Icon(Icons.arrow_forward_ios_outlined),

                ),

                const SizedBox(height: 10,),

                //notifications
                ListTile(
                  onTap: (){



                  },
                  leading: Container(
                    decoration: BoxDecoration(
                      color: Colors.purple.shade100,
                      shape: BoxShape.circle,
                    ),
                    child: Padding(
                      padding:const EdgeInsets.only(top: 20),
                      child:InkWell(
                        onTap: (){
                        },
                        child: const badges.Badge(
                              badgeContent: Text('0',style: TextStyle(color: Colors.white,fontSize: 10),),
                              child: Icon(Icons.notifications,color:Colors.purple,size: 35,),
                            )
                        
                        
                      ),
                    ),
                  ),
                  title: const Text('Notifications',style: TextStyle(fontSize: 18),),
                  trailing:const Icon(Icons.arrow_forward_ios_outlined),

                ),

                const SizedBox(height: 10,),


                //cart
                ListTile(
                  onTap: (){

                    Navigator.push(context,MaterialPageRoute(builder: (context)=> const CartPage()));

                  },
                  leading: Container(
                    decoration: BoxDecoration(
                      color: Colors.purple.shade100,
                      shape: BoxShape.circle,
                    ),
                    child: Padding(
                      padding:const EdgeInsets.only(top: 20),
                      child:InkWell(
                        child:const badges.Badge(
                          badgeContent:Text('4',style: TextStyle(color: Colors.white,fontSize: 10),),
                          child:Icon(Icons.shopping_cart,color:Colors.green,size: 35,) ,
                        ),
                        onTap: (){

                          Navigator.push(context,MaterialPageRoute(builder: (context)=> const CartPage()));
                        },
                      ),
                    ),
                  ),
                  title: const Text('Cart',style: TextStyle(fontSize: 18),),
                  trailing:const Icon(Icons.arrow_forward_ios_outlined),

                ),

                const SizedBox(height: 10,),

                //orders
                ListTile(
                  onTap: (){

                    Navigator.push(context,MaterialPageRoute(builder: (context)=> const Orders()));

                  },
                  leading: Container(
                    decoration: BoxDecoration(
                      color: Colors.indigo.shade100,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.shop_two,color: Colors.indigo,size: 35,),
                  ),
                  title: const Text('Orders',style: TextStyle(fontSize: 18),),
                  trailing:const Icon(Icons.arrow_forward_ios_outlined),

                ),

                const SizedBox(height: 10,),

                ListTile(
                  onTap: (){




                    Navigator.push(context,MaterialPageRoute(builder: (context)=> const InvoiceList()));


                  },
                  leading: Container(
                    decoration: BoxDecoration(
                      color: Colors.green.shade100,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(CupertinoIcons.money_pound,color: Colors.red,size: 35,),
                  ),
                  title: const Text('Invoices',style: TextStyle(fontSize: 18),),
                  trailing:const Icon(Icons.arrow_forward_ios_outlined),

                ),

                const SizedBox(height: 10,),


                ListTile(
                  onTap: (){




                    Navigator.push(context,MaterialPageRoute(builder: (context)=> const LoyaltyPoints()));


                  },
                  leading: Container(
                    decoration: BoxDecoration(
                      color: Colors.green.shade100,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(CupertinoIcons.hand_point_right_fill,color: Colors.red,size: 35,),
                  ),
                  title: const Text('Loyalty points',style: TextStyle(fontSize: 18),),
                  trailing:const Icon(Icons.arrow_forward_ios_outlined),

                ),

                const SizedBox(height: 10,),

                //about us
                ListTile(
                  onTap: (){


                    Navigator.push(context, MaterialPageRoute(builder:(context)=>const ContactUs()));


                  },
                  leading: Container(
                    decoration: BoxDecoration(
                      color: Colors.orange.shade100,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.mail,color: Colors.orange,size: 35,),
                  ),
                  title: const Text('Contact us',style: TextStyle(fontSize: 18),),
                  trailing:const Icon(Icons.arrow_forward_ios_outlined),

                ),

                const SizedBox(height: 10,),


              ],
            ),
          ),



          const Divider(thickness: 5,),

          const SizedBox(height: 3,),


          //logout
          Container(
            decoration: BoxDecoration(
              color:  Colors.grey.shade200,
              borderRadius: BorderRadius.circular(4),
            ),
            child: ListTile(
              onTap: (){

                FirebaseAuth.instance.signOut();
                Navigator.pushReplacementNamed(context,Login.id);
              },
              leading: Container(
                decoration: BoxDecoration(
                  color: Colors.red.shade100,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.login_outlined,color: Colors.red,size: 35,),
              ),
              title: const Text('Log out',style: TextStyle(fontSize: 18),),
              trailing:const Icon(Icons.arrow_forward_ios_outlined),

            ),
          ),

        ],
      ),
    );
  }
}