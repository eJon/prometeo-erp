$(document).ready(function() {

    function fixUrl(url) {
        var tokens = $.grep(url.split('/'), function(n) {
            return(n);
        });
        return '/' + tokens.join('/') + '/';
    }

    $('form span.add a').live('click', function(e) {

        var link_id = $(this).attr("id");
        var widget_id = $(this).parent().attr("id");
        var dialog_id = widget_id + "-dialog";
        var parent_id = $(this).closest(".ui-dialog-content").attr("id");
        var current_url = fixUrl($(this).closest("form").attr("action"));
        var add_url = fixUrl($(this).attr("href"));

        $(link_id).attr('disabled', true);

        $("#" + widget_id)
        .append('<div class="add-dialog" id="' + dialog_id +'"></div>')
        .children("#" + dialog_id)
        .load(add_url + " #main")
        .dialog({
            resizable: false,
            position: ["center", "top"],
            modal: true,
            width: 800,
            open: function(event, ui) { 

                $('.ui-dialog-titlebar').hide();
            },
            close: function(event, ui) {

                var root = "#main";
                if (parent_id)
                    root = "#" + parent_id + " #main";

                $(root + " #" + widget_id).load(current_url + " #" + widget_id + " > *");
                $("#" + dialog_id).remove();
                $(link_id).attr("disabled", false);
            }
        });

        e.preventDefault();
    });

    $(".ui-dialog form").live("submit", function(e) {

        var dlg = $(this).closest(".ui-dialog-content");
        var submit_input = $(e.target).find(".submit input");

        submit_input.attr("disabled", true);

        $.ajax({
            type: $(this).attr("method"),
            url: fixUrl($(this).attr("action")),
            data: $(this).serialize(),
            success: function(data, status, xhr) {

                if (xhr.status == 278)
                    dlg.dialog("close");

                else if (xhr.readyState == 4)
                    $("#" + dlg.attr("id") + " #main").html($(data).find("#main").html());
            }
        });

        submit_input.attr("disabled", false);

        e.preventDefault();
    });

    $(".ui-dialog .cancel a").live("click", function(e) {

        $(this).attr("disabled", true);

        var dlg = $(this).closest(".ui-dialog-content");

        dlg.dialog("close");

        $(this).attr("disabled", false);

        e.preventDefault();
    });
});
