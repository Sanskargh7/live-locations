import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './MapComponent.css';

const mapContainerStyle = {
    height: '100%',
    width: '100%'
};

const center = {
    lat: 23.031129,
    lng: 72.529016
};

const MapComponent = ({ selectedDriver, onDriverSelect }) => {
    const [drivers, setDrivers] = useState([]);
    const [driverAddress, setDriverAddress] = useState('');
    const [infoWindowPosition, setInfoWindowPosition] = useState(null);

    useEffect(() => {
        axios.get('http://3.6.160.162:2011/online-drivers')
            .then(response => {
                const drivers = response.data.drivers.map(driver => ({
                    ...driver,
                    driverLiveLocation: {
                        latitude: parseFloat(driver.driverLiveLocation.latitude),
                        longitude: parseFloat(driver.driverLiveLocation.longitude)
                    }
                }));
                console.log(drivers, 'drivers')
                setDrivers(drivers);
            })
            .catch(error => {
                console.error('Error fetching driver locations:', error);
            });
    }, []);

    useEffect(() => {
        if (selectedDriver) {
            const { latitude, longitude } = selectedDriver.driverLiveLocation;

            if (isNaN(latitude) || isNaN(longitude)) {
                console.error('Invalid latitude or longitude values');
                return;
            }

            axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAIQFImpzEQQvwywJ-yesY55DUQiATSaME`)
                .then(response => {
                    const results = response.data.results;
                    if (results && results.length > 0) {
                        setDriverAddress(results[0].formatted_address);
                    } else {
                        setDriverAddress('Address not found');
                    }
                })
                .catch(error => {
                    console.error('Error fetching address:', error);
                    setDriverAddress('Error fetching address');
                });

            setInfoWindowPosition({ lat: latitude, lng: longitude });
        }
    }, [selectedDriver]);

    return (
        <div className="map-container">
            <div className="map">
                <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={12}
                    >
                        {drivers.map(driver => (
                            <Marker
                                key={driver.driverId}
                                position={{
                                    lat: driver.driverLiveLocation.latitude,
                                    lng: driver.driverLiveLocation.longitude
                                }}
                                onClick={() => onDriverSelect(driver)}
                            />
                        ))}

                        {infoWindowPosition && selectedDriver && (
                            <InfoWindow
                                position={infoWindowPosition}
                                onCloseClick={() => setInfoWindowPosition(null)}
                            >
                                <div>
                                    <h4>{selectedDriver.driverName}</h4>
                                    <p><strong>Phone:</strong> {selectedDriver.phone}</p>
                                    <p><strong>Latitude:</strong> {selectedDriver.driverLiveLocation.latitude}</p>
                                    <p><strong>Longitude:</strong> {selectedDriver.driverLiveLocation.longitude}</p>
                                    <p><strong>Address:</strong> {driverAddress}</p>
                                    {selectedDriver.drivingLicense && (
                                        <div>
                                            <p><strong>Driving License:</strong></p>
                                            <img
                                                src={selectedDriver.drivingLicense}
                                                alt="Driving License"
                                                style={{ width: '100px', height: 'auto' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </LoadScript>
            </div>

            <div className="driver-details">
                {selectedDriver ? (
                    <>
                        <h2>Driver Details</h2>
                        <p><strong>Name:</strong> {selectedDriver.driverName}</p>
                        <p><strong>Phone:</strong> {selectedDriver.phone}</p>
                        <p><strong>Latitude:</strong> {selectedDriver.driverLiveLocation.latitude}</p>
                        <p><strong>Longitude:</strong> {selectedDriver.driverLiveLocation.longitude}</p>
                        <p><strong>Address:</strong> {driverAddress}</p>
                        {selectedDriver.drivingLicense && (
                            <div>
                                <p><strong>Driving License:</strong></p>
                                <img
                                    src={selectedDriver.drivingLicense}
                                    alt="Driving License"
                                    style={{ width: '100px', height: 'auto' }}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <p>Select a driver to see details</p>
                )}
            </div>
        </div>
    );
};

export default MapComponent;
