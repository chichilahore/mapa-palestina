import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { countriesRecognizePalestine } from "./recognizesPalestine";
import * as topojson from "topojson-client";
import "./WorldMap.scss";

const VIEWBOX_WIDTH = 960;
const VIEWBOX_HEIGHT = 600;

function WorldMap({ worldData }) {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const gRef = useRef(null);
  const zoomRef = useRef(null);

  useEffect(() => {
    if (!worldData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const projection = d3.geoNaturalEarth1()
      .fitSize([VIEWBOX_WIDTH, VIEWBOX_HEIGHT], topojson.feature(worldData, worldData.objects.countries));

    const path = d3.geoPath().projection(projection);

    const countries = topojson.feature(worldData, worldData.objects.countries).features;

    const g = svg.append("g");
    gRef.current = g;

    g.selectAll(".country")
      .data(countries)
      .join("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("fill", d =>
        countriesRecognizePalestine.includes(String(d.id)) ? "#4caf50" : "#e57373"
      )
      .attr("stroke", "#444")
      .attr("stroke-width", 0.5)
      .on("mouseover", (event, d) => {
        const name = d.properties.name;
        d3.select(event.currentTarget).attr("fill", "#81c784");
        d3.select(tooltipRef.current)
          .style("opacity", 1)
          .html(name)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget).attr("fill",
          countriesRecognizePalestine.includes(String(d.id)) ? "#4caf50" : "#e57373"
        );
        d3.select(tooltipRef.current).style("opacity", 0);
      });

    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
    zoomRef.current = zoom;
  }, [worldData]);

  function handleZoomIn() {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().call(zoomRef.current.scaleBy, 1.5);
  }

  function handleZoomOut() {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().call(zoomRef.current.scaleBy, 1 / 1.5);
  }

  return (
    <div className="mapWrapper">
      <div className="zoomButtons">
        <button onClick={handleZoomIn}>+</button>
        <button onClick={handleZoomOut}>−</button>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="worldMap"
      />
      <div ref={tooltipRef} className="tooltip" />
    </div>
  );
}

export default WorldMap;
