$(document).ready(function() {
    const socket = io();

    // Function to calculate percentage based on distance
    function calculatePercentage(distance) {
        const maxDistance = 15;
        const minDistance = 2;
        const percentage = ((maxDistance - distance) / (maxDistance - minDistance)) * 100;
        return Math.max(0, Math.min(100, percentage)); // Ensure percentage is within 0-100%
    }

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

    // Data for each trash bin
    const trashbinData = [
        { element: '#trashbin1', value: 0, label: 'Waste Level' },
        { element: '#trashbin2', value: 0, label: 'Waste Level' },
        { element: '#trashbin3', value: 0, label: 'Waste Level' },
        { element: '#trashbin4', value: 0, label: 'Waste Level' },
    ];

    // Store chart instances to update them later
    const charts = [];

    // Initialize charts for each trash bin
    trashbinData.forEach((trashbin, index) => {
        const options = {
            chart: {
                type: 'donut',
                height: 350
            },
            series: [trashbin.value, 100 - trashbin.value],
            labels: [trashbin.label, 'Remaining'],
            colors: [getColor(trashbin.value), getSecondaryColor(trashbin.value)],
            dataLabels: {
                enabled: true,
                formatter: function(val) {
                    return Math.round(val) + '%';
                },
                dropShadow: {
                    enabled: false
                }
            },
            plotOptions: {
                pie: {
                    expandOnClick: false
                }
            },
            stroke: {
                width: 0
            },
            legend: {
                show: true,
                position: 'right',
                labels: {
                    colors: '#000',
                    useSeriesColors: false
                },
                itemMargin: {
                    horizontal: 5,
                    vertical: 5
                }
            },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return Math.round(val) + '%';
                    }
                }
            }
        };

        // Create the chart and store the instance
        const chart = new ApexCharts(document.querySelector(trashbin.element), options);
        chart.render();
        charts.push(chart);
    });

    // Function to update the chart values
    const updateChart = (chartIndex, percentage) => {
        const chart = charts[chartIndex];
        chart.updateSeries([percentage, 100 - percentage]);
        chart.updateOptions({
            colors: [getColor(percentage), getSecondaryColor(percentage)]
        });
    };

    // Listen for data updates and update charts accordingly
    socket.on('updateTrash', (data) => {
        const percentage = Math.round(calculatePercentage(data.count));
        updateChart(0, percentage); // Update chart 1 with new percentage
        $('#trash1').text(percentage+" %")
    });

    socket.on('updateTrash2', (data) => {
        const percentage = Math.round(calculatePercentage(data.count));
        updateChart(1, percentage); // Update chart 2 with new percentage
        $('#trash2').text(percentage+" %")
    });

    socket.on('updateTrash3', (data) => {
        const percentage = Math.round(calculatePercentage(data.count));
        updateChart(2, percentage); // Update chart 3 with new percentage
        $('#trash3').text(percentage+" %")
    });

    socket.on('updateTrash4', (data) => {
        const percentage = Math.round(calculatePercentage(data.count));
        updateChart(3, percentage); // Update chart 4 with new percentage
        $('#trash4').text(percentage+" %")
    });
});
