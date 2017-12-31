$("ul").on("click", "li", function (event) {
   $(this).toggleClass("crossed");
});

$("ul").on("click", ".xx", function(event){
    console.log("clicked");
    $(this).parent().fadeOut(300, function () {
        $(this).remove();
        console.log($(this).text());
        post('/?_method=DELETE', {todoText: $(this).text()});
    });
    event.stopPropagation();
});

$("input[type='text']").keypress(function (e) {
    if(e.which === 13){
        var todoText = $(this).val();
        $("#data").append("<li><span class='xx'><i class='far fa-trash-alt'></i></span>" + " " + todoText + "</li>");
        post('/', {todoText: todoText});
    }
});

$("h1").click(function () {
    $("input[type='text']").fadeToggle();
});

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}