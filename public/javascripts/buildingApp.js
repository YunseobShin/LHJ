$(window).scroll(function () {
    var scrollVal = $(this).scrollTop();
    var height = $('#map').offset().top;
    if (scrollVal > (height - 550)) {
        $('.sidebar').css({'position': 'absolute', 'top': (height - 450) + 'px'});
    } else {
        $('.sidebar').css({'position': 'fixed', 'top': '100px'});
    }
});

$.ajax({
    type: "GET",
    url: '/review/' + info.id,
    success: function (reviews) {
        review = reviews
        console.log(reviews)
        var reviewUserItem = $('#review-user-template').html();
        var reviewAgentItem = $('#review-agent-template').html();
        var reviewUserItemTemplate = Handlebars.compile(reviewUserItem);
        var reviewAgentItemTemplate = Handlebars.compile(reviewAgentItem);

        reviews.forEach(function(review){
            
            if(review.onlyZiptail == 0 || userType != '9dong') {
                if(review.type == 0) {
                    var html = reviewUserItemTemplate(review);
                    $('.review-items').append(html)
                }
                else if(review.type == 1) {
                    var html = reviewAgentItemTemplate(review);
                    $('.review-items').append(html)
                }
            }
        })
        ;
    }
})

if(user) {
        $('.only-agent').hide();
        $('.only-tenant').show();
    $('textarea[name="advantage"]').attr('placeholder','예) 대로변에 위치하고 역이랑도 가까움. 경비아저씨 상주하고 친절하심. 따뜻한 물 잘 나오고 넓이도 꽤 넓음. 벽간 방음 잘 됨');
        $('textarea[name="weakness"]').attr('placeholder','예) 바퀴벌레가 가끔 나옴. 창이 커서 좋지만 바람이 숭숭 들어와서 난감했음. 1층에 식당이 있는데 가끔 냄새가 올라 옴. 외부 소음이 너무 잘 들림. 층간방음은 좀 아쉬움. 바퀴 가끔 봄.');
        $('textarea[name="reviewComment"]').attr('placeholder','예) 비싸지만 값어치 하는 곳 or 다시 살고 싶지는 않은 곳');
}

Handlebars.registerHelper('breaklines', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('profile', function(text) {
    if(this.origin == '9dong') {
        return new Handlebars.SafeString(
        '<img src="/images/9dong_profile.png">'
        )
    }
    else if(this.origin == 'snu' && userType != '9dong') {
        return new Handlebars.SafeString(
        '<img src="/images/snu_profile.png">'
        )
    }
    else {
        return new Handlebars.SafeString(
        '<img src="/images/tenant_profile.png">'
        )
    }
    
});



Handlebars.registerHelper('starPointOn', function(options){
    var starPointFrom = this.starPoint;
    return new Handlebars.SafeString(
        '<div class="review-item-star-on" style="width:'+ starPointFrom * 20 +'%;"></div>'
    )
})

Handlebars.registerHelper('pointOn', function(options){
    var point = this[options];
    return new Handlebars.SafeString(
        '<div class="review-item-step-on" style="width:'+point / 3 * 100+'%;"></div>'
    )
})

Handlebars.registerHelper('extraComment', function(options) {
    if(this.reviewComment) return new Handlebars.SafeString('<strong>추가 코멘트</strong><br>'+this.reviewComment);
})

Handlebars.registerHelper('pointComment', function(options){
    var point = this[options];
    var commentStr = "";
    if(options == 'soundPoint') {
        switch(point) {
            case 3 :
                commentStr = '<strong>좋음</strong>';
                break;
            case 2 :
                commentStr = '<strong>보통</strong>';
                break;
            case 1 :
                commentStr = '<strong>나쁨</strong>';
                break;
        }
    }
    else if(options == 'insectPoint') {
        switch(point) {
            case 3 :
                commentStr = '<strong>좋음</strong> (벌레가 거의 없음)';
                break;
            case 2 :
                commentStr = '<strong>보통</strong> (벌레가 가끔 출몰)';
                break;
            case 1 :
                commentStr = '<strong>나쁨</strong> (벌레가 자주 출몰)';
                break;
        }
    }
    else if(options == 'depositSafePoint') {
        switch(point) {
            case 3 :
                commentStr = '<strong>보증금 안전도 - 좋음</strong><br>';
                break;
            case 2 :
                commentStr = '<strong>보증금 안전도 - 보통</strong><br>';
                break;
            case 1 :
                commentStr = '<strong>보증금 안전도 - 나쁨</strong><br>';
                break;
        }
    }
    return new Handlebars.SafeString(commentStr)
})

Handlebars.registerHelper('insectTypeImgs', function(options){
    var insectTypeArr = JSON.parse(this.insectType);
    var insectTypeStr = "";
    if(insectTypeArr.indexOf('ant') > -1) insectTypeStr += '<img src="/images/ant.png">';
    if(insectTypeArr.indexOf('roach') > -1) insectTypeStr += '<img src="/images/roach.png">';
    if(insectTypeArr.indexOf('millipede') > -1) insectTypeStr += '<img src="/images/millipede.png">';
    if(insectTypeArr.indexOf('flies') > -1) insectTypeStr += '<img src="/images/flies.png">';
    if(insectTypeArr.indexOf('etc') > -1) insectTypeStr += '<img src="/images/etc.png">';

    return new Handlebars.SafeString(insectTypeStr)
})

Handlebars.registerHelper('recommend', function(options){
    var str = "";
    if(this.isRecommend == 1) {
        str = '이 집을 친구에게 <strong>추천</strong>합니다!';
    }

    return new Handlebars.SafeString(str);
})

Handlebars.registerHelper('writtenDate', function(options){
    var createdDate = new Date(this.createdAt)
    var currentDate = new Date()

    return getTimeago(createdDate, currentDate);
})

var review;

Handlebars.registerHelper('update', function(options){
    if(this.ziptailUserId == user) {
        review = this;
        return new Handlebars.SafeString('<button id="update-review-btn" onclick="updateReviewOpen('+this.reviewId+')">수정요청</button>');
    }
})

function getTimeago(beforeDate, afterDate) {
    var min = 1000*60;
    var hour = 1000*60*60;
    var day = 1000*60*60*24;
    var month = day*30;
    var year = month*12;
    var interval = afterDate - beforeDate;
    var dayInterval = interval / day;
    var hourInterval = interval / hour;
    if(hourInterval < 1) {
        return parseInt(interval / min) + '분 전'
    }
    else if(dayInterval < 1) {
        return parseInt(interval / hour) + '시간 전'
    }
    else if(dayInterval < 31) {
        return parseInt(dayInterval)+'일 전'
    }
    else {
        var monthInterval = interval / month;

        if(monthInterval < 12) {
            return parseInt(monthInterval)+'개월 전'
        }
        else {
            var yearInterval = interval / year;
            return parseInt(yearInterval) + '년 전'
        }
    }
}

if (price) {
    for (i = 0; i < price.length; i++) {
        if (price[i].floor == -1) price[i].floor = '반지하'
        else if (price[i].floor == 0) price[i].floor = '지상'
        else price[i].floor = price[i].floor + '층'

        if (price[i].roomCnt == 1) price[i].roomCnt = '원룸'
        else if (price[i].roomCnt == 1.5) price[i].roomCnt = '1.5룸'
        else if (price[i].roomCnt == 2) price[i].roomCnt = '투룸'

        else if (price[i].roomCnt == 3) price[i].roomCnt = '쓰리룸'
        else price[i].roomCnt = '-'

        var pArea;
        if (price[i].area == 0) {
            pArea = '정보없음';
            price[i].mArea = '';
        }
        else {
            pArea = (price[i].area / 3.3).toFixed() + '평';
            price[i].mArea = '(' + price[i].area + 'm²)';
        }

        if ($('.' + (price[i].area / 3.3).toFixed() + 'PY')[0]) {
            var tr = '<tr class="tr-normal"><td></td><td>' + pArea + '<span class="area">' + price[i].mArea + '</span></td><td>' + price[i].roomCnt + '</td><td>' + price[i].contract + '</td><td>' + price[i].deposit + '/' + price[i].monthly + '</td><td>' + price[i].floor + '</td><td>' + price[i].year + '.' + price[i].month + '.</td></tr>';
            $('.' + (price[i].area / 3.3).toFixed() + 'PY').append(tr);
        }
        else {
            var tbody = '<tbody class="tr-cluster ' + (price[i].area / 3.3).toFixed() + 'PY"></tbody>'
            $('.price-table').append(tbody);
            var tr = '<tr class="tr-first-child"><td class="tr-status">▼</td><td>' + pArea + '<span class="area">' + price[i].mArea + '</span></td><td>' + price[i].roomCnt + '</td><td>' + price[i].contract + '</td><td>' + price[i].deposit + '/' + price[i].monthly + '</td><td>' + price[i].floor + '</td><td>' + price[i].year + '.' + price[i].month + '.</td></tr>';
            $('.' + (price[i].area / 3.3).toFixed() + 'PY').append(tr);
        }
    }
}

$('.tr-first-child').click(function () {
    if ($(this).parent().find('.tr-normal').is(":visible")) $(this).parent().find('.tr-status').text('▼');
    else $(this).parent().find('.tr-status').text('▲');
    $(this).parent().find('.tr-normal').toggle('20');

});

var container = document.getElementById('container'),
    mapWrapper = document.getElementById('mapWrapper'),
    btnRoadview = document.getElementById('btnRoadview'),
    btnMap = document.getElementById('btnMap'),
    rvContainer = document.getElementById('roadview'),
    mapContainer = document.getElementById('map');

var placePosition = new daum.maps.LatLng(info.lat, info.lng);

var map = new daum.maps.Map(mapContainer, {
    center: placePosition,
    level: 3
});

var roadview = new daum.maps.Roadview(rvContainer);
var roadviewClient = new daum.maps.RoadviewClient();

roadviewClient.getNearestPanoId(placePosition, 50, function (panoId) {
    roadview.setPanoId(panoId, placePosition);
});

var mapMarker = new daum.maps.Marker({
    position: placePosition,
    map: map
});

daum.maps.event.addListener(roadview, 'init', function () {
    var rvMarker = new daum.maps.Marker({
        position: placePosition,
        map: roadview
    });
});

function toggleMap(active) {
    if (active) {
        container.className = "view_map"
    } else {
        container.className = "view_roadview"
    }
}

map.addControl(new daum.maps.ZoomControl(), daum.maps.ControlPosition.RIGHT);


$('.review-write-btn').click(function () {
    if(user) {
        $('.write-modal-wrapper').fadeIn('20');
        $('body').css('overflow', 'hidden');
        $('.write-modal-wrapper').trigger('review-write', 'newReview');
    }
    else {
        alert('로그인 후 이용해주세요.');
        $('#menu-login').click();
    }
})

function updateReviewOpen(reviewId) {
    if(user && userType != '9dong') {
        $('.write-modal-wrapper').fadeIn('20');
        $('body').css('overflow', 'hidden');
        $('.write-modal-wrapper').trigger('review-write', 'updateReview');
    }
    else if (userType == '9dong') {
        if (isMobile == 'android') {
            tsmart.open("requestReviewUpdate?user="+ user +"&buildingId=" + info.id + "&buildingTitle="+  info.danji +"&reviewId="+reviewId);
        } else if (isMobile == 'ios') {
            window.location="lffactory.test://requestReviewUpdate?user="+ user +"&buildingId=" + info.id + "&buildingTitle="+  info.danji +"&reviewId="+reviewId;
        }
    }
}

$('.write-modal-wrapper').on('review-write', function(event, eventType){
    if(eventType == 'newReview') {
        $('.write-modal-close').off('write-modal-close');
        $('.write-modal-close').on('write-modal-close', function(event, eventType){

        });
    }
    else {
        $('.review-submit').find('a').attr('onclick', 'writeUserReview(true)')
            $('#star'+review.starPoint*20).click()
            $('#livePeriod').val(review.livePeriod);
            $('input[name="floor"]:radio[value="'+review.floor+'"]').prop('checked', true)
            $('textarea[name="manageFee"]').val(review.manageFee);
            $('textarea[name="advantage"]').val(review.advantage);
            $('textarea[name="weakness"]').val(review.weakness);
            $('textarea[name="reviewComment"]').val(review.reviewComment);
            $('input[name="soundPoint"]:radio[value="'+review.soundPoint+'"]').prop('checked', true)
            $('input[name="insectPoint"]:radio[value="'+review.insectPoint+'"]').prop('checked', true)
            $('input[name="isRecommend"]:radio[value="'+review.isRecommend+'"]').prop('checked', true)
            $('input[name="onlyZiptail"]:radio[value="'+review.onlyZiptail+'"]').prop('checked', true)
            if(review.insectPoint > 0) {
                $('#select-insects').show()
                var insectTypes = JSON.parse(review.insectType);
                insectTypes.forEach(function(insectType){
                    $('#select-insects').find('input:checkbox[value="'+insectType+'"]').prop('checked', true);
                })
            }

        $('.write-modal-close').off('write-modal-close');
        $('.write-modal-close').on('write-modal-close', function(event, eventType){
            $('#review').find('input').prop('checked', false);
            $('#review').find('textarea').val(null);
            $('#select-insects').hide()
            $('.review-submit').find('a').attr('onclick', 'writeUserReview(false)')
        });
    }
})

$('.write-modal-close').click(function (event, eventType) {
    $('.write-modal-wrapper').fadeOut('20');
    $('body').css('overflow', 'auto');
    $('.write-modal-close').trigger('write-modal-close')
})

$(':radio[name="insectPoint"]').click(function () {
    if ($(':radio[name="insectPoint"]:checked').val() != '3') {
        $('#select-insects').show('20');
    }
    else {
        $('#select-insects').hide('20');
    }
})

function writeUserReview(isUpdate) {
    var starPoint = $("input[name='starPoint']:checked").val()
    if (!starPoint) {
        alert('별점을 매겨주세요!')
        return;
    }

    var floor = $("input[name=floor]:checked").val();
    if (!floor) {
        alert('거주 층을 선택해주세요!')
        return;
    }

    var reviewComment = $("textarea[name='reviewComment']").val();
    if ((!reviewComment || reviewComment == "")) {
        alert('한줄평가를 남겨주세요!')
        return;
    }

    var advantage = $("textarea[name='advantage']").val();
    if (!advantage || advantage == '') {
        alert('장점을 남겨주세요')
        return;
    }

    var weakness = $("textarea[name='weakness']").val();
    if (!weakness || weakness == '') {
        alert('단점을 남겨주세요!')
        return;
    }

    var soundPoint = $("input[name='soundPoint']:checked").val();
    if (!soundPoint) {
        alert('방음 지수를 선택해주세요!')
        return;
    }

    var insectPoint = $("input[name='insectPoint']:checked").val();
    if (!insectPoint) {
        alert('방충 지수를 선택해주세요!')
        return;
    }
    
    var recommend = $("input[name='isRecommend']:checked").val();
    if (!recommend) {
        alert('이 집의 추천 여부를 선택해주세요!')
        return;
    }

    var insectTypeArr = []
    var insectTypeInputs = $('#select-insects').find('input:checked');

    for (var i = 0; i < insectTypeInputs.length; i++) {
        insectTypeArr.push(insectTypeInputs.eq(i).val())
    }

    var ajaxData = $('#review').serialize() + '&buildingId=' + info.id + '&insectType=' + JSON.stringify(insectTypeArr);
    $.ajax({
        type: "POST",
        url: '/review/write',
        data: $('#review').serialize() + '&buildingId=' + info.id + '&insectType=' + JSON.stringify(insectTypeArr) + '&isUpdate='+isUpdate+ '&onlyZiptail='+$('#r18').val(),
        success: function (result) {
            if(result==0) alert('로그인 후 작성해주세요.');
            else if(result==2) alert('이미 리뷰를 작성한 건물입니다.');
            else if(result==3) alert('잘못된 접근입니다.');
            else {
                alert('리뷰가 작성되었습니다.');
                window.location.reload();
            }
        }
    });
}

$('#mobile-menu-btn').click(function() {
    $('.mobile-menu').slideToggle();
})

$('#r18').click(function() {
    if($(this).is(':checked')) {
        $(this).val('0');
    }
    else $(this).val('1');
})

$('#homestay').click(function() {
    if($(this).is(':checked')) {
        $('textarea[name="food"]').show();
    }
    else $('textarea[name="food"]').hide();
})


if(navigator.userAgent.indexOf("IE") != -1) {
    $(".insect-label").click(function(){
        if ($(this).attr("for") != "")
            $("#" + $(this).attr("for")).click();
    });
}

var ziptossurl = $(location).attr('pathname').replace('/9dong','').replace('/yonsei','');
$('#contact-btn').attr('href','http://ziptoss.com'+ziptossurl);