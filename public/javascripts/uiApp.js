var DOMloadingSpinner = $("#loading-spinner");
var DOMpropertyList = $('#property-list');
var DOMlikeRoomBtn = $('#like-room-btn');

window.query = {
    type : '[]',
    buildyear : '[]',
    option : '[]',
    area : '[]',
    deposit : -1,
    monthly : -1
};

function showLocation(data) {
    if (curMarkerOverlay != null)
        curMarkerOverlay.setMap(null)

    var content = '<div class="marker"><div class="dot"></div><div class="pulse"></div> </div>';
    var position = new daum.maps.LatLng($(data).data("lat"), $(data).data("lng"));

    curMarkerOverlay = new daum.maps.CustomOverlay({
        position: position,
        content: content,
        zIndex: '999'
    });

    curMarkerOverlay.setMap(map);
}

function itemClick(data) {
    var id = $(data).data("id");
    
    if (isMobile) location.href = '/building/' + id;
    else window.open('/building/' + id, '_blank')
}

Handlebars.registerHelper('starPoint', function (options) {
    if(userType == '9dong') {
        var starPoint = Number(this.totalStarPoint);
        var reviewCnt = this.reviewAgentCnt+this.reviewUserCnt;
    }
    else {
        var starPoint = Number(this.totalStarPoint) + Number(this.totalZiptailStar);
        var reviewCnt = this.reviewAgentCnt+this.reviewUserCnt+this.reviewZiptailCnt;
    }
    var averageStarPoint = (starPoint/reviewCnt)
    if (starPoint == 0) {
        return new Handlebars.SafeString('<span class="starpoint"><i class="fa fa-star"></i> 0.0</span>');
    }
    else if(averageStarPoint >= 4) return new Handlebars.SafeString('<span class="starpoint" style="color:#FFBB00"><i class="fa fa-star"></i> '+(averageStarPoint).toFixed(1)+'</span>');
    else if(averageStarPoint >= 3) return new Handlebars.SafeString('<span class="starpoint" style="color:#CAB23A"><i class="fa fa-star"></i> '+(averageStarPoint).toFixed(1)+'</span>');
    else if(averageStarPoint >= 2) return new Handlebars.SafeString('<span class="starpoint" style="color:#99B707"><i class="fa fa-star"></i> '+(averageStarPoint).toFixed(1)+'</span>');
    else if(averageStarPoint < 2) return new Handlebars.SafeString('<span class="starpoint" style="color:#8DA75E"><i class="fa fa-star"></i> '+(averageStarPoint).toFixed(1)+'</span>');
});


Handlebars.registerHelper('bldgThumbnail', function(){
    if(this.thumbnail) {
        return new Handlebars.SafeString('<div class="left-image" data-original="//file.ziptoss.com/bldg/'+this.thumbnail+'" style="background-image:url(//file.ziptoss.com/bldg/'+this.thumbnail+')">')
    }
    else if(this.blogThumb) {
        return new Handlebars.SafeString('<div class="left-image" data-original="'+JSON.parse(this.blogThumb)[0]+'" style="background-image:url('+JSON.parse(this.blogThumb)[0]+')">')
    }
    else {
        return new Handlebars.SafeString('<div class="left-image empty-thumbnail"><img src="/images/ziptosslogo_gr.png">')
    }
})

Handlebars.registerHelper('isMainSt', function (options) {
    if (this.isMainSt == 1)
        return new Handlebars.SafeString('<span class="blue-badge">#대로변</span>&nbsp;');
});

Handlebars.registerHelper('isParking', function (options) {
    if (this.pkgTotalCnt == 0) {
    }
    else return new Handlebars.SafeString('<span class="blue-badge">#주차' + this.pkgTotalCnt + '대</span>&nbsp;');
});

Handlebars.registerHelper('buildingType', function (options) {
    if (this.buildingType == '오피스텔') return new Handlebars.SafeString('<span class="blue-badge point-badge">#오피스텔</span>&nbsp;');
    else if (this.buildingType == '아파트') return new Handlebars.SafeString('<span class="blue-badge point-badge">#아파트</span>&nbsp;');
    else if (this.buildingType == '하숙') return new Handlebars.SafeString('<span class="blue-badge point-badge">#하숙</span>&nbsp;');
    else return new Handlebars.SafeString('<span class="blue-badge">#일반주택</span>&nbsp;');
});

var source = $("#item-template").html();
var moreItem = '<div id="load-more-item">더보기</div>';
var noItem = '<div id="no-item"><h3>현재 위치에 조건에 맞는 건물이 없습니다!</h3><br>지도를 이동하거나, 가격 조건을 다르게 설정해 보세요.<br><span>(현재 관악구 지역만 서비스 중입니다)</span></div>';
var template = Handlebars.compile(source);

function refreshBuildingList(buildings) {
    var data = {
        'buildings': _.slice(buildings, propertyItemSize * (currentPage), propertyItemSize * (++currentPage))
    };
    var html = template(data);
    $('#load-more-item').remove();
    DOMpropertyList.append(html);

    if (buildings.length == 0)
        DOMpropertyList.append(noItem)
    else if ((buildings.length <= propertyItemSize * currentPage) && (propertyItemSize < Math.round(DOMpropertyList.height()))) {
    }
    else
        DOMpropertyList.append(moreItem)

    $('#load-more-item').click(function () {
        refreshBuildingList(buildings)
        DOMpropertyList.scrollTop(DOMpropertyList.scrollTop() + 30)
    })
}

$('.dropdown1').hide()
$('.dropdown2').hide()
$('#dropdown3').hide()

$('.dropbtn').click(function () {
    if ($(this).next().css('display') == 'none') {
        $('.dropbtn').next().hide()
        $(this).next().show()
    }
    else
        $(this).next().hide()
})

$('.dropbtn-others').click(function () {
    if ($('.options').css('display') == 'none')
        $('.options').show()
    else
        $('.options').hide()
})

function resetFilter() {
    var checkboxes = $('.dropdown-search').find('input');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes.eq(i).prop('checked', false);
    }
    saveList = false;
    applyFilter()
}

var saveList = false;

// function landingStart() {
//         $('.modal-login-wrapper').hide();
// }

var markers = [];
var propertyItemSize = 20;