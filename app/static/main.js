var user_value_length = 0;

function searchAutoComplete(value) {
        remove_table();
        $.ajax({
                type: "GET",
                url: '/searchlist',
                data: $('#autocomplete').serialize()
        }).success(function (data) {
                hide_tooltip(value);
                $('#autocomplete').autocomplete({
                        source: data,
                        minLength: 2
                });
        });
}

function hide_tooltip(value) {
        user_value_length = value.length;
        if (user_value_length > 1) {
                document.getElementById('tooltip-search-bar').style.display = 'none';
        }else{
                document.getElementById('tooltip-search-bar').style.display = 'block';
        }
}



function remove_table() {
        if (($("#search_result_table").is(":visible"))) {
                ($("#search_result_table")).hide();
        }

        if (($("#no_records").is(":visible"))) {
                ($("#no_records")).hide();
        }

}

$('tr.table-data').click(function () {
        console.log("hello");
        window.location = $(this).find('a').attr('href');
}).hover(function () {
        $(this).toggleClass('hover');
});