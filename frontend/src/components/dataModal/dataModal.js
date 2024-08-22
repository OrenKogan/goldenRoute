import React from "react";
import './dataModal.css'

const DataModal = ({ isOpen, attacksData, closeHandle, setFlightData}) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={closeHandle}>X</button>
                <h2>Saved Attacks</h2>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>latitude</th>
                            <th>longitude</th>
                            <th>radius</th>
                            <th>speed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attacksData.map((row, index) => (
                            <tr key={index} onMouseOver={() => setFlightData(row.friendlyId)}>
                                <td>{row.id}</td>
                                <td>{row.latitude}</td>
                                <td>{row.longitude}</td>
                                <td>{row.radius}</td>
                                <td>{row.speed}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    )
}

export default DataModal;