import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './DriverTable.css';

const DriverTable = ({ onDriverSelect }) => {
    const [drivers, setDrivers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        axios.get('http://3.6.160.162:2011/online-drivers')
            .then(response => {
                setDrivers(response.data.drivers);
            })
            .catch(error => {
                console.error('Error fetching driver locations:', error);
            });
    }, []);

    const indexOfLastDriver = currentPage * itemsPerPage;
    const indexOfFirstDriver = indexOfLastDriver - itemsPerPage;
    const currentDrivers = drivers.slice(indexOfFirstDriver, indexOfLastDriver);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDriverClick = (driver) => {
        onDriverSelect(driver);
    };

    const totalPages = Math.ceil(drivers.length / itemsPerPage);

    return (
        <div className="table-container">
            <table className="driver-table">
                <thead>
                    <tr>
                        <th>S.No.</th> {/* Added Serial Number Column */}
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                    </tr>
                </thead>
                <tbody>
                    {currentDrivers.map((driver, index) => (
                        <tr key={driver.driverId} onClick={() => handleDriverClick(driver)}>
                            <td>{indexOfFirstDriver + index + 1}</td> {/* Serial Number */}
                            <td>{driver.driverName}</td>
                            <td>{driver.phone}</td>
                            <td>{driver.driverLiveLocation.latitude}</td>
                            <td>{driver.driverLiveLocation.longitude}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DriverTable;
