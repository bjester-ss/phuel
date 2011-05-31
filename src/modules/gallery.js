/* 
 * Author: Blaine Jester
 * Image Gallery -- Adds to Phuel Class
 * Works with: Browser, HTML5, Titanium
 * Date: 12/16/10
 * Requires: jQuery, Phuel.Url, CSS & Image Files for Viewer
 */
(function(Phuel,$){

	var isN = Phuel.fn.isN;
	var json = Phuel.fn.json;
	var location = Phuel.fn.url;
	
	if(!Phuel.fn.locale.jquery) {
		return;
	}
	
	// Global variables, accessible to Slimbox only
	var win = $(window), options, images, activeImage = -1, activeURL, prevImage, nextImage, compatibleOverlay, middle, centerWidth, centerHeight,
		ie6 = !window.XMLHttpRequest, hiddenElements = [], documentElement = document.documentElement,

	// Preload images
	preload = {}, preloadPrev = new Image(), preloadNext = new Image(),

	// DOM elements
	overlay, center, image, sizer, prevLink, nextLink, bottomContainer, bottom, caption, number;
	
	var ready = false;
	/*
		Initialization
	*/
	var dce = document.createElement;

	function appendGalleryHTML() {
		// Append the Slimbox HTML code at the bottom of the document
		$("body").append(
			$([
				overlay = $(dce('div')).attr('id',"lbOverlay")[0],
				center = $(dce('div')).attr('id',"lbCenter")[0],
				bottomContainer = $(dce('div')).attr('id',"lbBottomContainer")[0]
			]).css("display", "none")
		);

		image = $(dce('div')).attr('id',"lbImage").appendTo(center).append(
			sizer = $(dce('div')).css({position:"relative"}).append([
				prevLink = $(dce('a')).attr({'id':"lbPrevLink","href":"#"}).click(previous)[0],
				nextLink = $(dce('a')).attr({'id':"lbNextLink","href":"#"}).click(next)[0]
			])[0]
		)[0];

		bottom = $(dce('div')).attr('id',"lbBottom").appendTo(bottomContainer).append([
			$(dce('a')).attr({'id':"lbCloseLink","href":"#"}).add(overlay).click(close)[0],
			caption = $(dce('div')).attr('id',"lbCaption")[0],
			number = $(dce('div')).attr('id',"lbNumber")[0],
			$(dce('div')).css({clear:"both"})[0]
		])[0];
		
		return true;
	}
	
	/*
		Internal functions
	*/

	function position() {
		var l = win.scrollLeft(), w = win.width();
		$([center, bottomContainer]).css("left", l + (w / 2));
		if (compatibleOverlay) $(overlay).css({left: l, top: win.scrollTop(), width: w, height: win.height()});
	}

	function setup(open) {
		if (open) {
			$("object").add(ie6 ? "select" : "embed").each(function(index, el) {
				hiddenElements[index] = [el, el.style.visibility];
				el.style.visibility = "hidden";
			});
		} else {
			$.each(hiddenElements, function(index, el) {
				el[0].style.visibility = el[1];
			});
			hiddenElements = [];
		}
		var fn = open ? "bind" : "unbind";
		win[fn]("scroll resize", position);
		$(document)[fn]("keydown", keyDown);
	}

	function keyDown(event) {
		var code = event.keyCode, fn = $.inArray;
		// Prevent default keyboard action (like navigating inside the page)
		return (fn(code, options.closeKeys) >= 0) ? close()
			: (fn(code, options.nextKeys) >= 0) ? next()
			: (fn(code, options.previousKeys) >= 0) ? previous()
			: false;
	}

	function previous() {
		return changeImage(prevImage);
	}

	function next(cb) {
		return changeImage(nextImage,cb);
	}

	function changeImage(imageIndex,cb) {
		if (imageIndex >= 0) {
			activeImage = imageIndex;
			activeURL = images[activeImage][0];
			prevImage = (activeImage || (options.loop ? images.length : 0)) - 1;
			nextImage = ((activeImage + 1) % images.length) || (options.loop ? 0 : -1);

			stop();
			center.className = "lbLoading";

			preload = new Image();
			preload.onload = function(){
				animateBox();
				(isN(cb) ? (function(){}) : cb)();
			};
			preload.src = activeURL;
		}

		return false;
	}

	function animateBox() {
		center.className = "";
		$(image).css({backgroundImage: "url(" + activeURL + ")", visibility: "hidden", display: ""});
		$(sizer).width(preload.width);
		$([sizer, prevLink, nextLink]).height(preload.height);

		$(caption).html(images[activeImage][1] || "");
		$(number).html((((images.length > 1) && options.counterText) || "").replace(/{x}/, activeImage + 1).replace(/{y}/, images.length));

		if (prevImage >= 0) preloadPrev.src = images[prevImage][0];
		if (nextImage >= 0) preloadNext.src = images[nextImage][0];

		centerWidth = image.offsetWidth;
		centerHeight = image.offsetHeight;
		var top = Math.max(0, middle - (centerHeight / 2));
		if (center.offsetHeight != centerHeight) {
			$(center).animate({height: centerHeight, top: top}, options.resizeDuration, options.resizeEasing);
		}
		if (center.offsetWidth != centerWidth) {
			$(center).animate({width: centerWidth, marginLeft: -centerWidth/2}, options.resizeDuration, options.resizeEasing);
		}
		$(center).queue(function() {
			$(bottomContainer).css({width: centerWidth, top: top + centerHeight, marginLeft: -centerWidth/2, visibility: "hidden", display: ""});
			$(image).css({display: "none", visibility: "", opacity: ""}).fadeIn(options.imageFadeDuration, animateCaption);
		});
	}

	function animateCaption() {
		if (prevImage >= 0) $(prevLink).show();
		if (nextImage >= 0) $(nextLink).show();
		$(bottom).css("marginTop", -bottom.offsetHeight).animate({marginTop: 0}, options.captionAnimationDuration);
		bottomContainer.style.visibility = "";
	}

	function stop() {
		preload.onload = null;
		preload.src = preloadPrev.src = preloadNext.src = activeURL;
		$([center, image, bottom]).stop(true);
		$([prevLink, nextLink, image, bottomContainer]).hide();
	}

	function close() {
		if (activeImage >= 0) {
			stop();
			activeImage = prevImage = nextImage = -1;
			$(center).hide();
			$(overlay).stop().fadeOut(options.overlayFadeDuration, setup);
		}

		return false;
	}
	
	function slideshow(dur) {
		window.setTimeout(function(){
			if(imageIndex >= 0) {
				next(function(){
					slideshow(dur);
				});
			}
		},dur);
	}
	
	// Open Slimbox with the specified parameters
	var slimbox = function(_images, startImage, _options) {
		options = $.extend({
			loop: false,				// Allows to navigate between first and last images
			overlayOpacity: 0.8,			// 1 is opaque, 0 is completely transparent (change the color in the CSS file)
			overlayFadeDuration: 400,		// Duration of the overlay fade-in and fade-out animations (in milliseconds)
			resizeDuration: 400,			// Duration of each of the box resize animations (in milliseconds)
			resizeEasing: "swing",			// "swing" is jQuery's default easing
			initialWidth: 250,			// Initial width of the box (in pixels)
			initialHeight: 250,			// Initial height of the box (in pixels)
			imageFadeDuration: 400,			// Duration of the image fade-in animation (in milliseconds)
			captionAnimationDuration: 400,		// Duration of the caption animation (in milliseconds)
			counterText: "Image {x} of {y}",	// Translate or change as you wish, or set it to false to disable counter text for image groups
			closeKeys: [27, 88, 67],		// Array of keycodes to close Slimbox, default: Esc (27), 'x' (88), 'c' (67)
			previousKeys: [37, 80],			// Array of keycodes to navigate to the previous image, default: Left arrow (37), 'p' (80)
			nextKeys: [39, 78]			// Array of keycodes to navigate to the next image, default: Right arrow (39), 'n' (78)
		}, _options);

		// The function is called for a single image, with URL and Title as first two arguments
		if (typeof _images == "string") {
			_images = [[_images, startImage]];
			startImage = 0;
		}

		middle = win.scrollTop() + (win.height() / 2);
		centerWidth = options.initialWidth;
		centerHeight = options.initialHeight;
		$(center).css({top: Math.max(0, middle - (centerHeight / 2)), width: centerWidth, height: centerHeight, marginLeft: -centerWidth/2}).show();
		compatibleOverlay = ie6 || (overlay.currentStyle && (overlay.currentStyle.position != "fixed"));
		if (compatibleOverlay) overlay.style.position = "absolute";
		$(overlay).css("opacity", options.overlayOpacity).fadeIn(options.overlayFadeDuration);
		position();
		setup(1);

		images = _images;
		options.loop = options.loop && (images.length > 1);
		return changeImage(startImage);
	};

	/*
		options:	Optional options object, see jQuery.slimbox()
		linkMapper:	Optional function taking a link DOM element and an index as arguments and returning an array containing 2 elements:
				the image URL and the image caption (may contain HTML)
		linksFilter:	Optional function taking a link DOM element and an index as arguments and returning true if the element is part of
				the image collection that will be shown on click, false if not. "this" refers to the element that was clicked.
				This function must always return true when the DOM element argument is "this".
	*/
	$.fn.extend({
		slimbox: function(_options, linkMapper, linksFilter) {
			linkMapper = linkMapper || function(el) {
				return [el.href, el.title];
			};
	
			linksFilter = linksFilter || function() {
				return true;
			};
	
			var links = this;
	
			return links.unbind("click").click(function() {
				// Build the list of images that will be displayed
				var link = this, startIndex = 0, filteredLinks, i = 0, length;
				filteredLinks = $.grep(links, function(el, i) {
					return linksFilter.call(link, el, i);
				});
	
				// We cannot use jQuery.map() because it flattens the returned array
				for (length = filteredLinks.length; i < length; ++i) {
					if (filteredLinks[i] == link) startIndex = i;
					filteredLinks[i] = linkMapper(filteredLinks[i], i);
				}
	
				return slimbox(filteredLinks, startIndex, _options);
			});
		}
	});
	
	var Gallery = function(nm) {
		return new Gallery.fn.__construct(nm);
	};
	
	Gallery.fn = Gallery.prototype = {
		__construct:function(N) {
			// {key:"",hold:true,type:"session",value:""}
			this.key = N.key;
			this.container = N.container;
		},
		key:"",
		container:"",
		open:function(A){
			close();
			A = (isN(A) ? 0 : A);
			$("a",this.container).eq(A).trigger("click");
		},
		close:function(A){
			close();
		},
		remove:function(){
			$("img",this.container).each(function(){
				var img = $(this);
				img.unwrap();
			});
		},
		slideshow:function(dur){
			this.open(0);
			dur = (isN(dur) ? 3000 : dur);
			slideshow(dur);
		},
		extend:function(A) {
			Phuel.fn.extend.call(this,A,true);
		},
		type:"gallery"
	};

	Gallery.fn.__construct.prototype = Gallery.fn;
	Gallery.extend = Gallery.fn.extend;
	
	Phuel.fn.extend({
		gallery:function(container,opts){
			if(!ready){
				ready = appendGalleryHTML();
			}
			var key = (new Date()).getTime();
			var imgs = $("img",container).each(function(){
				var img = $(this);
				var loc = location(img.attr("src"));
				var wrap = $(document.createElement('a')).attr({
					href:"http://"+loc.domain+opts.directory+loc.path.pop(),
					title:img.attr("title"),
					rel:"gallery-"+key
				});
				img.wrap(wrap);
			}).closest("a");
			
			imgs.slimbox(opts, null, function(el) {
				return (this == el) || ((this.rel.length > 8) && (this.rel == el.rel));
			});
			
			return Gallery({key:key,container:container});
		}
	});

})(Phuel,window['jQuery']);