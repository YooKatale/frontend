import 'package:flutter/material.dart';

class FavoriteItems extends StatefulWidget {
  final List<Map<String, dynamic>> favoriteItems;
  const FavoriteItems({super.key, required this.favoriteItems});

  @override
  State<FavoriteItems> createState() => _FavoriteItemsState();
}

class _FavoriteItemsState extends State<FavoriteItems> {
    double tottalPrice =0;
  @override
  void initState() {
    super.initState();
    calculateTotalPrice();
  }
  void calculateTotalPrice () {
    double tottal =0;
    for(final item in widget.favoriteItems) {
      final itemPrice =item['price'];
      tottal += itemPrice;
    }
    setState(() {
      tottalPrice = tottal;
    });
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
       appBar: AppBar(
        backgroundColor: Colors.white,
        leading: InkWell(
          onTap: ()=> Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new_outlined)),
        title: const Text(
          "Favorite Items",
          style:TextStyle(color: Colors.black),),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
        child: Column (
          children: [
              Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [      
            const Text(
              "Favorite Items Price",
              style: TextStyle(
                  fontSize: 15,fontWeight: FontWeight.bold,color: Colors.black),
            ),      
            Text(
               'Shs.$tottalPrice',
              style:const TextStyle(fontSize: 15,fontWeight: FontWeight.bold,color: Colors.black),
            ),            
          ],
        ),
            Container(
          height: 500,
          padding: const EdgeInsets.all(10),
        child: ListView.builder(
        itemCount: widget.favoriteItems.length,
        itemBuilder: (context, index) {
          final item = widget.favoriteItems[index];
          return ListTile(
            title: Text(item['name']),
          );
        },
      ),
        ),
          ],
        )
      ),
    );
  }
}