/* shuffle object */
function shuffle(o) {
    var a = o;
    for (var j, x, i = a.length; i; j = Math.floor(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x);
    return a;
};

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

/* filter array */
function filter(data, issue, shuffle_flag) {
    var o = new Array();
    for (i = 0; i < data.length; i++) {
        if (data[i].issue == issue) {
            o.push(data[i]);
        }
    }
    if (shuffle_flag) {
        return shuffle(o);
    } else {
        return o.sort(sort_by('id', false, function(a){return a.toUpperCase()}));
    }
};

/* check for scrollbar */
(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false;
    }
})(jQuery);

/* create initial database */
bss_cur = filter(bss, initialissue, false);
issue_cur = initialissue;
increment = 10;
basefill = 10;
index = 0;
finish = false;

/* fill grid */
function fillGrid(data, issue, shuffle_flag) {
    if($("html").scrollTop() > 0) {
        $("html").animate({scrollTop: 0}, "slow", function() {
            bss_cur = filter(data, issue, shuffle_flag);
            issue_cur = issue;
            index = 0;
            var new_html = "";
            $("#grid").html(new_html);
            partFillGrid(bss_cur, index, basefill)
            new_html = "black stories "+issue_cur+" <span class=\"caret\"></span>";
            $(".dropdowntitle").html(new_html);
//            registerClickHandlers();
        });
    } else {
        bss_cur = filter(data, issue, shuffle_flag);
        issue_cur = issue;
        index = 0;
        var new_html = "";
        $("#grid").html(new_html);
        partFillGrid(bss_cur, index, basefill)
        new_html = "black stories "+issue_cur+" <span class=\"caret\"></span>";
        $(".dropdowntitle").html(new_html);
//        registerClickHandlers();
    }
}

/* partially fill grid */
function partFillGrid(data, first, lines) {
    var append_html = "";
    maxi = bss_cur.length;
    for (i = first; i < first + lines; i++) {
        if(i < maxi) {
            append_html = append_html.concat("<li>\n");
            append_html += "<div class=\"effect__click\">\n";
            append_html += "<div class=\"front\">\n";
            append_html += "<div class=\"bs-outer-card\">\n";
            append_html += "<div class=\"bs-inner-card\" title=\""+bss_cur[i].title+" ("+bss_cur[i].id+")\">\n";
            append_html += "<h2>"+bss_cur[i].title+"</h2>\n";
            append_html += "<img src=\"images/"+bss_cur[i].id+".png\" alt=\"Image "+bss_cur[i].id+"\" onerror=\"this.src='../images/default.png'\"/>\n";
            append_html += "<p class=\"bs-text hyphenate\">"+bss_cur[i].hint+"</p>\n";
            append_html += "</div>\n";
            append_html += "</div>\n";
            append_html += "</div>\n";

            append_html += "<div class=\"back\">\n";
            append_html += "<div class=\"bs-outer-card\">\n";
            append_html += "<div class=\"bs-inner-card\" title=\""+bss_cur[i].title+" ("+bss_cur[i].id+")\">\n";
            append_html += "<h2>"+bss_cur[i].title+"</h2>\n";
            append_html += "<img src=\"images/"+bss_cur[i].id+"s.png\" alt=\"Image "+bss_cur[i].id+"\" onerror=\"this.src='../images/default.png'\"/>\n";
            append_html += "<div class=\"bs-text hyphenate\">\n";
            append_html += "<p>"+bss_cur[i].solution+"</p>\n";
            append_html += "</div>\n";
            append_html += "</div>\n";
            append_html += "</div>\n";
            append_html += "</div>\n";
            append_html += "</div>\n";
            append_html += "</li>\n";
            index++;
        } else {
            finish = true;
        }
    }
    $("#grid").append(append_html);
    registerClickHandlers();
}

/* bs cards click handler */
function registerClickHandlers() {
    /* load more content if no scroll bar */
    if($("html").hasScrollBar()) {
        if(!(finish)) {
            partFillGrid(bss_cur, index, increment);
        }
    }
    
    $(".effect__click .bs-inner-card").off("click");
    $(".effect__click .bs-inner-card").click(function(event) {
        $(this).closest(".effect__click").hasClass("flipped") === true ? $(this).closest(".effect__click").removeClass("flipped") : $(this).closest(".effect__click").addClass("flipped");
    });

    /* adjust height to title */
    $("h2").each(function() {
        var texth = 221;
        if($(this).height() > 35) {
            texth = 187;
        }
        $(this).siblings(".bs-text").height(texth);
    });
}

$(document).ready(function () {
    $(".navbar-nav li a").click(function(event) {
        var toggle = $(".navbar-toggle").is(":visible");
        if (toggle) {
            $(".navbar-collapse").collapse('hide');
        }
    });

    $(".navbar-nav button:not(.dropdown-toggle)").click(function(event) {
        var toggle = $(".navbar-toggle").is(":visible");
        if (toggle) {
            $(".navbar-collapse").collapse('hide');
        }
    });
});

(function(){
    loading = false;
    $(window).scroll(function(){
        if(loading) {
            return;
        }
        if($(window).scrollTop() > $(document).height() - $(window).height() - 150) {
            loading = true;
            setTimeout(function(){
                partFillGrid(bss_cur, index, increment);
                loading = false;
            }, 50);
        }
    });
}());

