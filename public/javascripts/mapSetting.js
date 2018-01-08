var DOMloadingSpinner = $("#loading-spinner");
var mapContainer = document.getElementById('map')

const MAP_CONSTANT = {
    initMapLevel : isMobile ? 6 : 5
}

var mapOption = {
    center: new daum.maps.LatLng(37.48121, 126.952712),
    level: MAP_CONSTANT.initMapLevel
};

if(userType == 'yonsei')
    mapOption.center = new daum.maps.LatLng(37.564313, 126.938900)

var map = new daum.maps.Map(mapContainer, mapOption);

var coArr = [];
var zIndex = 1;
var curMarkerOverlay;

daum.maps.event.addListener(map, 'dragend', _.debounce(function(){
    if(curMarkerOverlay != null)
        curMarkerOverlay.setMap(null)

    getCluster()


    
    if(userType == '9dong') {
        $(".custom-cluster").css('background', 'rgba(28, 152, 204, 0.8)');
    }
    else if(userType == 'yonsei') {
        $(".custom-cluster").css('background', 'rgba(48,157,217, 0.8)');
    }
    else {
        $(".custom-cluster").css('background', 'rgba(230, 91, 25, 0.8)');
    }
    $(".custom-cluster").css('boxShadow', '0 0 0 0pt rgba(255, 255, 255, 0.7)');
}, 500));

daum.maps.event.addListener(map, 'zoom_changed', function() {
    getCluster();
});

function clearCustomOverlay(){
    coArr.forEach(function(co){
        co.setMap(null);
    })
    coArr = [];
}

function getCluster() {
    var sw = map.getBounds().getSouthWest()
    var ne = map.getBounds().getNorthEast()
    var query = window.query;

    var data = "zoom=" + map.getLevel()
        + "&swLat=" + sw.getLat()
        + "&swLng=" + sw.getLng()
        + "&neLat=" + ne.getLat()
        + "&neLng=" + ne.getLng()
        + "&deposit=" + '-1'
        + "&monthly=" + '-1'
        + "&type=" + query.type
        + "&buildyear=" + query.buildyear
        + "&option=" + query.option
        + "&area=" + query.area
        + "&m=" + (isMobile?'true':'false');

    $.ajax({
        url : '/search/cluster',
        type : 'get',
        data : data,
        success : function(clusterResults) {
            console.log(clusterResults)
            clearCustomOverlay();
            window.currentCluster = clusterResults
            for(var i = 0; i < clusterResults.data.length; i++) {
                var item = clusterResults.data[i]

                var content = "";

                if(item.label)
                    content = '<div class="custom-cluster" onmousedown="clusterClick(this, '+ i +')" onmouseover="clusterOver(this)"  onmouseout="clusterOut(this)" data-cluster="'+item.label+'">'+ item.count +'<span>'+ item.label +'</span></div>';
                else
                    content = '<div class="custom-cluster custom-cluster-sm" onmousedown="clusterClick(this, '+ i +')" onmouseover="clusterOver(this)"  onmouseout="clusterOut(this)">'+ item.count + '</div>';

                var customOverlay = new daum.maps.CustomOverlay({
                    position: new daum.maps.LatLng(item.lat, item.lng),
                    content: content
                });

                customOverlay.setMap(map);
                coArr.push(customOverlay);

            }

            changeBounds()
        }
    })
}

function clusterClick(element, index) {
    if($(element).data('isClick') != 'true') {
        if(userType == '9dong') {
            $(".custom-cluster").css('background', 'rgba(28, 152, 204, 0.8)');
            $(element).css('background', "rgba(28, 152, 204, 1)")
        }
        else if(userType == 'yonsei') {
            $(".custom-cluster").css('background', 'rgba(48,157,217, 0.8)');
            $(element).css('background', "rgba(48,157,217, 1)")
        }
        else {
            $(".custom-cluster").css('background', 'rgba(230, 91, 25, 0.8)');
            $(element).css('background', "rgba(230, 91, 25, 1)")
        }
        $(".custom-cluster").css('boxShadow', '0 0 0 0pt rgba(255, 255, 255, 0.7)');
        $(".custom-cluster").data('isClick', null);
        
        $(element).css('boxShadow', '0 0 0 4pt rgba(255, 255, 255, 0.9)')
        $(element).data('isClick', 'true');

        var clusterType = window.currentCluster.type;
        var clusterData = window.currentCluster.data;

        console.log(clusterData[index])

        if(clusterType == 'p') {
            var clusterIdArr = [];
            if(Array.isArray(clusterData[index].id))
                clusterData[index].id.forEach(function(id) {
                    window.buildinglist.forEach(function(tempBuilding){
                        if(tempBuilding.id == (id*16668430-9999).toString('16'))
                            clusterIdArr.push(tempBuilding)
                    })
                })
            else {
                window.buildinglist.forEach(function(tempBuilding) {
                    if (tempBuilding.id == (clusterData[index].id * 16668430 - 9999).toString('16'))
                        clusterIdArr.push(tempBuilding)
                })
            }

            currentPage = 0;
            $('#total-num').text(clusterIdArr.length)
            DOMpropertyList.html("");
            refreshBuildingList(clusterIdArr)
        }
        else {
            $.ajax({
                url : '/search/clusteritem',
                type : 'post',
                data : 'label=' + clusterData[index].label + '&type=' + clusterType,
                success : function(data) {
                    currentPage = 0;
                    $('#total-num').text(data.length)
                    DOMpropertyList.html("");
                    refreshBuildingList(data)
                }
            })
        }
    }
    else {
        $(element).data('isClick', null);
        getCluster();
    }
}

function clusterOver(element) {
    if($(element).data('isClick') != 'true') {
        if(userType == '9dong') {
            $(element).css('background', 'rgba(28, 152, 204, 0.9)');
        }
        else if(userType == 'yonsei') {
            $(element).css('background', "rgba(48,157,217, 0.9)")
        }
        else {
            $(element).css('background', 'rgba(230, 91, 25, 0.9)');
        }
        
        $(element).css('boxShadow', '0 0 0 4pt rgba(255, 255, 255, 0.7)');
        $(element).parent().css('zIndex', zIndex++);
    }
}

function clusterOut(element) {
    if($(element).data('isClick') != 'true') {
        if(userType == '9dong') {
            $(element).css('background', 'rgba(28, 152, 204, 0.8)');
        }
        else if(userType == 'yonsei') {
            $(element).css('background', "rgba(48,157,217, 0.8)")
        }
        else {
            $(element).css('background', 'rgba(230, 91, 25, 0.8)');
        }
        $(element).css('boxShadow', '0 0 0 0pt rgba(255, 255, 255, 0.7)');
    }
}

// 지도 확대, 축소 컨트롤에서 확대 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomIn() {
    map.setLevel(map.getLevel() - 1);
}

// 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomOut() {
    map.setLevel(map.getLevel() + 1);
}
