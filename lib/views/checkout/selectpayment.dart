// ignore_for_file: must_be_immutable
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:mpesadaraja/mpesadaraja.dart';
import 'package:yookatale/views/checkout/checkout.dart';

class SelectPayment extends StatefulWidget {  
  const SelectPayment({super.key,});
  @override
  State<SelectPayment> createState() => _SelectPaymentState();
}

class _SelectPaymentState extends State<SelectPayment> {  
  String formattedPhoneNumber(String phoneNumber) {
  if (phoneNumber.startsWith('+')) {
    return phoneNumber.substring(1);
  }
  return phoneNumber;
}
int tottalPrice =0;
  Future<void>initiatePayment() async {
    final stk = MpesaDaraja (
    consumerKey: 'PDGOKqUZnxrrOj903SVafCQmarS7QHwJ',
    consumerSecret: 'MaLnZGv0vheRW3Wv',
    passKey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
  );
  final User? user = FirebaseAuth.instance.currentUser;
  String userPhoneNumber ='';
  if(user!= null) {
    userPhoneNumber = user.phoneNumber ??'';
    userPhoneNumber = formattedPhoneNumber(userPhoneNumber);
  } else {
    return;
  }
  final result = await stk.lipaNaMpesaStk(
    "174379",
    tottalPrice,
    userPhoneNumber,
    "174379",
    userPhoneNumber,
    "https://a7ad-41-80-115-29.ngrok-free.app",
    "YOOKATALE",
    "transactionDesc",
    );
    return result;
  }
  final items = ['Credit card/ Debit Card', 'MTN MoMo', 'Airtel Money', 'Cash on delivery','Pay later'];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        leading: InkWell(
          onTap: ()=> Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new_outlined)),
        title: const Text("Select a Payment Method",style:TextStyle(color: Colors.black),),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 25),
          child: Column(
            children: [
              Padding(
              padding: const EdgeInsets.symmetric(horizontal: 0),
              child: Center(
                child: SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(5)
                      ),
                      backgroundColor: Colors.green.shade600
                    ),
                    onPressed: (){}, child: const Text(
                      'Total Amount to be paid 200,000 ugx',
                       style: TextStyle(color: Colors.white, fontSize: 16),)),
                ),
              ),
            ),
          const SizedBox(height: 20,),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: items.length,
            itemBuilder: (context, index) {
        return Container(
          decoration: const BoxDecoration(
            border: Border(bottom: BorderSide(
              color: Colors.grey
            )),
          ),
          child: ListTile(
            title: Text(items[index]),
          ),
        );
          },
        ),
        ListTile(
          onTap: initiatePayment,
          title: const Text('M-pesa'),
        ),
         const SizedBox(height: 40,),
      TextFormField(
          // controller: _ema,
          cursorColor: Colors.blue.shade200,
          decoration: InputDecoration(
              hintText: 'Add Voucher or Promo code',
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
            return null;          
          }
      ),
              const SizedBox(height: 15,),
      
              Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 0),
                            child: Center(
                              child: Container(
                                width: double.infinity,
                                height: 50,
                                child: ElevatedButton(
                                  style: ElevatedButton.styleFrom(
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(5)
                                    ),
                                    backgroundColor: Colors.green.shade600
                                  ),
                                  onPressed: ()=>Navigator.of(context).push(MaterialPageRoute(builder: (context)=>const Checkout())), child: const Text('Place order & Pay', style: TextStyle(color: Colors.white, fontSize: 18),)),
                              ),
                            ),
                          ),
            ],
          ),
        ),
      ),
    );
  }
}