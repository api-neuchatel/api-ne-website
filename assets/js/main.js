var $window = jQuery(window);

// Set Featured Image Defaults
if (jQuery("#fi-container").length) {
	var fi_div_height = jQuery("#fi-container").data("fi-div-height");
}

jQuery(document).ready(function($) {
   
	/* Portfolio Single Page Slide Show */
	if(jQuery("#js-grid-slider-thumbnail").length) {
		jQuery('#js-grid-slider-thumbnail').cubeportfolio({
			layoutMode: 'slider',
			drag: true,
			auto: true,
			autoTimeout: 5000,
			autoPauseOnHover: true,
			showNavigation: false,
			showPagination: true,
			rewindNav: false,
			scrollByPage: false,
			gridAdjustment: 'responsive',
			mediaQueries: [{
				width: 1,
				cols: 1
			}],
			gapHorizontal: 0,
			gapVertical: 0,
			caption: '',
			displayType: 'default',
		});
	}
	
	// Blog-date click
	if(jQuery(".blog-date").length) {
		jQuery('.blog-date').each(function() {
			var url = $(this);
			url = url.data("post-url");
			jQuery(this).click(function(event) {
				event.preventDefault();
				window.location = url;
			});
		});
	}
	/*
	* One Page Navigation
	*/
	var target_menu_class = '.um-menu';
	var current_page_class = 'current-menu-item';
	if(jQuery(".umax-one-page-sidemenu").length) {
		target_menu_class = '.um-side-menu';
		current_page_class = 'current_page_item';
	}

	if(jQuery(".umax-one-page").length) {

		// Get the height of the header // .length
		var stickHeight = jQuery(".stickyheader").height();
		jQuery(target_menu_class+" li:first-child").addClass(current_page_class);

		jQuery(target_menu_class+" a[href*=\\#]").click(function(evn){
			evn.preventDefault();
			if(jQuery(this).parent().is(':first-child')){
				jQuery('html, body').animate({scrollTop: 0}, 1200, 'easeInOutExpo', function() {
					jQuery(target_menu_class+" li:first-child").addClass(current_page_class);
				});

			} else {
				jQuery('html,body').animate( { scrollTop:$(this.hash).offset().top  - stickHeight} , 1200, 'easeInOutExpo');
				jQuery(target_menu_class+" li:first-child").removeClass(current_page_class);
			}
		});

		var aChildren = jQuery(target_menu_class+" li").not(':first-child').children(); // find the a children of the list items
		var aArray = []; // create the empty aArray
		for (var i=0; i < aChildren.length; i++) {
			var aChild = aChildren[i];
			// Remove if Search Icon is there
			if(jQuery(aChild).attr('href') != 'javascript:void(0);') {
				var ahref = jQuery(aChild).attr('href');
			}
			aArray.push(ahref);
		}
	}

	/*
	* Animated Words
	*/

	//set animation timing
	var animationDelay = 2500,
		//loading bar effect
		barAnimationDelay = 3800,
		barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
		//letters effect
		lettersDelay = 50,
		//type effect
		typeLettersDelay = 150,
		selectionDuration = 500,
		typeAnimationDelay = selectionDuration + 800,
		//clip effect
		revealDuration = 600,
		revealAnimationDelay = 1500;

	initHeadline();

	function initHeadline() {
		//insert <i> element for each letter of a changing word
		singleLetters($('.cd-headline.letters').find('b'));
		//initialise headline animation
		animateHeadline($('.cd-headline'));
	}

	function singleLetters($words) {
		$words.each(function(){
			var word = $(this),
				letters = word.text().split(''),
				selected = word.hasClass('is-visible');
			for (i in letters) {
				if(word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
				letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
			}
		    var newLetters = letters.join('');
		    word.html(newLetters).css('opacity', 1);
		});
	}

	function animateHeadline($headlines) {
		var duration = animationDelay;
		$headlines.each(function(){
			var headline = $(this);

			if(headline.hasClass('loading-bar')) {
				duration = barAnimationDelay;
				setTimeout(function(){ headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
			} else if (headline.hasClass('clip')){
				var spanWrapper = headline.find('.cd-words-wrapper'),
					newWidth = spanWrapper.width() + 10
				spanWrapper.css('width', newWidth);
			} else if (!headline.hasClass('type') ) {
				//assign to .cd-words-wrapper the width of its longest word
				var words = headline.find('.cd-words-wrapper b'),
					width = 0;
				words.each(function(){
					var wordWidth = $(this).width();
				    if (wordWidth > width) width = wordWidth;
				});
				headline.find('.cd-words-wrapper').css('width', width);
			};

			//trigger animation
			setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
		});
	}

	function hideWord($word) {
		var nextWord = takeNext($word);

		if($word.parents('.cd-headline').hasClass('type')) {
			var parentSpan = $word.parent('.cd-words-wrapper');
			parentSpan.addClass('selected').removeClass('waiting');
			setTimeout(function(){
				parentSpan.removeClass('selected');
				$word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
			}, selectionDuration);
			setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);

		} else if($word.parents('.cd-headline').hasClass('letters')) {
			var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
			hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
			showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ width : '2px' }, revealDuration, function(){
				switchWord($word, nextWord);
				showWord(nextWord);
			});

		} else if ($word.parents('.cd-headline').hasClass('loading-bar')){
			$word.parents('.cd-words-wrapper').removeClass('is-loading');
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, barAnimationDelay);
			setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

		} else {
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, animationDelay);
		}
	}

	function showWord($word, $duration) {
		if($word.parents('.cd-headline').hasClass('type')) {
			showLetter($word.find('i').eq(0), $word, false, $duration);
			$word.addClass('is-visible').removeClass('is-hidden');

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){
				setTimeout(function(){ hideWord($word) }, revealAnimationDelay);
			});
		}
	}

	function hideLetter($letter, $word, $bool, $duration) {
		$letter.removeClass('in').addClass('out');

		if(!$letter.is(':last-child')) {
		 	setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);
		} else if($bool) {
		 	setTimeout(function(){ hideWord(takeNext($word)) }, animationDelay);
		}

		if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
			var nextWord = takeNext($word);
			switchWord($word, nextWord);
		}
	}

	function showLetter($letter, $word, $bool, $duration) {
		$letter.addClass('in').removeClass('out');

		if(!$letter.is(':last-child')) {
			setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration);
		} else {
			if($word.parents('.cd-headline').hasClass('type')) { setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200);}
			if(!$bool) { setTimeout(function(){ hideWord($word) }, animationDelay) }
		}
	}

	function takeNext($word) {
		return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
	}

	function takePrev($word) {
		return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
	}

	function switchWord($oldWord, $newWord) {
		$oldWord.removeClass('is-visible').addClass('is-hidden');
		$newWord.removeClass('is-hidden').addClass('is-visible');
	}

	// Initiate Pretty Photo
	jQuery("a[data-rel^='prettyPhoto']").prettyPhoto();

    // Initiate Video Background
    if (jQuery(".alona-video-bg").length) {
		jQuery(".alona-video-bg").coverVid(1920, 1080);
	}

	// Back to top Offset
    var offset = 220;

	// On Window Scroll
    jQuery(window).scroll(function() {

		if (jQuery(this).scrollTop() > offset) {
            jQuery('.back-to-top').show();
        } else {
            jQuery('.back-to-top').hide();
        }

		// If it is a one page template
		if($(".umax-one-page").length) {

			var windowPos = jQuery(window).scrollTop() + 2; // get the offset of the window from the top of page
			var windowHeight = jQuery(window).height(); // get the height of the window
			var docHeight = jQuery(document).height();

			for (var i=0; i < aArray.length; i++) {
				var xtheID = aArray[i];
				var divPos = jQuery(xtheID).offset().top - stickHeight; // get the offset of the div from the top of page
				var divHeight = jQuery(xtheID).height(); // get the height of the div in question

				// On Scroll Activate Home / First Menu
				var firstDiv = aArray[0];
				var secondChildPos = jQuery(firstDiv).offset().top - stickHeight;

				// Add class for First Child
				if(windowPos < secondChildPos) {
					jQuery(target_menu_class+" li:first-child").addClass(current_page_class);
				}

				// Add / Remove Current / Active Class
				if (windowPos >= divPos && windowPos < (divPos + divHeight)) {
					jQuery(target_menu_class+" li:first-child").removeClass(current_page_class);
					jQuery("a[href='" + xtheID + "']").parent().addClass(current_page_class);

				} else {
					jQuery("a[href='" + xtheID + "']").parent().removeClass(current_page_class);
				}
			}
		}
	});

    jQuery('.back-to-top').click(function(event) {
        event.preventDefault();
        jQuery('html, body').animate({scrollTop: 0}, 1200, 'easeInOutExpo');
        return false;
    });

	// Initiate Different Functions
	ultimax_video_bg();
	UltimaxPortfolio();
    initProgressBars();
    initEasyPieCharts();
	initCounterBoxes();
	ultimax_raindrops();
	initUltimaxSliders();
	FixedFooter();
	stellar_check();
	check_sticky_sidebar();

	/*
	* Responsive Tabs - Convert to Accordion
	*/

    $('#horizontalTab').easyResponsiveTabs({
        type: 'default', //Types: default, vertical, accordion
        width: 'auto', //auto or any width like 600px
        fit: true,   // 100% fit in a container
        closed: 'accordion', // Start closed if in accordion view
        activate: function(event) { // Callback function if tab is switched
            var $tab = $(this);
            var $info = $('#tabInfo');
            var $name = $('span', $info);
            $name.text($tab.text());
            $info.show();
        }
    });

    $('#verticalTab').easyResponsiveTabs({
        type: 'vertical',
        width: 'auto',
        fit: true
    });


    /* Videos class */
    if (jQuery(".ultimax-video").length) {
		$(".container").fitVids();
    }

	// Header search icon
	$('.search_icon').click(function(event){
		event.stopPropagation();
		$('.search-popup').fadeToggle( "fast");
	});

	// On Resize (check width) and show / hide - Right side of main navigation
	if((jQuery('.nav-right-holder').width() + jQuery('.nav-holder').width()) >= jQuery('.nav-bg').width()) {
		jQuery('.nav-right-holder').hide();
	} else {
		jQuery('.nav-right-holder').show();
	}

	/*
	*	Mobile Nav functions - Start
	*/
	//mnav-holder
	$('.mnav-holder').click(function(event){
		event.stopPropagation();
		$('.um-menu').toggleClass("xactive");
	});

	$(".um-menu").on("click", function (event) {
		event.stopPropagation();
	});

	$(".um-side-menu").on("click", function (event) {
		event.stopPropagation();
	});

	// Add xactive class on Mobile - Smaller Screen Resolution
	$(document).on("click", function (e) {
		if ($('.um-menu').hasClass('xactive')) {
		  $('.um-menu').toggleClass("xactive");
		}
		if( e.target.className != "bravio_s_popup") {
			$(".search-popup").hide();
		}
	});

	// Sub Icons on Mobile Devices - Main Navigation
	$('.mnav-subicon').click( function () {
		$(this).parent().toggleClass("mnavdrop");
	});

	/*
	* Side Navigation Menu HOVER Intention
	*/

	$(".page-has-children").hoverIntent({
		sensitivity:3,
		timeout:1500,
		over:sn_show,
		out:sn_hide
	});

	// Side Navigation Show
	function sn_show() {
		$(this).find(".children").slideDown();
	}
	// Side Navigation Hide
	function sn_hide() {
		$(this).find(".children").slideUp();
	}

	/*
	* Featured Image Settings
	*/
	
	// ACTIAVTE VWLO just for testing disbaled
	/*
	var imgHeight = jQuery("#theimage").height();
	var containerHeight = jQuery("#fi-container").height();

	if(imgHeight < containerHeight) {
		jQuery("#fi-container").height(imgHeight);
	}
	*/	
	
	/*
	* Toggle Functions
	*/

	// Only check if toggle is present on page
	if($(".toggle-content").length) {

		jQuery('.toggle-content').each(function() {
			if(!jQuery(this).hasClass('open')){
				jQuery(this).hide();
			} else {
				jQuery(this).show();
			}
		});

		jQuery("span.toggle").click(function(){
			if(jQuery(this).parents('.accordian').length >=1){
				var accordian = jQuery(this).parents('.accordian');
				if(jQuery(this).hasClass('active')){
					jQuery(accordian).find('span.toggle').removeClass('active');
					jQuery(accordian).find(".toggle-content").slideUp();
				} else {
					jQuery(accordian).find('span.toggle').removeClass('active');
					jQuery(accordian).find(".toggle-content").slideUp();
					jQuery(this).addClass('active');
					jQuery(this).next(".toggle-content").slideToggle();
				}
			} else {
				if(jQuery(this).hasClass('active')){
					jQuery(this).removeClass("active");
				}else{
					jQuery(this).addClass("active");
				}
			}
		});

		jQuery("span.toggle").click(function(){
			if(!jQuery(this).parents('.accordian').length >=1){
				jQuery(this).next(".toggle-content").slideToggle();
			}
		});
	}

	/*
	* Tabs Functions
	*/

	// Only check if Tab is present on page
	if($(".tabs-container").length) {
		//When page loads...
		jQuery('.tabs-container').each(function() {
			jQuery(this).find(".tab_content").hide(); //Hide all content
			if(document.location.hash && jQuery(this).find("ul.tabs li a[href='"+document.location.hash+"']").length >= 1) {
				jQuery(this).find("ul.tabs li a[href='"+document.location.hash+"']").parent().addClass("active").show(); //Activate first tab
				jQuery(this).find(document.location.hash+".tab_content").show(); //Show first tab content
			} else {
				jQuery(this).find("ul.tabs li:first").addClass("active").show(); //Activate first tab
				jQuery(this).find(".tab_content:first").show(); //Show first tab content
			}
		});

		//On Click Event
		jQuery("ul.tabs li").click(function(e) {
			jQuery(this).parents('.tabs-container').find("ul.tabs li").removeClass("active"); //Remove any "active" class
			jQuery(this).addClass("active"); //Add "active" class to selected tab
			jQuery(this).parents('.tabs-container').find(".tab_content").hide(); //Hide all tab content
			var activeTab = jQuery(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
			jQuery(this).parents('.tabs-container').find(activeTab).fadeIn(); //Fade in the active ID content
			e.preventDefault();
		});

		jQuery("ul.tabs li a").click(function(e) {
			e.preventDefault();
		});
	}

	// Get the width of navigation
	navwidth = 0;
	jQuery(".um-menu > li").each(function() {
		navwidth += jQuery(this).width();
	});

	/*
	* Initiate CSS Animation with WOW
	*/
	var WOWanimate = new WOW({
	  boxClass:     'animate',
	  animateClass: 'animated',
	  offset:       30,
	  mobile:       false
	});
	WOWanimate.init();

	// Perfect EqualHeights
	jQuery('.equalheights').matchHeight();

    stellar_check();

});

(function($,sr){

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  }
    // smartresize
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

jQuery(function(){

	// Full Height Headers
	if(jQuery(".ultimax-full-height").length) {

		var header_vm = "";

		if (jQuery(this).data("header_vm") !== "") {
			header_vm = jQuery('.ultimax-full-height').data("header_vm");
		}

		var windowH = jQuery(window).height();
		var headerH = jQuery('.ultimax-full-height').height();

		// header_vm=1 means in the middle
		if(header_vm == "1") { // content to be in middle
			if(jQuery(".um_header_right").length) {
				var logoAreaH = jQuery('.header-logo-ra-container').outerHeight(true);
				var minuH = windowH - (logoAreaH * 2);

				if(windowH > headerH) {
					jQuery('.header_bg_container').css({'height':(jQuery(window).height())+'px'});
					jQuery('.ultimax-full-height').css({'height':(jQuery(window).height())+'px'});
					jQuery('.extra_within_header').css({'height':minuH+'px'});
					jQuery('.ultimax-full-height .ultimax-fullwidth').addClass('fh-valign');
				}
			} else {
				if(jQuery(".header-container").length) {
					logoAreaH = jQuery('.header-container').outerHeight(true);
				}
				if(jQuery(".nav-container").length) {
					logoAreaH += jQuery('.nav-container').outerHeight(true);
				}
				if(windowH > headerH) {
					jQuery('.ultimax-full-height').css({'height':(jQuery(window).height())+'px'});
					jQuery('.header_bg_container').css({'height':windowH+'px'});
					jQuery('.header_vm').addClass('fh-valign');
				}
			}

		}

		else if(header_vm == "2") { // content set to bottom
			if(jQuery(".um_header_right").length) {

				var logoAreaH = jQuery('.header-logo-ra-container').outerHeight(true);
				var minuH = windowH - logoAreaH;

				if(windowH > headerH) {
					jQuery('.ultimax-full-height').css({'height':(jQuery(window).height())+'px'});
					jQuery('.extra_within_header').css({'height':minuH+'px'});
					jQuery('.ultimax-full-height .ultimax-fullwidth').addClass('fh-valign-bottom');
				}
			} else {
				//alert('not right header');
				if(jQuery(".header-container").length) {
					logoAreaH = jQuery('.header-container').outerHeight(true);
				}
				if(jQuery(".nav-container").length) {
					logoAreaH += jQuery('.nav-container').outerHeight(true);
				}
				var minuH = windowH - logoAreaH;

				if(windowH > headerH) {
					jQuery('.ultimax-full-height').css({'height':(jQuery(window).height())+'px'});
					jQuery('.extra_within_header').css({'height':minuH+'px'});
					jQuery('.ultimax-full-height .ultimax-fullwidth').addClass('fh-valign-bottom');
				}

			}
		} else {
			// content should be in normal position - not middle not bottom
			if(jQuery(".header-container").length) {
				logoAreaH = jQuery('.header-container').outerHeight(true);
			}
			if(jQuery(".nav-container").length) {
				logoAreaH += jQuery('.nav-container').outerHeight(true);
			}
			var minuH = windowH - (logoAreaH * 2);

			if(windowH > headerH) {
				jQuery('.ultimax-full-height').css({'height':(jQuery(window).height())+'px'});
				jQuery('.extra_within_header').css({'height':minuH+'px'});
				jQuery('.header_bg_container').css({'height':windowH+'px'});
			}
		}
	}

});

jQuery(window).smartresize(function(){

	// Full Height Headers
	if(jQuery(".ultimax-full-height").length) {

		var header_vm = "";

		if (jQuery(this).data("header_vm") !== "") {
			header_vm = jQuery('.ultimax-full-height').data("header_vm");
		}

		var windowH = jQuery(window).height();
		var headerH = jQuery('.ultimax-full-height').height();

		// header_vm=1 means in the middle
		if(header_vm == "1") { // content to be in middle
			if(jQuery(".um_header_right").length) {
				var logoAreaH = jQuery('.header-logo-ra-container').outerHeight(true);
				var minuH = windowH - (logoAreaH * 2);

				if(windowH > headerH) {
					jQuery('.ultimax-full-height').css({'height':(jQuery(window).height())+'px'});
					jQuery('.extra_within_header').css({'height':minuH+'px'});
					jQuery('.ultimax-full-height .ultimax-fullwidth').addClass('fh-valign');
				}
			} else {
				if(jQuery(".header-container").length) {
					logoAreaH = jQuery('.header-container').outerHeight(true);
				}
				if(jQuery(".nav-container").length) {
					logoAreaH += jQuery('.nav-container').outerHeight(true);
				}
				if(windowH > headerH) {
					jQuery('.ultimax-full-height').css({'height':(jQuery(window).height())+'px'});
					jQuery('.header_bg_container').css({'height':windowH+'px'});
					jQuery('.header_vm').addClass('fh-valign');
				}  else {
					jQuery('.ultimax-full-height').css('height', ''); // reset inline height first
					jQuery('.header_bg_container').css('height', '');
					jQuery('.header_vm').removeClass('fh-valign');
				}
			}
		}

		else if(header_vm == "2") { // content set to bottom
			if(jQuery(".um_header_right").length) {
				var logoAreaH = jQuery('.header-logo-ra-container').outerHeight(true);
				var minuH = windowH - logoAreaH;
				if(windowH >= headerH) {
					jQuery('.ultimax-full-height').css({'height':(jQuery(window).height())+'px'});
					jQuery('.extra_within_header').css({'height':minuH+'px'});
					jQuery('.ultimax-full-height .ultimax-fullwidth').addClass('fh-valign-bottom');

				} else {
					jQuery('.ultimax-full-height').css('height', ''); // reset inline height first
					jQuery('.header_bg_container').css('height', '');
					jQuery('.ultimax-full-height .ultimax-fullwidth').removeClass('fh-valign-bottom');
				}
			} else {
				if(jQuery(".header-container").length) {
					logoAreaH = jQuery('.header-container').outerHeight(true);
				}
				if(jQuery(".nav-container").length) {
					logoAreaH += jQuery('.nav-container').outerHeight(true);
				}
				var minuH = windowH - logoAreaH;

				if(windowH > headerH) {
					jQuery('.ultimax-full-height').css({'height':(jQuery(window).height())+'px'});
					jQuery('.extra_within_header').css({'height':minuH+'px'});
					jQuery('.ultimax-full-height .ultimax-fullwidth').addClass('fh-valign-bottom');
				} else {
					jQuery('.ultimax-full-height').css('height', ''); // reset inline height first
					jQuery('.header_bg_container').css('height', 'auto');
					jQuery('.header_vm').removeClass('fh-valign');
				}

			}
		} else {
			// content should be in normal position - not middle not bottom
			if(jQuery(".header-container").length) {
				logoAreaH = jQuery('.header-container').outerHeight(true);
			}
			if(jQuery(".nav-container").length) {
				logoAreaH += jQuery('.nav-container').outerHeight(true);
			}
			var minuH = windowH - (logoAreaH * 2);

			if(windowH > headerH) {
				jQuery('.ultimax-full-height').css({'height':(jQuery(window).height())+'px'});
				jQuery('.extra_within_header').css({'height':minuH+'px'});
			}
		}
	}

	// Adjust Right Area of Main Menu Navigation
	if (jQuery(".nav-right-holder").length) {
		if(((jQuery('.nav-right-holder').width() + 15) + jQuery('.nav-holder').width()) >= jQuery('#mn-contaner').width()) {
			jQuery('.nav-right-holder').hide();
		} else {
			jQuery('.nav-right-holder').fadeIn();
		}
	}

    if(jQuery(".xactive").is(":visible"))
    {
        jQuery(this).toggleClass("xactive");
    }
	stellar_check();

	// Toggle fix for fixing height
	if (jQuery(".toggle").length) {
		jQuery('.toggle').each(function() {
			var $this = jQuery(this);
			var height = $this.parent().css("height");
			$this.parent().css("height", '');
		});
	}
	ultimax_video_bg();

});

function ultimax_video_bg() {

	/*
	* Page Background Video
	*/
    if (jQuery(".alona-video-container").length) {
		bgcontaier_height = jQuery('.header_bg_container').height();
		jQuery('.alona-video-container').css("height", bgcontaier_height);
	}

    // Initiate Video Background
    if (jQuery(".alona-video-bg").length) {
		jQuery(".alona-video-bg").coverVid(1920, 1080);
	}
}
/*
* On Window Load / Resize the Browser
*/
jQuery(window).on("load resize",function(e){

	stellar_check();

	if (jQuery(window).width() <= 820) {
		jQuery('.stickyheader').hide();
        jQuery('.nav-holder').show();
	}

	/*
	* Featured Image Auto Resizing
	*/
	
	if (jQuery("#fi-container").length) {

		var container = jQuery("#fi-container");
		var theimage = jQuery("#theimage");

		var fi_div_height_ = fi_div_height;


		if(container.height() < fi_div_height_)
			container.height(fi_div_height_);
		else
		if(theimage.height() < container.height())
			container.height(theimage.height());
		//else
			//container.height(fi_div_height_.height());

	}



	// Apply Classes to Main Menu Navigation upon Resize
	if(navwidth >= jQuery('.nav-holder').parent().width()) {

		if (jQuery(window).width() > 780) {
			jQuery('.mnav-container').addClass('alignright');
		} else {
			jQuery('.mnav-container').removeClass('alignright');
		}

		jQuery('.nav-holder').addClass('floatleftnotimportant');
		jQuery('.nav-holder').addClass('widthnotImportant');

		jQuery('.mnav-right-area').removeClass('alignright');

		jQuery('.mnav-holder').addClass('show_main_menu');

		jQuery('.mnav-subicon').addClass('disblocknotImportant');
		jQuery('.um-menu').addClass('widthnotImportant');
		jQuery('.um-menu').addClass('disnonenotImportant');
		jQuery('.um-menu.xactive').addClass('disblocknotImportant');
		jQuery('.um-menu li').addClass('widthnotImportant');
		jQuery('.um-menu li').addClass('disblocknotImportant');
		jQuery('.um-menu li').addClass('floatnone');
		jQuery('.um-menu li a').addClass('floatnonenotImportant');
		jQuery('.um-menu ul').addClass('posstaticnotImportant');
		jQuery('.um-menu ul').addClass('disnonenotImportant');
		jQuery('.mnavdrop ul').addClass('disblocknotImportant');
		jQuery('.mnavdrop ul ul').addClass('disnonenotImportant');
		jQuery('.mnavdrop .mnavdrop ul').addClass('disblocknotImportant');
	} else {

		/* State When Browser is resize and menu becomes to original state */

		jQuery('.search_icon').show();
		jQuery('.um-menu ul').css('min-width', 'inherit');
		jQuery('.um-menu li').removeClass('floatnone');
		jQuery('.um-menu li').removeClass('mnavdrop');
		jQuery('ul.sub-menu').removeClass('disblocknotImportant');
		jQuery('.nav-holder').removeClass('widthnotImportant');

		jQuery('.mnav-holder').removeClass('show_main_menu');
		jQuery('.mnav-right-area').addClass('alignright');

		jQuery('.nav-holder').removeClass('floatleftnotimportant');
		jQuery('.nav-holder').removeClass('distablenotImportant');
		jQuery('.mnav-subicon').removeClass('disblocknotImportant');
		jQuery('.sub-menu ul').addClass('disnonenotImportant');
		jQuery('.sub-menu ul').removeClass('disblocknotImportant');
		jQuery('.sub-menu ul').removeClass('floatnone');
		jQuery('.um-menu').removeClass('widthnotImportant');
		jQuery('.um-menu').removeClass('disnonenotImportant');
		jQuery('.um-menu.xactive').removeClass('disblocknotImportant');
		jQuery('.um-menu li').removeClass('widthnotImportant');
		jQuery('.um-menu li').removeClass('disblocknotImportant');
		jQuery('.um-menu li a').removeClass('floatnonenotImportant');
		jQuery('.um-menu ul').removeClass('posstaticnotImportant');
		jQuery('.um-menu ul').removeClass('disnonenotImportant');
		jQuery('.mnavdrop ul').removeClass('disblocknotImportant');
		jQuery('.mnavdrop ul li').removeClass('disblocknotImportant');
		jQuery('.mnavdrop ul ul').removeClass('disnonenotImportant');

	}
});

jQuery(window).on('resize', function(){

});

/*
* Circle Pie Charts Function
*/
function initEasyPieCharts() {
    //Check if this class exists, then run the code
    if (jQuery(".alona-piechart").length) {
        // find all instances
        jQuery(".alona-piechart").each(function() {
          jQuery('.alona-piechart').waypoint(function() {
            // Initiliaze default values
            var trackcolor = "#efefef";
            var fillcolor = "#888888";
            var linewidth = 10;
            var circlesize = 180;
            var animationspeed = 1400;
            var mystyle = "round";
            var showscale = false;

            if (jQuery(this).data("trackcolor") !== "") {
                trackcolor = jQuery(this).data("trackcolor")
            }
            if (jQuery(this).data("fillcolor") !== "") {
                fillcolor = jQuery(this).data("fillcolor")
            }
            if (jQuery(this).data("linewidth") !== "") {
                lwidth = jQuery(this).data("linewidth")
            }
            if (jQuery(this).data("showscale") !== "") {
                showscale = jQuery(this).data("showscale")
            }
            if (jQuery(this).data("size") !== "") {
                circlesize = jQuery(this).data("size")
            }
            jQuery(this).easyPieChart({
                barColor: fillcolor,
                trackColor: trackcolor,
                scaleColor: showscale,
                lineCap: mystyle,
                lineWidth: lwidth,
                animate: animationspeed,
                size: circlesize
            })

            return false;
         }, { triggerOnce: true, offset: 'bottom-in-view' })
        })
    }
}

/*
* Progress Bar Function
*/
function initProgressBars() {
    //Check if this class exists, then run the code
    if (jQuery(".meter").length) {
        // find all instances
        jQuery(".meter > span").each(function() {
          jQuery(this).waypoint(function() {

			var parentWidth = jQuery(this).offsetParent().width();
			var percent = jQuery(this).data("width");
			var childwidth = (percent / 100) * parentWidth;

			jQuery(this)
				.animate({width: childwidth}, 900, 'swing', function(){
					jQuery(this).css("width", percent+"%");

				});

            return false;
         }, { triggerOnce: true, offset: 'bottom-in-view' })
        })
    }
}

/*
* Init Ultimax Sliders
*/
function initUltimaxSliders() {
    if (jQuery(".ultimax-slider").length) {

		var elems = jQuery(".ultimax-slider"), count = elems.length;
		//alert(count);

		elems.each( function(i) {

			var myid = jQuery(this).data("id");
			var _margin = 10;
			var _visible_slides = 5;
			var	_autoplay = false;
			var _autoplayhoverpause = false;
			var _navigation = false;
			var _bullets = false;
			var _responsive = '1';
			var _loop = true;
			var _autoheight = false;
			var _animatein = 'slideInRight';
			var _animateout = 'slideOutLeft';


            if (jQuery(this).data("margin") != "") {
                _margin = jQuery(this).data("margin")
            }

            if (jQuery(this).data("visible-slides") != "") {
                _visible_slides = jQuery(this).data("visible-slides")
            }

			if (jQuery(this).data("responsive") != "") {
                _responsive = jQuery(this).data("responsive")
            }

			if (jQuery(this).data("loop") != "") {
                _loop = false;
            }

            if (jQuery(this).data("autoplay") != "") {
                _autoplay = jQuery(this).data("autoplay")
            }

            if (jQuery(this).data("autoplayhoverpause") != "") {
                _autoplayhoverpause = jQuery(this).data("autoplayhoverpause")
            }

            if (jQuery(this).data("navigation") != "") {
                _navigation = jQuery(this).data("navigation")
            }

            if (jQuery(this).data("bullets") != "") {
                _bullets = jQuery(this).data("bullets")
            }

            if (jQuery(this).data("animatein") != "") {
                _animatein = jQuery(this).data("animatein")
            }

            if (jQuery(this).data("animateout") !== "") {
                _animateout = jQuery(this).data("animateout")
            }

            if (jQuery(this).data("autoheight") !== "") {
                _autoheight = jQuery(this).data("autoheight")
            }

			// check if slides are less than total for 600 pixels resolution
			var six_hundred = 3;
			if(_visible_slides < six_hundred) {
				six_hundred = _visible_slides;
			}

			var four_hundred = 2;
			if(_visible_slides < four_hundred) {
				four_hundred = _visible_slides;
			}

			// Make Responsive Array if slider are greater than 1
			var responsive_array = { 0: { items:1 }, 400:{ items:four_hundred }, 600:{ items:six_hundred }, 1000:{ items:_visible_slides} };
			if(jQuery(this).data("responsive") == 'no') {
				var responsive_array = false;
			}

			var $owl = jQuery('#ultimax-slider-'+myid+'');
			$owl.show(function() {
				jQuery('#ultimax-slider-'+myid+'').owlCarousel({
				  items:_visible_slides,
				  autoplay:_autoplay,
				  autoplayHoverPause:_autoplayhoverpause,
				  nav:_navigation,
				  dots:_bullets,
				  margin:_margin,
				  animateIn:_animatein,
				  animateOut:_animateout,
				  autoHeight:_autoheight,
				  loop:_loop,
				  dotsClass:'owl-dots',
				  responsive:responsive_array
				});
			});
			jQuery('.item').addClass('disblocknotImportant');

		})
    }
}

/*
* Drops Effect Function
*/
function ultimax_raindrops() {
    if (jQuery(".um_rain").length) {

        jQuery(".um_rain").each(function() {
			var bgcolor = jQuery(this).data("bgcolor");
			var frequency = jQuery(this).data("frequency");
			var myid = jQuery(this).data("id");

			jQuery('#um_raindrops'+myid+'').raindrops(
				{color:bgcolor,
				density: 0.1,
				frequency: frequency,
				waveLength: 100,
				canvasHeight:100,
				density: 0.04
			});
        })
    }
}
/*
* Check Sticky Sidebar
*/
function check_sticky_sidebar() {
    if (jQuery("#stickyheader").length) {
		if (jQuery(this).data("sticky-sidebar") !== "") {
			enable_sticky_sidebar = "1";
		}
		if(enable_sticky_sidebar == "1") {
			// Remove sticknes on responsive
			if (jQuery(window).width() >= 799) {
				// Setting offset
				if(jQuery("#stickyheader").length == 0) {
				  sidebar_offset = 30;
				} else {
					sidebar_offset = jQuery('.stickyheader').height();
				}
				// Enable Sticky Sidebar

				jQuery("#sidebar").stick_in_parent(
					{ offset_top: window.sidebar_offset, recalc_every: 1}
				);
			} else {
				jQuery("#sidebar").trigger("sticky_kit:detach");
			}
		}
	}
}

/*
* Counter Boxes Function
*/

function initCounterBoxes() {
    //Check if this class exists, then run the code
    if (jQuery(".counter-wrapper").length) {
        jQuery(".counter-wrapper").each(function() {
          jQuery(this).waypoint(function() {

			var direction = jQuery(this).data("direction");
			var countvalue = jQuery(this).data("value");
			var countvalue_down = jQuery(this).data("value-down");

			if(direction == "up")
				jQuery(this).find('.counter-value').animateNumber({ number: countvalue }, 2500);
			else
			if(direction == "down")
				jQuery(this).find('.counter-value').prop('number', countvalue).animateNumber({ number: 0, numberStep: function(now, tween) { var target = jQuery(tween.elem), rounded_now = Math.round(now); target.text(now === tween.end ? countvalue_down : rounded_now); }}, 2500, 'linear');

            return false;
         }, { triggerOnce: true, offset: 'bottom-in-view' })
        })
    }
}

/*
* Smooth Scroll Function
* Credit:  http://blog.bassta.bg/2013/05/smooth-page-scrolling-with-tweenmax/

var scrollTime = 0.6;			//Scroll time
var scrollDistance = 300;		//Distance. Use smaller value for shorter scroll and greater value for longer scroll
mobile_ie = -1 !== navigator.userAgent.indexOf("IEMobile");
if (!jQuery('html').hasClass('touch') && !mobile_ie) {
    $window.on("mousewheel DOMMouseScroll", function (event) {
        event.preventDefault();
        var delta = event.originalEvent.wheelDelta/120 || -event.originalEvent.detail/3;
        var scrollTop = $window.scrollTop();
        var finalScroll = scrollTop - parseInt(delta*scrollDistance);
        TweenLite.to($window, scrollTime, {
            scrollTo: {
                y: finalScroll, autoKill: !0
            },
            ease: Power1.easeOut, //For more easing functions see http://api.greensock.com/js/com/greensock/easing/package-detail.html
            autoKill: !0,
            overwrite: 5
        });
    });
}
*/
/*
* Background Parallax - Deactivate on Smaller Screens
* Check Stellar and fix the scrolling on smaller screens
*/
var stellarActivated = false;
function stellar_check() {
    if (jQuery(window).width() <= 624) {
        if (stellarActivated == true) {
            jQuery(window).data('plugin_stellar').destroy();
            stellarActivated = false;
        }
    } else {
        if (stellarActivated == false) {
            jQuery.stellar({
               horizontalScrolling: false
           });

            jQuery(window).data('plugin_stellar').init();
            stellarActivated = true;
        }
    }
}

/*
* Function to check for Fixed Footer, add class and adjust margins
*/
function FixedFooter() {
    //Check if this class exists, then run the code
    if (jQuery(".footer_reveal").length) {
		// Calculate footer height
		var footer_height = jQuery(".ultimax-footer").outerHeight();
		jQuery(".ultimax-wrapper").css('margin-bottom', footer_height+'px');
    } else
    if (jQuery(".footer_sticky").length) {
		// Calculate footer height
		var footer_height = jQuery(".ultimax-footer").outerHeight();
		jQuery(".ultimax-wrapper").css('margin-bottom', footer_height+'px');
    }
}

// Things on scroll
jQuery(window).scroll(function() {
    var windscroll = jQuery(window).scrollTop();
    if (windscroll >= 100) {
        jQuery('nav').addClass('fixed');
        jQuery('.wrapper section').each(function(i) {
            if (jQuery(this).position().top <= windscroll - 20) {
                jQuery('nav a.active').removeClass('active');
                jQuery('nav a').eq(i).addClass('active');
            }
        });
    } else {
        jQuery('nav').removeClass('fixed');
        jQuery('nav a.active').removeClass('active');
        jQuery('nav a:first').addClass('active');
    }
}).scroll();

function UltimaxPortfolio() {
     // Ultimax Portfolio
	 if (jQuery(".umax-grid").length) {
		var gridID = 1;
		jQuery(".umax-grid").each(function() {

			jQuery(this).css("visibility", "visible");
			var _open_type = '';

			if (jQuery(this).data("opentype") !== "") {
				_open_type = jQuery(this).data("opentype");
			}
			if (jQuery(this).data("gridid") !== "") {
				gridID = jQuery(this).data("gridid")
			}

			if(_open_type == "inline")
				PortfolioInline(gridID);
			else
			if(_open_type == "popup")
				PortfolioPopup(gridID);
			else
				PortfolioInline(gridID);

			gridID++;
		})
	}
}

function PortfolioInline(gridID) {
		var _columns = 4;
		var _space = 20;
		var _caption = 'pushTop';
		var grid_id = '#umax-gridid'+gridID;

		//alert(grid_id);
		if (jQuery(grid_id).data("caption") !== "") {
			_caption = jQuery(grid_id).data("caption")
		}
		if (jQuery(grid_id).data("columns") !== "") {
			_columns = jQuery(grid_id).data("columns")
		}
		if (jQuery(grid_id).data("space") !== "") {
			_space = jQuery(grid_id).data("space")
		}
		jQuery(grid_id).cubeportfolio({
			filters: '#js-filters-juicy-projects'+gridID,
			layoutMode: 'grid',
			defaultFilter: '*',
			animationType: 'quicksand',
			gapHorizontal: _space,
			gapVertical: _space,
			gridAdjustment: 'responsive',
			mediaQueries: [{
				width: 1100,
				cols: _columns
			}, {
				width: 800,
				cols: _columns
			}, {
				width: 700,
				cols: 3
			}, {
				width: 480,
				cols: 2
			}, {
				width: 320,
				cols: 1
			}],
			caption: _caption,
			displayType: 'sequentially',
			displayTypeSpeed: 80,

			// lightbox
			lightboxDelegate: '.cbp-lightbox',
			lightboxGallery: true,
			lightboxTitleSrc: 'data-title',
			lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',

		    // singlePageInline
			singlePageInlineDelegate: '.cbp-singlePageInline',
			singlePageInlinePosition: 'below',
			singlePageInlineInFocus: true,
			singlePageInlineCallback: function(url, element) {
				// to update singlePageInline content use the following method: this.updateSinglePageInline(yourContent)
				var t = this;

				post_id = jQuery(this).attr("data-post_id")
				nonce = jQuery(this).attr("data-nonce")
				
				jQuery.ajax({
						url: url,
						timeout: 10000,
						type: 'post',
						dataType: 'html',
						data : {action: "bravio_portfolio_remote", post_id : post_id, nonce: nonce}
					})					
					.done(function(result) {
						t.updateSinglePageInline(result);
					})
					.fail(function() {
						t.updateSinglePageInline('AJAX Error! Please refresh the page!');
					});
			},
		});
}

function PortfolioPopup(gridID) {
	var _columns = 4;
	var _space = 20;
	var _caption = 'pushTop';
	var _singlePageAnimation = 'left';
	var grid_id = '#umax-gridid'+gridID;
	//alert('popup: '+grid_id);
	if (jQuery(grid_id).data("caption") !== "") {
		_caption = jQuery(grid_id).data("caption")
	}
	if (jQuery(grid_id).data("columns") !== "") {
		_columns = jQuery(grid_id).data("columns")
	}
	if (jQuery(grid_id).data("space") !== "") {
		_space = jQuery(grid_id).data("space")
	}

	if (jQuery(grid_id).data("popupeffect") !== "") {
		_singlePageAnimation = jQuery(grid_id).data("popupeffect")
	}

	jQuery(grid_id).cubeportfolio({

		filters: '#js-filters-juicy-projects'+gridID,
		layoutMode: 'grid',
		defaultFilter: '*',
		animationType: 'quicksand',
		gapHorizontal: _space,
		gapVertical: _space,
		gridAdjustment: 'responsive',
		mediaQueries: [{
			width: 1100,
			cols: _columns
		}, {
			width: 800,
			cols: _columns
		}, {
			width: 700,
			cols: 3
		}, {
			width: 480,
			cols: 2
		}, {
			width: 320,
			cols: 1
		}],
		caption: _caption,
		displayType: 'sequentially',
		displayTypeSpeed: 80,

		// lightbox
		lightboxDelegate: '.cbp-lightbox',
		lightboxGallery: true,
		lightboxTitleSrc: 'data-title',
		lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',

		// singlePage popup
		singlePageDelegate: '.cbp-singlePage',
		singlePageDeeplinking: true,
		singlePageAnimation: _singlePageAnimation,
		singlePageStickyNavigation: true,
		singlePageCounter: '<div class="cbp-popup-singlePage-counter">{{current}} of {{total}}</div>',
		singlePageCallback: function(url, element) {
			// to update singlePage content use the following method: this.updateSinglePage(yourContent)
			var t = this;
			
			post_id = jQuery(this).attr("data-post_id")
			nonce = jQuery(this).attr("data-nonce")

			jQuery.ajax({
					url: url,
					timeout: 10000,
					type: 'post',
					dataType: 'html',
					data : {action: "bravio_portfolio_popup", post_id : post_id, nonce: nonce}
				})					
				.done(function(result) {
					t.updateSinglePage(result);
				})
				.fail(function() {
					t.updateSinglePage('AJAX Error! Please refresh the page!');
				});
		},

	});
}

// window Resizing Funtions
window.onresize = AllResiziingFunction;
function AllResiziingFunction() {
	jQuery('.equalheights').matchHeight();
	if(jQuery('.um-menu').hasClass("xactive")) {
		jQuery('.um-menu').toggleClass("xactive");
	}
	FixedFooter();
}
var handler = window.onresize;
handler.apply(window, [' On']);