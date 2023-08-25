
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
      child: GridView.builder(
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 4),
          itemCount:itemLength,
          physics: const BouncingScrollPhysics(),
          // scrollDirection:Axis.horizontal,
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
                padding: const EdgeInsets.all(2.0),
                child: Container(
                  child: Column(
                    children: [
                      Container(
                        height: 55,
                        width: 60,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(50),
                          color: Color.fromRGBO(
                              itemsTemp[index]['red'], itemsTemp[index]['green'], itemsTemp[index]['blue'], 1),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(1.0),
                          child: CachedNetworkImage(
                            imageUrl:'${itemsTemp[index]['img']}',height: 55,width: 40,fit: BoxFit.cover,),
                        ),
                      ),
                      const SizedBox(height:5,),
                      Text(
                          itemsTemp[index]['name'],
                          style: const TextStyle(
                               fontSize: 14, color: Colors.green),
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
