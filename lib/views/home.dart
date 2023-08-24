import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'cart.dart';
import 'dynamic/categories.dart';
import 'dynamic/categorieshorizontal.dart';
import 'dynamic/products.dart';
import 'dynamic/someproducts.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {


    final users= FirebaseAuth.instance.currentUser;

    return Scaffold(
      appBar: AppBar(
        // backgroundColor: Colors.lightGreen,
        leading:Padding(
          padding: const EdgeInsets.all(2.0),
          child: Icon(Icons.menu),
        ) ,
        title:Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Good Morning,", style: TextStyle(fontSize: 14, color: Colors.green),),
            Text("Vincent", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.green),)
          ],
        ),
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
               SizedBox(height: 10,)
              ],
            ),
          ) ,
        ),

      ),
     
      body:ListView(
        padding: const EdgeInsets.only(left: 8,top: 10,right: 10),
        children: [

          Container(
            height: 140,
            child:  Column(
              children: [

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Categories',style: TextStyle(fontSize: 16,fontWeight: FontWeight.bold),),
                    InkWell(
                      onTap: (){

                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: ((context) => const CategoriesPageDynamic())));
                      },
                        child: const Text('View more.',style: TextStyle(fontSize: 16),)
                    ),

                  ],
                ),

                const SizedBox(height:5,),

                const CategoriesHorizontal(),
              ],
            ),
          ),

          const SizedBox(height: 20,),


          Container(
            width: MediaQuery.of(context).size.width,
            height:MediaQuery.of(context).size.height,
            child:Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Best Products',style: TextStyle(fontSize: 16,fontWeight: FontWeight.bold),),
                    InkWell(
                        onTap: (){

                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: ((context) => const AllProductsPageDynamic())));
                        },
                        child: const Text('View more.',style: TextStyle(fontSize: 16),)
                    ),

                  ],
                ),
                const SomeProducts(),
              ],
            ),
          ),


          //
          // Center(
          //   child: ElevatedButton(
          //     onPressed: () {
          //       Navigator.push(
          //           context,
          //           MaterialPageRoute(
          //               builder: ((context) => const AllProductsPageDynamic())));
          //     },
          //     child: const Text("All Products"),
          //   ),
          // ),
        ],
      ),
    );
  }
}
