// Function to show Waste Level and hide Object Detect
$('#waste_lvl').on('click', function() {
    $('#wasteLevelContent').show();
    $('#objectDetectContent').hide();
});

// Function to show Object Detect and hide Waste Level
$('#object_det').on('click', function() {
    $('#wasteLevelContent').hide();
    $('#objectDetectContent').show();
});
