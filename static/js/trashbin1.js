$(document).ready(function() {
    // Function to get the color based on the value
    function getColor(value) {
        if (value >= 1 && value < 50) return '#28a745'; // Green
        else if (value >= 50 && value < 60) return '#ffc107'; // Dark Yellow
        else if (value >= 60 && value < 70) return '#fd7e14'; // Orange
        else if (value >= 70 && value <= 100) return '#dc3545'; // Red to Dark Red
        return '#ccc'; // Default color if out of range
    }

    // Data and configuration for the donut charts
    const trashbinData = [
        { element: '#trashbin1', value: 30 },  // Example value
        { element: '#trashbin2', value: 55 },  // Example value
        { element: '#trashbin3', value: 65 },  // Example value
        { element: '#trashbin4', value: 80 },  // Example value
    ];

    trashbinData.forEach((trashbin) => {
        const options = {
            chart: {
                type: 'donut',
                height: 350
            },
            series: [trashbin.value, 100 - trashbin.value], // Main value and remaining space
            labels: [], // No labels for the segments
            colors: [getColor(trashbin.value), '#FFCCCB'], // Primary color based on value and secondary light red color
            dataLabels: {
                enabled: false, // Disable data labels
            },
            plotOptions: {
                pie: {
                    expandOnClick: false
                }
            },
            stroke: {
                width: 0 // No stroke on the donut
            },
            legend: {
                show: false // Hide the legend to remove right labels
            }
        };

        // Create the donut chart for each trashbin
        const chart = new ApexCharts(document.querySelector(trashbin.element), options);
        chart.render();
    });
});