// common.js 기능 작성 송주현
// 한군데서만 쓰는 js는 해당 html 파일 안에 넣어놨으며 2군데 이상 쓰는 js는 common.js에 넣어놨습니다.
// 체크 박스 전체 선택 전체 해제 기능
// 이미지 + 버튼 클릭시 팝업으로 보여지는 이미지 팝업 배너 기능(이전 다음 버튼 포함)
// 팝업 기능 부분 (AI견적 상세심도, 표준견적 견적정보)

$(document).ready(function () {
    // 체크 박스 전체선택 전체 해제 부분
    $("#selectAllButton_list").on('click', function () {
        $(".itemCheckbox1").prop('checked', true);
    });

    $("#clearAllButton_list").on('click', function () {
        $(".itemCheckbox1").prop('checked', false);
    });

    // 이미지 팝업부분
    var currentIndex = 0;
    var $ul;
    //모바일에서 팝업 이미지가 상단에 고정 되어 있는 부분 제어 모바일에서는 스크롤이 생기기 때문에 필요함
    $(".popup_warp").each(function () {
        var $popupWarp = $(this);
        $popupWarp.on('scroll', function () {
            var scrollPosition = $popupWarp.scrollTop();
             if ($(window).width() <= 720) {
                if (scrollPosition >= 150 && scrollPosition < 500) {
                    $(".img_popup").css({
                        "top": "calc(50vh + 375px)"
                    });
                } else {
                    $(".img_popup").css({
                        "top": ""
                    });
                }
            } 
            else if ($(window).width() <= 1280) {
                if (scrollPosition >= 300 && scrollPosition < 800) {
                    $(".img_popup").css({
                        "top": "calc(50vh + 375px)"
                    });
                } else {
                    $(".img_popup").css({
                        "top": ""
                    });
                }
            }
            else {
                $(".img_popup").css({
                    "top": ""
                });
            }
        });
    });
    // 이벤트 버블링 안일어나게 체크박스 선택시 리턴
    $(".img_expand li").on('click', function (e) {
        if ($(e.target).is('input[type="checkbox"]')) {
            return;
        }
        //클릭한 현재 값 받아오기
        var $clickedLi = $(this);
        $ul = $clickedLi.closest('.img_expand');
        var $images = $ul.find('li');

        currentIndex = $images.index($clickedLi);
        showImage();
        //이미지가 2개보다 작으면 이전 다음 버튼 안보이게 
        if ($images.length < 2) {
            $(".img_popup .next_button").css('display', 'none');
            $(".img_popup .prev_button").css('display', 'none');
        }
    });
    //다음 버튼 기능
    $(".img_popup .next_button").on('click', function () {
        currentIndex = (currentIndex + 1) % $ul.find('li').length;
        showImage();
    });
    //이전 버튼 기능
    $(".img_popup .prev_button").on('click', function () {
        currentIndex = (currentIndex - 1 + $ul.find('li').length) % $ul.find('li').length;
        showImage();
    });
    //현재 클릭한 이미지를 팝업으로 보여지게 하는 함수 부분
    function showImage() {
        var imageUrl = $ul.find('li').eq(currentIndex).find('img').attr('src');
        $(".img_popup_content").attr('src', imageUrl);
        $(".img_popup_continer").css('display', 'block');
        $(".img_popup").css('display', 'block');
        $(".img_popup_continer").css('display', 'block');
        $("body").addClass('popup_scroll');
    }
    //닫기버튼(X) 버튼 누르거나 영역외 버튼 누르면 안보이게 하는 부분
    $(".img_close").on('click', function () {
        $(".img_popup").css('display', 'none');
        $(".img_popup_continer").css('display', 'none');
        $("body").removeClass('popup_scroll');
        $(".img_popup .next_button").css('display', 'block');
        $(".img_popup .prev_button").css('display', 'block');
    });

    // AI견적 상세심도, 표준견적 견적정보 팝업 부분
    $(".popup_button").on("click", function () {
        $(".popup_continer").css('display', 'block');
        $(".popup_warp").css('display', 'block');
        $("body").addClass('popup');
    })
    $(".popup_warp .close").on("click", function () {
        $(".popup_continer").css('display', 'none');
        $(".popup_warp").css('display', 'none');
        $("body").removeClass('popup');
    })


})