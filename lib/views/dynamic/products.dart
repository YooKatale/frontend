import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:yookatale/views/cart.dart';
import 'package:yookatale/views/static/productdetails.dart';

import '../product_categoryjson/productjson.dart';


class AllProductsPageDynamic extends StatefulWidget {


  const AllProductsPageDynamic({super.key});

  @override
  State<AllProductsPageDynamic> createState() => _AllProductsPageDynamicState();
}

class _AllProductsPageDynamicState extends State<AllProductsPageDynamic> {

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


  List itemsTemp = [];
  int itemLength = 0;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    setState(() {
      itemsTemp = pro_json ;
      itemLength = pro_json.length;
    });
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.lightGreen,
        title: const Text(
          "All Products",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
              onPressed: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: ((context) => const CartPage())));
              },
              icon: const Icon(Icons.shopping_bag))
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: SingleChildScrollView(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: SizedBox(
                  height: 50,
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: "What's in your mind",
                      contentPadding: const EdgeInsets.symmetric(vertical: 10),
                      prefixIcon: const Icon(Icons.search_sharp),
                      enabledBorder: OutlineInputBorder(
                        borderSide: const BorderSide(color: Colors.green),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: const BorderSide(color: Colors.green),
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                ),
              ),
            GridView.builder(
            shrinkWrap: true,
            itemCount:itemLength,
            gridDelegate:
            const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 7,
                mainAxisSpacing: 7),
            itemBuilder: (BuildContext context, int index) {


              return InkWell(
                onTap: (){

                  Navigator.push(context, MaterialPageRoute(builder:(context)=> ProductDetails(
                      im:itemsTemp[index]['img'],nem:itemsTemp[index]['name'],price:itemsTemp[index]['price'].toString(),
                      cross:itemsTemp[index]['crossedPrice'].toString(),unit:itemsTemp[index]['unit'].toString(),wei:itemsTemp[index]['Weight'].toString()
                  )));
                },
                child:Card(
                  color: const Color.fromRGBO(243, 253, 254, 1),
                  child: Padding(
                    padding: const EdgeInsets.only(
                        left: 8.0, right: 8.0),
                    child: Column(
                      children: [
                        CachedNetworkImage(
                          imageUrl:'${itemsTemp[index]['img']}',
                          width: double.infinity,
                          height: 60,
                          fit: BoxFit.contain,
                        ),
                        Row(
                          mainAxisAlignment:
                          MainAxisAlignment.spaceBetween,
                          children: [
                            Padding(
                              padding:
                              const EdgeInsets.only(left: 8.0),
                              child: Text(
                                itemsTemp[index]["name"],
                                style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold),
                              ),
                            ),
                            InkWell(
                                onTap: (){

                                  save();
                                },
                                child: const Icon(Icons.favorite_outline,color: Colors.red,)
                            ),
                          ],
                        ),
                        Row(
                          mainAxisAlignment:
                          MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Text(
                                  "\$${itemsTemp[index]['price'].toStringAsFixed(2)}",
                                  style: const TextStyle(
                                      color: Colors.green,
                                      fontSize: 18),
                                ),
                                if (itemsTemp[index]['crossedPrice'] !=
                                    null) ...[
                                  Padding(
                                    padding:
                                    const EdgeInsets.only(
                                        left: 3.0),
                                    child: Text(
                                      "\$${itemsTemp[index]['crossedPrice'].toStringAsFixed(2)}",
                                      style: const TextStyle(
                                          decoration:
                                          TextDecoration
                                              .lineThrough),
                                    ),
                                  ),
                                ],
                              ],
                            ),
                            Row(
                              children: [
                                Text(
                                  itemsTemp[index]["unit"],
                                  style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight:
                                      FontWeight.bold),
                                ),
                                Padding(
                                  padding: const EdgeInsets.only(
                                      left: 4.0, right: 8.0),
                                  child: Text(
                                    "${itemsTemp[index]['Weight']}",
                                    style: const TextStyle(
                                        fontSize: 16),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        TextButton(
                          onPressed: () {

                            cart();
                          },
                          child: const Text(
                            "Add to cart",
                            style: TextStyle(
                                color: Colors.black, fontSize: 18),
                          ),
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
      ),
    );
  }
}
