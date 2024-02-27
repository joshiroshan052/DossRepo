// BluebookComponent.jsx

import React from 'react';
import './BluebookComponent.css'; // Import the CSS file for styling
import { Link } from 'react-router-dom';

const BluebookComponent = () => {
    return (
        <div className="bluebook-container-comp">
            <div className="bluebook-box share-bluebook">
            <h2>Share Bluebook</h2>
                <Link to={'/bluebook/share'}>
                <button>Share</button>
                </Link>
                
                
            </div>
            <div className="bluebook-box view-bluebook">
                <h2>View Bluebook</h2>
                <Link to={'/bluebook/sharedBluebook'}>
                <button>View</button>
                </Link>
            </div>
        </div>
    );
};

export default BluebookComponent;
