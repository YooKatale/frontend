import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:yookatale/views/Widgets/favorite_items.dart';
import 'package:yookatale/views/Widgets/itemsCart.dart';
import 'package:yookatale/views/product_categoryjson/cart_json.dart';
class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  List itemsTemp = [];
  int itemLength = 0;
  List<Map<String, dynamic>> favoriteItems = [];   
  List<Map<String, dynamic>> cartItems = [];  

void incrementItemsToCart(String itemId) {
  setState(() {
    final item = cartjson.firstWhere((item) => item['id'] == itemId, orElse: () => null);
    if (item != null && item['quant'] >= 0) {
      item['quant']++;
    }
  });
}

void decrementItemsToCart(String itemId) {
  setState(() {
    final item = cartjson.firstWhere((item) => item['id'] == itemId, orElse: () => null);
    if (item != null && item['quant'] >= 0) {
      item['quant']--;
    }
  });
}

  @override
  void initState() {
    super.initState();
    setState(() {
      itemsTemp = cartjson;
      itemLength = cartjson.length;
    });
  }

  Future<void> callFunction(String phoneNumber) async {
  final Uri launchUri = Uri(
    scheme: 'tel',
    path:phoneNumber,
  );
  await launchUrl(launchUri);
}

void addItemToFavorite(String itemId) {
  setState(() {
    final isFavorite = favoriteItems.any((item) => item['id'] == itemId);
    if (isFavorite) {
      favoriteItems.removeWhere((item) => item['id'] == itemId);
    } else {
      final addItemToCart = itemsTemp.firstWhere((item) => item['id'] == itemId);
      favoriteItems.add(addItemToCart);
    }
  });
}
void addItemToCart(String itemId) {
  setState(() {
    final isAddedToCart = cartItems.any((item) => item['id'] == itemId);
    if (isAddedToCart) {
      cartItems.removeWhere((item) => item['id'] == itemId);
    } else {
      final addItemToCart = itemsTemp.firstWhere((item) => item['id'] == itemId);
      cartItems.add(addItemToCart);
    }
  });
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: InkWell(
          onTap: () => Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new,
          color: Colors.green,)),
        actions: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,            

            children:  [
          const Icon(Icons.location_pin),
          const SizedBox(width: 5,),
          const Text('Home', style: TextStyle(color: Colors.green),),
          const SizedBox(width: 10,),
          InkWell(
            onTap: ()=> Navigator.of(context).push(MaterialPageRoute(builder: (context)=> ItemsCart(cartItems: cartItems,))),
            child: const Icon(Icons.shopping_cart)),
            InkWell(
            onTap: ()=> Navigator.of(context).push(MaterialPageRoute(builder: (context)=> FavoriteItems(favoriteItems: favoriteItems))),
            child: const Icon(Icons.favorite)),
          const SizedBox(width: 10,),
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
                          child: TextField(

                             enabled: false,
                             decoration: InputDecoration(
                               hintText: 'Search category',
                               prefixIcon: const Icon(Icons.search,color:Colors.grey ,),
                               border: OutlineInputBorder(
                                 borderRadius: BorderRadius.circular(10),
                                 borderSide: const BorderSide(color: Colors.grey, width: 1.5),
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
                    ],
                  ),
                ),
               const SizedBox(height: 10,)
              ],
            ),
          ) ,
        ),
      ),
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 15),
              child: Text(
                "Vegetables", 
                style: TextStyle(
                  color: Colors.green, 
                  fontSize: 18, fontWeight: 
                  FontWeight.bold),),
            ),
            ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount:itemLength,
                itemBuilder: (BuildContext context, int index) {   
                  final isAddedToCart = cartItems.any((item) => item['id'] == itemsTemp[index]['id']);
                  final isFavorite = favoriteItems.any((item) => item['id'] == itemsTemp[index]['id']);            
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 5),
                    child: Card(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      color: Colors.white,
                      elevation: 10,
                      child: Container(
                        height: 110,
                        padding: const EdgeInsets.all(5),                        
                        margin: const EdgeInsets.only(top: 5),  
                        decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(4)
                        ),
                        child: Column(
                          children: [
                            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [                                          
                                CachedNetworkImage(
                                  imageUrl:'${itemsTemp[index]['img']}',
                                  width:100,
                                  height:100,
                                  fit: BoxFit.cover,
                                ),                                
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,                                      
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [                                
                                    Text( itemsTemp[index]["name"],
                                      style: const TextStyle(
                                          color: Colors.black,
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold
                                              ),),                                                                                            
                                    
                                    Text(
                                      '${itemsTemp[index]['unit']}'
                                    )
                                  ],
                                ),                                                       
                                Column(
                                  children: [                                   
                                    IconButton(
                                      icon: Icon(
                                        isFavorite ? Icons.favorite: Icons.favorite_border,
                                        color: isFavorite ? Colors.green : Colors.grey,                               
                                      ),
                                      onPressed: () {
                                        final itemId = itemsTemp[index]['id'];
                                        if (itemId!= null) {
                                          addItemToFavorite(itemId);
                                        } else {
                                        }
                                      }),
                                      IconButton(
                                      icon: Icon(
                                        isAddedToCart ? Icons.add_circle: Icons.add_circle_outline_rounded,
                                        color: isAddedToCart ? Colors.green : Colors.grey,                               
                                      ),
                                      onPressed: () {
                                        final itemId = itemsTemp[index]['id'];
                                        if (itemId!= null) {
                                          addItemToCart(itemId);
                                        } else {
                                        }
                                      }),
                                  ],
                                )
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),
          ],
        ),
      ),
    );
  }
}