var overflowHidden = false;

$("#login-btn").click(function()
{
	var formData = $("#login-form").serialize();
	$.ajax({
 		type : "POST",
 		url : "/user/login",
 		cache : false,
 		data : formData,
 		success: function(data) {
 		    if(data==1) {
                location.href = location.href.split('?')[0]
            }
 		    else $(".extraWords").text('아이디 또는 비밀번호가 정확하지 않습니다.');
 		}
	});
});


$('.modal-wrapper').click(function (e){
    var container = $(".modal-body");
    if(container.has(e.target).length === 0) {
        $('.modal-wrapper').fadeOut('20');
        if(overflowHidden == false) $('body').css('overflow','auto');
    }
});


function modalLoginOpen() {
  $('.modal-wrapper.login').fadeIn('20');
  if($('body').css('overflow') == 'hidden') {
      overflowHidden = true;
  }
  else {
      $('body').css('overflow','hidden');
  }
}


function modalSignUpOpen() {
  $('.modal-wrapper.signup').fadeIn('20');
  if($('body').css('overflow') == 'hidden') {
      overflowHidden = true;
  }
  else {
      $('body').css('overflow','hidden');
  }
}

$('.modal-box.student').click(function() {
    $('.modal-box').hide();
    $('.student-register').show();
})

$('.modal-box.principal').click(function() {
    $('.modal-box').hide();
    $('.principal-register').show();
})

$('.back-btn').click(function() {
    $('.register').hide();
    $('.modal-box').show();
})

$('#principal-register-btn').click(function() {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	var formData = new FormData($("#principal-form")[0]);

	var id = $("#principal-form").find("input:checkbox[name='agree1']").is(":checked")==true;
    if (!id) {
        $(".extraWords").text('회원가입약관애 동의해주세요.')
        return;
    }

    var id = $("#principal-form").find("input:checkbox[name='agree2']").is(":checked")==true;
    if (!id) {
        $(".extraWords").text('개인정보약관애 동의해주세요.')
        return;
    }

	var id = $("#principal-form").find("input[name='email']").val();
    if (!id) {
        $(".extraWords").text('사용하실 아이디를 입력해주세요.')
        return;
    }
    if (!re.test(id)) {
        $(".extraWords").text('올바른 이메일을 입력해주세요.')
        return;
    }

    var pw = $("#principal-form").find("input[name='password']").val();
    if (!pw) {
        $(".extraWords").text('사용하실 비밀번호를 입력해주세요.')
        return;
    }
    var pw2 = $("#principal-form").find("input[name='password-check']").val();
    if (pw != pw2) {
        $(".extraWords").text('비밀번호를 확인해주세요.')
        return;
    }
    var ins = $("#principal-form").find("input[name='ins_name']").val();
    if (!ins) {
        $(".extraWords").text('학원명을 입력해주세요.')
        return;
    }
    var name = $("#principal-form").find("input[name='co_name']").val();
    if (!name) {
        $(".extraWords").text('성함을 입력해주세요.')
        return;
    }

	$.ajax({
 		type : "POST",
 		url : "/user/signup/principal",
        enctype: 'multipart/form-data',
 		cache : false,
 		processData: false,
 		data : formData,
        contentType: false,
 		success: function(data) {
 		    if(data==1) {
 		        $(".extraWords").text('회원가입이 완료되었습니다. 감사합니다.');
 		        window.location.href='/';
 		    }
 		    else if(data==2) $(".extraWords").text('아이디가 이미 사용중입니다. 다른 아이디로 가입해주세요.');
 		    else if(data==4) $(".extraWords").text('파일 업로드 오류');
 		}
	});
})

$('#student-register-btn').click(function() {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	var formData = $("#student-form").serialize();

	var id = $("#student-form").find("input:checkbox[name='agree1']").is(":checked")==true;
    if (!id) {
        $(".extraWords").text('회원가입약관애 동의해주세요.')
        return;
    }

    var id = $("#student-form").find("input:checkbox[name='agree2']").is(":checked")==true;
    if (!id) {
        $(".extraWords").text('개인정보약관애 동의해주세요.')
        return;
    }

	var id = $("#student-form").find("input[name='email']").val();
    if (!id) {
        $(".extraWords").text('사용하실 아이디를 입력해주세요.')
        return;
    }
    if (!re.test(id)) {
        $(".extraWords").text('올바른 이메일을 입력해주세요.')
        return;
    }
    var pw = $("#student-form").find("input[name='password']").val();
    if (!pw) {
        $(".extraWords").text('사용하실 비밀번호를 입력해주세요.')
        return;
    }

    var pw2 = $("#student-form").find("input[name='password-check']").val();
    if (pw != pw2) {
        $(".extraWords").text('비밀번호를 확인해주세요.')
        return;
    }
    var name = $("#student-form").find("input[name='name']").val();
    if (!name) {
        $(".extraWords").text('이름을 입력해주세요.')
        return;
    }

    var nick = $("#student-form").find("input[name='nickname']").val();
    if(!nick){
        $(".extraWords").text('사용하실 닉네임을 입력해주세요.')
        return;
    }

    if(!$("select[name='gu'] > option:selected").val()) {
        $(".extraWords").text('지역(구)를 선택해주세요.')
        return;
    }

    var school = $("#student-form").find("input[name='school']").val();
    if(!school){
        $(".extraWords").text('학교명을 입력해주세요.')
        return;
    }

    if(!$("select[name='grade'] > option:selected").val()) {
        $(".extraWords").text('학년을 선택해주세요.')
        return;
    }

	$.ajax({
 		type : "POST",
 		url : "/user/signup/student",
 		cache : false,
 		data : formData,
 		success: function(data) {
 		    if(data==1) {
 		        $(".extraWords").text('회원가입이 완료되었습니다. 감사합니다.');
				// alert("입력하신 메일 주소로 인증메일이 전송되었습니다.");
 		        window.location.href='/';
 		    }
 		    else if(data==2) $(".extraWords").text('아이디가 이미 사용중입니다. 다른 아이디로 가입해주세요.');
            else if(data==3) $(".extraWords").text('닉네임이 이미 사용중입니다. 다른 닉네임으로 가입해주세요.');
 		}
	});
})
