jQuery(document).ready(function($){

  // Parallax
  if ($('.parallax-background').length) {
    $(".parallax-background").parallax();
  }
  
  // Parallax
  if ($('.parallax-background-partners').length) {
    $(".parallax-background-partners").parallax();
  }  
  
  
  // Scroll +1px - big fix
  $(window).scrollTop($(window).scrollTop()+1);
  
  
  // niceScroll
  $("html").niceScroll();
    
    
  // Stick menu
  $(".menu").sticky({topSpacing:0});




  // Menu Scroll to content and Active menu
  var lastId,
    topMenu = $("#menu"),
    topMenuHeight = topMenu.outerHeight()+105,
    menuItems = topMenu.find("a"),
    scrollItems = menuItems.map(function(){
      var item = $($(this).attr("href"));
      if (item.length) { return item; }
    });

   $('a[href*=#]').bind('click', function(e) {
	e.preventDefault();
       
	var target = $(this).attr("href");
			

	$('html, body').stop().animate({ scrollTop: $(target).offset().top-140 }, 1000, function() {

	});
			
	return false;
   });

  $(window).scroll(function(){
   var fromTop = $(this).scrollTop()+topMenuHeight;
   var cur = scrollItems.map(function(){
     if ($(this).offset().top < fromTop)
       return this;
   });

   cur = cur[cur.length-1];
   var id = cur && cur.length ? cur[0].id : "";
   
   if (lastId !== id) {
       lastId = id;
       menuItems
         .parent().removeClass("active")
         .end().filter("[href=#"+id+"]").parent().addClass("active");
   }                   
  });  
  

  //courses - opacity
  $('.grid .text').hover(
    function () {
      $(this).animate({opacity:'0.5'});
    },
    function () {
      $(this).animate({opacity:'1'});
    }
  );    


  if ( $(window).width() > 1023) {     

    tiles = $("p, h1, h2, h3, .column-one, .column-two, .column-three, .start-page .content .text, hr, .grid li, .contact .content .form, .contact .content .contact-text ").fadeTo(0, 0);

    $(window).scroll(function(d,h) {
      tiles.each(function(i) {
          a = $(this).offset().top + $(this).height();
          b = $(window).scrollTop() + $(window).height();
          if (a < b) $(this).fadeTo(1000,1);
      });
    });

  }
  else {
  }


  //Menu mobile click
  $( ".icon" ).click(function() {
    $( " ul.menu-click" ).slideToggle( "slow", function() {
    // Animation complete.
    });
  });

//  //cirle 1 click
//  $( ".circle-one" ).click(function() {
//    window.location = "http://www.isle.illinois.edu/sst/pubs/2015/ren15slate.pdf";
//  });
//
//  //cirle 2 click
//  $( ".circle-two" ).click(function() {
//    window.location = "https://github.com/cs-education/classTranscribe/blob/master/documentation/student_faq.md";
//  });
//
//  //cirle 3 click
//  $( ".circle-three" ).click(function() {
//    window.location = "https://github.com/cs-education/classTranscribe/blob/master/documentation/instructor_faq.md";
//  });

  // button email send click
  $( ".button" ).click(function() {
    $(location).attr('href', 'mailto:?subject='+encodeURIComponent("This is my subject")+ "&body="+ encodeURIComponent("This is my body"));
  });

  
});
