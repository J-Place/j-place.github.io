$(".search").keyup(function() {
    var searchData = [];
    // add search values
    $('.search').each(function() {
        var value = $(this).val();
        // var searchField = $(this).attr( "title" );
        var searchField = $(this).attr( "id" );
        if(value !== "") {
            searchData.push({
                field: searchField,
                value: value
            });
        }
    });
    resultsGtd.filter(function(item) {
        var searchName, searchAge, searchClub;
        // set true if the added search values is in list area
        $.each(searchData, function(key, value) {
            if(searchData[key]["field"] == "searchName")
                searchName = item.values().user.toLowerCase().indexOf(searchData[key]["value"].toLowerCase()) != -1;
            if(searchData[key]["field"] == "searchAge")
                searchAge = item.values().location.toLowerCase().indexOf(searchData[key]["value"].toLowerCase()) != -1;
            if(searchData[key]["field"] == "searchClub")
                searchClub = item.values().prognosis.toLowerCase().indexOf(searchData[key]["value"].toLowerCase()) != -1;
        });
        // if the searchValues is true or not set
        return  (searchName || typeof searchName == "undefined") &&
                (searchAge || typeof searchAge == "undefined") &&
                (searchClub || typeof searchClub == "undefined")
    });
});







$('input.search').onblur(function() {
    list.search( function( item ) {
        $('input.search').each(function() {
            var search = $(this),
                attribute = search.data('search-attribute'),
                value = search.val();
            if (value !== '' && value !== item[attribute]) {
                return false;
            }
        });
    });
});