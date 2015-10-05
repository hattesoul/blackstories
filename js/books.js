/* sort array of objects */
var sort_by = function(field, reverse, primer) {
    var key = primer ?
    function(x) {return primer(x[field])} :
    function(x) {return x[field]};
    reverse = !reverse ? 1 : -1;
    return function(a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
}

/* sort initial database */
var sorted_books = books;
sorted_books.sort(sort_by("id", true, function(a){return a.toUpperCase()}));
var cur_year = 0;
var numbers = new Array();

/* populate list */
function populateList(data) {
    var append_html = "";
    var number = 0;
    $.each(data, function () {
        /* panel headers */
        if(cur_year != this.issue) {

        /* first header */
            if(cur_year == 0) {
                cur_year = this.issue;
                number++;
                append_html = append_html.concat("<div class=\"panel panel-default\">\n");
                append_html += "<div class=\"panel-heading accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#"+this.issue+"\">\n";
                if(this.prefix == "") {
                        append_html += "<h4 class=\"panel-title\">&nbsp;&nbsp;"+this.issue+" <span id=\"amount-"+this.issue+"\">(1 book)</span></h4>\n";
                } else {
                        append_html += "<h4 class=\"panel-title\">"+this.prefix+this.issue+" <span id=\"amount-"+this.issue+"\">(1 book)</span></h4>\n";
                }
                append_html += "</div>\n";
                append_html += "<div id=\""+this.issue+"\" class=\"collapse in\">\n";
                append_html += "<div class=\"panel-body\">\n";
                append_html += "<table class=\"table-hover table-responsive\" id=\"table\">\n";
                append_html += "<thead>\n";
                append_html += "<tr>\n";
                append_html += "<th class=\"title\">Title</th>\n";
                append_html += "<th class=\"author\">Author</th>\n";
                append_html += "<th class=\"thanks\">Thanks to</th>\n";
                append_html += "</tr>\n";
                append_html += "</thead>\n";
                append_html += "<tbody>\n";
                append_html += "<tr>\n";
                append_html += "<td>"+this.title+"</td>\n";
                append_html += "<td>"+this.author+"</td>\n";
                append_html += "<td>"+this.thanks+"</td>\n";
                append_html += "</tr>\n";
            } else {

        /* remaining headers */
                append_html += "</tbody>\n";
                append_html += "</table>\n";
                append_html += "</div>\n";
                append_html += "</div>\n";
                append_html += "</div>\n";
                numbers.push(new Object({year:cur_year, amount:number}));
                cur_year = this.issue;
                number = 1;
                append_html = append_html.concat("<div class=\"panel panel-default\">\n");
                append_html += "<div class=\"panel-heading accordion-toggle collapsed\" data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#"+this.issue+"\">\n";
                if(this.prefix == "") {
                        append_html += "<h4 class=\"panel-title\">&nbsp;&nbsp;"+this.issue+" <span id=\"amount-"+this.issue+"\">(1 book)</span></h4>\n";
                } else {
                        append_html += "<h4 class=\"panel-title\">"+this.prefix+this.issue+" <span id=\"amount-"+this.issue+"\">(1 book)</span></h4>\n";
                }
                append_html += "</div>\n";
                append_html += "<div id=\""+this.issue+"\" class=\"collapse\">\n";
                append_html += "<div class=\"panel-body\">\n";
                append_html += "<table class=\"table-hover table-responsive\" id=\"table\">\n";
                append_html += "<thead>\n";
                append_html += "<tr>\n";
                append_html += "<th class=\"title\">Title</th>\n";
                append_html += "<th class=\"author\">Author</th>\n";
                append_html += "<th class=\"thanks\">Thanks to</th>\n";
                append_html += "</tr>\n";
                append_html += "</thead>\n";
                append_html += "<tbody>\n";
                append_html += "<tr>\n";
                append_html += "<td>"+this.title+"</td>\n";
                append_html += "<td>"+this.author+"</td>\n";
                append_html += "<td>"+this.thanks+"</td>\n";
                append_html += "</tr>\n";
            }
        } else {

        /* panel bodies */
            number++;
            append_html += "<tr>\n";
            append_html += "<td>"+this.title+"</td>\n";
            append_html += "<td>"+this.author+"</td>\n";
            append_html += "<td>"+this.thanks+"</td>\n";
            append_html += "</tr>\n";
        }
    });
    append_html += "</tbody>\n";
    append_html += "</table>\n";
    append_html += "</div>\n";
    append_html += "</div>\n";
    append_html += "</div>\n";
    numbers.push(new Object({year:cur_year, amount:number}));
    $("#accordion").append(append_html);
    registerClickHandlers();
}

/* click handler */
function registerClickHandlers() {

}

$(document).ready(function () {
    $("#table tr").not(".ahidden").each(function(index, row){
        $(row).removeClass("odd");
        if (index%2==1){ //odd row
            $(row).addClass("odd");
        }
    });

    $.each(numbers, function () {
        var cur_number = $("#"+this.year+" tbody tr").not(".ahidden").length;
        if(cur_number == 1) {
            $("#amount-"+this.year).html("("+cur_number+" book)");
        } else {
            $("#amount-"+this.year).html("("+cur_number+" books)");
        }
    });

    var $rows = $("#table tbody tr");
    $("#search").keyup(function() {
        var val = $.trim($(this).val()).replace(/ +/g, " ").toLowerCase();

        $rows.show().removeClass("ahidden").filter(function() {
            var text = $(this).text().replace(/\s+/g, " ").toLowerCase();
            return !~text.indexOf(val);
        }).addClass("ahidden").hide();

        $("#table tr").not(".ahidden").each(function(index, row){
            $(row).removeClass("odd");
            if (index%2==1){ //odd row
                $(row).addClass("odd");
            }
        });
        $.each(numbers, function () {
            var cur_number = $("#"+this.year+" tbody tr").not(".ahidden").length;
            if(cur_number == 1) {
                $("#amount-"+this.year).html("("+cur_number+" book)");
            } else {
                $("#amount-"+this.year).html("("+cur_number+" books)");
            }
        });
    });

    $('input').on('keyup', function() {
        if ($(this).val() == '') {
            $(this).parents('.form-group').addClass('has-empty-value');
        } else {
            $(this).parents('.form-group').removeClass('has-empty-value');
        }
    }).trigger('keyup');

    $('.has-clear .form-control-clear').on('click', function() {
        var $input = $(this).parents('.form-group').find('input');

        $input.val('').trigger('keyup').focus();

        // Trigger a "cleared" event on the input for extensibility purpose
        $input.trigger('cleared');
    });
});

(function(){
}());
