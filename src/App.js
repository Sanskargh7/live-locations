import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import DriverTable from './components/DriverTable';

function App() {
    const [selectedDriver, setSelectedDriver] = useState(null);

    const handleDriverSelect = (driver) => {
        setSelectedDriver(driver);

        // Scroll to the top of the page
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="App">
            <MapComponent
                selectedDriver={selectedDriver}
                onDriverSelect={handleDriverSelect}
            />
            <DriverTable onDriverSelect={handleDriverSelect} />
        </div>
    );
}

export default App;
