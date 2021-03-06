/**
 * Biscuit
 * -------
 * A simple style-free cookie banner.
 * 
 * @author mattbit <me@mattbit.com>
 */
;(function () {
    'use strict';

    function Biscuit(options) {

        this.options = {
            cookie: 'biscuit',
            remember: 365,
            text: 'This website uses cookies to ensure you get the best experience.',
            link_text: 'More info',
            link: '/privacy',
            hideOnScroll: true
        };

        for (var attr in options) {
            this.options[attr] = options[attr];
        }

        this.event = {
            add: function(obj, type, fn) {
                if (obj.attachEvent) {
                    obj['e'+type+fn] = fn;
                    obj[type+fn] = function() { obj['e'+type+fn](window.event); };
                    obj.attachEvent('on'+type, obj[type+fn]);
                } else {
                    obj.addEventListener(type, fn, false);
                }
            },
            remove: function(obj, type, fn) {
                if (obj.detachEvent) {
                    obj.detachEvent('on'+type, obj[type+fn]);
                    obj[type+fn] = null;
                } else {
                    obj.removeEventListener(type, fn, false);
                }
            }
        };

        this.cookie = {
            create: function (name, value, days) {
                var expires;
                if (days) {
                    var date = new Date();
                    date.setTime(date.getTime()+(days*24*60*60*1000));
                    expires = "; expires="+date.toUTCString();
                }
                else { expires = ""; }
                document.cookie = name+"="+value+expires+"; path=/";
            },
            read: function (name) {
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for(var i=0;i < ca.length;i++) {
                    var c = ca[i];
                    while (c.charAt(0)===' ') { c = c.substring(1,c.length); }
                    if (c.indexOf(nameEQ) === 0) { return c.substring(nameEQ.length,c.length); }
                }
                return null;
            }
        };

        var cookie = this.cookie.read(this.options.cookie);
        var biscuit = this;

        this.event.add(document, 'DOMContentLoaded', function() {

                if (!cookie) {

                    biscuit.show();

                    biscuit.event.add(document.getElementById('cookie-banner-close'), 'click', function() {
                        biscuit.remove();
                    }, false);
                                        
                    if (biscuit.options.hideOnScroll) {
                        var initialScroll;

                        biscuit.event.add(window, 'scroll', function cookieScroll() {
                            
                            if (!initialScroll) {
                                initialScroll = window.scrollY;
                            }

                            if (window.scrollY > initialScroll + 200 || window.scrollY < initialScroll - 200) {
                                biscuit.remove(1000);
                                biscuit.event.remove(window, 'scroll', cookieScroll);
                            }
                        }, false);
                    }
                }
            }
        );
    }

    Biscuit.prototype.show = function() {
        var html = '<div id="cookie-banner"><div id="cookie-banner-container">' +
                   '<p>' + this.options.text + ' <a href="' + this.options.link + '">' + this.options.link_text + '</a>.</p>' +
                   '<button id="cookie-banner-close">&#x2715;</button>' +
                   '</div></div>';

        document.body.insertAdjacentHTML('afterbegin', html);

        var cookieBanner = document.getElementById('cookie-banner');
        cookieBanner.className = 'show';
    };

    Biscuit.prototype.remove = function(delay) {
        if (typeof delay === 'undefined') { delay = 0; }

        this.cookie.create(this.options.cookie, '1', this.options.remember);

        var cookieBanner = document.getElementById('cookie-banner');
        
        cookieBanner.className = '';
        setTimeout(function () {
                cookieBanner.remove();
        }, delay);
    };

    Biscuit.init = function(options) {
        return new Biscuit(options);
    };

    window.Biscuit = Biscuit;
})();
