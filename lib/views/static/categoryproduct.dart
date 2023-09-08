import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:yookatale/views/static/productdetails.dart';

import '../product_categoryjson/categoryjson.dart';

class CategoryProduct extends StatefulWidget {

  final String name;
  const CategoryProduct({super.key, required this.name});

  @override
  State<CategoryProduct> createState() => _CategoryProductState();
}

class _CategoryProductState extends State<CategoryProduct> {


  List itemsTemp = [];
  int itemLength = 0;





  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    setState(() {
      itemsTemp = cat_json ;
      itemLength = cat_json.length;
    });
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title:Text(widget.name,style: const TextStyle(fontWeight: FontWeight.bold),),
        leading: InkWell(
          onTap: ()=> Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new_outlined)),
      ),
      body:Padding(
        padding: const EdgeInsets.all(8.0),
        child: SingleChildScrollView(
          child:StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance
                  .collectionGroup('products').where('name',isEqualTo: widget.name,)
                  .snapshots(),
              builder: (BuildContext context,
                  AsyncSnapshot<QuerySnapshot> snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: const CircularProgressIndicator());
                } else if (snapshot.hasData) {
                  List<QueryDocumentSnapshot> documents =
                      snapshot.data!.docs;
                  return GridView.builder(
                      shrinkWrap: true,
                      itemCount: documents.length,
                      gridDelegate:
                      const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 7,
                          mainAxisSpacing: 7),
                      itemBuilder: (BuildContext context, int index) {
                        final data =
                        documents[index].data() as Map<String, dynamic>;


                        return InkWell(
                          onTap: (){

                            Navigator.push(context, MaterialPageRoute(builder:(context)=> ProductDetails(
                                im:data['imageUrl'],nem:data['name'],price:data['price'].toString(),
                                cross:data['crossedPrice'].toString(),unit:data['unit'].toString(),wei:data['weight'].toString()
                            )));
                          },
                          child:Card(
                            color: const Color.fromRGBO(243, 253, 254, 1),
                            child: Padding(
                              padding: const EdgeInsets.only(
                                  left: 8.0, right: 8.0),
                              child: Column(
                                children: [
                                  Image.network(
                                    data["imageUrl"],
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
                                          data["name"],
                                          style: const TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                      const Icon(Icons.favorite_outline),
                                    ],
                                  ),
                                  Row(
                                    mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                    children: [
                                      Row(
                                        children: [
                                          Text(
                                            "\$${data['price'].toStringAsFixed(2)}",
                                            style: const TextStyle(
                                                color: Colors.green,
                                                fontSize: 18),
                                          ),
                                          if (data['crossedPrice'] !=
                                              null) ...[
                                            Padding(
                                              padding:
                                              const EdgeInsets.only(
                                                  left: 3.0),
                                              child: Text(
                                                "\$${data['crossedPrice'].toStringAsFixed(2)}",
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
                                            data["unit"],
                                            style: const TextStyle(
                                                fontSize: 16,
                                                fontWeight:
                                                FontWeight.bold),
                                          ),
                                          Padding(
                                            padding: const EdgeInsets.only(
                                                left: 4.0, right: 8.0),
                                            child: Text(
                                              "${data['weight']}",
                                              style: const TextStyle(
                                                  fontSize: 16),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                  TextButton(
                                    onPressed: () {},
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
                      });
                }
                // if snapshot.hasError
                return const Center(child: Text('Something went wrong'));
              }),
        ),
      ),
    );
  }
}
