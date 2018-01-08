function isPriceDontcare() {
    if($('.deposit').eq(0).text() == '상관없음'
        && $('.monthly').eq(0).text() == '상관없음')
        return true;
    else
        return false;
}

function changeBounds() {
    var sw = map.getBounds().getSouthWest()
    var ne = map.getBounds().getNorthEast()
    var query = window.query;

    var data =
        "&swLat=" + sw.getLat()
        + "&swLng=" + sw.getLng()
        + "&neLat=" + ne.getLat()
        + "&neLng=" + ne.getLng()
        + "&deposit=" + query.deposit
        + "&monthly=" + query.monthly
        + "&type=" + query.type
        + "&buildyear=" + query.buildyear
        + "&option=" + query.option
        + "&area=" + query.area;

    $.ajax({
        url : '/search/buildinglist',
        type : 'get',
        data : data,
        success : function(data) {
            window.buildinglist = data;
            DOMpropertyList.html("");
            currentPage = 0;
            $('#total-num').text(data.length)
            refreshBuildingList(data)
            $('.property-list').scrollTop(0)
            DOMloadingSpinner.hide();
        }
    })
}

var currentPage = 0;

function applyFilter(isPrice) {
    if ($('.dropdown-search').css('display') == 'block')
        $('.dropdown-search').hide()

    var type = $("input[name=type]").map(function () { if ($(this).prop('checked')) return this.value; }).get();
    var area = $("input[name=area]").map(function () { if ($(this).prop('checked')) return this.value; }).get();
    var option = $("input[name=option]").map(function () { if ($(this).prop('checked')) return this.value;}).get();
    var buildyear = $("input[name=buildyear]").map(function () { if ($(this).prop('checked')) return this.value; }).get();

    window.query.type = JSON.stringify(type);
    window.query.buildyear = JSON.stringify(buildyear);
    window.query.option = JSON.stringify(option);
    window.query.area = JSON.stringify(area);
    
    getCluster();
}

$('.dropdown1').find('li').click(function (e) {
    $('.deposit').text(this.innerHTML)
    $('.dropdown1').hide()
    applyFilter();
})

$('.dropdown2').find('li').click(function (e) {
    $('.monthly').text(this.innerHTML)
    $('.dropdown2').hide();
    applyFilter();
})


if (!Cookies.get('deposit')) {
    getCluster();
    $(document).keydown(function (e) {
        if (e.keyCode == 27) {
            landingStart();
        }
    });

    $(document).ready(function () {
        $('.open-landing').mouseup(function (e) {
            var container = $(".open-landing-img");
            if (container.has(e.target).length === 0)
                landingStart();
        });

        $('.open-landing').show();
        var selectTarget = $('.selectbox select');

        selectTarget.on('blur', function () {
            $(this).parent().removeClass('focus');
        });

        selectTarget.change(function () {
            var select_name = $(this).children('option:selected').text();

            $(this).siblings('label').text(select_name);
        });

    });
} else {
    var _deposit = Cookies.get('deposit');
    var _monthly = Cookies.get('monthly');

    $('.deposit').text(_deposit);
    $('.monthly').text(_monthly);
    applyFilter();
}