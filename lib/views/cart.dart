import 'package:cached_network_image/cached_network_image.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:yookatale/views/product_categoryjson/cart_json.dart';

import '../gradient/grad.dart';
import 'deliverydetils/deliverydetail.dart';

class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {


  List itemsTemp = [];
  int itemLength = 0;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    setState(() {
      itemsTemp = cart_json;
      itemLength = cart_json.length;
    });
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Cart",style:TextStyle(color: Colors.white),),
        leading: InkWell(
          onTap: () => Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new)),
        actions: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            
            children: const [
              Icon(Icons.location_pin),
          SizedBox(width: 5,),
          Text('Home', style: TextStyle(color: Colors.green),),
          SizedBox(width: 10,),
          Icon(Icons.shopping_cart),
          SizedBox(width: 10,),
            ],
          )
        ],
        bottom:  PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child:Padding(
            padding: const EdgeInsets.only(left: 10,right: 10),
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 15),
                  child: Row(
                    children: [
                      Expanded(
                        child:InkWell(
                          onTap: () {
                          },
                          child: Container(
                                                       
                           child:TextField(
                              enabled: false,
                              decoration: InputDecoration(
                                hintText: 'Search category',
                                prefixIcon: const Icon(Icons.search,color:Colors.grey ,),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10),
                                  borderSide: BorderSide(color: Colors.grey, width: 1.5),
                                ),
                                contentPadding: EdgeInsets.zero,
                                filled: true,
                                fillColor:Colors.white,
                                suffixIcon: IconButton(
                          onPressed: () {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: ((context) => const CartPage())));
                          },
                          icon: const Icon(Icons.speaker,color: Colors.grey,)),
                              ),

                            ),
                          ),
                        ),
                      ),

                      
                    ],
                  ),
                ),
               const SizedBox(height: 10,)
              ],
            ),
          ) ,
        ),
      ),
      
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton:Container(
        padding: const EdgeInsets.all(15),
        height: 120,
        // margin: const EdgeInsets.only(bottom: 10),
        width: MediaQuery.of(context).size.width,
        decoration:BoxDecoration(
            color: Colors.green.withOpacity(0.9),
            borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(30),
                topRight: Radius.circular(30))),
        child: Column(
          children: [
           Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [

            Text(
              "Total Payment",
              style: TextStyle(
                  fontSize: 15,fontWeight: FontWeight.bold,color: Colors.white),
            ),

            Text(
               " Shs 0",
              style:TextStyle(fontSize: 15,fontWeight: FontWeight.bold,color: Colors.white),
            ),


          ],
        ),

             Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [

                TextFormField(
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

              ],
            ),

            const SizedBox(
              height: 4,
            ),
            Container(
              width: MediaQuery.of(context).size.width,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                //color: Colors.green.shade700,
                //shape: BoxShape.circle,
                gradient:LinearGradient(
                  colors:[
                    blueGradient.darkShade,
                    blueGradient.lightShade,
                  ],
                ),
              ),
              child:Container(
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

                    Navigator.push(context,MaterialPageRoute(builder: (context)=> const DeliveryDetails()));

                  },
                ) ,
              ),
            ),
          ],
        ),
      ),
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 15),
              child: Text("Vegetables", style: TextStyle(color: Colors.green, fontSize: 18, fontWeight: FontWeight.bold),),
            ),
            ListView.builder(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                itemCount:itemLength,
                itemBuilder: (BuildContext context, int index) {          
                
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 5),
                    child: Card(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      color: Colors.white,
                      elevation: 10,
                      child: Container(
                        height: 110,
                        padding: const EdgeInsets.all(5),
                        margin: const EdgeInsets.only(top: 5),
                        // decoration: BoxDecoration(
                        //     color: Colors.white,
                        //     borderRadius: BorderRadius.circular(4)
                        // ),
                        child: Column(
                          children: [
                            Row(mainAxisAlignment: MainAxisAlignment
                                  .spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment
                                  .start,
                              children: [                                
                                
                                CachedNetworkImage(
                                  imageUrl:'${itemsTemp[index]['img']}',
                                  width:100,
                                  height:100,
                                  fit: BoxFit.cover,
                                ),
                                
                                Container(
                                  // width: MediaQuery
                                  //     .of(context)
                                  //     .size
                                  //     .width - 183,
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment
                                        .start,
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                
                                      Text( itemsTemp[index]["name"],
                                        style: const TextStyle(
                                            color: Colors.black,
                                            fontSize: 15,
                                            fontWeight: FontWeight
                                                .bold),),
                                      Row(
                                        children: [
                                
                                
                                          // IconButton(
                                          //     icon: const Icon(
                                          //       Icons.add_circle,
                                          //       color: Colors.green,
                                          //     ),
                                          //     onPressed: () {
                                          //       //shop.updateQuanity(catid:pros[index].id, quant: 'adding',context: context);
                                          //     }),
                                
                                
                                          Text(itemsTemp[index]["quant"].toString(),
                                            style: const TextStyle(
                                              color: Colors.black),),
                                
                                
                                          // IconButton(
                                          //     icon: const Icon(
                                          //       Icons.remove_circle,
                                          //       color: Colors.red,
                                          //     ),
                                          //     onPressed: () {
                                          //       // shop.updateQuanity( catid:pros[index].id, quant: 'sub',context:context);
                                
                                          //     }),
                                
                                
                                        ],
                                      ),
                                
                                      Text('Price:${ itemsTemp[index]['price']} ',
                                        style: const TextStyle(
                                            color: Colors.black,
                                            fontSize: 15),)
                                    ],
                                  ),
                                ),
                                
                                // IconButton(onPressed: () {
                                //   // shop.deleteCartItem(catid:pros[index].id, context:context);
                                
                                // }, icon: const Icon(Icons.delete,
                                //   color: Colors.red,)),
            
                                Column(
                                  children: const [
                                    Icon(Icons.favorite_outline,color: Colors.green,),
                                    SizedBox(height: 40,),
                                    Text("Add to Cart", style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold),)
                                  ],
                                )
                                
                                
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),
          ],
        ),
      ),
    );
  }
}