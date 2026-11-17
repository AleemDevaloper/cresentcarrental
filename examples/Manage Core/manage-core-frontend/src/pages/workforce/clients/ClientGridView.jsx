import React from 'react';
import ClientCard from './ClientCard';

const ClientGridView = ({ clients, onViewDetails }) => {
    return (
        <div className="row g-4">
            {clients.map((client) => (
                <ClientCard key={client.id} client={client} onViewDetails={onViewDetails} />
            ))}
            {clients.length === 0 && (
                <div className="col-12 text-center py-5">
                    <p className="text-muted">No clients found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default ClientGridView;
