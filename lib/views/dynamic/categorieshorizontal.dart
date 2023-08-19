
import 'package:cached_network_image/cached_network_image.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

import '../product_categoryjson/categoryjson.dart';
import '../static/categoryproduct.dart';

class CategoriesHorizontal extends StatefulWidget {
  const CategoriesHorizontal({super.key});

  @override
  State<CategoriesHorizontal> createState() => _CategoriesHorizontalState();
}

class _CategoriesHorizontalState extends State<CategoriesHorizontal> {

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
    return Expanded(
      child: ListView.builder(
          itemCount:itemLength,
          physics: const BouncingScrollPhysics(),
          scrollDirection:Axis.horizontal,
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
              child: Padding(
                padding: const EdgeInsets.all(4.0),
                child: Container(
                  height: 50,
                  width: 100,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: Color.fromRGBO(
                        itemsTemp[index]['red'], itemsTemp[index]['green'], itemsTemp[index]['blue'], 1),
                  ),
                  child: Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(3.0),
                        child: CachedNetworkImage(
                          imageUrl:'${itemsTemp[index]['img']}',height: 40,width: 40,fit: BoxFit.cover,),
                      ),
                      Text(
                        itemsTemp[index]['name'],
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 15),
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
