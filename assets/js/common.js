$(document).ready(function(){
    // 체크 박스 전체선택 전체 해제 부분
    $("#selectAllButton_list").on('click', function() {
        $(".itemCheckbox1").prop('checked', true);
      });
  
      $("#clearAllButton_list").on('click', function() {
        $(".itemCheckbox1").prop('checked', false);
      });

      // 이미지 팝업부분
      var images = $(".img_expand li");
      var currentIndex = 0;

      $(".img_expand li").on('click', function (e) {
        if ($(e.target).is('input[type="checkbox"]')) {
          return;
      }
          currentIndex = images.index($(this));
          showImage();
      });
      
      $(".img_close, .img_popup_continer").on('click', function () {
          $(".img_popup").css('display', 'none');
          $(".img_popup_continer").css('display', 'none');
          $("body").removeClass('popup');
      });
      
      $(".img_popup .next_button").on('click', function () {
          currentIndex = (currentIndex + 1) % images.length;
          showImage();
      });
      
      $(".img_popup .prev_button").on('click', function () {
          currentIndex = (currentIndex - 1 + images.length) % images.length;
          showImage();
      });
      
      function showImage() {
          var imageUrl = images.eq(currentIndex).find('img').attr('src');
          $(".img_popup_content").attr('src', imageUrl);
          $(".img_popup").css('display', 'block');
          $(".img_popup_continer").css('display', 'block');
          $("body").addClass('popup');
      }
     
      // 탭 메뉴 부분
      $(".arrow_button").on("click", function () {
        $(this).toggleClass("open");
        $(this).closest(".depth_contents").find(".state").toggle();
    });

    // 상세 팝업 부분
    $(".popup_button").on("click",function(){
        $(".popup_continer").css('display', 'block');
        $(".popup_warp").css('display', 'block');
        $("body").addClass('popup');
    })
    $(".popup_warp .close").on("click",function(){
        $(".popup_continer").css('display', 'none');
        $(".popup_warp").css('display', 'none');
        $("body").removeClass('popup');
    })
})