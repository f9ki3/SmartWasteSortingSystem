// // Establish socket connection
// const socket = io();

// // Calculate percentage based on distance
// const calculatePercentage = (distance) => {
//     const maxDistance = 20;
//     const minDistance = 2;
//     const percentage = ((maxDistance - distance) / (maxDistance - minDistance)) * 100;
//     return Math.max(0, Math.min(100, percentage)); // Ensure the percentage is within the 0-100% range
// };

// // Check connection status for each microcontroller and display data if connected
// const updateStatus = (microcontrollerId, status, data = null) => {
//     const statusElement = document.getElementById(`status${microcontrollerId}`);
//     const dataElement = document.getElementById(`data${microcontrollerId}`);
    
//     if (status) {
//         statusElement.querySelector('.connection').textContent = 'Connected';
//         if (data !== null) {
//             const percentage = calculatePercentage(data);
//             dataElement.textContent = `Data: ${percentage.toFixed(2)}%`;
//         } else {
//             dataElement.textContent = 'Data: N/A';
//         }
//     } else {
//         statusElement.querySelector('.connection').textContent = 'Not connected';
//         dataElement.textContent = 'Data: N/A';
//     }
// };

// // Listen for connection status
// socket.on('connect', () => {
//     console.log('Connected to server');
//     updateStatus(1, false);
//     updateStatus(2, false);
//     updateStatus(3, false);
//     updateStatus(4, false);
// });

// socket.on('disconnect', () => {
//     console.log('Disconnected from server');
//     updateStatus(1, false);
//     updateStatus(2, false);
//     updateStatus(3, false);
//     updateStatus(4, false);
// });

// // Listen for data updates from each microcontroller
// socket.on('updateTrash', (data) => {
//     console.log('Received data from microcontroller 1:', data);
//     updateStatus(1, true, data.count);
// });

// socket.on('updateTrash2', (data) => {
//     console.log('Received data from microcontroller 2:', data);
//     updateStatus(2, true, data.count);
// });

// socket.on('updateTrash3', (data) => {
//     console.log('Received data from microcontroller 3:', data);
//     updateStatus(3, true, data.count);
// });

// socket.on('updateTrash4', (data) => {
//     console.log('Received data from microcontroller 4:', data);
//     updateStatus(4, true, data.count);
// });

