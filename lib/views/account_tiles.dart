import 'package:flutter/material.dart';

class AccountPageTiles extends StatelessWidget {
  final bool withArrow;
  final IconData icon;
  final String title;
  final Function()? onTap;
  
  const AccountPageTiles({
    super.key, 
    this.withArrow = false, 
    required this.icon, 
    this.onTap, required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Container(
        width: MediaQuery.of(context).size.width,
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.12),
              blurRadius: 1.1,
              spreadRadius: 1.1
            )
          ]
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              borderRadius: BorderRadius.circular(1.5),
              onTap: onTap,
              child: ListTile(
                leading: Icon(icon,
                color: Colors.green,
                size: 35,),
                title: Text(title,
                style: const TextStyle(fontSize: 18)),
                trailing: withArrow ?
                const Icon(Icons.arrow_forward_ios,
                color: Colors.black): null
              ),
            ),
          ),
      ),
    );
  }
}