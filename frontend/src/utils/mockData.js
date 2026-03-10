export const maintenanceRevenueSeries = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Maintenance Revenue',
      data: [120000, 135000, 128000, 142000, 155000, 162000],
      borderColor: '#2F80ED',
      backgroundColor: 'rgba(47, 128, 237, 0.12)',
      tension: 0.35,
      fill: true,
    },
  ],
};

export const complaintStatsSeries = {
  labels: ['Open', 'In Progress', 'Resolved'],
  datasets: [
    {
      data: [14, 7, 52],
      backgroundColor: ['#F2994A', '#F2C94C', '#27AE60'],
    },
  ],
};

export const visitorAnalyticsSeries = {
  labels: ['Morning', 'Afternoon', 'Evening'],
  datasets: [
    {
      label: 'Visitors',
      data: [34, 52, 41],
      backgroundColor: ['#2F80ED', '#56CCF2', '#9B51E0'],
    },
  ],
};

export const mockVisitors = [
  { id: 1, name: 'Karan Mehta', flat: 'A-302', purpose: 'Delivery', time: '10:24 AM' },
  { id: 2, name: 'Swati Sharma', flat: 'C-704', purpose: 'Guest', time: '11:05 AM' },
  { id: 3, name: 'Rahul Verma', flat: 'B-1201', purpose: 'Maintenance', time: '12:18 PM' },
];

export const mockComplaints = [
  { id: 1, title: 'Water leakage in corridor', flat: 'A-302', status: 'Open' },
  { id: 2, title: 'Lift not working', flat: 'C-502', status: 'In Progress' },
];

export const mockMaintenance = [
  { id: 1, month: 'January', amount: '₹2,500', status: 'Paid' },
  { id: 2, month: 'February', amount: '₹2,500', status: 'Due' },
  { id: 3, month: 'March', amount: '₹2,500', status: 'Paid' },
];

export const mockAmenities = [
  { id: 1, name: 'Clubhouse', status: 'Available' },
  { id: 2, name: 'Swimming Pool', status: 'Maintenance' },
  { id: 3, name: 'Gym', status: 'Available' },
];

