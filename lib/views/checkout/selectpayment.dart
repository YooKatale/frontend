import 'package:flutter/material.dart';
import 'package:yookatale/views/checkout/checkout.dart';

class SelectPayment extends StatefulWidget {
  SelectPayment({Key? key}) : super(key: key);

  @override
  State<SelectPayment> createState() => _SelectPaymentState();
}

class _SelectPaymentState extends State<SelectPayment> {

  final items = ['Credit card/ Debit Card', 'MTN MoMo', 'Airtel Money', 'Cash on delivery', 'Pay later'];
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
                                  onPressed: (){}, child: Text('Total Amount to be paid 200,000 ugx', style: TextStyle(color: Colors.white, fontSize: 16),)),
                              ),
                            ),
                          ),
                          SizedBox(height: 20,),
                          Container(
                            child: ListView.builder(
                              shrinkWrap: true,
                              physics: NeverScrollableScrollPhysics(),
          itemCount: items.length,
          itemBuilder: (context, index) {
        return Container(
          decoration: BoxDecoration(
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
                          ),
         SizedBox(height: 60,),
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
                                  onPressed: ()=>Navigator.of(context).push(MaterialPageRoute(builder: (context)=>const Checkout())), child: Text('Place order & Pay', style: TextStyle(color: Colors.white, fontSize: 18),)),
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