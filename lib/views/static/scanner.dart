import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:barcode_scan2/barcode_scan2.dart';
class ScannerScreen extends StatefulWidget {
  const ScannerScreen({Key? key}) : super(key: key);

  @override
  State<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  String scannedData ='';

Future<void> scanQRCode() async {
  try {
    final result = await BarcodeScanner.scan();
    setState(() {
      scannedData = result.rawContent;
    });
    if(scannedData.isNotEmpty) {
      saveQRCodeToFirebase(scannedData);
    }
  }
  catch (e) {
   showBottomSheet(context: context, 
   builder: (context) {
    return Text(
      'Error scanning QR Code: $e'
    );
   }
   );
  }
}

Future<void> saveQRCodeToFirebase(String qrCodeData) async {
  try {
    // you can change the collection I have used here to qrCodes(or any)
    // add the collection to rules to see the codes: allow write read: if true
    await FirebaseFirestore.instance.collection('categories').add({
      'data': qrCodeData,
      'timestamp': FieldValue.serverTimestamp(),
    });
  } catch (e) {
    print('Error saving QR code: $e');
  }
}


  @override
  Widget build(BuildContext context) {
    return Scaffold(      
      appBar: AppBar(
        centerTitle:  true,
        automaticallyImplyLeading: false,
        title: const Text('QR Codes'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: scanQRCode,
        tooltip: 'Scan QR Code',
        child: const Icon(Icons.camera_alt),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: StreamBuilder(
            stream: FirebaseFirestore.instance.collection('categories').snapshots(),
            builder: (context, snapshot) {
              if(snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }
              if( snapshot.hasError) {
                 return Text('Error: ${snapshot.error}');
              }
               final qrCodes = snapshot.data!.docs;
                if(qrCodes.isEmpty){
                  return const Center(
                    child: Text(
                      'No products scanned yet. Scan to get the codes here.',
                      style: TextStyle(
                        fontSize: 18
                      ),
                    ),
                  );
                }
                return ListView.builder(
                  itemCount: qrCodes.length,
                  itemBuilder: (context, index) {
                    final qrCodeData = qrCodes[index] ['data'] as String;
                    return ListTile(
                      title: Text(
                        qrCodeData
                      ),
                    );
                  }
                  );
            },
          ),
        ),
      ),
    );
  }
}