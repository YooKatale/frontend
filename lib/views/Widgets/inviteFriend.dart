import 'package:flutter/material.dart';
import 'package:clipboard/clipboard.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:share_plus/share_plus.dart';

class InviteFriend extends StatefulWidget {
  InviteFriend({Key? key}) : super(key: key);

  @override
  State<InviteFriend> createState() => _InviteFriendState();
}

class _InviteFriendState extends State<InviteFriend> {

TextEditingController field = TextEditingController(text: 'InviteYOOKATALE2023');

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Invite a Friend', style: TextStyle(fontWeight: FontWeight.bold),),
        leading: InkWell(
          onTap: ()=> Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new_outlined)),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Card(
              color: Colors.grey.shade300,
              elevation: 0,
              margin: const EdgeInsets.all(4),
              child: Padding(
                padding: const EdgeInsets.all(30.0),
                child: Center(
                  child: Column(
                    children: [
                      Icon(Icons.people, size: 60, color: Colors.green.shade700,),
                      const Text('Invite friends by sharing this link'),
                      TextFormField(
                  controller: field,
                  // initialValue: 'AJJDODMVMVLSMCSCMCC',
                  decoration: InputDecoration(
                    hintText: 'Enter text',
                    border: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.green.shade400, width: 2),
                      borderRadius: BorderRadius.circular(10)
                    ),
                    suffixIcon: InkWell(
                       onTap: (){
                        if(field.text.trim() == ""){
                          print('enter text');
                        } else {
                          print(field.text);
                          FlutterClipboard.copy(field.text).then(( value ) =>
                              // print('copied')
                              Fluttertoast.showToast(
                              msg: "You have copied the invite code",
                              toastLength: Toast.LENGTH_SHORT,
                              gravity: ToastGravity.BOTTOM,
                              timeInSecForIosWeb: 1,
                              backgroundColor: Colors.green,
                              textColor: Colors.white,
                              fontSize: 16.0
                          ));
                        }
                      },
                      child: const Icon(Icons.copy))
                  ),
                ),
                     

                    ],
                  ),
                ),
              ),
            ),
          ),
          Icon(Icons.person_add, size: 100, color: Colors.green.shade600,),
          const Text('You have no friends yet, \nInvite them now', textAlign: TextAlign.center,),
          Padding(
          padding: const EdgeInsets.only(left: 20,right: 20, top: 50),
          child: SizedBox(
          width: 200,
          child: ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: Colors.green[800]),
          onPressed: (){
            // Use Firebase Dynamic Links to get create the app's link.
            // Won't work past AUg 2025
            // String deepLink ='';
            String message ='Get your food delivered now in minutes!!\n Download the app here ${field.text}';
            Share.share(message, subject: 'Yookatale Invitation');
          }, child: const Padding(
            padding: EdgeInsets.all(8.0),
            child: Text('Invite',style: TextStyle(color: Colors.white, fontWeight: FontWeight.w400, fontSize: 25)),
          )),
              ), ),
        ],
      ),
    );
  }
}