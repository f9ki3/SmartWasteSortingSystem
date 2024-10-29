$(document).ready(function() {
    // Function to get the color based on the value
    function getColor(value) {
        if (value >= 1 && value < 50) return '#28a745'; // Green
        else if (value >= 50 && value < 60) return '#ffc107'; // Dark Yellow
        else if (value >= 60 && value < 70) return '#fd7e14'; // Orange
        else if (value >= 70 && value <= 100) return '#dc3545'; // Red to Dark Red
        return '#ccc'; // Default color if out of range
    }

    // Function to get the secondary color based on the primary color
    function getSecondaryColor(value) {
        if (value >= 1 && value < 50) return '#90ee90'; // Light Green
        else if (value >= 50 && value < 60) return '#ffe6a1'; // Light Yellow
        else if (value >= 60 && value < 70) return '#ffd1a1'; // Light Orange
        else if (value >= 70 && value <= 100) return '#f8d7da'; // Light Red
        return '#FFCCCB'; // Default secondary color
    }

    // Data and configuration for the donut charts
    const trashbinData = [
        { element: '#trashbin1', value: 30, label: 'Waste Level' },
        { element: '#trashbin2', value: 55, label: 'Waste Level' },
        { element: '#trashbin3', value: 65, label: 'Waste Level' },
        { element: '#trashbin4', value: 80, label: 'Waste Level' },
    ];

    trashbinData.forEach((trashbin) => {
        const options = {
            chart: {
                type: 'donut',
                height: 350
            },
            series: [trashbin.value, 100 - trashbin.value], // Main value and remaining space
            labels: [trashbin.label, 'Remaining'], // Labels for the segments
            colors: [getColor(trashbin.value), getSecondaryColor(trashbin.value)], // Primary and secondary colors
            dataLabels: {
                enabled: true, // Enable data labels
                formatter: function(val) {
                    return Math.round(val) + '%'; // Format to show percentage
                },
                dropShadow: {
                    enabled: false // Disable drop shadow
                }
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
                show: true, // Show the legend
                position: 'right', // Position the legend on the right
                labels: {
                    colors: '#000', // Color of legend text
                    useSeriesColors: false // Use specified colors for legend items
                },
                itemMargin: {
                    horizontal: 5,
                    vertical: 5
                }
            },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return Math.round(val) + '%'; // Show percentage in tooltip
                    }
                }
            }
        };

        // Create the donut chart for each trashbin
        const chart = new ApexCharts(document.querySelector(trashbin.element), options);
        chart.render();
    });
});
