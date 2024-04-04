import { useState, useEffect, useRef } from 'react'
import { 
    MapContainer, 
    TileLayer, 
    LayersControl, 
    WMSTileLayer, 
    useMap, 
    ScaleControl,
    ZoomControl
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Fetch from '../fetch/fetch'
import L from 'leaflet';
import '../components/ruler/ruler'
import '../components/ruler/ruler.css'
import Legend from '../components/legend/legend';
import FeatureInfo from '../components/featureInfo/featureInfo';

const {Overlay, BaseLayer} = LayersControl


export default function Home(){
    const [layers, setLayers] = useState([])
    const [activeLayers, setActiveLayers] = useState([])
    const position = [-0.7893, 113.9213]
    const mapRef = useRef(null)

    const layersControlRef = useRef(null)

    useEffect(()=>{
        const getOverlays = () => {
            const overlays = {}; // Initialize an object to store overlay statuses
            layersControlRef.current?._layers.forEach(function (obj) {
                if (obj.overlay) {
                    overlays[obj.name] = layersControlRef.current._map.hasLayer(obj.layer);
                }
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps

            return overlays;
        };
        
        const interval = setInterval(() => {
            const activeKeys = Object.entries(getOverlays())
            .filter(([key, value]) => value)
            .map(([key, value]) => key);
            setActiveLayers(activeKeys)
        }, 2000); // Change the interval as needed

        return () => clearInterval(interval);
    },[])


    useEffect(()=>{
        const access = localStorage.getItem('access')
        const fetch = async() => {
            try{    
                const response = await Fetch({
                    endpoint:'shp/',
                    method:"GET",
                    headers:{
                        'Content-Type':'application/json',
                        Authorization: `Bearer ${access}`
                    },
                })
                const data = response.data.layers.layer
                setLayers(data)
            }
            catch{
                setLayers([])
            }
        }
        fetch()
    },[])
    
    return (
        <div className='w-full h-full'>
            <MapContainer ref={mapRef} zoomControl={false} center={position} zoom={5} scrollWheelZoom={false}>
                <ZoomControl position='topright'/>
                <Ruler/>
                <LayersControl
                ref={layersControlRef}
                position="topright"
                className="leaflet-control-layers">
                    <BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                    </BaseLayer>
                    {layers&&<RenderOverlay layers={layers}/>}
                </LayersControl>
                <ScaleControl position="bottomright" />
                <FeatureInfo mapRef={mapRef} layers={activeLayers}/>
                {activeLayers&&
                <Legend layers={activeLayers}/>
                }
            </MapContainer>
        </div>
    )
}


function RenderOverlay({ layers }) {
    return (
        layers.map((layer, index) => (
            <Overlay checked={layer.name.toLowerCase().includes('desa')} key={index} name={layer.name}>
                <WMSTileLayer
                    key={index}  // Tambahkan key pada WMSTileLayer
                    url={import.meta.env.VITE_GEOSERVER_API + 'wms?'}
                    layers={layer.name} // Ubah layer menjadi layer.name
                    opacity={layer.name.toLowerCase().includes('desa') ? 0.7 : 1} // Ubah layer menjadi layer.name
                    transparent
                    format="image/png"
                />
            </Overlay>
        ))
    );
}

function Ruler(){
    const map = useMap()
    useEffect(() => {
        const ruler = L.control.ruler().addTo(map);

        return () => {
          map.removeControl(ruler);
        };
      }, [map]);
    return null
}