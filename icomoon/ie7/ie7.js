/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-arrow-up2': '&#xea3a;',
		'icon-search': '&#xe986;',
		'icon-cart': '&#xe93a;',
		'icon-home2': '&#xe901;',
		'icon-circle-up': '&#xea41;',
		'icon-heart': '&#xe9da;',
		'icon-share2': '&#xea82;',
		'icon-phone-hang-up': '&#xe943;',
		'icon-location2': '&#xe948;',
		'icon-connection': '&#xe91b;',
		'icon-book': '&#xe91f;',
		'icon-history': '&#xe94d;',
		'icon-display': '&#xe956;',
		'icon-glass': '&#xe9a0;',
		'icon-man-woman': '&#xe9de;',
		'icon-cross': '&#xea0f;',
		'icon-checkmark': '&#xea10;',
		'icon-bubble': '&#xe96b;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
