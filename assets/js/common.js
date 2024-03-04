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
    $(".img_expand li").on('click', function (e) {
        if ($(e.target).is('input[type="checkbox"]')) {
            return;
        }

        var $clickedLi = $(this);
        $ul = $clickedLi.closest('.img_expand');
        var $images = $ul.find('li');

        currentIndex = $images.index($clickedLi);
        showImage();
        if ($images.length < 2) {
            $(".img_popup .next_button").css('display', 'none');
            $(".img_popup .prev_button").css('display', 'none');
        }
    });

    $(".img_popup .next_button").on('click', function () {
        currentIndex = (currentIndex + 1) % $ul.find('li').length;
        showImage();
    });

    $(".img_popup .prev_button").on('click', function () {
        currentIndex = (currentIndex - 1 + $ul.find('li').length) % $ul.find('li').length;
        showImage();
    });

    function showImage() {
        var imageUrl = $ul.find('li').eq(currentIndex).find('img').attr('src');
        $(".img_popup_content").attr('src', imageUrl);
        $(".img_popup_continer").css('display', 'block');
        $(".img_popup").css('display', 'block');
        $(".img_popup_continer").css('display', 'block');
        $("body").addClass('popup_scroll');
    }

    $(".img_close, .img_popup_continer").on('click', function () {
        $(".img_popup").css('display', 'none');
        $(".img_popup_continer").css('display', 'none');
        $("body").removeClass('popup_scroll');
        $(".img_popup .next_button").css('display', 'block');
        $(".img_popup .prev_button").css('display', 'block');
    });

    // 탭 메뉴 부분
    $(".arrow_button").on("click", function () {
        $(this).toggleClass("open");
        $(this).closest(".depth_contents").find(".state").toggle();
    });

    // 상세 팝업 부분
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

    //개인정보 토큰값에 따라 리스트 다르게 보이게
    var userTypeSelect = $('#userType');
    var table = $('.filter_list');
    function toggleColumnVisibility(className, show) {
        var columns = table.find('.' + className);
        columns.css('display', show ? '' : 'none');
    }
    function handleUserTypeChange() {
        var selectedValue = userTypeSelect.val();
        if (selectedValue === 'agency') {
            toggleColumnVisibility('ins_list', true);
            toggleColumnVisibility('other_list', false);
        } else {
            toggleColumnVisibility('ins_list', false);
            toggleColumnVisibility('other_list', true);

        }
    }
    handleUserTypeChange();
    userTypeSelect.on('change', handleUserTypeChange);
})