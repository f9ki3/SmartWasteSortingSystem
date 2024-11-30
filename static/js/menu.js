// Utility function to hide all sections
function hideAllSections() {
    $('#wasteLevelContent').hide();
    $('#objectDetectContent').hide();
    $('#ai_camera_div').hide();
    $('#plastic_div').hide();
    $('#waste_div').hide();
    $('#paper_div').hide();
    $('#metal_div').hide();
}

// Function to show Waste Level and hide others
$('#waste_lvl').on('click', function() {
    hideAllSections();
    $('#wasteLevelContent').show();
});

// Function to show Object Detect and hide others
$('#object_det').on('click', function() {
    hideAllSections();
    $('#objectDetectContent').show();
});

// Function to show AI Camera and hide others
$('#ai_cam').on('click', function() {
    hideAllSections();
    $('#ai_camera_div').show();
});

// Function to show Plastic and hide others
$('#plastic').on('click', function() {
    hideAllSections();
    $('#plastic_div').show();
});

// Function to show Waste and hide others
$('#waste').on('click', function() {
    hideAllSections();
    $('#waste_div').show();
});

// Function to show Paper and hide others
$('#paper').on('click', function() {
    hideAllSections();
    $('#paper_div').show();
});

// Function to show Metal and hide others
$('#metal').on('click', function() {
    hideAllSections();
    $('#metal_div').show();
});
