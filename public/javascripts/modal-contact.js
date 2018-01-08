$('.modal-contact-wrapper').click(function (e){
    var container = $("#contact-modal");
    if(container.has(e.target).length === 0) {
        $('.modal-contact-wrapper').fadeOut('20');
        if(overflowHidden == false) $('body').css('overflow','auto');
    }
});

$('input').keyup(_.debounce(function(e) {
    if (e.keyCode == 13) directSearch($("select[name='dong']").val(), $('.modal-search').val())
}, 500));
$('.search-btn-modal').click(_.debounce(function(e) {
    directSearch($("select[name='dong']").val(), $('.modal-search').val())
}, 500));

var overflowHidden = false;

$('#contact-btn').click(function() {
  $('.modal-contact-wrapper').fadeIn('20');
  if($('body').css('overflow') == 'hidden') {
      overflowHidden = true;
  }
  else {
      $('body').css('overflow','hidden');
  }
})

$('.contact-modal-close').click(function() {
  $('.modal-contact-wrapper').fadeOut('20');
  if(overflowHidden == false) $('body').css('overflow','auto');
})


$(".sms-submit").click(function()
{
	var formData = $("#sms-form").serialize();
	if(user) {
	    if(userPhone) {
	        if(confirm('중개사에게 문자메세지를 통해 문의가 전달되며 회원님의 연락처도 함께 전달됩니다. 문자를 보내시겠습니까?')) {
	            $.ajax({
             		type : "POST",
             		url : "/building/sendSMS",
             		cache : false,
             		data : formData,
             		success: function(data) {
             		    if(data==1) {
             		        alert('문자 전송이 완료되었습니다.');
             		        $('.modal-contact-wrapper').fadeOut('20');
                            if(overflowHidden == false) $('body').css('overflow','auto');
             		    }
             		    else alert('문자 전송에 실패하였습니다. 같은 오류가 계속 발생하면 1666-8430 으로 문의주세요.');
             		}
            	});
	        }
	    }
	    else {
	        alert('마이페이지에서 휴대폰 인증을 받아주세요. 인증을 받은 후에도 오류가 발생하면 새로고침 해보세요.');
	    }
	    
	}
	else {
	    alert('회원만 문자를 보내실 수 있습니다.');
	}
	
	
});