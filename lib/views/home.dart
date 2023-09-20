// ignore_for_file: unused_local_variable

import 'package:cached_network_image/cached_network_image.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:yookatale/views/dynamic/products.dart';
import 'cart.dart';
import 'dynamic/categories.dart';
import 'dynamic/categorieshorizontal.dart';
import 'dynamic/someproducts.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String greetings = '';

  greeting() {
    var hour = DateTime.now().hour;
    if (hour < 12) {
      setState(() {
        greetings = 'Good Morning';
      });
    } else if ((hour >= 12) && (hour <= 16)) {
      setState(() {
        greetings = 'Good Afternoon';
      });
    } else if ((hour > 16) && (hour < 20)) {
      setState(() {
        greetings = 'Good Evening';
      });
    } else {
      setState(() {
        greetings = 'Good Evening';
      });
    }
  }

  @override
  void initState() {
    greeting();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final users = FirebaseAuth.instance.currentUser;
    return Scaffold(
      appBar: AppBar(
        // backgroundColor: Colors.lightGreen,
        leading: const Padding(
          padding: EdgeInsets.all(2.0),
          child: Icon(Icons.menu),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              greetings,
              style: const TextStyle(fontSize: 14, color: Colors.green),
            ),
            const Text(
              "YooKatale",
              style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Colors.green),
            )
          ],
        ),
        actions: const [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.location_pin),
              SizedBox(
                width: 5,
              ),
              Text(
                'Home',
                style: TextStyle(color: Colors.green),
              ),
              SizedBox(
                width: 10,
              ),
              Icon(Icons.shopping_cart),
              SizedBox(
                width: 10,
              ),
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
                              prefixIcon: const Icon(
                                Icons.search,
                                color: Colors.grey,
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                    color: Colors.grey, width: 1.5),
                              ),
                              contentPadding: EdgeInsets.zero,
                              filled: true,
                              fillColor: Colors.white,
                              suffixIcon: IconButton(
                                  onPressed: () {
                                    Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: ((context) =>
                                                const CartPage())));
                                  },
                                  icon: const Icon(
                                    Icons.speaker,
                                    color: Colors.grey,
                                  )),
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
      body: ListView(
        padding: const EdgeInsets.only(left: 8, top: 10, right: 10),
        children: [
          Stack(
            children: <Widget>[
              Container(
                decoration:
                    BoxDecoration(borderRadius: BorderRadius.circular(20)),
                height: 150,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: CachedNetworkImage(
                      height: 150,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      imageUrl:
                          "https://cdn.pixabay.com/photo/2015/05/04/10/16/vegetables-752153_1280.jpg"),
                ),
              ),
              // ),
              const Positioned(
                left: 200,
                right: 10,
                top: 20,
                child: Text(
                  'Special deal of the day',
                  style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 18.0,
                      fontStyle: FontStyle.normal),
                  textAlign: TextAlign.center,
                ),
              ),

              Positioned(
                  left: 200,
                  right: 30,
                  top: 80,
                  child: ElevatedButton(
                      style:
                          ElevatedButton.styleFrom(backgroundColor: Colors.red),
                      onPressed: () {},
                      child: const Text(
                        'Order Now',
                        style: TextStyle(color: Colors.white),
                      )))
            ],
          ),
          const SizedBox(
            height: 20,
          ),
          Container(
            height: 250,
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Categories',
                          style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.green),
                        ),
                        InkWell(
                            onTap: () {
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: ((context) =>
                                          const CategoriesPageDynamic())));
                            },
                            child: const Text(
                              'View more.',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.green,
                              ),
                            )),
                      ],
                    ),
                  ),
                  const SizedBox(
                    height: 5,
                  ),
                  const CategoriesHorizontal(),
                ],
              ),
            ),
          ),
          const SizedBox(
            height: 20,
          ),
          Container(
            width: MediaQuery.of(context).size.width,
            child: Padding(
              padding: const EdgeInsets.all(
                8.0,
              ),
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Popular Products',
                          style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.green),
                        ),
                        InkWell(
                          onTap: () {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: ((context) =>
                                        const AllProductsPageDynamic())));
                          },
                          child: const Text(
                            'View more',
                            style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.normal,
                                color: Colors.green),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Center(
                    child: SomeProducts(),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(
            height: 20,
          ),
          Center(
            child: ElevatedButton(
              onPressed: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: ((context) =>
                            const AllProductsPageDynamic())));
              },
              child: const Text("View All Products"),
            ),
          ),
          const SizedBox(
            height: 20,
          ),
        ],
      ),
    );
  }
}
