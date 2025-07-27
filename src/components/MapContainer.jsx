import React from "react";
import { useWorldData } from "./useWorldData";
import WorldMap from "./WorldMap";

function MapContainer() {
  const { worldData, loading } = useWorldData();

  if (loading) return <div>Loading map data...</div>;

  return (
    <div className="mapContainer">
      <WorldMap worldData={worldData} />
    </div>
  );
}

export default MapContainer;
