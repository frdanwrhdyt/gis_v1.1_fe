import { useEffect } from "react";
import L from 'leaflet';
import { useMap } from "react-leaflet";

export default function Legend({layers}){
    const map = useMap();
    useEffect(() => {
        let legend; // Deklarasikan variabel legend di luar blok if

        if (map) {
            legend = L.control({ position: "bottomleft" });

            legend.onAdd = () => {
                const div = L.DomUtil.create("div", "info legend");
                div.innerHTML = "<h2 class='text-lg font-semibold'>Legend</h2>";
                layers.forEach(layer => {
                    if(layer==='telkomsat:Bakti'||
                    layer==='telkomsat:BTS_Cellular'||
                    layer==='telkomsat:SatMP2'
                    ){
                        div.innerHTML += `
                        <div class='flex justify-between items-center'>
                            <img class="h-52" src="${import.meta.env.VITE_GEOSERVER_API}wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=50&HEIGHT=50&LAYER=${layer}"/>
                            <p>${layer}</p>
                        </div>`;
                    }
                    else if (layer==='telkomsat:Desa'){
                        div.innerHTML += `
                        <div class='flex justify-between items-center'>
                            <img class="h-32" src="${import.meta.env.VITE_GEOSERVER_API}wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=50&HEIGHT=50&LAYER=${layer}"/>
                            <p>${layer}</p>
                        </div>`;
                    }
                    else{
                        div.innerHTML += `
                        <div class='flex justify-between items-center'>
                            <img class="h-8" src="${import.meta.env.VITE_GEOSERVER_API}wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=50&HEIGHT=50&LAYER=${layer}"/>
                            <p>${layer}</p>
                        </div>` 
                    }
                });
                return div;
            };

            legend.addTo(map);
        }

        // Kembalikan fungsi untuk menghapus kontrol legenda dari peta
        return () => {
            if (map && legend) {
                map.removeControl(legend);
            }
        };
    }, [layers, map]);

    return null;
}