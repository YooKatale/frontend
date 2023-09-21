import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../product_categoryjson/productjson.dart';
import '../static/productdetails.dart';

class SomeProducts extends StatefulWidget {
  const SomeProducts({super.key});

  @override
  State<SomeProducts> createState() => _SomeProductsState();
}

class _SomeProductsState extends State<SomeProducts> {
  cart() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: Colors.cyan.withOpacity(0.8),
          title: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Image.network(
                'https://www.yookatale.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo1.54d97587.png&w=384&q=75',
                height: 50,
                width: 50,
              )
            ],
          ),
          content: const Text(
            'Saved to cart',
            style: TextStyle(color: Colors.white),
          ),
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

  save() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: Colors.cyan.withOpacity(0.8),
          title: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Image.network(
                'https://www.yookatale.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo1.54d97587.png&w=384&q=75',
                height: 50,
                width: 50,
              )
            ],
          ),
          content: const Text(
            'Saved for later',
            style: TextStyle(color: Colors.white),
          ),
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
      itemsTemp = pro_json;
      itemLength = pro_json.length;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: GridView.builder(
          shrinkWrap: true,
          physics: const ClampingScrollPhysics(),
          itemCount: itemLength,
          // scrollDirection: Axis.horizontal,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2, crossAxisSpacing: 7, mainAxisSpacing: 7),
          itemBuilder: (BuildContext context, int index) {
            return InkWell(
              onTap: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => ProductDetails(
                            im: itemsTemp[index]['img'],
                            nem: itemsTemp[index]['name'],
                            price: itemsTemp[index]['price'].toString(),
                            cross: itemsTemp[index]['crossedPrice'].toString(),
                            unit: itemsTemp[index]['unit'].toString(),
                            wei: itemsTemp[index]['Weight'].toString())));
              },
              child: Card(
                color: const Color.fromRGBO(243, 253, 254, 1),
                child: Padding(
                  padding:
                      const EdgeInsets.only(left: 8.0, right: 8.0, top: 4.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(2.0),
                        child: Container(
                            width: double.infinity,
                            // color: Colors.red,
                            height: 55,
                            child: CachedNetworkImage(
                              height: 55,
                              imageUrl: '${itemsTemp[index]['img']}',
                              fit: BoxFit.cover,
                            )),
                      ),
                      Column(
                        children: [
                          Padding(
                            padding: const EdgeInsets.only(left: 2, top: 2),
                            child: Text(
                              itemsTemp[index]["name"],
                              style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green),
                            ),
                          ),
                        ],
                      ),
                      Column(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Center(
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Padding(
                                  padding: const EdgeInsets.only(left: 4.0),
                                  child: Text(
                                    itemsTemp[index]["unit"] + ":",
                                    style: const TextStyle(
                                      fontSize: 14,
                                    ),
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.only(
                                      left: 4.0, right: 8.0),
                                  child: Text(
                                    "${itemsTemp[index]['Weight']},",
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                // ignore: prefer_const_constructors
                                Padding(
                                  padding: const EdgeInsets.only(
                                      left: 2.0, right: 2.0),
                                  // ignore: prefer_const_constructors
                                  child: Text(
                                    'Price:',
                                    style: const TextStyle(fontSize: 14),
                                  ),
                                ),
                                Text(
                                  "\$${itemsTemp[index]['price'].toStringAsFixed(2)}",
                                  style: const TextStyle(
                                      color: Colors.black,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16),
                                ),
                              ],
                            ),
                          ),
                          Center(
                            child: TextButton(
                              onPressed: () {
                                cart();
                              },
                              child: const Text(
                                "Add to cart",
                                style: TextStyle(
                                    color: Colors.green, fontSize: 14),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),
    );
  }
}
