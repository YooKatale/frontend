import 'package:flutter/material.dart';
import 'package:yookatale/gradient/grad.dart';
import 'package:yookatale/views/deliverydetils/deliverydetail.dart';

class ItemsCart extends StatefulWidget {
  final List<Map<String, dynamic>> cartItems;
  const ItemsCart({Key? key, required this.cartItems}) : super(key: key);

  @override
  State<ItemsCart> createState() => _ItemsCartState();
}

class _ItemsCartState extends State<ItemsCart> {
  double tottalPrice =0;
  @override
  void initState() {
    super.initState();
    calculateTotalPrice();
  }
  void calculateTotalPrice () {
    double tottal =0;
    for(final item in widget.cartItems) {
      final itemPrice =item['price'];
      tottal += itemPrice;
    }
    setState(() {
      tottalPrice = tottal;
    });
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        leading: InkWell(
          onTap: ()=> Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new_outlined)),
        title: const Text("Items on Cart",style:TextStyle(color: Colors.black),),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
        child: Column(
          children: [
             Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [      
            const Text(
              "Total Payment",
              style: TextStyle(
                  fontSize: 15,fontWeight: FontWeight.bold,color: Colors.black),
            ),      
            Text(
               'Shs.$tottalPrice',
              style:const TextStyle(fontSize: 15,fontWeight: FontWeight.bold,color: Colors.black),
            ),            
          ],
        ),
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 10),
          child: TextFormField(
                      //controller: _ema,
                      cursorColor: Colors.blue.shade200,
                      decoration: InputDecoration(
                          hintText: 'Enter Coupon Code',
                          prefixIcon: const Icon(Icons.email,size: 18,color:Colors.grey,),
                          filled: true,
                          fillColor:Colors.grey.shade200,
                          enabledBorder: UnderlineInputBorder(
                            borderRadius: BorderRadius.circular(4),
                            borderSide: BorderSide.none,
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(4),
                            borderSide: const BorderSide(color: Colors.blue),
                          )
                      ),
                      validator: (value){      
                        return null;      
                      }
                  ),
        ),
        Container(
          height: 500,
          padding: const EdgeInsets.all(10),
        child: ListView.builder(
        itemCount: widget.cartItems.length,
        itemBuilder: (context, index) {
          final item = widget.cartItems[index];
          return ListTile(
            title: Text(item['name']),
          );
        },
      ),
        ),
        Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(5),
                gradient: LinearGradient(
                  colors:[
                    blueGradient.darkShade,
                    blueGradient.lightShade,
                  ],
                ),
              ),
              child:MaterialButton(
                // color: Colors.green.shade700,
                child:const Text("CHECKOUT NOW",style: TextStyle(color: Colors.white),),
                onPressed: () {      
                  Navigator.push(context,MaterialPageRoute(builder: (context)=> DeliveryDetails(totalPrice: tottalPrice,)));      
                },
              ) ,
            ),
            
        ],
        ),
      )
      // Container(
      //   padding: const EdgeInsets.all(15),
      //   height: double.infinity,
      //   // margin: const EdgeInsets.only(bottom: 10),
      //   // width: MediaQuery.of(context).size.width,
      //   decoration:BoxDecoration(
      //       color: Colors.green.withOpacity(0.9),
      //       borderRadius: const BorderRadius.only(
      //           topLeft: Radius.circular(30),
      //           topRight: Radius.circular(30))),
      //   child: Column(
      //     children: [
      //      Row(
      //     mainAxisAlignment: MainAxisAlignment.spaceBetween,
      //     children: [
      
      //       Text(
      //         "Total Payment",
      //         style: TextStyle(
      //             fontSize: 15,fontWeight: FontWeight.bold,color: Colors.white),
      //       ),
      
      //       Text(
      //          " Shs 0",
      //         style:TextStyle(fontSize: 15,fontWeight: FontWeight.bold,color: Colors.white),
      //       ),
      
      
      //     ],
      //   ),
      
      //        Row(
      //         mainAxisAlignment: MainAxisAlignment.spaceBetween,
      //         children: [
      
      //           TextFormField(
      //               //controller: _ema,
      //               cursorColor: Colors.blue.shade200,
      //               decoration: InputDecoration(
      //                   hintText: 'Enter Coupon Code',
      //                   prefixIcon: const Icon(Icons.email,size: 18,color:Colors.grey,),
      //                   filled: true,
      //                   fillColor:Colors.grey.shade200,
      //                   enabledBorder: UnderlineInputBorder(
      //                     borderRadius: BorderRadius.circular(4),
      //                     borderSide: BorderSide.none,
      //                   ),
      //                   focusedBorder: OutlineInputBorder(
      //                     borderRadius: BorderRadius.circular(4),
      //                     borderSide: const BorderSide(color: Colors.blue),
      //                   )
      //               ),
      //               validator: (value){
      
      //                 return null;
      
      //               }
      //           ),
      
      //         ],
      //       ),
      
      //       const SizedBox(
      //         height: 4,
      //       ),
      //       Container(
      //         // width: MediaQuery.of(context).size.width,
      //         decoration: BoxDecoration(
      //           borderRadius: BorderRadius.circular(10),
      //           color: Colors.green.shade700,
      //           // shape: BoxShape.circle,
      //           gradient:LinearGradient(
      //             colors:[
      //               blueGradient.darkShade,
      //               blueGradient.lightShade,
      //             ],
      //           ),
      //         ),
      //         child:Container(
      //           decoration: BoxDecoration(
      //             borderRadius: BorderRadius.circular(5),
      //             gradient: LinearGradient(
      //               colors:[
      //                 blueGradient.darkShade,
      //                 blueGradient.lightShade,
      //               ],
      //             ),
      //           ),
      //           child:MaterialButton(
      //             // color: Colors.green.shade700,
      //             child:const Text("CHECKOUT NOW",style: TextStyle(color: Colors.white),),
      //             onPressed: () {
      
      //               Navigator.push(context,MaterialPageRoute(builder: (context)=> const DeliveryDetails()));
      
      //             },
      //           ) ,
      //         ),
      //       ),
      //     ],
      //   ),
      // ),
    
    );
  }
}