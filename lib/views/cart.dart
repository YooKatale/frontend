import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

class CartPage extends StatelessWidget {
  const CartPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.lightGreen,
        title: const Text("Cart",style:TextStyle(color: Colors.white),),
      ),
      body: StreamBuilder<QuerySnapshot>(
          stream: FirebaseFirestore.instance
              .collectionGroup('products')
              .snapshots(),
          builder: (BuildContext context,
              AsyncSnapshot<QuerySnapshot> snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {

              return const CircularProgressIndicator();


            } else if (snapshot.hasData) {
              List<QueryDocumentSnapshot> documents =
                  snapshot.data!.docs;
              return ListView.builder(
                  shrinkWrap: true,
                  physics:const BouncingScrollPhysics(),
                  itemCount: documents.length,
                  itemBuilder: (BuildContext context, int index) {
                    final data =
                    documents[index].data() as Map<String, dynamic>;


                    return Container(
                      height: 140,
                      padding: const EdgeInsets.all(5),
                      margin: const EdgeInsets.only(top: 5),
                      decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(4)
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment
                                .spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment
                                .start,
                            children: [


                              Image.network(
                                data["imageUrl"],
                                width:100,
                                height:100,
                                fit: BoxFit.cover,
                              ),

                              Container(
                                width: MediaQuery
                                    .of(context)
                                    .size
                                    .width - 183,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment
                                      .start,
                                  children: [

                                    Text(data["name"],
                                      style: const TextStyle(
                                          color: Colors.black,
                                          fontSize: 15,
                                          fontWeight: FontWeight
                                              .bold),),
                                    Row(
                                      children: [


                                        IconButton(
                                            icon: const Icon(
                                              Icons.add_circle,
                                              color: Colors.green,
                                            ),
                                            onPressed: () {
                                              //shop.updateQuanity(catid:pros[index].id, quant: 'adding',context: context);
                                            }),


                                        const Text(
                                          '1', style: TextStyle(
                                            color: Colors.black),),


                                        IconButton(
                                            icon: const Icon(
                                              Icons.remove_circle,
                                              color: Colors.red,
                                            ),
                                            onPressed: () {
                                              // shop.updateQuanity( catid:pros[index].id, quant: 'sub',context:context);

                                            }),


                                      ],
                                    ),

                                    Text('Price:${data['price']} ',
                                      style: const TextStyle(
                                          color: Colors.black,
                                          fontSize: 15),)
                                  ],
                                ),
                              ),

                              IconButton(onPressed: () {
                                // shop.deleteCartItem(catid:pros[index].id, context:context);

                              }, icon: const Icon(Icons.delete,
                                color: Colors.red,)),


                            ],
                          ),
                        ],
                      ),
                    );
                  });
            }
            // if snapshot.hasError
            return const Text('Something went wrong');
          }),
    );
  }
}