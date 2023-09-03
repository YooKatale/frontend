
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:io' show Platform;
class ContactUs extends StatefulWidget {
  const ContactUs({super.key});

  @override
  State<ContactUs> createState() => _ContactUsState();
}

class _ContactUsState extends State<ContactUs> {

  _scaffold(message){
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content:Text(message),
      action: SnackBarAction(label: 'ok',onPressed: (){
        ScaffoldMessenger.of(context).clearSnackBars();
      },),));
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:Colors.white,
      appBar:AppBar(
        leading: InkWell(
        onTap: ()=> Navigator.of(context).pop(),
        child: const Icon(Icons.arrow_back_ios_new_outlined, color: Colors.black,)),
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        title:const Text('Contact Us',style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body:ListView(
        padding: const EdgeInsets.only(left: 10,right: 10,top: 10),
        children: [


          Padding(
            padding:const EdgeInsets.only(top: 10,bottom: 10),
            child:Image.network('https://www.yookatale.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo1.54d97587.png&w=384&q=75',height: 100,),
          ),


          ListTile(

            onTap: (){


              //launch('tel:0754615840');

              _makePhoneCall('+256754615840');
            },
            leading:Container(
              decoration: BoxDecoration(
                color: Colors.green.shade100,
                shape: BoxShape.circle,
              ),
              child:const Icon(CupertinoIcons.phone,color: Colors.green,size: 35,),
            ),
            title: const Text('0754615840',style: TextStyle(fontSize: 18),),
            trailing:const Icon(Icons.arrow_forward_ios_outlined) ,
          ),

          const SizedBox(height: 10,),

          ListTile(

            onTap: () async {

              launch('mailto:info@yookatale.com?subject=Inquiry&body=');

            },

            leading:Container(
              decoration: BoxDecoration(
                color: Colors.green.shade100,
                shape: BoxShape.circle,
              ),
              child:const Icon(CupertinoIcons.mail,color: Colors.blue,size: 35,),
            ),
            title: const Text('info@yookatale.com',style: TextStyle(fontSize: 18),),
            trailing:const Icon(Icons.arrow_forward_ios_outlined) ,
          ),

          const SizedBox(height: 10,),

          ListTile(

            onTap: () async {

              launch('https://twitter.com/YooKatale?t=3Q96I9JR98HgA69gisdXdA&s=09');

            },
            leading:Container(
              decoration: BoxDecoration(
                color: Colors.green.shade100,
                shape: BoxShape.circle,
              ),
              child: Image.asset('assets/images/twitter.png',height: 40,width: 40,),
            ),
            title: const Text('Twitter',style: TextStyle(fontSize: 18),),
            trailing:const Icon(Icons.arrow_forward_ios_outlined) ,
          ),

          const SizedBox(height: 10,),

          ListTile(

            onTap: () async {

              openWhatsapp();

            },
            leading:Container(
              decoration: BoxDecoration(
                color: Colors.green.shade100,
                shape: BoxShape.circle,
              ),
              child: Image.asset('assets/images/whatsapp.png',height: 40,width: 40,),
            ),
            title: const Text('Whatsapp',style: TextStyle(fontSize: 18),),
            trailing:const Icon(Icons.arrow_forward_ios_outlined) ,
          ),


          const SizedBox(height: 10,),

          ListTile(

            onTap: () async {

              launch("https://www.facebook.com/profile.php?id=100094194942669&mibextid=LQQJ4d");

            },
            leading:Container(
              decoration: BoxDecoration(
                color: Colors.green.shade100,
                shape: BoxShape.circle,
              ),
              child: Image.asset('assets/images/facebook.png',height: 40,width: 40,),
            ),
            title: const Text('Facebook',style: TextStyle(fontSize: 18),),
            trailing:const Icon(Icons.arrow_forward_ios_outlined) ,
          ),

          const SizedBox(height: 10,),

          ListTile(

            onTap: () async {

              launch("https://www.instagram.com/p/CuHdaksN5UW/?igshid=NTc4MTIwNjQ2YQ%3D%3D");

            },
            leading:Container(
              decoration: BoxDecoration(
                color: Colors.green.shade100,
                shape: BoxShape.circle,
              ),
              child: Image.asset('assets/images/instagram.png',height: 40,width: 40,),
            ),
            title: const Text('Instagram',style: TextStyle(fontSize: 18),),
            trailing:const Icon(Icons.arrow_forward_ios_outlined) ,
          ),

          const SizedBox(height: 10,),

          ListTile(

            onTap: () async {

              launch("https://www.linkedin.com/company/yookatale/");

            },
            leading:Container(
              decoration: BoxDecoration(
                color: Colors.green.shade100,
                shape: BoxShape.circle,
              ),
              child: Image.asset('assets/images/linkedin.png',height: 40,width: 40,),
            ),
            title: const Text('LinkedIn',style: TextStyle(fontSize: 18),),
            trailing:const Icon(Icons.arrow_forward_ios_outlined) ,
          ),

        ],
      ),
    );
  }



  Future<void> _makePhoneCall(String phoneNumber) async {
    final Uri launchUri = Uri(
      scheme: 'tel',
      path:phoneNumber,
    );
    await launchUrl(launchUri);
  }


  openWhatsapp() async {

    String whatsapp = '+256754615840';
    String whatsappURlAndroid = "whatsapp://send?phone=$whatsapp&text=Hallo Yookatale";
    String whatsappURLIos =
        "https://wa.me/$whatsapp?text=${Uri.parse("Hallo YooKatale")}";
    if (Platform.isIOS) {
      if (await canLaunchUrl(Uri.parse(whatsappURLIos))) {
        await launchUrl(Uri.parse(whatsappURLIos));
      } else {
        _scaffold("Whatsapp not installed");
      }
    } else {
      if (await canLaunchUrl(Uri.parse(whatsappURlAndroid))) {
        await launchUrl(Uri.parse(whatsappURlAndroid));
      } else {
        _scaffold("Whatsapp not installed");
      }
    }
  }


}
