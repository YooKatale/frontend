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
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.lightGreen,
        leading:Padding(
          padding: const EdgeInsets.all(2.0),
          child: Image.network('https://www.yookatale.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo1.54d97587.png&w=384&q=75',height: 50,width: 50,),
        ) ,
        title: const Center(child: Text("Yookatale",style:TextStyle(color: Colors.white),)),
        bottom:  PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child:Padding(
            padding: const EdgeInsets.only(left: 10,right: 10),
            child: Column(
              children: [
                Row(
                  children: [

                    Expanded(
                      child:InkWell(
                        onTap: () {


                        },
                        child: Container(
                          child:TextField(
                            enabled: false,
                            decoration: InputDecoration(
                              hintText: 'Search a product',
                              prefixIcon: const Icon(Icons.search,color:Colors.grey ,),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(4),
                                borderSide: BorderSide.none,
                              ),
                              contentPadding: EdgeInsets.zero,
                              filled: true,
                              fillColor:Colors.grey.shade200,
                            ),

                          ),
                        ),
                      ),
                    ),

                    IconButton(
                        onPressed: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: ((context) => const CartPage())));
                        },
                        icon: const Icon(Icons.shopping_bag,color: Colors.white,)),
                  ],
                ),
                const SizedBox(height: 10,),
                SizedBox(
                  height: 20,
                  width: MediaQuery.of(context).size.width,
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [

                      Row(
                        children: [
                          Icon(Icons.info_outline,size:12,color:Colors.white),
                          Text('100 % Genuine',style: TextStyle(color: Colors.white,fontSize:12 ),)
                        ],
                      ),
                      Row(
                        children: [
                          Icon(Icons.work,size:12,color:Colors.white),
                          Text('24-7 working days',style: TextStyle(color: Colors.white,fontSize:12 ),)
                        ],
                      ),
                      Row(
                        children: [
                          Icon(Icons.production_quantity_limits,size:12,color:Colors.white),
                          Text('Trusted Products',style: TextStyle(color: Colors.white,fontSize:12 ),)
                        ],
                      ),
                    ],
                  ),

                ),
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
