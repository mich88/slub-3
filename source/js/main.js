(function () {
    if ( typeof NodeList.prototype.forEach === "function" ) return false;
    NodeList.prototype.forEach = Array.prototype.forEach;
})();

function scrollIt(destination, duration = 200, easing = 'linear', callback) {

  const easings = {
    easeOutQuad(t) {
      return t * (2 - t);
    }
  };

  const start = window.pageYOffset;
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

  const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
  const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

  if ('requestAnimationFrame' in window === false) {
    window.scroll(0, destinationOffsetToScroll);
    if (callback) {
      callback();
    }
    return;
  }

  function scroll() {
    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, ((now - startTime) / duration));
    const timeFunction = easings[easing](time);
    window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

    if (window.pageYOffset === destinationOffsetToScroll) {
      if (callback) {
        callback();
      }
      return;
    }

    requestAnimationFrame(scroll);
  }

  scroll();
}

function elementInViewport(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top < (window.pageYOffset + window.innerHeight) &&
    left < (window.pageXOffset + window.innerWidth) &&
    (top + height) > window.pageYOffset &&
    (left + width) > window.pageXOffset
  );
} 

function counter() {
	var daysEl = document.getElementById('days');
	var hoursEl = document.getElementById('hours');
	var minsEl = document.getElementById('mins');
	var secsEl = document.getElementById('secs');
	var counterNumEl = document.querySelector('.counter');
	var heroTxtEl = document.querySelector('.hero__txt');
	var heroTxt = heroTxtEl.childNodes[0];

	var weddingTime = new Date(2017, 6, 29, 14, 30, 0);

	var secs = 1000; 
	var mins = secs * 60;
	var hours = mins * 60;
	var days = hours * 24;

	function countDiffTime(weddingTime, nowTime) {
		var diffTime = {
			value: weddingTime - nowTime
		};

		if (diffTime.value >= 0) {
			diffTime = {
				type: 1
			};
		} else {
			diffTime = {
				value: nowTime - weddingTime,
				type: 0
			};
		}

		return diffTime;
	}

	function countDiff(diffTime, time, el) {
	  	var timeLeft = Math.floor(diffTime / time);
	  	if(el == document.getElementById('days')) {
		  	el.innerHTML = timeLeft;
	  	} else {
		  	el.innerHTML = ('0' + timeLeft).slice(-2);
	  	}
	  	diffTime -= (timeLeft * time);
	  	return diffTime;
	}

	var nowTime = new Date();
	var diffTime = countDiffTime(weddingTime, nowTime);

	if (diffTime.value <= 86400000 && diffTime.type == 1 || diffTime.type == 0) {
		counterNumEl.classList.add('counter__new');
	}

	if (diffTime.type == 0) {
		heroTxt.nodeValue = `NASZEGO MAŁŻEŃSTWA`;
	}

	setInterval(function() {
	  	var nowTime = new Date();
		var diffTime = countDiffTime(weddingTime, nowTime);
		diffTime = diffTime.value;
	  
	  	diffTime = countDiff(diffTime, days, daysEl);
	  	diffTime = countDiff(diffTime, hours, hoursEl);
	  	diffTime = countDiff(diffTime, mins, minsEl);
	  	diffTime = countDiff(diffTime, secs, secsEl);
	}, 1000);
}

function parallax() {
	var bgEls = document.querySelectorAll('.bg');
	bgEls.forEach(el => {
		if(elementInViewport(el)) {
			var scrolltop = el.getBoundingClientRect().top;
			el.style.top = - scrolltop * 0.1 + 'px';
		}
	});
}

var lastScrollTop = [];

function navScroll() {
	var navEl = document.querySelector('nav');
	var st = window.pageYOffset || document.documentElement.scrollTop;

	if (st > 0) {
		navEl.classList.add('sticky');
		if (st >= lastScrollTop[10]) {
		    navEl.classList.remove('show');
		} else {
		    navEl.classList.add('show');
		}
	} else {
		navEl.classList.remove('sticky');
	    navEl.classList.remove('show');
	}

	for (var i = 10; i > 0; i--) {
		lastScrollTop[i] = lastScrollTop[i-1];
	} 

   	lastScrollTop[0] = st;
}

function scrollFunctions() {
	parallax();
	navScroll();
}

var callback = function(){
	// counter
	counter();

	// paralax and navscroll
	window.addEventListener('scroll', scrollFunctions);

	// animate scroll to sections
	var gotoEl = document.querySelectorAll('.goto');

	gotoEl.forEach(function(item){
		item.addEventListener('click', function(e) {
			var goto = e.target.getAttribute("href");
			scrollIt(document.querySelector(goto), 600, 'easeOutQuad');

			e.preventDefault();
		});
	});
};

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  callback();
} else {
  document.addEventListener("DOMContentLoaded", callback);
}
