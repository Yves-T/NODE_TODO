//Hamburger menu toggle
$("#navbar").find("li").on('click', function (event) {
    // check if window is small enough so dropdown is created
    var toggle = $(".navbar-toggle").is(":visible");
    if (toggle) {
        $(".navbar-collapse").collapse('hide');
    }
});
