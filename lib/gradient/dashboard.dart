
import 'package:badges/badges.dart';
import 'package:flutter/material.dart';

import '../views/account.dart';
import '../views/cart.dart';
import '../views/dynamic/categories.dart';
import '../views/home.dart';

class Dashboard extends StatefulWidget {

  static const  String id='dashboard';

  const Dashboard({super.key});

  @override
  State<Dashboard> createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {

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
          items:  [
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
                          badgeStyle: BadgeStyle(
                            badgeColor: Colors.blue,
                          ),
                          // backgroundColor: 
                          child: Text("4"),
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
