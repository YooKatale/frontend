import 'package:cached_network_image/cached_network_image.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

import '../product_categoryjson/cart_json.dart';
import '../product_categoryjson/categoryjson.dart';
import '../static/categoryproduct.dart';

class CategoriesPageDynamic extends StatefulWidget {
  const CategoriesPageDynamic({super.key});

  @override
  State<CategoriesPageDynamic> createState() => _CategoriesPageDynamicState();
}

class _CategoriesPageDynamicState extends State<CategoriesPageDynamic> {


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
        backgroundColor: Colors.lightGreen,
        title: const Text("Categories",style:TextStyle(color: Colors.white),),
      ),
      body: GridView.builder(
          //scrollDirection: Axis.horizontal,
          shrinkWrap: true,
          physics: const BouncingScrollPhysics(),
          itemCount:itemLength,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2),
          itemBuilder: (BuildContext context, int index) {



           return InkWell(
             onTap: (){

               Navigator.push(
                   context,
                   MaterialPageRoute(
                       builder: ((context) => CategoryProduct(

                         name:itemsTemp[index]['name'],
                       ))));
             },
             child: Card(
               shape: RoundedRectangleBorder(
                 borderRadius: BorderRadius.circular(10.0),
                 side: const BorderSide(color: Colors.red),
               ),
               color: Color.fromRGBO(
                   itemsTemp[index]['red'],itemsTemp[index]['green'], itemsTemp[index]['blue'], 1),
               child: Column(
                 children: [
                   SizedBox(
                       height: 146,
                       child: CachedNetworkImage(
                           imageUrl:'${itemsTemp[index]['img']}'
                           )
                   ),
                   Text(
                     itemsTemp[index]['name'],
                     style: const TextStyle(
                         fontWeight: FontWeight.bold, fontSize: 18),
                   ),
                 ],
               ),
             ),
           );


          }),
    );
  }
}
