import { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import Table from '../components/Table';

export default function AmenitiesPage() {
  const [amenities, setAmenities] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api
      .get('/amenities')
      .then((r) => setAmenities(r.data || []))
      .catch(() => setAmenities([]));
    api
      .get('/amenities/bookings')
      .then((r) => setBookings(r.data || []))
      .catch(() => setBookings([]));
  }, []);

  return (
    <div>
      <h2 className="page-title">Amenities</h2>
      <p className="page-subtitle">Book clubhouse, gym, pool, and view schedules.</p>

      <div className="dashboard-grid">
        <DashboardCard title="Available Amenities">
          <Table
            columns={[
              { key: 'name', label: 'Amenity' },
              { key: 'status', label: 'Active' },
            ]}
            rows={amenities.map((a) => ({
              id: a.id,
              name: a.name,
              status: a.is_active ? 'Yes' : 'No',
            }))}
          />
        </DashboardCard>

        <DashboardCard title="Your Bookings">
          <Table
            columns={[
              { key: 'amenity_id', label: 'Amenity' },
              { key: 'status', label: 'Status' },
            ]}
            rows={bookings.map((b) => ({
              id: b.id,
              amenity_id: `#${b.amenity_id}`,
              status: b.status,
            }))}
          />
        </DashboardCard>
      </div>
    </div>
  );
}

