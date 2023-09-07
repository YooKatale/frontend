import 'package:cached_network_image/cached_network_image.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class EditProfile extends StatefulWidget {
  EditProfile({Key? key}) : super(key: key);

  @override
  State<EditProfile> createState() => _EditProfileState();
}

class _EditProfileState extends State<EditProfile> {

TextEditingController name = TextEditingController();
TextEditingController pass = TextEditingController();
bool _secureText = true;

  showHide() {
    setState(() {
      _secureText = !_secureText;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(actions: [],
      leading: InkWell(
        onTap: ()=> Navigator.of(context).pop(),
        child: const Icon(Icons.arrow_back_ios_new)),
      title: const Text('Edit Profile', style: TextStyle(fontWeight: FontWeight.bold),),
      centerTitle: true,
      
      ),
      body: Container(
        height: double.infinity,
        child: Column(
          children: [
            Center(
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(100),
                  color: Colors.green
                ),
                child: CachedNetworkImage(
                  height: 150, width: 150, fit: BoxFit.cover,
                  imageUrl: 'https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png'),
              ),
            ),
            const SizedBox(height: 20),
             Padding(
               padding: const EdgeInsets.symmetric(horizontal: 20),
               child: Column(
                 children: [
                  TextFormField(
                            controller: name,
                            cursorColor: Colors.blue.shade200,
                            // obscureText: _secureText,
                            decoration: InputDecoration(
                                hintText: 'Name',
                                // prefixIcon:const Icon(Icons.lock,size: 18,color:Colors.green,),
                              
                                filled: true,
                                fillColor:Colors.white,
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(15),
                                  borderSide: const BorderSide(color: Colors.grey, width: 1),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(15),
                                  borderSide: const BorderSide(color: Colors.green, width: 2),
                                )
                            ),
        
                            validator: (value){
                              if(value!.isEmpty){
                                return 'Enter your name';        
                              }
                              return null;
                            }
        
                        ),
                  const SizedBox(height: 20),
                   TextFormField(
                            controller: pass,
                            cursorColor: Colors.blue.shade200,
                            decoration: InputDecoration(
                                hintText: 'Password',
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
                                fillColor:Colors.white,
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(15),
                                  borderSide: const BorderSide(color: Colors.grey, width: 1),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(15),
                                  borderSide: const BorderSide(color: Colors.green, width: 2),
                                )
                            ),
        
                            validator: (value){
                              if(value!.isEmpty){
                                return 'Enter your Password';        
                              }
                              return null;
                            }
        
                        ),
                        const SizedBox(height: 20),
                  
                   TextFormField(
                            controller: pass,
                            cursorColor: Colors.blue.shade200,
                            decoration: InputDecoration(
                                hintText: 'Confirm Password',
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
                                fillColor:Colors.white,
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(15),
                                  borderSide: const BorderSide(color: Colors.grey, width: 1),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(15),
                                  borderSide: const BorderSide(color: Colors.green, width: 2),
                                )
                            ),        
                            validator: (value){
                              if(value!.isEmpty){
                                return 'Enter your Password';        
                              }
                              return null;
                            }
        
                        ),
                        const SizedBox(height: 30),

                        Padding(
                    padding: const EdgeInsets.only(left: 20,right: 20),
                    child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: Colors.green[800]),
                onPressed: (){
                 updateUserDetails();
                }, child: const Padding(
                  padding: EdgeInsets.all(8.0),
                  child: Text('Update Info',style: TextStyle(color: Colors.white, fontWeight: FontWeight.w400, fontSize: 20)),
                )), ),
                 ],
               ),
             ),
          ],
        ),
      ),
    );
  }
  void updateUserDetails() {
    String newName = name.text;
    String newPassword = pass.text;
    String uid = FirebaseAuth.instance.currentUser!.uid;
    FirebaseFirestore.instance.collection('users')
    .doc(uid).update({
      'name': newName,
      "pass": newPassword,
      }
    ).then((value) {
      showDialog(
        context: context, 
        builder: (context) {
          return const AlertDialog(
            title: Text('Update status'),
            content: Text('Profile updated successfully'),
          );
        },
        );
    }).catchError((error){
      showDialog(
        context: context, 
        builder: (context) {
          return const AlertDialog(
            title: Text('Update status'),
            content: Text('Error updating profile'),
          );
        },
        );
    });  }
}