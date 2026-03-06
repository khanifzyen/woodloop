import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class MapPickerPage extends StatefulWidget {
  const MapPickerPage({super.key});

  @override
  State<MapPickerPage> createState() => _MapPickerPageState();
}

class _MapPickerPageState extends State<MapPickerPage> {
  // Default to Jepara
  LatLng _selectedLocation = const LatLng(-6.5888, 110.6687);
  GoogleMapController? _mapController;
  String _address = 'Ketuk peta untuk memilih lokasi';

  final TextEditingController _searchController = TextEditingController();
  bool _isSearching = false;
  String? _searchError;

  // Google Maps API key — loaded from .env
  String get _apiKey => dotenv.env['GOOGLE_MAPS_API_KEY'] ?? '';

  @override
  void dispose() {
    _mapController?.dispose();
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _searchLocation(String query) async {
    if (query.trim().isEmpty) return;

    setState(() {
      _isSearching = true;
      _searchError = null;
    });

    final encodedQuery = Uri.encodeComponent(query.trim());
    final url =
        'https://maps.googleapis.com/maps/api/geocode/json?address=$encodedQuery&key=$_apiKey';

    try {
      final client = HttpClient();
      client.connectionTimeout = const Duration(seconds: 10);
      final request = await client.getUrl(Uri.parse(url));
      final response = await request.close();
      final body = await response.transform(utf8.decoder).join();
      final data = json.decode(body) as Map<String, dynamic>;

      if (data['status'] == 'OK') {
        final results = data['results'] as List<dynamic>;
        if (results.isNotEmpty) {
          final location =
              results[0]['geometry']['location'] as Map<String, dynamic>;
          final lat = (location['lat'] as num).toDouble();
          final lng = (location['lng'] as num).toDouble();
          final formattedAddress =
              results[0]['formatted_address'] as String? ?? query;

          final newPos = LatLng(lat, lng);
          setState(() {
            _selectedLocation = newPos;
            _address = formattedAddress;
          });

          await _mapController?.animateCamera(
            CameraUpdate.newLatLngZoom(newPos, 16.0),
          );
        } else {
          setState(() => _searchError = 'Lokasi tidak ditemukan');
        }
      } else {
        setState(() => _searchError = 'Lokasi tidak ditemukan');
      }
      client.close();
    } catch (e) {
      setState(() => _searchError = 'Gagal mencari lokasi. Coba lagi.');
    } finally {
      setState(() => _isSearching = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return Scaffold(
      resizeToAvoidBottomInset: false,
      appBar: AppBar(
        title: const Text(
          'Pilih Lokasi Bisnis',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: AppTheme.background,
        iconTheme: const IconThemeData(color: Colors.white),
        elevation: 0,
        actions: [
          TextButton(
            onPressed: () {
              context.pop({
                'lat': _selectedLocation.latitude,
                'lng': _selectedLocation.longitude,
                'address': _address,
              });
            },
            child: const Text(
              'Pilih',
              style: TextStyle(
                color: AppTheme.primaryColor,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
      body: Stack(
        children: [
          // ── Google Map ──────────────────────────────────────────────────
          GoogleMap(
            initialCameraPosition: CameraPosition(
              target: _selectedLocation,
              zoom: 13.0,
            ),
            onMapCreated: (controller) {
              _mapController = controller;
            },
            onTap: (latLng) {
              setState(() {
                _selectedLocation = latLng;
                _address =
                    'Lat: ${latLng.latitude.toStringAsFixed(4)}, Lng: ${latLng.longitude.toStringAsFixed(4)}';
              });
            },
            markers: {
              Marker(
                markerId: const MarkerId('selected'),
                position: _selectedLocation,
                icon: BitmapDescriptor.defaultMarkerWithHue(
                  BitmapDescriptor.hueRed,
                ),
              ),
            },
            mapType: MapType.normal,
            myLocationEnabled: true,
            myLocationButtonEnabled: true,
            zoomControlsEnabled: true,
          ),

          // ── Search Bar (top overlay) ────────────────────────────────────
          Positioned(
            top: 12,
            left: 12,
            right: 12,
            child: Column(
              children: [
                Material(
                  elevation: 6,
                  shadowColor: Colors.black38,
                  borderRadius: BorderRadius.circular(12),
                  child: TextField(
                    controller: _searchController,
                    textInputAction: TextInputAction.search,
                    style: const TextStyle(color: Colors.white, fontSize: 14),
                    onSubmitted: _searchLocation,
                    decoration: InputDecoration(
                      hintText: 'Cari nama bisnis atau alamat...',
                      hintStyle: TextStyle(
                        color: Colors.white.withValues(alpha: 0.5),
                        fontSize: 14,
                      ),
                      filled: true,
                      fillColor: AppTheme.surfaceColor,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: AppTheme.primaryColor,
                          width: 1.5,
                        ),
                      ),
                      prefixIcon: const Icon(
                        Icons.search,
                        color: AppTheme.primaryColor,
                        size: 22,
                      ),
                      suffixIcon: _isSearching
                          ? const Padding(
                              padding: EdgeInsets.all(12),
                              child: SizedBox(
                                width: 18,
                                height: 18,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: AppTheme.primaryColor,
                                ),
                              ),
                            )
                          : _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(
                                Icons.close,
                                color: Colors.white54,
                                size: 20,
                              ),
                              onPressed: () {
                                _searchController.clear();
                                setState(() => _searchError = null);
                              },
                            )
                          : null,
                    ),
                    onChanged: (_) => setState(() {}),
                  ),
                ),
                if (_searchError != null) ...[
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.red.shade800.withValues(alpha: 0.9),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.error_outline,
                          color: Colors.white,
                          size: 16,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            _searchError!,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),

          // ── Bottom Card: Lokasi Terpilih ────────────────────────────────
          Positioned(
            bottom: 16 + bottomPadding,
            left: 24,
            right: 24,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.3),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Row(
                    children: [
                      Icon(
                        Icons.location_on,
                        color: AppTheme.primaryColor,
                        size: 18,
                      ),
                      SizedBox(width: 8),
                      Text(
                        'Lokasi Terpilih',
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _address,
                    style: const TextStyle(color: Colors.white, fontSize: 14),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
