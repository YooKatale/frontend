import 'dart:io';

import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:yookatale/views/account.dart';
import 'package:yookatale/views/cart.dart';
import 'package:yookatale/views/home.dart';

import 'firebase_options.dart';
import 'views/dynamic/categories.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  ByteData data = await PlatformAssetBundle().load('assets/ca/lets-encrypt-r3.pem');
  SecurityContext.defaultContext.setTrustedCertificatesBytes(data.buffer.asUint8List());
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        useMaterial3: true,
      ),
      home: const YookataleBase(),
    );
  }
}

class YookataleBase extends StatefulWidget {
  const YookataleBase({super.key});

  @override
  State<YookataleBase> createState() => _YookataleBaseState();
}

class _YookataleBaseState extends State<YookataleBase> {
  int _selectedIndex = 0;

  List pages = const [
    HomePage(),
    CategoriesPageDynamic(),
    CartPage(),
    AccountPage(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
          showSelectedLabels: false,
          selectedItemColor: Colors.green.shade900,
          currentIndex: _selectedIndex,
          onTap: _onItemTapped,
          items: const [
            BottomNavigationBarItem(
                backgroundColor: Colors.lightGreen,
                icon: Icon(Icons.home_outlined),
                label: "Home"),
            BottomNavigationBarItem(
                backgroundColor: Colors.lightGreen,
                icon: Icon(Icons.window),
                label: "Categories"),
            BottomNavigationBarItem(
                backgroundColor: Colors.lightGreen,
                icon: Stack(
                  children: [
                    Icon(Icons.shopping_cart_outlined),
                    Positioned(
                        top: 0,
                        right: 0,
                        child: Badge(
                          backgroundColor: Colors.blue,
                          label: Text("0"),
                        )),
                  ],
                ),
                label: "Cart"),
            BottomNavigationBarItem(
                backgroundColor: Colors.lightGreen,
                icon: Icon(Icons.people_alt_outlined),
                label: "Account"),
          ]),
    );
  }
}
