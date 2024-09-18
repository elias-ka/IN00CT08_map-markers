import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import MapView, {
  LatLng,
  LongPressEvent,
  Marker,
  Region,
} from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [region, setRegion] = useState<Region | null>(null);
  const [markerCoords, setMarkerCoords] = useState<LatLng[]>([]);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setRegion({
        ...position.coords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setIsLocationLoaded(true);
    })();
  }, []);

  const addMarker = (e: LongPressEvent) => {
    const { coordinate } = e.nativeEvent;
    setMarkerCoords((prev) => [...prev, coordinate]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLocationLoaded && region ? (
        <MapView
          region={region}
          onLongPress={addMarker}
          showsUserLocation
          style={styles.map}
        >
          {markerCoords.map((coord, idx) => (
            <Marker key={idx} coordinate={coord} />
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={{ fontSize: 18 }}>Getting location...</Text>
        </View>
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
