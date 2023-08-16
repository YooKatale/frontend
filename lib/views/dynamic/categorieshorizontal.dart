
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

import '../static/categoryproduct.dart';

class CategoriesHorizontal extends StatefulWidget {
  const CategoriesHorizontal({super.key});

  @override
  State<CategoriesHorizontal> createState() => _CategoriesHorizontalState();
}

class _CategoriesHorizontalState extends State<CategoriesHorizontal> {

  CollectionReference categories =
  FirebaseFirestore.instance.collection('categories');

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: StreamBuilder(
          stream: categories.snapshots(),
          builder:
              (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {

            if (snapshot.connectionState == ConnectionState.waiting) {

              return ListView.builder(
                  physics: const BouncingScrollPhysics(),
                  scrollDirection:Axis.horizontal,
                  itemBuilder: (BuildContext context, int index) {

                    return Padding(
                      padding: const EdgeInsets.all(4.0),
                      child: Container(
                        height: 50,
                        width: 100,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(10),
                          color: Colors.grey.shade300
                        ),
                        child: Image.asset('assets/hug.gif',height: 40,width: 40,fit: BoxFit.cover,),
                      ),
                    );
                  });

            } else if (snapshot.hasData) {
              List<QueryDocumentSnapshot> documents = snapshot.data!.docs;
              return ListView.builder(
                  itemCount: documents.length,
                  physics: const BouncingScrollPhysics(),
                  scrollDirection:Axis.horizontal,
                  itemBuilder: (BuildContext context, int index) {
                    final data =
                    documents[index].data() as Map<String, dynamic>;
                    return InkWell(
                      onTap: (){

                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: ((context) => CategoryProduct(

                                  name:data['name'],
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
                                data['red'], data['green'], data['blue'], 1),
                          ),
                          child: Column(
                            children: [
                              Padding(
                                padding: const EdgeInsets.all(3.0),
                                child: Image.network(data['imageUrl'],height: 40,width: 40,fit: BoxFit.cover,),
                              ),
                              Text(
                                data['name'],
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold, fontSize: 15),
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
    );
  }
}
