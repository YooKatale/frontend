import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:yookatale/views/cart.dart';
import 'package:yookatale/views/static/productdetails.dart';


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
              StreamBuilder<QuerySnapshot>(
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
                                    cross:data['crossedPrice'].toString()!!,unit:data['unit'].toString(),wei:data['weight'].toString()
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
                          });
                    }
                    // if snapshot.hasError
                    return const Text('Something went wrong');
                  }),
            ],
          ),
        ),
      ),
    );
  }
}
