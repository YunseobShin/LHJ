
$('#mobile-menu-btn').click(function() {
    $('.mobile-menu').slideToggle();
})

$('#update-btn').click(function(){
    $('#mypage-form').serialize();
    $.ajax({
        url : '/users/update',
        type : 'post',
        data : $('#mypage-form').serialize(),
        success : function(data){
            if(data == 'authfailed') {
                alert('인증 번호를 다시 입력해주세요')
            }
            else if(data == 'passwordisntsame') {
                alert('기존 비밀번호와 다릅니다')
            }
            else if(data == 'cannotfinduser') {
                alert('유저를 찾을 수 없습니다. 다시 로그인 해주세요')
            }
            else {
                alert('회원 정보 수정이 완료되었습니다')
                window.location.reload();
            }
        }
    })
})

$('#update-phone-btn').click(function(){
    $.ajax({
        url : '/users/updatephone',
        type : 'post',
        data : 'phone=' + $('#phone-input').val() + '&authNum=' + $('#authNum').val(),
        success : function(data){
            if(data) {
                alert('연락처 수정이 완료되었습니다')
                window.location.reload();
            }
            else {
                alert('번호를 다시 확인해주세요.')
            }
        }
    })
})

var phoneUpdate = 0;

$('#phone-auth-btn').click(function(){
    if(phoneUpdate == 0) {
        $('#phone-input').removeAttr("disabled");
        $(this).val('인증');
        $(this).parent().append('<input type="text" id="authNum" name="authNum" placeholder="인증번호">')
        phoneUpdate = 1;
    }
    else {
        $.ajax({
            url : '/users/auth',
            type : 'post',
            data : 'phone=' + $('#phone-input').val(),
            success : function(data) {
                if(data.authNum) {
                    alert('인증번호가 전송되었습니다.')
                }
                else {
                    alert('번호를 다시 확인해주세요.')
                }
            }
        })
    }
})