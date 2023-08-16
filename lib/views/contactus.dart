
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class ContactUs extends StatefulWidget {
  const ContactUs({super.key});

  @override
  State<ContactUs> createState() => _ContactUsState();
}

class _ContactUsState extends State<ContactUs> {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        backgroundColor:Colors.grey[10],
        appBar:AppBar(
            backgroundColor: Colors.lightGreen,
          elevation: 0,
          iconTheme: const IconThemeData(color: Colors.white),
          title:const Text('Contact Us',maxLines: 1,overflow:TextOverflow.ellipsis,style: TextStyle(color: Colors.white)),
        ),
        body:ListView(
          padding: const EdgeInsets.only(left: 10,right: 10,top: 10),
          children: [


            Padding(
              padding:const EdgeInsets.only(top: 10,bottom: 10),
              child:Image.network('https://www.yookatale.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo1.54d97587.png&w=384&q=75',height: 200,),
            ),


            ListTile(

              onTap: (){


                launch('tel:0754615840');
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

                //launch('mailto:sales@edgetchuganda.com?subject=Inquiry&body=');

              },
              leading:Container(
                decoration: BoxDecoration(
                  color: Colors.green.shade100,
                  shape: BoxShape.circle,
                ),
                child:const Icon(CupertinoIcons.phone,color: Colors.cyan,size: 35,),
              ),
              title: const Text('Whatsapp',style: TextStyle(fontSize: 18),),
              trailing:const Icon(Icons.arrow_forward_ios_outlined) ,
            ),

          ],
        ),
      ),
    );
  }
}
