import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

import '../static/categoryproduct.dart';

class CategoriesPageDynamic extends StatelessWidget {
  const CategoriesPageDynamic({super.key});

  @override
  Widget build(BuildContext context) {
    CollectionReference categories =
        FirebaseFirestore.instance.collection('categories');

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.lightGreen,
        title: const Text("Categories",style:TextStyle(color: Colors.white),),
      ),
      body: StreamBuilder(
          stream: categories.snapshots(),
          builder:
              (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            } else if (snapshot.hasData) {
              List<QueryDocumentSnapshot> documents = snapshot.data!.docs;
              return GridView.builder(
                  itemCount: documents.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2),
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
                      child: Card(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10.0),
                          side: const BorderSide(color: Colors.red),
                        ),
                        color: Color.fromRGBO(
                            data['red'], data['green'], data['blue'], 1),
                        child: Column(
                          children: [
                            SizedBox(
                                height: 146,
                                child: Image.network(data['imageUrl'])),
                            Text(
                              data['name'],
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 18),
                            ),
                          ],
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
