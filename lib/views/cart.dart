import 'dart:convert';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:yookatale/views/Widgets/favorite_items.dart';
import 'package:yookatale/views/Widgets/itemsCart.dart';
import 'package:yookatale/views/product_categoryjson/cart_json.dart';
import 'package:location/location.dart'  as loc;
import 'package:http/http.dart' as http;

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
  String googleApiKey ='AIzaSyDhbytrBgo8gUz5tgkprBXcTFiJ2BX386M';
  final LatLng center = const LatLng(0.347596, 32.582520);
   loc.LocationData? currentLocation;
   late GoogleMapController controller;
   String currentAddress = 'Home';

  // get cartjson => cart_json;

  void incrementItemsToCart(String itemId) {
    setState(() {
      final item = cartjson.firstWhere((item) => item['id'] == itemId,
          orElse: () => null);
      if (item != null && item['quant'] >= 0) {
        item['quant']++;
      }
    });
  }

  void decrementItemsToCart(String itemId) {
    setState(() {
      final item = cartjson.firstWhere((item) => item['id'] == itemId,
          orElse: () => null);
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
      path: phoneNumber,
    );
    await launchUrl(launchUri);
  }

void addItemToFavorite(String itemId) {
  setState(() {
    final isFavorite = favoriteItems.any((item) => item['id'] == itemId);
    if (isFavorite) {
      favoriteItems.removeWhere((item) => item['id'] == itemId);
    } else {
      final addItemToFav = itemsTemp.firstWhere((item) => item['id'] == itemId);
      favoriteItems.add(addItemToFav);
    }
  });
}

void removeItemFromFavorite(String itemId) {
  setState(() {
    favoriteItems.removeWhere((item) => item['id'] == itemId);
  });
}

void addItemToCart(String itemId) {
  setState(() {
    final isAddedToCart= cartItems.any((item) => item['id'] == itemId);
    if (isAddedToCart) {
      cartItems.removeWhere((item) => item['id'] == itemId);
    } else {
      final addItemToCart = itemsTemp.firstWhere((item) => item['id'] == itemId);
      cartItems.add(addItemToCart);
    }
  });
}

  void getCurrentLocation() async {
  loc.Location location = loc.Location();
  location.getLocation().then((location) async {
    currentLocation = location;
    String newAddress = await getAddressFromCoordinates(
      location.latitude!, location.longitude!);
    currentAddress = newAddress;
  });
  setState(() {
    
  });
  }
  // GoogleMapController googleMapController = controller;
  // location.onLocationChanged.listen((newLocation) {
  //   currentLocation = newLocation;
  //   // Update the map with the new location.
  //   googleMapController.animateCamera(
  //     CameraUpdate.newCameraPosition(
  //       CameraPosition(
  //         zoom: 11,
  //         target: LatLng(
  //           newLocation.latitude!, 
  //           newLocation.longitude!,
  //           )))
  //           );
  //           setState(() {
              
  //           });
  // }

Future<String> getAddressFromCoordinates(double latitude, double longitude) async {
    final apiKey = googleApiKey;
    final apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=$latitude,$longitude&key=$apiKey';
    try {
      var response = await http.get(Uri.parse(apiUrl));
      if(response.statusCode == 200){
        Map<String, dynamic> data = json.decode(response.body);
        if(data['status'] == 'OK'){
          return data['results'][0]['formatted_address'];
        }
      }
    } catch (e) {
      print(e.toString());
    }
    return '';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: InkWell(
          onTap: () => Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new)),
        actions: [
          Row(mainAxisAlignment: MainAxisAlignment.center,            
            children:  [
          const Icon(Icons.location_pin),
          const SizedBox(width: 5,),          
           Text(
            currentAddress, style: const TextStyle(color: Colors.green),),
          const SizedBox(width: 10,),
          InkWell(
            onTap: ()=> Navigator.of(context).push(MaterialPageRoute(builder: (context)=> ItemsCart(cartItems: cartItems,))),
            child: const Icon(Icons.shopping_cart,color: Colors.green,)),
            InkWell(
            onTap: ()=> Navigator.of(context).push(MaterialPageRoute(builder: (context)=> FavoriteItems(favoriteItems: favoriteItems))),
            child: const Icon(Icons.favorite,
            color: Colors.green,)),
          const SizedBox(width: 10,),

            ],
          )
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Padding(
            padding: const EdgeInsets.only(left: 10, right: 10),
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 15),
                  child: Row(
                    children: [
                      Expanded(
                        child: InkWell(
                          onTap: () {},
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
                const SizedBox(
                  height: 10,
                )
              ],
            ),
          ),
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
                    fontSize: 18,
                    fontWeight: FontWeight.bold),
              ),
            ),
            ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount:itemLength,
                itemBuilder: (BuildContext context, int index) {   
                  final isFavorite = favoriteItems.any((item) => item['id'] == itemsTemp[index]['id']); 
                  final isAddedToCart = cartItems.any((item) => item['id'] == itemsTemp[index]['id']);         
                  return Padding(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 15, vertical: 5),
                    child: Card(
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10)),
                      color: Colors.white,
                      elevation: 10,
                      child: Container(
                        height: 110,
                        padding: const EdgeInsets.all(5),                        
                        margin: const EdgeInsets.only(top: 5),  
                        decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(4)),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                CachedNetworkImage(
                                  imageUrl: '${itemsTemp[index]['img']}',
                                  width: 100,
                                  height: 100,
                                  fit: BoxFit.cover,
                                ),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      itemsTemp[index]["name"],
                                      style: const TextStyle(
                                          color: Colors.black,
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold
                                              ),),     
                                         Text('Price:${ itemsTemp[index]['price']}',
                                      style: const TextStyle(
                                          color: Colors.black,
                                          fontSize: 15),),                                                              
                                    Text('Weight:${ itemsTemp[index]['unit']}',
                                      style: const TextStyle(
                                          color: Colors.black,
                                          fontSize: 15),)
                                  ],
                                ),                                            
                                Column(
                                  children: [                                   
                                    IconButton(
                                      icon: Icon(
                                        isFavorite ? Icons.favorite : Icons.favorite_outline,
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
                                        isAddedToCart ? Icons.add_circle_outline : Icons.add_circle,
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
