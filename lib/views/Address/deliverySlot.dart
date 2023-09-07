import 'package:flutter/material.dart';
import 'package:yookatale/views/Widgets/itemsCart.dart';
import 'package:yookatale/views/checkout/selectpayment.dart';
import 'package:yookatale/views/deliverydetils/deliverydetail.dart';

class DeliverySlot extends StatefulWidget {
  DeliverySlot({Key? key}) : super(key: key);

  @override
  State<DeliverySlot> createState() => _DeliverySlotState();
}

class _DeliverySlotState extends State<DeliverySlot> {

  bool? _isChecked = false;

  List<String> text = ['12:00 AM - 2:00 PM','2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM','6:00 PM - 8:00 PM'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        leading: InkWell(
          onTap: ()=> Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new_outlined)),
        title: const Text("Select a Delivery Slot",style:TextStyle(color: Colors.black),),
      ),
      body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20,vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
               Row(
                 children:const  [
                  Icon(Icons.circle, color: Colors.black,),
                  SizedBox(width: 10,),
                   Text("Express delivery slot", style: TextStyle(fontSize: 16),),
                 ],
               ),
                      SizedBox(height: 20),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 0),
                        child: Center(
                          child: Container(
                            width: double.infinity,
                            height: 45,
                            child: ElevatedButton.icon(
                              icon: Icon(Icons.check_circle_outline, color: Colors.white,),
                              style: ElevatedButton.styleFrom(
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(5)
                                ),
                                backgroundColor: Colors.green.shade600
                              ),
                              onPressed: ()=>Navigator.of(context).push(MaterialPageRoute(builder: (context)=>DeliverySlot())), label: const Text('Express delivery in 40 mins', style: TextStyle(color: Colors.white, fontSize: 18),)),
                          ),
                        ),
                      ),
                      const SizedBox(height: 15),
                      Row(
                 children: const [
                  Icon(Icons.circle, color: Colors.black,),
                  SizedBox(width: 10,),
                   Text("Standard a delivery slot", style: TextStyle(fontSize: 16),),
                 ],
               ),
               const SizedBox(height: 20,),
                Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 0),
                        child: Center(
                          child: Container(
                            width: double.infinity,
                            height: 45,
                            child: ElevatedButton.icon(
                              icon: Icon(Icons.check_circle_outline, color: Colors.white,),
                              style: ElevatedButton.styleFrom(
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(5)
                                ),
                                backgroundColor: Colors.green.shade600
                              ),
                              onPressed: ()=>Navigator.of(context).push(MaterialPageRoute(builder: (context)=>DeliverySlot())), label: const Text('Select a delivery slot', style: TextStyle(color: Colors.white, fontSize: 18),)),
                          ),
                        ),
                      ),
                     const  SizedBox(height: 15,),
                    
          Card(
            elevation: 5,
            color: Colors.grey.shade400,
            margin: EdgeInsets.all(10),
            child: Container(
              height: 270.0,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
            children:[
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text('Today', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),),
              ),
              ListView.builder(
                itemCount: text.length,
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                itemBuilder: (context,index){
                return CheckboxListTile(
                  controlAffinity: ListTileControlAffinity.leading,
                      title: Text(text[index]),
                      value: _isChecked,
                      selected: _isChecked!,
                      onChanged: (val) {
                        setState(() {
                          _isChecked = val;
                          if (val == true) {
                            text[index];
                          }
                        });
                      },
                    );
              })
            ],
              ),
            ),
          ),
                      const SizedBox(height: 30),
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
                              onPressed: ()=>Navigator.of(context).push(MaterialPageRoute(builder: (context)=>SelectPayment())), child: Text('Proceed pay', style: TextStyle(color: Colors.white, fontSize: 18),)),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20,),
                    
            ],
          ),
        ),
    );
  }
}