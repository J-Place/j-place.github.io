(function($, window, undefined) {
    '$:nomunge';
    var str_hashchange = 'hashchange',
        doc = document,
        fake_onhashchange, special = $.event.special,
        doc_mode = doc.documentMode,
        supports_onhashchange = 'on' + str_hashchange in window && (doc_mode === undefined || doc_mode > 7);

    function get_fragment(url) {
        url = url || location.href;
        return '#' + url.replace(/^[^#]*#?(.*)$/, '$1');
    };
    $.fn[str_hashchange] = function(fn) {
        return fn ? this.bind(str_hashchange, fn) : this.trigger(str_hashchange);
    };
    $.fn[str_hashchange].delay = 50;
    special[str_hashchange] = $.extend(special[str_hashchange], {
        setup: function() {
            if (supports_onhashchange) {
                return false;
            }
            $(fake_onhashchange.start);
        },
        teardown: function() {
            if (supports_onhashchange) {
                return false;
            }
            $(fake_onhashchange.stop);
        }
    });
    fake_onhashchange = (function() {
        var self = {},
            timeout_id, last_hash = get_fragment(),
            fn_retval = function(val) {
                return val;
            },
            history_set = fn_retval,
            history_get = fn_retval;
        self.start = function() {
            timeout_id || poll();
        };
        self.stop = function() {
            timeout_id && clearTimeout(timeout_id);
            timeout_id = undefined;
        };

        function poll() {
            var hash = get_fragment(),
                history_hash = history_get(last_hash);
            if (hash !== last_hash) {
                history_set(last_hash = hash, history_hash);
                $(window).trigger(str_hashchange);
            } else if (history_hash !== last_hash) {
                location.href = location.href.replace(/#.*/, '') + history_hash;
            }
            timeout_id = setTimeout(poll, $.fn[str_hashchange].delay);
        };
        (document.documentMode != undefined) && !supports_onhashchange && (function() {
            var iframe, iframe_src;
            self.start = function() {
                if (!iframe) {
                    iframe_src = $.fn[str_hashchange].src;
                    iframe_src = iframe_src && iframe_src + get_fragment();
                    iframe = $('<iframe tabindex="-1" title="empty"/>').hide().one('load', function() {
                        iframe_src || history_set(get_fragment());
                        poll();
                    }).attr('src', iframe_src || 'javascript:0').insertAfter('body')[0].contentWindow;
                    doc.onpropertychange = function() {
                        try {
                            if (event.propertyName === 'title') {
                                iframe.document.title = doc.title;
                            }
                        } catch (e) {}
                    };
                }
            };
            self.stop = fn_retval;
            history_get = function() {
                return get_fragment(iframe.location.href);
            };
            history_set = function(hash, history_hash) {
                var iframe_doc = iframe.document,
                    domain = $.fn[str_hashchange].domain;
                if (hash !== history_hash) {
                    iframe_doc.title = doc.title;
                    iframe_doc.open();
                    domain && iframe_doc.write('<script>document.domain="' + domain + '"</script>');
                    iframe_doc.close();
                    iframe.location.hash = hash;
                }
            };
        })();
        return self;
    })();
})(jQuery, this);
(function(swim_AjaxBrowser, $, undefined) {
    var currentInt = 1;
    var cache = {};
    var initObject = null;
    swim_AjaxBrowser.ingredient = "Bacon Strips";
    swim_AjaxBrowser.GetObject = function() {
        alert("Must override this method");
    };
    swim_AjaxBrowser.Execute = function(obj) {
        alert("Must override this method");
    };
    swim_AjaxBrowser.ParseObj = function(obj) {
        return obj;
    };
    swim_AjaxBrowser.SetHash = function(obj) {
        location.hash = "#" + encodeURI(obj);
    };
    swim_AjaxBrowser.HtmlEncode = function(str) {
        str = str.replace(/%/g, "%25");
        str = str.replace(/\//g, "%2F");
        str = str.replace(/#/g, "%23");
        return str;
    }
    swim_AjaxBrowser.GetDecodeArray = function(str, splitCharacters) {
        var array = (str).split(splitCharacters);
        for (var i = 0; i < array.length; i++) {
            array[i] = decodeURIComponent(array[i]).replace(/%2F/g, "/");
        }
        return array;
    }
    swim_AjaxBrowser.GetRedirectUrlWithoutAnchor = function() {
        var hash = location.hash;
        var url = window.location.href;
        return url.replace(hash, '');
    };
    swim_AjaxBrowser.Init = function(getObject, execute, parseObj, getObjectCallback) {
        $(window).hashchange(function() {
            var obj = null;
            var hash = '';
            if (location.hash.length > 0) {
                hash = location.href.split("#")[1];
            }
            var key = hash.replace(/^#/, '');
            if (key == '') {
                obj = $.extend(true, {}, initObject);
                swim_AjaxBrowser.Execute(obj);
            } else {
                swim_AjaxBrowser.Execute(swim_AjaxBrowser.ParseObj(key));
            }
        });
        if (getObjectCallback) swim_AjaxBrowser.GetObject = getObjectCallback;
        else swim_AjaxBrowser.GetObject = getObject;
        swim_AjaxBrowser.Execute = execute;
        swim_AjaxBrowser.ParseObj = parseObj;
        if (getObjectCallback) {
            getObjectCallback(function(obj) {
                initObject = obj;
                $(window).trigger("hashchange");
            });
        } else {
            initObject = getObject();
            $(window).trigger("hashchange");
        }
    };
}(window.swim_AjaxBrowser = window.swim_AjaxBrowser || {}, jQuery));
jQuery.fn.onScrollBeyond = function(callback, options) {
    var domTargetElement = this;
    if (callback == 'disable') {
        jQuery(domTargetElement).data('onScrollBeyond-disabled', true);
        return;
    }
    if (callback == 'enable') {
        jQuery(domTargetElement).data('onScrollBeyond-disabled', false);
        return;
    }
    var settings = {
        'buffer': 20,
        'fireOnDocEnd': true,
        'fireOnBeyondElement': true
    };
    jQuery.extend(settings, options);
    jQuery(window).bind('scroll', function() {
        var fire = false;
        var jqTargetElement = jQuery(domTargetElement);
        if (jqTargetElement.data('onScrollBeyond-disabled') == true || (common && common.isDisableScroll())) {
            return;
        }
        if (settings.fireOnBeyondElement) {
            if (jQuery(document).scrollTop() > (jqTargetElement.position().top + jqTargetElement.height())) {
                fire = true;
            }
        }
        if (!fire && settings.fireOnDocEnd) {
            var amt_scrolled = jQuery(document).scrollTop() - jqTargetElement.position().top;
            if ((amt_scrolled + jqTargetElement.position().top + jQuery(window).height() + settings.buffer) > jQuery(document).height()) {
                fire = true;
            }
        }
        if (fire) {
            callback.call(this, domTargetElement);
        }
    });
    return this;
};
jQuery.fn.scrollExtend = function(options) {
    if (options == 'disable') {
        jQuery(this).data('scrollExtend-disabled', true);
        return;
    }
    if (options == 'enable') {
        jQuery(this).data('scrollExtend-disabled', false);
        return;
    }
    var settings = {
        'url': null,
        'beforeStart': null,
        'onSuccess': null,
        'target': null,
        'loadingIndicatorEnabled': true,
        'loadingIndicatorClass': 'scrollExtend-loading',
        'newElementClass': '',
        'ajaxSettings': {}
    };
    var url;
    var localAjaxSettings = {};
    var ajaxSettings = settings.ajaxSettings;
    jQuery.extend(settings, options);
    jQuery.extend(ajaxSettings, settings.ajaxSettings);
    jQuery(this).onScrollBeyond(function(container) {
        var jqContainerElem = jQuery(container);
        if (jqContainerElem.data('scrollExtend-disabled') != true && jqContainerElem.data('scrollExtendLoading') != true) {
            jqContainerElem.data('scrollExtendLoading', true);
            if (typeof(settings.beforeStart) == 'function') {
                var ret = settings.beforeStart.call(this, container);
                if (!ret) {
                    jqContainerElem.data('scrollExtendLoading', false);
                    return;
                }
            }
            if (jqContainerElem.data('scrollExtend-disabled') == true) {
                jqContainerElem.data('scrollExtendLoading', false);
                return;
            }
            if (typeof(settings.url) == 'function') {
                url = settings.url.call(this, container);
            } else {
                url = settings.url;
            }
            ajaxSettings.url = url;
            var target = (settings.target) ? settings.target : container;
            var new_elem = (container.is('table')) ? jQuery('<tbody/>') : jQuery('<div/>');
            if (settings.newElementClass != '') {
                jQuery(new_elem).addClass(settings.newElementClass);
            }
            if (settings.loadingIndicatorEnabled) {
                var jqLoadingElem = jQuery('<div></div>');
                jqLoadingElem.addClass(settings.loadingIndicatorClass);
                jqLoadingElem.appendTo(target);
            }
            localAjaxSettings = {
                'success': function(data, textStatus) {
                    var target = (settings.target) ? settings.target : container;
                    jQuery(new_elem).html(data);
                    jQuery(new_elem).appendTo(target);
                    if (typeof(settings.onSuccess) == 'function') {
                        settings.onSuccess.call(this, container, new_elem);
                    }
                    jQuery(container).data('scrollExtendLoading', false);
                    if (settings.loadingIndicatorEnabled) {
                        jqLoadingElem.remove();
                    }
                }
            }
            jQuery.extend(ajaxSettings, localAjaxSettings);
            jQuery.ajax(ajaxSettings);
        }
    }, settings);
    return this;
};
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(window.jQuery || window.$);
    }
}(function($) {
    var defaults = {
            className: 'autosizejs',
            append: '',
            callback: false,
            resizeDelay: 10
        },
        copy = '<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; padding: 0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden; transition:none; -webkit-transition:none; -moz-transition:none;"/>',
        typographyStyles = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent'],
        mirrored, mirror = $(copy).data('autosize', true)[0];
    mirror.style.lineHeight = '99px';
    if ($(mirror).css('lineHeight') === '99px') {
        typographyStyles.push('lineHeight');
    };
    mirror.style.lineHeight = '';
    $.fn.autosize = function(options) {
        if (!this.length) {
            return this;
        };
        options = $.extend({}, defaults, options || {});
        if (mirror.parentNode !== document.body) {
            $(document.body).append(mirror);
        };
        return this.each(function() {
            var ta = this,
                $ta = $(ta),
                maxHeight, minHeight, boxOffset = 0,
                callback = $.isFunction(options.callback),
                originalStyles = {
                    height: ta.style.height,
                    overflow: ta.style.overflow,
                    overflowY: ta.style.overflowY,
                    wordWrap: ta.style.wordWrap,
                    resize: ta.style.resize
                },
                timeout, width = $ta.width();
            if ($ta.data('autosize')) {
                return;
            };
            $ta.data('autosize', true);
            if ($ta.css('box-sizing') === 'border-box' || $ta.css('-moz-box-sizing') === 'border-box' || $ta.css('-webkit-box-sizing') === 'border-box') {
                boxOffset = $ta.outerHeight() - $ta.height();
            };
            minHeight = Math.max(parseInt($ta.css('minHeight'), 10) - boxOffset || 0, $ta.height());
            $ta.css({
                overflow: 'hidden',
                overflowY: 'hidden',
                wordWrap: 'break-word',
                resize: ($ta.css('resize') === 'none' || $ta.css('resize') === 'vertical') ? 'none' : 'horizontal'
            });

            function setWidth() {
                var style, width;
                if ('getComputedStyle' in window) {
                    style = window.getComputedStyle(ta);
                    width = ta.getBoundingClientRect().width;
                    $.each(['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'], function(i, val) {
                        width -= parseInt(style[val], 10);
                    });
                    mirror.style.width = width + 'px';
                } else {
                    mirror.style.width = Math.max($ta.width(), 0) + 'px';
                };
            };

            function initMirror() {
                var styles = {};
                mirrored = ta;
                mirror.className = options.className;
                maxHeight = parseInt($ta.css('maxHeight'), 10);
                $.each(typographyStyles, function(i, val) {
                    styles[val] = $ta.css(val);
                });
                $(mirror).css(styles);
                setWidth();
                if (window.chrome) {
                    var width = ta.style.width;
                    ta.style.width = '0px';
                    var ignore = ta.offsetWidth;
                    ta.style.width = width;
                }
            };

            function adjust() {
                var height, original;
                if (mirrored !== ta) {
                    initMirror();
                } else {
                    setWidth();
                };
                mirror.value = ta.value + options.append;
                mirror.style.overflowY = ta.style.overflowY;
                original = parseInt(ta.style.height, 10);
                mirror.scrollTop = 0;
                mirror.scrollTop = 9e4;
                height = mirror.scrollTop;
                if (maxHeight && height > maxHeight) {
                    ta.style.overflowY = 'scroll';
                    height = maxHeight;
                } else {
                    ta.style.overflowY = 'hidden';
                    if (height < minHeight) {
                        height = minHeight;
                    }
                };
                height += boxOffset;
                if (original !== height) {
                    ta.style.height = height + 'px';
                    if (callback) {
                        options.callback.call(ta, ta);
                    }
                }
            };

            function resize() {
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    var newWidth = $ta.width();
                    if (newWidth !== width) {
                        width = newWidth;
                        adjust();
                    }
                }, parseInt(options.resizeDelay, 10));
            };
            if ('onpropertychange' in ta) {
                if ('oninput' in ta) {
                    $ta.on('input.autosize keyup.autosize', adjust);
                } else {
                    $ta.on('propertychange.autosize', function() {
                        if (event.propertyName === 'value') {
                            adjust();
                        }
                    });
                }
            } else {
                $ta.on('input.autosize', adjust);
            };
            if (options.resizeDelay !== false) {
                $(window).on('resize.autosize', resize);
            };
            $ta.on('autosize.resize', adjust);
            $ta.on('autosize.resizeIncludeStyle', function() {
                mirrored = null;
                adjust();
            });
            $ta.on('autosize.destroy', function() {
                mirrored = null;
                clearTimeout(timeout);
                $(window).off('resize', resize);
                $ta.off('autosize').off('.autosize').css(originalStyles).removeData('autosize');
            });
            adjust();
        });
    };
}));
(function(Isporttl_Athlete, $, undefined) {
    function showErrorSyncDialog(fullName, status) {
        var title = '';
        var content = '';
        switch (status) {
            case "CONNECT":
                title = " cannot be requested as a connection.";
                break;
            case "RESPOND TO REQUEST":
                title = " cannot be requested as a connection.";
                break;
            case "CONNECTED":
            case "REQUESTED":
                title = "'s profile cannot be accessed.";
                break;
        }
        content = "The user has deleted their Swim.com account.";
        var syncDialog = $("#synchronization_dialog");
        $(syncDialog).find("#error_Message").html(fullName.formatLengthText(31, 40) + title);
        $(syncDialog).find("#explanation_Message").html(content);
        $(syncDialog).dialog("open");
    }

    function showListUserLike(control, listUser, feedLogId, workoutId, totalLike) {
        var listUserLiked = "";
        var divListLike = $(control).find('.jsListUsersLike:first');
        if (listUser && listUser.length > 0) {
            listUserLiked += '<a title="' + listUser[0].fullName + '" class="wd-link-blue" href="' + listUser[0].profileName + '">' + (listUser[0].fullName == 'You' ? listUser[0].fullName : common.formatShortUserName(listUser[0].firstName, listUser[0].lastName, 20)) + '</a>';
            if (listUser.length === 2) {
                listUserLiked += (listUser[0].isSubcribe ? "" : ",") + ' and <a title="' + listUser[1].fullName + '" class="wd-link-blue" href="' + listUser[1].profileName + '">' + (listUser[0].fullName == 'You' ? common.formatShortUserName(listUser[1].firstName, listUser[1].lastName, 30) : common.formatShortUserName(listUser[1].firstName, listUser[1].lastName, 20)) + '</a>';
            }
            if (listUser.length > 2) {
                var arr = $.map(listUser, function(a) {
                    return a.userId;
                });
                listUserLiked += (listUser[0].isSubcribe ? "" : ",") + ' and <a title="' + (listUser.length - 1) + ' other people" \n\
                    class="wd-link jsOtherUsers" href="javascript:;" workoutId="' + workoutId + '" feedLogId="' + feedLogId + '"  \n\
                    ids="' + arr.join(',') + '">' + (totalLike - 1) + ' other people</a>';
            }
            listUserLiked += ' liked this swim.';
            $(divListLike).html(listUserLiked);
            $(divListLike).show();
        } else {
            $(divListLike).html("");
            $(divListLike).hide();
        }
        initEventShowListUserLike(control);
    }

    function initEventShowListUserLike(ctrl) {
        $.each($(ctrl).find(".jsOtherUsers"), function() {
            $(this).live("click", function(event) {
                $('.js-ajax-waiting').hide();
                var elemClick = $(this);
                var feedLogId = $(this).attr('feedLogId');
                var workoutId = $(this).attr('workoutId') == '' ? 0 : $(this).attr('workoutId');
                if ($(this).find(".js_feed_total_achievement") && Number($(this).find(".js_feed_total_achievement").html()) === 0) {
                    return;
                }
                if (feedLogId !== undefined && workoutId !== undefined) {
                    $.ajax({
                        url: "ajax/activity/otherusers?noajax=true",
                        data: {
                            feedLogId: feedLogId,
                            workoutId: workoutId
                        },
                        type: "POST",
                        success: function(data) {
                            $('div.js-ajax-waiting').hide();
                            $('#divAlertBgWU').show();
                            $("#divAlertPopupAchivement").html(data);
                            $("#divAlertPopupAchivement").center();
                            var topPopup = $("#divAlertPopupAchivement").css('top').replace('px', '') - ($("#divAlertPopupAchivement").outerHeight() + ($('.popup-your-comment-swim').height() / 2));
                            $("#divAlertPopupAchivement").show();
                            $.each($('#divAlertPopupAchivement').find('.btnAddConnection'), function() {
                                $(this).hover(function() {
                                    var statusConnection = $(this).val();
                                    if (statusConnection.toUpperCase() == 'CONNECTED') {
                                        $(this).parent().addClass("popup-pool-btn-orange");
                                        $(this).parent().find('#textBtnAddConnection').html('Disconnect');
                                    } else if (statusConnection.toUpperCase() == 'REQUESTED') {
                                        $(this).parent().addClass("popup-pool-btn-orange");
                                        $(this).parent().find('#textBtnAddConnection').html('Cancel');
                                    }
                                }, function() {
                                    var statusConnection = $(this).val();
                                    if (statusConnection.toUpperCase() == 'CONNECTED') {
                                        $(this).parent().removeClass("popup-pool-btn-orange");
                                        $(this).parent().find('#textBtnAddConnection').html('Connected');
                                    } else if (statusConnection.toUpperCase() == 'REQUESTED') {
                                        $(this).parent().removeClass("popup-pool-btn-orange");
                                        $(this).parent().find('#textBtnAddConnection').html('Requested');
                                    }
                                });
                                $(this).click(function() {
                                    Isporttl_Athlete.feed.addConnection(this);
                                });
                            });
                            if (elemClick.hasClass('js_feed_achievement')) {
                                $('.js_like_popup_activity_feed').hide();
                                $('.js_li_like_popup').removeClass('active');
                                $('.js_achivement_popup_activity_feed').show();
                                $('.js_li_achivement_popup').addClass('active');
                            }
                            setFocus();
                        }
                    });
                }
            });
        });
    }

    function setFocus() {
        $("a").not(".tab-address,:has(>img),:has(>div)").addClass("link-focus");
        $("a:has(>img)").focusin(function() {
            if ($(this).hasClass("wrap_img")) {
                $(">img", this).addClass("input-focus");
            } else if ($(this).parent().hasClass("a_wrap_circle")) {
                $(this).parent().addClass("input-focus");
            } else if ($(this).parent().hasClass("feed")) {
                $(this).parent().addClass("input-focus");
            } else {
                $(this).parent().parent().addClass("input-focus");
            }
        });
        $("a:has(>img)").focusout(function() {
            if ($(this).hasClass("wrap_img")) {
                $(">img", this).removeClass("input-focus");
            } else if ($(this).parent().hasClass("a_wrap_circle")) {
                $(this).parent().removeClass("input-focus");
            } else if ($(this).parent().hasClass("feed")) {
                $(this).parent().removeClass("input-focus");
            } else {
                $(this).parent().parent().removeClass("input-focus");
            }
        });
        $("a:has(>div)").focusin(function() {
            $(">div", this).addClass("input-focus");
        });
        $("a:has(>div)").focusout(function() {
            $(">div", this).removeClass("input-focus");
        });
        $("input,.button-blue,.jsDeviceSettingsLink,.device-wrap-image,.device-wrap-content,.button-blue177,.ico_addprofile,.comment-input,.feed-txt-blue,.feed-txt-grey,.feed-device,.jsLoadMoreHeader,#imageAvatarHeader20,.js_feed_achievement,.js_comment_group,.js_feed_totallikes,.edit-dropdown,.support-dropdown,.logout-dropdown").focusin(function() {
            $(this).addClass("input-focus");
        });
        $("input,.button-blue,.jsDeviceSettingsLink,.device-wrap-image,.device-wrap-content,.button-blue177,.ico_addprofile,.comment-input,.feed-txt-blue,.feed-txt-grey,.feed-device,.jsLoadMoreHeader,#imageAvatarHeader20,.js_feed_achievement,.js_comment_group,.js_feed_totallikes,.edit-dropdown,.support-dropdown,.logout-dropdown").focusout(function() {
            $(this).removeClass("input-focus");
        });
    };
    Isporttl_Athlete.feed = {
        decodeSearchData: function(obj) {
            var array = swim_AjaxBrowser.GetDecodeArray(obj, "/");
            return {
                getWhat: array[0],
                profileName: $('#profileName').val(),
                teamId: $('#teamId').val(),
                orderBy: 'MostRecent',
                pageIndex: Isporttl_Athlete.feed.settings.pageIndex,
                pageSize: Isporttl_Athlete.feed.settings.pageSize,
                feedLogId: array[1]
            };
        },
        encodeSearchData: function(options) {
            var searchData = Isporttl_Athlete.feed.getSearchData(options);
            var stringReturn = searchData.getWhat + '/' + searchData.feedLogId + '/' + searchData.pageIndex + '/' + searchData.teamId;
            return stringReturn;
        },
        settings: {
            pageSize: 12,
            pageIndex: 1,
            searching: false,
            firstLoad: true
        },
        getPageIndexCurrent: function() {
            return parseInt(Isporttl_Athlete.feed.settings.pageIndex);
        },
        getPageTotal: function() {
            return parseInt($('#pageTotal').val());
        },
        getSearchData: function() {
            return {
                getWhat: $('#getWhat').val(),
                profileName: $('#profileName').val(),
                orderBy: 'MostRecent',
                pageIndex: Isporttl_Athlete.feed.settings.pageIndex,
                pageSize: Isporttl_Athlete.feed.settings.pageSize,
                feedLogId: $('#feedLogId').val(),
                teamId: $('#teamId').val()
            };
        },
        getBlastInvitedUsers: function(list, profileName) {
            var a = [],
                result = '';
            for (var i = 0; i < list.length; i++) {
                var user = list[i];
                if (user.profileName == profileName)
                    continue;
                var userProfileUrl = $('#contextPath').val() + '/' + user.profileName;
                a.push('<a href="{0}"><span class="feed-local-pool">{1} {2}</span></a>'.format(userProfileUrl, user.firstName, user.lastName));
                if (a.length == 3)
                    break;
            }
            result = a.join(', ');
            if (list.length == 5)
                result = '{0} and <span class="feed-local2">1</span> other'.format(result);
            else if (list.length > 5)
                result = '{0} and <span class="feed-local2">{1}</span> others'.format(result, list.length - 4);
            return result;
        },
        updateLikeByFeedLogId: function(feedLogId, type) {
            if ($("#jsIsLogin").val() === "false") {
                var urlLocation = window.location.href;
                urlLocation = urlLocation.replace("?mode=connection", "");
                window.location.href = "/login?urlRedirect=" + urlLocation + "?mode=like|feedLogId=" + feedLogId;
                return false;
            }
            var likeDate = new Date().getTime();
            $.ajax({
                url: "/likecomment/updatelikecounter",
                data: {
                    type: type,
                    feedLogId: feedLogId,
                    likeDate: likeDate
                },
                type: "POST",
                beforeSend: function() {},
                complete: function() {},
                success: function(data) {
                    $('div.js-ajax-waiting').hide();
                    $('.js_feed_totallikes[feedLogId="' + feedLogId + '"]').attr("status", type === 0 ? "Like" : "Liked");
                    var jsLikeGroup = $('.js_like_group[feedLogId="' + feedLogId + '"]');
                    if (type === 0) {
                        $(jsLikeGroup).removeClass('iconfeed-ico-start').addClass('iconfeed-ico-start-grey');
                    } else {
                        $(jsLikeGroup).removeClass('iconfeed-ico-start-grey').addClass('iconfeed-ico-start');
                    }
                    var totalLikeDiv = $('.js_feed_totallikes[feedLogId="' + feedLogId + '"]');
                    var workoutId = $(totalLikeDiv).attr("workoutid");
                    $(totalLikeDiv).html(data.body.likeNumber);
                    showListUserLike(jsLikeGroup, data.body.listUser, feedLogId, workoutId, data.body.likeNumber);
                    var totalLikeUserAthlete = $.trim($('#js_TotalLikeUserAthlete').text()) != "" ? parseInt($('#js_TotalLikeUserAthlete').text()) : 0;
                    if (type == 1) {
                        totalLikeUserAthlete = totalLikeUserAthlete + 1;
                    } else {
                        totalLikeUserAthlete = (totalLikeUserAthlete > 0) ? totalLikeUserAthlete - 1 : 0;
                    }
                    if (totalLikeUserAthlete != 0) {
                        $('#js_TotalLikeUserAthlete').text(totalLikeUserAthlete);
                        if (totalLikeUserAthlete == 1) {
                            $('#js_TextLikeUserAthlete').text("Like");
                        } else {
                            $('#js_TextLikeUserAthlete').text("Likes");
                        }
                    } else {
                        $('#js_TotalLikeUserAthlete').text("");
                        $('#js_TextLikeUserAthlete').text("");
                    }
                }
            });
        },
        updateLike: function(btnLike) {
            var feedLogId = $(btnLike).attr('feedLogId');
            var type = $('.js_feed_totallikes[feedLogId="' + feedLogId + '"]').attr("status");
            type = (type === "Like" || type === undefined) ? 1 : 0;
            Isporttl_Athlete.feed.updateLikeByFeedLogId(feedLogId, type);
        },
        requestConnection: function(toUserId) {
            if ($('#jsIsLogin').val() == false)
                window.location.href = "/login?urlRedirect=" + window.location.href;
            $.post('/ajax/requestConnection', {
                toUserId: toUserId
            }, function(result) {
                if (result.statusCode !== 200) {
                    location.reload();
                }
            });
        },
        buildComment: function(listComment, feedLogId, totalComment, loadMore, feedOwnerId) {
            var loggedInUserId = $("#jsUserId").val();
            var stringComment = '';
            if (totalComment > 3) {
                stringComment += '<div class="comment-feed js_comment_view_more comment-feed-first" feedLogId="' + feedLogId + '" numberLoadMore="' + (totalComment - 3) + '" feedOwnerId="' + feedOwnerId + '">';
                stringComment += '<div class="floatL">';
                stringComment += '<a class="comment-view-more" title="View ' + (totalComment - 3) + ' more comments" >View ' + (totalComment - 3) + ' more comments...</a></div><div class="clear"></div></div>';
            }
            var host = $('#contextPath').val();
            for (var i = listComment.length - 1; i >= 0; i--) {
                var display = '';
                var commentId = listComment[i].commentId;
                stringComment += '<div class="comment-feed" feedLogId="' + feedLogId + '" ' + display + ' commentId="' + commentId + '">';
                if (listComment[i].userId == loggedInUserId) {
                    stringComment += '  <div class="edit_comment"></div>';
                    stringComment += '  <div class="delete_comment"></div>';
                } else if (feedOwnerId == loggedInUserId) {
                    stringComment += '  <div class="delete_comment"></div>';
                }
                stringComment += '  <div class="circle comment ' + (listComment[i].socialName != "" ? ("social " + listComment[i].socialName) : "") + '">';
                stringComment += listComment[i].isUserDeleted ? '' : '     <a href="' + (host + listComment[i].profileName) + '">';
                stringComment += '        <img src="' + (listComment[i].avatarUrl == "" || listComment[i].avatarUrl == null || listComment[i].avatarUrl == 'undefined' ? '/resources/images/avatar/No_Avatar_38x38.jpg' : (listComment[i].avatarUrl)) + '" width="38" height="38" alt="' + listComment[i].fullName + '">';
                stringComment += listComment[i].isUserDeleted ? '' : '     </a>';
                stringComment += '  </div>';
                stringComment += '  <div class="comment-feedL">';
                stringComment += listComment[i].isUserDeleted ? '' : '     <a href="' + (host + listComment[i].profileName) + '">';
                stringComment += '        <span class="feed-name-comment">' + listComment[i].fullName + '</span>';
                stringComment += listComment[i].isUserDeleted ? '' : '     </a>';
                stringComment += '     <div class="clear"></div>';
                stringComment += '     <span class="day-first-comment">' + common.formatCommentDate(listComment[i].createdDate) + '</span><div class="clear"></div>';
                stringComment += '     <p class="feed-content-comment">' + common.translateBreakLineToHTMLTag(listComment[i].comment) + '</p>';
                stringComment += '  </div><div class="clear"></div></div>';
            }
            if (!loadMore) {
                var socialName = $("#jsUserSocialName").val();
                var profileName = $("#jsUserProfileName").val();
                var fullName = $("#jsUserFullName").val();
                var avatarUrl38x38 = $("#jsUserAvatarUrl38x38").val();
                stringComment += '<div class="line_white"></div><div class="comment-feed txtComment comment-feed-last" >\n\
                        <div class="circle comment' + (socialName !== "" ? (" social " + socialName) : "") + '"><a href="' + (host + profileName) + '" title="' + fullName + '"><img src="' + (avatarUrl38x38 === "" || avatarUrl38x38 === null || avatarUrl38x38 === 'undefined' ? '/resources/images/avatar/No_Avatar_38x38.jpg' : avatarUrl38x38) + '" width="38" height="38" alt="' + fullName + '"></a></div> \n\
                        <div><textarea class="comment-input" style="resize:none;height: 16px;" feedLogId=' + feedLogId + '></textarea></div><div class="clear"></div></div>';
            }
            return stringComment;
        },
        buildFeedList: function(list) {
            var linkProfileUserLogin = $('#jslinkProfileUserLogin').val();
            var profileName = "";
            if (linkProfileUserLogin !== undefined && linkProfileUserLogin.length > 0)
                profileName = linkProfileUserLogin.substring(1);
            var length = list.length <= Isporttl_Athlete.feed.settings.pageSize ? list.length : Isporttl_Athlete.feed.settings.pageSize;
            if (Isporttl_Athlete.feed.settings.pageIndex === 1)
                $('div.js_feed_list').html('');
            for (var i = 0; i < length; i++) {
                var feedItem = list[i];
                var tpl = $('div.js_feed > div').clone();
                var username = feedItem.firstName + ' ' + feedItem.lastName;
                var userProfileUrl = $('#contextPath').val() + '/' + feedItem.profileName;
                var userAvatarUrl = feedItem.linkAvatar ? feedItem.linkAvatar : $('#contextPath').val() + '/resources/images/no-avatar-50x50.jpg';
                tpl.addClass('feedLogId_' + feedItem.feedLogId).attr('feedLogId', feedItem.feedLogId);
                tpl.find('.js_feed_img').attr('href', userProfileUrl).find('img').attr('src', userAvatarUrl).attr('alt', username);
                var currentUrl = window.location.href;
                if (currentUrl.indexOf(userProfileUrl) != -1) {
                    tpl.find('.js_feed_username').replaceWith("<b>" + username + "</b>");
                    var htmlImage = tpl.find('.js_feed_img').html();
                    tpl.find('.js_circle_feed').html(htmlImage);
                } else {
                    tpl.find('.js_feed_username').attr('href', userProfileUrl).attr("title", username).html(username);
                }
                var poolName = (feedItem.place && feedItem.place.name) ? (feedItem.place.name) : 'Unknown Pool';
                var title = '';
                if (poolName === 'Unknown Pool') {
                    title = '<span class="iconfeed-local-grey">{0}</span>'.format(poolName);
                    tpl.find('.feed-local, feed-local2').parent().removeAttr('href').css('cursor', 'default');
                } else {
                    var poolUrl = "/pools/{0}-{1}";
                    poolUrl = feedItem.place ? "/pools/{0}-{1}".formatUrl('-', encodeURIComponent(feedItem.place.name.replace(/\s{2,}/g, ' ').replace(/ /g, '-').replace(/\//g, '')), (feedItem.place.placeId)) : '';
                    title = '<a href="{0}" title="{1}" class="iconfeed-local">{1}</a>'.format(poolUrl, poolName);
                }
                tpl.find('.js_feed_title').html(title);
                tpl.find('.js_feed_total_achievement').html(feedItem.totalAchievement);
                tpl.find('.js_feed_achievement').attr('feedLogId', feedItem.feedLogId);
                tpl.find('.js_feed_totalcomments').html(feedItem.totalComment);
                tpl.find('.js_feed_totallikes').html(feedItem.totalLike);
                tpl.find('.js_feed_totallikes').attr('feedLogId', feedItem.feedLogId);
                tpl.find('.js_feed_day').html(common.formatWorkoutDate(feedItem.workoutDate));
                tpl.find('.js_feed_distance').html(feedItem.distanceFormat.valueFormat);
                tpl.find('.js_feed_distance_unit').html(feedItem.distanceFormat.unit);
                tpl.find('.js_feed_short_unit').html(feedItem.distanceFormat.unit.charAt(0));
                if (feedItem.durationFormat) {
                    if ($.trim(feedItem.durationFormat.formatValue) !== "") {
                        tpl.find('.js_feed_pace_factor').html(feedItem.durationFormat.formatValue);
                        var str = feedItem.durationFormat.formatType;
                        tpl.find('.js_feed_pace_factor_type').html(str);
                    }
                }
                if (feedItem.paceFormat) {
                    if ($.trim(feedItem.paceFormat.formatValue) !== "") {
                        tpl.find('.js_feed_pace').html(feedItem.paceFormat.formatValue + "" + feedItem.paceFormat.formatType);
                    } else {
                        tpl.find(".js_feed_pace_factor").html("");
                    }
                }
                var deviceName = feedItem.device ? feedItem.device.name : '';
                if (deviceName !== '') {
                    var compareLink = "/swim-watches?registryId=" + feedItem.device.deviceRegistryId;
                    tpl.find('.js_feed_device').attr("href", compareLink);
                    tpl.find('.js_feed_device').html(deviceName).attr('title', deviceName);
                    var imgDevice = tpl.find('.feed-device > img');
                    imgDevice.attr('alt', deviceName).attr('src', feedItem.device.imageUrl);
                    tpl.find('.jsDeviceName').html(deviceName).attr('title', deviceName);
                } else {
                    var divFeedDevice = tpl.find('.feed-device');
                    if (feedItem.manual === undefined) {
                        divFeedDevice.hide();
                    } else {
                        var content = "Manual";
                        $(divFeedDevice).addClass("device_manually_entered");
                        tpl.find('.js_feed_device').hide();
                        tpl.find('.js_feed_device_content').html(content);
                        var imgDevice = tpl.find('.feed-device > img');
                        if (feedItem.manualIcon === undefined || feedItem.manualIcon === null)
                            imgDevice.attr('alt', '');
                        else
                            imgDevice.attr('alt', content).attr('src', feedItem.manualIcon);
                    }
                }
                if (tpl.find('.js_feed_day').html() === "") {
                    tpl.find('.jsDash').hide();
                }
                tpl.find('.js_feed_workout').show();
                tpl.find('.js_workoutTitle').show();
                tpl.find('.js_workoutTitle').html(common.formatWorkoutTitle(feedItem.workoutTitle, feedItem.workoutDate));
                tpl.find('.js_feed_day').html(common.formatWorkoutDate(feedItem.workoutDate));
                tpl.find('.js_feed_workout').attr('workoutId', feedItem.feedLogId);
                tpl.find('.js_feed_workout').attr('onclick', 'Isporttl_Athlete.feed.setHashWorkoutClick(' + feedItem.workoutid + ', ' + feedItem.feedLogId + ')');
                tpl.find('.js_feed_achievement').attr('workoutId', feedItem.workoutid);
                tpl.find('.js_feed_totallikes').attr('workoutId', feedItem.workoutid);
                if (feedItem.userAlreadyLiked) {
                    tpl.find('.js_feed_totallikes').attr("status", "Liked");
                    tpl.find('.js_like_group').removeClass('iconfeed-ico-start-grey').addClass('iconfeed-ico-start');
                }
                tpl.find('.js_like_group').attr('feedLogId', feedItem.feedLogId);
                showListUserLike(tpl, feedItem.listUserLike, feedItem.feedLogId, feedItem.workoutid, feedItem.totalLike);
                tpl.find('.js_comment_group').attr('feedLogId', feedItem.feedLogId);
                var listHtmlComment = "";
                if (feedItem.totalComment > 0) {
                    listHtmlComment = Isporttl_Athlete.feed.buildComment(feedItem.listComment, feedItem.feedLogId, feedItem.totalComment, false, feedItem.userid);
                    listHtmlComment = "<div class='wrap_athlete_update'>\n\
                            <div class='corner01_tl'></div><div class='corner01_tr'></div>\n\
                            <div class='corner01_bl'></div><div class='corner01_br'></div>" + listHtmlComment + "</div>";
                    if (profileName.length > 0 && listHtmlComment.indexOf(profileName) !== -1) {
                        tpl.find('.js_comment_group').addClass('iconfeed-ico-comment-blue').removeClass('iconfeed-ico-comment');
                    }
                    tpl.append(listHtmlComment);
                } else {
                    $(tpl).addClass("viewworkout-mb");
                }
                $.each(tpl.find('.comment-input'), function(index, value) {
                    $(value).autosize();
                    $(value).keypress(function(e) {
                        var code = e.keyCode || e.which;
                        if (code == 13 && !e.shiftKey) {
                            e.preventDefault();
                            var comment = $(value).val();
                            if (comment != '' && $.trim(comment) != '') {
                                var feedLogId = $(value).attr('feedLogId');
                                Isporttl_Athlete.feed.insertComment(feedLogId, comment);
                                $(value).val('');
                                $(value).height("16px");
                            }
                        }
                    });
                });
                $('div.js_feed_list').append(tpl);
            }
            $(document).off('click', '.comment-feed .delete_comment');
            $(document).on('click', '.comment-feed .delete_comment', function(event) {
                Isporttl_Athlete.feed.deleteComment(event);
            });
            $(document).off('click', '.comment-feed .edit_comment');
            $(document).on('click', '.comment-feed .edit_comment', function(event) {
                Isporttl_Athlete.feed.editComment(event);
            });
            setFocus();
        },
        reset: function() {
            $('div.js_feed_list').onScrollBeyond('disable');
        },
        showComment: function(btnComment) {
            var feedLogId = $(btnComment).attr('feedLogId');
            $('.feedLogId_' + feedLogId).find('.js_comment_group').addClass('iconfeed-ico-comment-blue').removeClass('iconfeed-ico-comment');
            $('.feedLogId_' + feedLogId).removeClass("viewworkout-mb");
            if ($('.feedLogId_' + feedLogId).find('.txtComment').length === 0) {
                var socialName = $("#jsUserSocialName").val();
                var profileName = $("#jsUserProfileName").val();
                var fullName = $("#jsUserFullName").val();
                var avatarUrl38x38 = $("#jsUserAvatarUrl38x38").val();
                var divParent = "<div class='wrap_athlete_update'>\n\
                            <div class='corner01_tl'></div><div class='corner01_tr'></div>\n\
                            <div class='corner01_bl'></div><div class='corner01_br'></div>";
                $('.feedLogId_' + feedLogId).append(divParent + '<div class="line_white" style="display:none;"></div><div class="comment-feed txtComment" style="padding: 1px 6px 1px 10px">\n\
                            <div class="circle comment' + (socialName !== "" ? (" social " + socialName) : "") + '"><a href="' + ($('#contextPath').val() + profileName) + '" title="' + fullName + '"><img src="' + (avatarUrl38x38 === "" || avatarUrl38x38 === null || avatarUrl38x38 === 'undefined' ? '/resources/images/avatar/No_Avatar_38x38.jpg' : avatarUrl38x38) + '" width="38" height="38" alt="' + fullName + '"></a></div> \n\
                            <div><textarea class="comment-input" style="resize:none;height: 16px;" feedLogId=' + feedLogId + '></textarea></div><div class="clear"></div></div>' + "</div>");
                $('textarea[feedLogId="' + feedLogId + '"]').focus();
                $.each($('.feedLogId_' + feedLogId).find('textarea'), function(index, value) {
                    $(value).autosize();
                    $(value).keypress(function(e) {
                        var code = e.keyCode || e.which;
                        if (code == 13 && !e.shiftKey) {
                            e.preventDefault();
                            var feedLogId = $(value).attr('feedLogId');
                            var comment = $(value).val();
                            Isporttl_Athlete.feed.insertComment(feedLogId, comment);
                            $(value).val('');
                            $(value).height("16px");
                        }
                    });
                });
            }
            $('textarea[feedLogId="' + feedLogId + '"]').focus();
            $('textarea[feedLogId="' + feedLogId + '"]').focusout(function() {
                $('textarea[feedLogId="' + feedLogId + '"]').css({
                    minHeight: 16
                });
            });
        },
        insertComment: function(feedLogId, commentContent) {
            if ($.trim(common.removeBreakLine(commentContent)) === '') {
                return false;
            }
            if ($("#jsIsLogin").val() === "false") {
                var urlLocation = window.location.href;
                urlLocation = urlLocation.replace("?mode=comment", "");
                window.location.href = "/login?urlRedirect=" + urlLocation;
                return false;
            }
            var commentStatus = Isporttl_Comment.statusACTIVE;
            if ($('#commentStatus').val() == Isporttl_Comment.statusPENDING) {
                commentStatus = Isporttl_Comment.statusPENDING;
            }
            $.ajax({
                url: "/athlete/insertcomment",
                data: {
                    feedLogId: feedLogId,
                    commentContent: commentContent,
                    commentStatus: commentStatus
                },
                type: "POST",
                success: function(data) {
                    $('div.js-ajax-waiting').hide();
                    if (commentStatus == Isporttl_Comment.statusPENDING && data.status == Isporttl_Comment.statusACTIVE) {
                        $('.comment-input[feedLogId=' + feedLogId + ']').val('');
                        $('.comment-input[feedLogId=' + feedLogId + ']').height("16px");
                        Isporttl_Comment.showPopupPending();
                        return;
                    }
                    if (data.status == Isporttl_Comment.statusPENDING) {
                        Isporttl_Comment.showPopupError($('.comment-input[feedLogId=' + feedLogId + ']'), commentContent);
                        $('#feedLogIdComment').val(feedLogId);
                        return;
                    }
                    var htmlComment = Isporttl_Athlete.feed.buildHtmlComment(data, feedLogId);
                    $('.comment-input[feedLogId=' + feedLogId + ']').closest('.txtComment').removeAttr("style").addClass("comment-feed-last");
                    var commentFeed = $('.comment-input[feedLogId=' + feedLogId + ']').closest(".wrap_athlete_update").find(".line_white");
                    $(commentFeed).show();
                    $(commentFeed).before(htmlComment);
                    var spanTotalComment = $($(commentFeed).closest(".js_feed_item")).find('.js_feed_totalcomments');
                    var totalComment = parseInt($(spanTotalComment).text());
                    totalComment = totalComment + 1;
                    $(spanTotalComment).text(totalComment);
                    if (totalComment > 0) {
                        $('.feedLogId_' + feedLogId).find('.js_comment_group').addClass('iconfeed-ico-comment-blue').removeClass('iconfeed-ico-comment');
                    }
                    var totalCommentUserAthlete = $.trim($('#js_TotalCommentUserAthlete').text()) == "" ? 0 : parseInt($('#js_TotalCommentUserAthlete').text());
                    totalCommentUserAthlete = totalCommentUserAthlete + 1;
                    $('#js_TotalCommentUserAthlete').html(totalCommentUserAthlete);
                    if (totalCommentUserAthlete == 1) {
                        $('#js_TextCommentUserAthlete').html("Comment");
                    } else {
                        $('#js_TextCommentUserAthlete').html("Comments");
                    }
                    $('html, body').animate({
                        scrollTop: $('textarea[feedLogId="' + feedLogId + '"]').offset().top - $(window).height() / 2
                    }, 1000);
                }
            });
        },
        deleteComment: function(deleteEvent) {
            var commentNode = $(deleteEvent.target).parent();
            commentNode.hide();
            var feedLogId = commentNode.attr("feedlogid");
            var commentId = commentNode.attr("commentid");
            var commentGroup = $("div .js_feed_item [feedlogid=" + feedLogId + "]");
            var deleteCommentUrl = "/athlete/deletecomment/" + commentId;
            $.ajax({
                url: deleteCommentUrl,
                type: "DELETE",
                success: function(data) {
                    var commentObj = data;
                    if ($('div.js-ajax-waiting').is(':visible') == true) {
                        $('div.js-ajax-waiting').hide();
                    }
                    if (commentObj.commentId == commentId) {
                        commentNode.remove();
                        var spanTotalComment = commentGroup.find('.js_feed_totalcomments');
                        var totalComment = parseInt($(spanTotalComment).text());
                        totalComment = totalComment - 1;
                        spanTotalComment.text(totalComment);
                        if (totalComment == 0) {
                            commentGroup.filter('.js_comment_group').addClass('iconfeed-ico-comment').removeClass('iconfeed-ico-comment-blue');
                            commentGroup.parent().parent().find('.line_white').hide();
                        }
                    } else {
                        alert("You can only delete your own comments.");
                    }
                },
                error: function(xhr) {
                    commentNode.show();
                }
            });
        },
        editComment: function(editEvent) {
            var commentNode = $(editEvent.target).parent()
            var commentId = commentNode.attr("commentid");
            var feedLogId = commentNode.attr("feedlogid");
            var commentGroup = $("div .js_feed_item [feedlogid=" + feedLogId + "]");
            var commentText = commentNode.find(".feed-content-comment")
            var commentTextClone = commentText.clone();
            var commentTextarea = $(".comment-feed [feedlogid=" + feedLogId + "]").clone();
            commentTextarea.removeAttr("feedlogid");
            commentTextarea.html(common.translateBreakLineToJava(commentText.html()));
            commentTextarea.css("margin-left", "0px");
            commentTextarea.autosize();
            commentText.replaceWith(commentTextarea);
            $(commentTextarea).keydown(function(event) {
                var code = event.keyCode || event.which;
                if (code == 13 && !event.shiftKey) {
                    event.preventDefault();
                    var comment = event.target.value;
                    if (comment === "") {
                        $.ajax({
                            url: "/athlete/deletecomment/" + commentId,
                            type: "DELETE",
                            success: function(data) {
                                var commentObj = data;
                                if ($('div.js-ajax-waiting').is(':visible') == true) {
                                    $('div.js-ajax-waiting').hide();
                                }
                                if (commentObj.commentId == commentId) {
                                    commentNode.remove();
                                    var spanTotalComment = commentGroup.find('.js_feed_totalcomments');
                                    var totalComment = parseInt($(spanTotalComment).text());
                                    totalComment = totalComment - 1;
                                    spanTotalComment.text(totalComment);
                                    if (totalComment == 0) {
                                        commentGroup.filter('.js_comment_group').addClass('iconfeed-ico-comment').removeClass('iconfeed-ico-comment-blue');
                                        commentGroup.parent().parent().find('.line_white').hide();
                                    }
                                } else {
                                    alert("You can only delete your own comments.");
                                    commentTextarea.replaceWith(commentTextClone);
                                }
                            }
                        });
                    } else {
                        var commentStatus = Isporttl_Comment.statusACTIVE;
                        if ($('#commentStatus').val() == Isporttl_Comment.statusPENDING) {
                            commentStatus = Isporttl_Comment.statusPENDING;
                        }
                        $.ajax({
                            url: "/athlete/updatecomment",
                            data: {
                                commentId: commentId,
                                commentContent: comment,
                                commentStatus: commentStatus
                            },
                            type: "PUT",
                            success: function(data) {
                                var commentObj = data;
                                if ($('div.js-ajax-waiting').is(':visible') == true) {
                                    $('div.js-ajax-waiting').hide();
                                }
                                if (commentStatus == Isporttl_Comment.statusPENDING && commentObj.status == Isporttl_Comment.statusACTIVE) {
                                    commentTextarea.val('');
                                    commentTextarea.height("16px");
                                    Isporttl_Comment.showPopupPending();
                                    return;
                                }
                                if (commentObj.status == Isporttl_Comment.statusPENDING) {
                                    Isporttl_Comment.showPopupError(commentTextarea, comment);
                                    $('#feedLogIdComment').val(feedLogId);
                                    return;
                                }
                                if (commentObj.commentId == commentId) {
                                    commentTextClone.html(common.translateBreakLineToHTMLTag(commentObj.comment));
                                } else {
                                    alert("You can only change your own comments.");
                                }
                                commentTextarea.replaceWith(commentTextClone);
                            }
                        });
                    }
                } else if (code == 27 && !event.shiftKey) {
                    commentTextarea.replaceWith(commentTextClone);
                }
            });
        },
        loadMoreComment: function(feedLogId, numberLoadMore, feedOwnerId) {
            var currentCommentNum = $("div .comment-feed[feedlogid=" + feedLogId + "][commentid]").size();
            $.ajax({
                url: "/athlete/loadMoreComment",
                data: {
                    feedLogId: feedLogId,
                    numberLoadMore: numberLoadMore,
                    firstIndex: currentCommentNum
                },
                type: "POST",
                success: function(data) {
                    $('div.js-ajax-waiting').hide();
                    var htmlComment = Isporttl_Athlete.feed.buildComment(data, feedLogId, 0, true, feedOwnerId);
                    var commentFeed = $('.js_comment_view_more[feedLogId="' + feedLogId + '"]');
                    $(commentFeed).after(htmlComment);
                    $('html, body').animate({
                        scrollTop: $('textarea[feedLogId="' + feedLogId + '"]').offset().top - $(window).height() / 2
                    }, 1000);
                }
            });
        },
        buildHtmlComment: function(comment, feedLogId) {
            var host = $('#contextPath').val();
            var stringComment = '<div class="comment-feed" feedLogId="' + feedLogId + '" commentId="' + comment.commentId + '">';
            stringComment += '<div class="edit_comment"></div>';
            stringComment += '<div class="delete_comment"></div>';
            stringComment += '  <div class="circle comment' + (comment.socialName != "" ? (" social " + comment.socialName) : "") + '"><a href="' + (host + comment.profileName) + '" title="' + comment.fullName + '"><img src="' + (comment.avatarUrl == "" || comment.avatarUrl == null || comment.avatarUrl == 'undefined' ? '/resources/images/avatar/No_Avatar_38x38.jpg' : comment.avatarUrl) + '" width="38" height="38" alt="' + comment.fullName + '"></a></div>';
            stringComment += '  <div class="comment-feedL"> ';
            stringComment += (comment.isUserDeleted ? '' : '   <a href="/' + comment.profileName + '">') + '<span class="feed-name-comment">' + comment.shortName + '</span>';
            stringComment += (comment.isUserDeleted ? '' : '</a>') + '<div class="clear"></div> ';
            stringComment += '   <span class="day-first-comment" title="' + comment.elapsedTime + '">' + comment.elapsedTime + '</span><div class="clear"></div>';
            stringComment += '   <p class="feed-content-comment">' + common.translateBreakLineToHTMLTag(comment.comment) + '</p></div>';
            stringComment += '  <div class="clear"></div>';
            stringComment += '</div>';
            return stringComment;
        },
        joinClub: function(clubId) {
            $.post('/ajax/leaveOrJoinClub', {
                clubId: clubId,
                status: 'Join',
                isShowPopup: false
            }, function() {
                Isporttl_Athlete.feed.getRecommendDashboard();
            });
        },
        getRecommendDashboard: function() {
            $.ajax({
                type: 'GET',
                url: 'ajax/getRecommendClubOnDashboard',
                success: function(response) {
                    return $('#recommendDashboardList').html(response);
                }
            });
        },
        search: function(data) {
            if (data.pageIndex == -1 || ($('div.js-ajax-waiting').is(':visible') && data.pageIndex != 1)) {
                return;
            }
            Isporttl_Athlete.feed.settings.searching = true;
            $.ajax({
                type: 'GET',
                url: $('#feedUrl').val(),
                data: data,
                success: function(response) {
                    $('div.js-ajax-waiting').hide();
                    if (!response || response.meta.code != "13_1_s") {
                        if (data.pageIndex == 1) {
                            var getWhat = data.getWhat;
                            $('#getWhat').val(getWhat);
                            var htmlNoData = '';
                            if (getWhat == 3) {
                                var haveHomePool = $('#homePoolId').length > 0 && parseInt($('#homePoolId').val()) > 0;
                                htmlNoData = $("#workoutFeedTemplate").tmpl({
                                    haveHomeFacility: haveHomePool
                                });
                            } else if (getWhat == 2 && $('.js_myWorkoutFeed').length > 0) {
                                htmlNoData = "<div class='text-empty-dashboard'><h4>Start uploading your workouts!</h4><div class='clear'></div>You can start tracking workouts and compete on leaderboard by using one of the Swim.com <a href='/upload' class='db_linkblue' title='approved watches'>approved watches</a> or manual creating a recent workout! Use the upload workout button above!</div>";
                            } else if (getWhat == 4 && $('.js_myWorkoutFeed').length > 0) {
                                htmlNoData = "<div class='text-empty-dashboard'><h4>We don't have any swims to show you here! </h4><div class='clear'></div>Join some Clubs on Swim.com to see what Swim.com users are doing, track your progress vs. your friends and compete with other swimmers. </div><div class='clear'></div><div id='recommendDashboardList'></div>";
                                Isporttl_Athlete.feed.getRecommendDashboard();
                            }
                            $('div.js_feed_list').html(htmlNoData);
                        }
                        Isporttl_Athlete.feed.reset();
                        return;
                    }
                    var list = response.data;
                    Isporttl_Athlete.feed.buildFeedList(list);
                    $('textarea').focusout(function() {
                        $(this).css({
                            minHeight: 16
                        });
                    });
                    $('.js_comment_view_more').unbind("click");
                    $('.js_comment_view_more').click(function() {
                        var feedLogId = $(this).attr('feedLogId');
                        var feedOwnerId = $(this).attr('feedOwnerId');
                        var numberLoadMore = $(this).attr('numberLoadMore');
                        Isporttl_Athlete.feed.loadMoreComment(feedLogId, numberLoadMore, feedOwnerId);
                        $('.feedLogId_' + feedLogId).find('.comment-feed').show();
                        $(this).hide();
                    });
                    $(".js_feed_workout").hover(function() {
                        $(this).find(".js_feed_link").show();
                    }, function() {
                        $(this).find(".js_feed_link").hide();
                    });
                    if ($('#feedLogId').val() != '0') {
                        if ($('.feedLogId_' + data.feedLogId).length != 0) {
                            $('html, body').animate({
                                scrollTop: $('.feedLogId_' + data.feedLogId).offset().top - $(window).height() / 3
                            }, 1000);
                            $('#feedLogId').val(0);
                        } else {
                            $('html, body').animate({
                                scrollTop: $('html, body').height()
                            }, 'slow');
                        }
                    }
                    if (list.length <= Isporttl_Athlete.feed.settings.pageSize)
                        Isporttl_Athlete.feed.reset();
                },
                complete: function() {
                    Isporttl_Athlete.feed.settings.searching = false;
                    Isporttl_Athlete.feed.settings.firstLoad = false;
                    $('.js-ajax-waiting').hide();
                }
            });
        },
        setHashWorkoutClick: function(workoutId, feedLogId) {
            Isporttl_Athlete.feed.setHashFeedLogId(feedLogId);
            window.location.href = "/workout/" + workoutId;
        },
        setHashFeedLogId: function(feedLogId) {
            $('#feedLogId').val(feedLogId);
            swim_AjaxBrowser.SetHash(Isporttl_Athlete.feed.encodeSearchData(), false);
        },
        addConnection: function(ctr) {
            if (ctr !== undefined) {
                if ($(ctr).data("executing")) {
                    return;
                }
                $(ctr).data("executing", true);
            }
            if ($("#jsIsLogin").val() === "false") {
                var urlLocation = window.location.href;
                urlLocation = urlLocation.replace("?mode=connection", "");
                window.location.href = "/login?urlRedirect=" + encodeURIComponent(urlLocation + "?mode=connection");
                return false;
            }
            var statusConnection = $(ctr).val();
            var userId = $(ctr).parent().find('#hdUserId').val();
            var actionUrl = "";
            if (statusConnection.toUpperCase() === "RESPOND TO REQUEST") {
                actionUrl = "/addconnection/" + userId + "/" + statusConnection.toUpperCase();
            } else if (statusConnection.toUpperCase() === "REQUESTED" || statusConnection.toUpperCase() === "CONNECTED") {
                actionUrl = "/addconnection/" + userId + "/" + statusConnection.toUpperCase();
            } else if (statusConnection.toUpperCase() === "CONNECT") {
                actionUrl = "/addconnection/" + userId + "/" + statusConnection.toUpperCase();
            }
            $.ajax({
                url: actionUrl,
                type: "POST",
                success: function(response) {
                    $('div.js-ajax-waiting').hide();
                    if (Number(response) === 1014) {
                        var urlLocation = window.location.href;
                        window.location.href = "/login?urlRedirect=" + encodeURIComponent(urlLocation);
                    } else if (Number(response) === 3) {
                        showErrorSyncDialog($(ctr).parent().find('#hdUserFullName').val(), $(ctr).val().toUpperCase());
                    } else if (response != "false") {
                        var statusConnection = response.split('-')[0];
                        if (statusConnection == 'Waiting') {
                            statusConnection = "Requested";
                            $(ctr).parent().removeClass("button-blue177").addClass("button-grey");
                        } else if (statusConnection == 'Connect') {
                            $(ctr).parent().removeClass("button-grey").addClass("button-blue177");
                        }
                        $(ctr).val(statusConnection);
                        $(ctr).parent().find('#textBtnAddConnection').text(statusConnection == 'Connect' ? "Request" : statusConnection);
                        $(ctr).parent().removeClass("popup-pool-btn-orange");
                        if (statusConnection == "Connected") {
                            $(ctr).parent().css('width', '');
                        }
                        $('#loading').dialog('close');
                    }
                    if (ctr !== undefined) {
                        $(ctr).removeData("executing");
                    }
                },
                error: function(e) {
                    if (ctr !== undefined) {
                        $(ctr).removeData("executing");
                    }
                    return false;
                }
            });
            return true;
        },
        init: function() {
            $('div.js_feed_list').onScrollBeyond(function() {
                if (Isporttl_Athlete.feed.settings.pageIndex == -1 || Isporttl_Athlete.feed.settings.searching) {
                    return;
                }
                Isporttl_Athlete.feed.settings.pageIndex = Isporttl_Athlete.feed.settings.pageIndex + 1;
                Isporttl_Athlete.feed.search(Isporttl_Athlete.feed.getSearchData());
            });
            var urlAthlete = window.location.href;
            if (urlAthlete.indexOf("mode=like") != -1) {
                var feedLogId = urlAthlete.substring(urlAthlete.lastIndexOf("=") + 1, urlAthlete.length);
                Isporttl_Athlete.feed.updateLikeByFeedLogId(feedLogId, 1);
            }
            $('#jsInsertComment').click(function() {
                Isporttl_Comment.hidePopupError();
                $('#commentStatus').val(Isporttl_Comment.statusPENDING);
                var feedLogId = $('#feedLogIdComment').val();
                var comment = $('#commentPendingContent').html();
                Isporttl_Athlete.feed.insertComment(feedLogId, comment);
                $('.comment-input[feedLogId=' + feedLogId + ']').val('');
                $('.comment-input[feedLogId=' + feedLogId + ']').height("16px");
                $('.comment-input[feedLogId=' + feedLogId + ']').focus();
            });
        }
    };
}(window.Isporttl_Athlete = window.Isporttl_Athlete || {}, jQuery));
(function(Isporttl_ActivityFeed, $, undefined) {
    var currentPersonalRecordCourseId = -1;
    var currentLeaderboardCourseId = -1;
    var currentUserLeaderboardCourseId = -1;
    var currentPoolId = -1;
    var processing = false;
    var tab1_cur_page = 1;
    var tab1_num_of_row = 3;
    var tab2_cur_page = 1;
    var tab2_num_of_row = 4;
    var tab3_cur_page = 1;
    var tab3_num_of_row = 4;
    common.settings.useAjaxGlobalLoader = true;
    Isporttl_ActivityFeed.Init = function() {
        Isporttl_ActivityFeed.eventForHomeTab();
        Isporttl_ActivityFeed.InitLayout();
        Isporttl_ActivityFeed.InitBackButton();
    };
    Isporttl_ActivityFeed.eventForHomeTab = function() {
        $(".jsHomeTabTitle").click(function() {
            var status = $(this).attr("status");
            if (status !== "disable") {
                $(".jsHomeTabTitle").not(this).removeClass("active");
                $(".jsHomeTab").hide();
                $(".jsSettingTab").hide();
                $(this).addClass("active");
                var subContent = $(this).attr("subContent");
                $("#" + subContent).show();
            }
        });
    };
    Isporttl_ActivityFeed.InitBackButton = function() {
        swim_AjaxBrowser.Init(function() {
            return Isporttl_Athlete.feed.getSearchData();
        }, function(obj) {
            if (obj.getWhat === 4) {
                Isporttl_ActivityFeed.ActiveTab('js_clubWorkoutFeed');
            } else if (obj.getWhat === 2) {
                Isporttl_ActivityFeed.ActiveTab('js_myWorkoutFeed');
            } else if (obj.getWhat === 3) {
                Isporttl_ActivityFeed.ActiveTab('js_allWorkoutFeed');
            }
            if (obj.feedLogId !== 0) {
                $('#feedLogId').val(obj.feedLogId);
            }
            Isporttl_Athlete.feed.search(obj);
        }, function(obj) {
            return Isporttl_Athlete.feed.decodeSearchData(obj);
        });
    };
    Isporttl_ActivityFeed.InitLayout = function() {
        var urlHomeFeed = $(location).attr('href');
        if (urlHomeFeed.indexOf('#4') !== -1) {
            Isporttl_ActivityFeed.ActiveTab('js_clubWorkoutFeed');
        } else if (urlHomeFeed.indexOf('#2') !== -1) {
            Isporttl_ActivityFeed.ActiveTab('js_myWorkoutFeed');
        } else if (urlHomeFeed.indexOf('#3') !== -1) {
            Isporttl_ActivityFeed.ActiveTab('js_allWorkoutFeed');
        }
        currentPersonalRecordCourseId = $("#defaultPersonalRecordCourseId").val();
        currentLeaderboardCourseId = $("#defaultLeaderboardCourseId").val();
        currentUserLeaderboardCourseId = $("#defaultUserLBCourseId").val();
        currentPoolId = $("#homePoolId").length > 0 ? $("#homePoolId").val() : -1;
        $("#coursePersonalRecordSelector").kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value"
        });
        $("#courseUserLeaderboardSelector").kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value"
        });
        $("#courseLeaderboardSelector").kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value"
        });
        $(".courseSelectionArrow").live("click", function() {
            $(this).closest(".jsTabGroup").find(".showCourseSelectionContainer").show();
        });
        $("#chooseLeaderboardCourseCurrentSelect").live("click", function() {
            tab1_cur_page = 1;
            currentLeaderboardCourseId = $("#courseLeaderboardSelector").data("kendoDropDownList").value();
            $("#hdNotAutoUpdateCoursePool").val("false");
            getPoolLeaderboard();
            $(this).parents(".parentCourseListContainer").find(".showCourseSelectionContainer").hide();
        });
        $("#cancelLeaderboardCourseCurrentSelect").live("click", function() {
            $("#courseLeaderboardSelector").data("kendoDropDownList").select(function(dataItem) {
                return dataItem.value === currentLeaderboardCourseId;
            });
            $(this).parents(".parentCourseListContainer").find(".showCourseSelectionContainer").hide();
        });
        $("#choosePersonalRecordCourseCurrentSelect").live("click", function() {
            tab3_cur_page = 1;
            currentPersonalRecordCourseId = $("#coursePersonalRecordSelector").data("kendoDropDownList").value();
            $("#hdNotAutoUpdatePRCourse").val("false");
            getPersonalRecord();
            $(this).parents(".parentCourseListContainer").find(".showCourseSelectionContainer").hide();
        });
        $("#cancelPersonalRecordCourseCurrentSelect").live("click", function() {
            $("#coursePersonalRecordSelector").data("kendoDropDownList").select(function(dataItem) {
                return dataItem.value === currentPersonalRecordCourseId;
            });
            $(this).parents(".showCourseSelectionContainer").hide();
        });
        $("#chooseUserLeaderboardCourseCurrentSelect").live("click", function() {
            tab2_cur_page = 1;
            currentUserLeaderboardCourseId = $("#courseUserLeaderboardSelector").data("kendoDropDownList").value();
            $("#hdNotAutoUpdateUserLBCourse").val("false");
            getUserLeaderboard();
            $(this).parents(".parentCourseListContainer").find(".showCourseSelectionContainer").hide();
        });
        $("#cancelUserLeaderboardCourseCurrentSelect").live("click", function() {
            $("#courseUserLeaderboardSelector").data("kendoDropDownList").select(function(dataItem) {
                return dataItem.value === currentUserLeaderboardCourseId;
            });
            $(this).parents(".showCourseSelectionContainer").hide();
        });
        $(".viewAllPersonalRecord").live("click", function() {
            $(".personalRecordsection").show();
            $(this).parents("div:first").remove();
        });
        $(".viewAllActivityFeed").live("click", function() {
            $(".leaderboardSection").show();
            $(this).parents("div:first").remove();
        });
        $(".js_myWorkoutFeed").click(function() {
            Isporttl_ActivityFeed.ActiveTab('js_myWorkoutFeed');
            $('#getWhat').val("2");
            $('#teamId').val("0");
            swim_AjaxBrowser.SetHash(Isporttl_Athlete.feed.encodeSearchData(), false);
        });
        $(".js_allWorkoutFeed").click(function() {
            Isporttl_ActivityFeed.ActiveTab('js_allWorkoutFeed');
            $('#getWhat').val("3");
            $('#teamId').val("0");
            swim_AjaxBrowser.SetHash(Isporttl_Athlete.feed.encodeSearchData(), false);
        });
        $("#js_SubMenu").hover(function() {
            $("#js_SubMenu").addClass("active");
        }, function() {
            $("#js_SubMenu").removeClass("active");
        });
        $(".js_dropdown").click(function() {
            $("#js_SubMenu").addClass("active");
        });
        $(".js_club_iteam").click(function() {
            $("#js_SubMenu").removeClass("active");
        });
    };
    Isporttl_ActivityFeed.getTeamDetail = function(teamId) {
        if (teamId == "0" && $('#js_Menu2').html().trim().length == 0) {
            Isporttl_ActivityFeed.getActivityFeedByTeamId(teamId);
            $.ajax({
                url: 'ajax/menuclub',
                type: 'GET',
                success: function(data) {
                    $('div.js-ajax-waiting').hide();
                    $('#js_Menu2').html(data);
                }
            });
        } else {
            Isporttl_ActivityFeed.getActivityFeedByTeamId(teamId);
        }
    };
    Isporttl_ActivityFeed.getActivityFeedByTeamId = function(teamId) {
        Isporttl_ActivityFeed.ActiveTab('js_clubWorkoutFeed');
        $('#getWhat').val("4");
        $('#teamId').val(teamId);
        $(".js_club_iteam").removeClass('add-check');
        var js_club_teamId = "js_club_" + teamId;
        $("." + js_club_teamId).addClass('add-check');
        $('.js_dropdown_club').html($("." + js_club_teamId).find('a').html());
        swim_AjaxBrowser.SetHash(Isporttl_Athlete.feed.encodeSearchData(), false);
    };
    Isporttl_ActivityFeed.ActiveTab = function(className) {
        Isporttl_Athlete.feed.settings.pageIndex = 1;
        if (className === 'js_clubWorkoutFeed') {
            $('#js_Menu2').show();
            $('#jsTabClubDontHaveDropdown').show();
            $('#jsTabClubHaveDropdown').hide();
        } else {
            $('#js_Menu2').hide();
            $('#jsTabClubDontHaveDropdown').hide();
            $('#jsTabClubHaveDropdown').show();
        }
        $('div.js_feed_list').onScrollBeyond('enable');
        $(".js_workoutTab").removeClass('active');
        $('.js_workoutTab').find('.js_workoutTabdivIE').remove();
        $("." + className).addClass('active');
        var textTab = $("." + className).html();
        $("." + className).html('<div class="js_workoutTabdivIE corner06_tl"></div> <div class="js_workoutTabdivIE corner06_tr"></div>' + textTab);
    };

    function getPersonalRecord() {
        if (currentPersonalRecordCourseId !== "" && !isNaN(currentPersonalRecordCourseId)) {
            var isAutoUpdate = $("#hdNotAutoUpdateCourse").val();
            var preferrCourseSize = Number($("#hdListPreferrCourseSize").val());
            if (!tab3_cur_page) {
                tab3_cur_page = 1;
            }
            if (!tab3_num_of_row) {
                tab3_num_of_row = 10;
            }
            var path = "/ajax/personalrecordwidget";
            if (preferrCourseSize > 0) {
                $.get(path, {
                    swimCourseType: currentPersonalRecordCourseId,
                    isNotAutoUpdatePreferCourse: isAutoUpdate,
                    pageIndex: tab3_cur_page,
                    pageSize: tab3_num_of_row
                }, function(result) {
                    $("#jsPersonalRecordTab").find(".jsContentList").html(result);
                    tab3_cur_page = updateStatusArrow($("#jsPersonalRecordTab"), tab3_cur_page);
                    $("#hdNotAutoUpdatePRCourse").val("true");
                });
            }
        } else {
            $("#tabPersonalRecord").attr("status", "disable").css("cursor", "default");
        }
    }

    function getUserLeaderboard() {
        if (currentUserLeaderboardCourseId !== "" && !isNaN(currentUserLeaderboardCourseId)) {
            var isAutoUpdate = $("#hdNotAutoUpdateUserLBCourse").val();
            var preferrCourseSize = Number($("#hdlistPreferrCourseUserLBSize").val());
            var path = "/ajax/myleaderboardwidget/" + currentUserLeaderboardCourseId;
            if (preferrCourseSize > 0) {
                $.get(path, {
                    isNotAutoUpdatePreferCourse: isAutoUpdate,
                    pageIndex: tab2_cur_page,
                    pageSize: tab2_num_of_row,
                    orderByName: "placeName",
                    orderbyMethod: "asc"
                }, function(result) {
                    $("#jsLeaderboardTab").find(".jsContentList").html(result);
                    tab2_cur_page = updateStatusArrow($("#jsLeaderboardTab"), tab2_cur_page);
                    $("#hdNotAutoUpdateUserLBCourse").val("true");
                });
            }
        } else {
            $("#tabLeaderboard").attr("status", "disable").css("cursor", "default");
        }
    }

    function getPoolLeaderboard() {
        if (!isNaN(currentLeaderboardCourseId)) {
            var path = "/ajax/leaderboardwidget";
            var isAutoUpdate = $("#hdNotAutoUpdateCoursePool").val();
            var preferrCourseSize = Number($("#hdListPreferrCoursePoolSize").val());
            if (preferrCourseSize > 0) {
                $.get(path, {
                    swimCourseType: currentLeaderboardCourseId,
                    poolId: currentPoolId,
                    isNotAutoUpdatePreferCourse: isAutoUpdate,
                    pageIndex: tab1_cur_page,
                    pageSize: tab1_num_of_row
                }, function(result) {
                    $("#jsPoolInfoHomeTab").find(".jsContentList").html(result);
                    tab1_cur_page = updateStatusArrow($("#jsPoolInfoHomeTab"), tab1_cur_page);
                    $("#hdNotAutoUpdateCoursePool").val("true");
                });
            }
        }
    }

    function initAlertPopup() {
        $("#divAlertBgWU").click(function() {
            if (!$('#divAlertPopupAchivement').is(':hidden')) {
                $('#divAlertBgWU').hide();
                $('#divAlertPopupAchivement').hide();
            }
        });
        $(document).keypress(function(e) {
            if (e.which == 13 && $("#divAlertWU").is(':visible')) {
                $("#divAlertWU").find('.js_btn_continue').trigger('click');
            }
        });
        $("#btnLaterWU").live("click", function() {
            $.ajax({
                url: '/athlete/viewLater',
                type: 'GET',
                success: function() {
                    $('div.js-ajax-waiting').hide();
                    $("#divAlertWU").hide();
                    $('#divAlertBgWU').hide();
                }
            });
        });
        $("#btnViewWU").live("click", function() {
            $.ajax({
                url: '/athlete/viewunassociate',
                type: 'GET',
                success: function() {
                    $('div.js-ajax-waiting').hide();
                    window.location = $('#workoutListUrl').val();
                }
            });
        });
        if ($('#numberOfWorkoutNotAssociated').html()) {
            $("#divAlertWU").center().show();
            $('#divAlertBgWU').show();
        }
    }

    function eventMovePageForUserLeaderboard() {
        $("#jsLeaderboardTab").find(".jsLeftArrow").click(function() {
            if ($(this).hasClass("view_allrecord_left_enable") && !processing) {
                tab2_cur_page--;
                processing = true;
                getUserLeaderboard();
            }
        });
        $("#jsLeaderboardTab").find(".jsRightArrow").click(function() {
            if ($(this).hasClass("view_allrecord_right_enable") && !processing) {
                tab2_cur_page++;
                processing = true;
                getUserLeaderboard();
            }
        });
    }

    function eventMovePageForPersonalRecord() {
        $("#jsPersonalRecordTab").find(".jsLeftArrow").click(function() {
            if ($(this).hasClass("view_allrecord_left_enable") && !processing) {
                tab3_cur_page--;
                processing = true;
                getPersonalRecord();
            }
        });
        $("#jsPersonalRecordTab").find(".jsRightArrow").click(function() {
            if ($(this).hasClass("view_allrecord_right_enable") && !processing) {
                tab3_cur_page++;
                processing = true;
                getPersonalRecord();
            }
        });
    }

    function eventMovePageForPoolLeaderboard() {
        $("#jsPoolInfoHomeTab").find(".jsLeftArrow").click(function() {
            if ($(this).hasClass("view_allrecord_left_enable") && !processing) {
                tab1_cur_page--;
                processing = true;
                getPoolLeaderboard();
            }
        });
        $("#jsPoolInfoHomeTab").find(".jsRightArrow").click(function() {
            if ($(this).hasClass("view_allrecord_right_enable") && !processing) {
                tab1_cur_page++;
                processing = true;
                getPoolLeaderboard();
            }
        });
    }

    function updateStatusArrow(parent, cur_page) {
        var leftArrow = $(parent).find(".jsLeftArrow");
        var rightArrow = $(parent).find(".jsRightArrow");
        var hasMore = $(parent).find(".jsDatalist").attr("hasMoreData");
        if (cur_page > 1) {
            $(leftArrow).removeClass("view_allrecord_left_disable").addClass("view_allrecord_left_enable");
        } else {
            $(leftArrow).addClass("view_allrecord_left_disable").removeClass("view_allrecord_left_enable");
        }
        if (hasMore !== undefined && hasMore !== "" && hasMore.toLowerCase() === "true") {
            $(rightArrow).removeClass("view_allrecord_right_disable").addClass("view_allrecord_right_enable");
        } else {
            $(rightArrow).addClass("view_allrecord_right_disable").removeClass("view_allrecord_right_enable");
        }
        processing = false;
        return cur_page;
    }

    function updateTabNoContent() {
        var poolId = Number($("#homePoolId").val());
        var tag = $("#jsPoolInfoHomeTab");
        var courseSize = $(tag).find($("#hdListPoolCourseSize")).val();
        if (poolId === 0 || (courseSize === "" && Number(courseSize) < 1)) {
            if (poolId === 0) {
                $(".jsPoolSection").find(".jsPoolInfo").height(117);
            } else {
                $(".jsPoolSection").find(".jsPoolInfo").height(210);
            }
            $(".jsPoolSection").find(".wrap_record").height("auto");
            $(tag).find(".jsSettingSpan").hide();
        }
    }

    function showHideSettingIcon(tab, hdSize) {
        $(tab).find(".jsSettingSpan").css("visibility", "");
        var courseSize = $(tab).find(hdSize).val();
        if (courseSize === "" && Number(courseSize) < 1) {
            $(tab).find(".jsSettingSpan").find(".jsSettingIcon").hide();
        }
    }

    function showBottomBarOfTab() {
        $(".jsPoolSection").hover(function() {
            if ($("#jsPoolInfoHomeTab").is(":visible")) {
                var tab = $("#jsPoolInfoHomeTab");
                var poolId = Number($("#homePoolId").val());
                if (poolId !== 0) {
                    $(tab).find(".jsSettingSpan").css("visibility", "");
                }
                showHideSettingIcon(tab, $("#hdListPoolCourseSize"));
            } else if ($("#jsLeaderboardTab").is(":visible")) {
                showHideSettingIcon($("#jsLeaderboardTab"), $("#hdListUserLBCourseSize"));
            } else if ($("#jsPersonalRecordTab").is(":visible")) {
                showHideSettingIcon($("#jsPersonalRecordTab"), $("#hdListUserCourseSize"));
            }
        }, function() {
            if ($("#jsPoolInfoHomeTab").is(":visible")) {
                $("#jsPoolInfoHomeTab").find(".jsSettingSpan").css("visibility", "hidden");
            } else if ($("#jsLeaderboardTab").is(":visible")) {
                $("#jsLeaderboardTab").find(".jsSettingSpan").css("visibility", "hidden");
            } else if ($("#jsPersonalRecordTab").is(":visible")) {
                $("#jsPersonalRecordTab").find(".jsSettingSpan").css("visibility", "hidden");
            }
        });
    }
    $(function() {
        Isporttl_ActivityFeed.Init();
        Isporttl_Athlete.feed.init();
        initAlertPopup();
        $('.jsInviteFriend').bind("click", function() {
            var type = $(this).attr("socialType");
            var size = "width=1400,height=400";
            if (typeof type !== "undefined") {
                window.open('/SocialLogin/' + type + '?action=cache&isSecure=' + common.isSecure() + '&urlRedirect=swimmers?type=' + type, '_blank', 'location=0,status=0,menubar =0,scrollbars=1,' + size);
            }
        });
        $.get("/ajax/recommendconnection", function(result) {
            $(".recommendConnectionHeader").html(result);
            setFocus();
        });
        $.get("/home/myclubs", function(result) {
            $(".nearbyClubHeader").html(result);
            setFocus();
        });

        function setFocus() {
            $("a").not(":has(>img),:has(>div)").addClass("link-focus");
            $("a:has(>img)").focusin(function() {
                if ($(this).parent().hasClass("feed")) {
                    $(this).parent().addClass("input-focus");
                } else {
                    $(this).parent().parent().addClass("input-focus");
                }
            });
            $("a:has(>img)").focusout(function() {
                if ($(this).parent().hasClass("feed")) {
                    $(this).parent().removeClass("input-focus");
                } else {
                    $(this).parent().parent().removeClass("input-focus");
                }
            });
            $("a:has(>div)").focusin(function() {
                $(">div", this).addClass("input-focus");
            });
            $("a:has(>div)").focusout(function() {
                $(">div", this).removeClass("input-focus");
            });
            $("a.ico-wd-facebook").removeClass("link-focus");
        }
        getPoolLeaderboard();
        eventMovePageForPoolLeaderboard();
        getPersonalRecord();
        eventMovePageForPersonalRecord();
        getUserLeaderboard();
        eventMovePageForUserLeaderboard();
        showHideSettingIcon($("#jsPoolInfoHomeTab"), $("#hdListPoolCourseSize"));
        showHideSettingIcon($("#jsLeaderboardTab"), $("#hdListUserLBCourseSize"));
        showHideSettingIcon($("#jsPersonalRecordTab"), $("#hdListUserCourseSize"));
        updateTabNoContent();
        showBottomBarOfTab();
        setFocus();
    });
}(window.Isporttl_ActivityFeed = window.Isporttl_ActivityFeed || {}, jQuery));
(function(a) {
    var r = a.fn.domManip,
        d = "_tmplitem",
        q = /^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /,
        b = {},
        f = {},
        e, p = {
            key: 0,
            data: {}
        },
        h = 0,
        c = 0,
        l = [];

    function g(e, d, g, i) {
        var c = {
            data: i || (d ? d.data : {}),
            _wrap: d ? d._wrap : null,
            tmpl: null,
            parent: d || null,
            nodes: [],
            calls: u,
            nest: w,
            wrap: x,
            html: v,
            update: t
        };
        e && a.extend(c, e, {
            nodes: [],
            parent: d
        });
        if (g) {
            c.tmpl = g;
            c._ctnt = c._ctnt || c.tmpl(a, c);
            c.key = ++h;
            (l.length ? f : b)[h] = c
        }
        return c
    }
    a.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(f, d) {
        a.fn[f] = function(n) {
            var g = [],
                i = a(n),
                k, h, m, l, j = this.length === 1 && this[0].parentNode;
            e = b || {};
            if (j && j.nodeType === 11 && j.childNodes.length === 1 && i.length === 1) {
                i[d](this[0]);
                g = this
            } else {
                for (h = 0, m = i.length; h < m; h++) {
                    c = h;
                    k = (h > 0 ? this.clone(true) : this).get();
                    a.fn[d].apply(a(i[h]), k);
                    g = g.concat(k)
                }
                c = 0;
                g = this.pushStack(g, f, i.selector)
            }
            l = e;
            e = null;
            a.tmpl.complete(l);
            return g
        }
    });
    a.fn.extend({
        tmpl: function(d, c, b) {
            return a.tmpl(this[0], d, c, b)
        },
        tmplItem: function() {
            return a.tmplItem(this[0])
        },
        template: function(b) {
            return a.template(b, this[0])
        },
        domManip: function(d, l, j) {
            if (d[0] && d[0].nodeType) {
                var f = a.makeArray(arguments),
                    g = d.length,
                    i = 0,
                    h;
                while (i < g && !(h = a.data(d[i++], "tmplItem")));
                if (g > 1) f[0] = [a.makeArray(d)];
                if (h && c) f[2] = function(b) {
                    a.tmpl.afterManip(this, b, j)
                };
                r.apply(this, f)
            } else r.apply(this, arguments);
            c = 0;
            !e && a.tmpl.complete(b);
            return this
        }
    });
    a.extend({
        tmpl: function(d, h, e, c) {
            var j, k = !c;
            if (k) {
                c = p;
                d = a.template[d] || a.template(null, d);
                f = {}
            } else if (!d) {
                d = c.tmpl;
                b[c.key] = c;
                c.nodes = [];
                c.wrapped && n(c, c.wrapped);
                return a(i(c, null, c.tmpl(a, c)))
            }
            if (!d) return [];
            if (typeof h === "function") h = h.call(c || {});
            e && e.wrapped && n(e, e.wrapped);
            j = a.isArray(h) ? a.map(h, function(a) {
                return a ? g(e, c, d, a) : null
            }) : [g(e, c, d, h)];
            return k ? a(i(c, null, j)) : j
        },
        tmplItem: function(b) {
            var c;
            if (b instanceof a) b = b[0];
            while (b && b.nodeType === 1 && !(c = a.data(b, "tmplItem")) && (b = b.parentNode));
            return c || p
        },
        template: function(c, b) {
            if (b) {
                if (typeof b === "string") b = o(b);
                else if (b instanceof a) b = b[0] || {};
                if (b.nodeType) b = a.data(b, "tmpl") || a.data(b, "tmpl", o(b.innerHTML));
                return typeof c === "string" ? (a.template[c] = b) : b
            }
            return c ? typeof c !== "string" ? a.template(null, c) : a.template[c] || a.template(null, q.test(c) ? c : a(c)) : null
        },
        encode: function(a) {
            return ("" + a).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;")
        }
    });
    a.extend(a.tmpl, {
        tag: {
            tmpl: {
                _default: {
                    $2: "null"
                },
                open: "if($notnull_1){_=_.concat($item.nest($1,$2));}"
            },
            wrap: {
                _default: {
                    $2: "null"
                },
                open: "$item.calls(_,$1,$2);_=[];",
                close: "call=$item.calls();_=call._.concat($item.wrap(call,_));"
            },
            each: {
                _default: {
                    $2: "$index, $value"
                },
                open: "if($notnull_1){$.each($1a,function($2){with(this){",
                close: "}});}"
            },
            "if": {
                open: "if(($notnull_1) && $1a){",
                close: "}"
            },
            "else": {
                _default: {
                    $1: "true"
                },
                open: "}else if(($notnull_1) && $1a){"
            },
            html: {
                open: "if($notnull_1){_.push($1a);}"
            },
            "=": {
                _default: {
                    $1: "$data"
                },
                open: "if($notnull_1){_.push($.encode($1a));}"
            },
            "!": {
                open: ""
            }
        },
        complete: function() {
            b = {}
        },
        afterManip: function(f, b, d) {
            var e = b.nodeType === 11 ? a.makeArray(b.childNodes) : b.nodeType === 1 ? [b] : [];
            d.call(f, b);
            m(e);
            c++
        }
    });

    function i(e, g, f) {
        var b, c = f ? a.map(f, function(a) {
            return typeof a === "string" ? e.key ? a.replace(/(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g, "$1 " + d + '="' + e.key + '" $2') : a : i(a, e, a._ctnt)
        }) : e;
        if (g) return c;
        c = c.join("");
        c.replace(/^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/, function(f, c, e, d) {
            b = a(e).get();
            m(b);
            if (c) b = j(c).concat(b);
            if (d) b = b.concat(j(d))
        });
        return b ? b : j(c)
    }

    function j(c) {
        var b = document.createElement("div");
        b.innerHTML = c;
        return a.makeArray(b.childNodes)
    }

    function o(b) {
        return new Function("jQuery", "$item", "var $=jQuery,call,_=[],$data=$item.data;with($data){_.push('" + a.trim(b).replace(/([\\'])/g, "\\$1").replace(/[\r\t\n]/g, " ").replace(/\$\{([^\}]*)\}/g, "{{= $1}}").replace(/\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g, function(m, l, j, d, b, c, e) {
            var i = a.tmpl.tag[j],
                h, f, g;
            if (!i) throw "Template command not found: " + j;
            h = i._default || [];
            if (c && !/\w$/.test(b)) {
                b += c;
                c = ""
            }
            if (b) {
                b = k(b);
                e = e ? "," + k(e) + ")" : c ? ")" : "";
                f = c ? b.indexOf(".") > -1 ? b + c : "(" + b + ").call($item" + e : b;
                g = c ? f : "(typeof(" + b + ")==='function'?(" + b + ").call($item):(" + b + "))"
            } else g = f = h.$1 || "null";
            d = k(d);
            return "');" + i[l ? "close" : "open"].split("$notnull_1").join(b ? "typeof(" + b + ")!=='undefined' && (" + b + ")!=null" : "true").split("$1a").join(g).split("$1").join(f).split("$2").join(d ? d.replace(/\s*([^\(]+)\s*(\((.*?)\))?/g, function(d, c, b, a) {
                a = a ? "," + a + ")" : b ? ")" : "";
                return a ? "(" + c + ").call($item" + a : d
            }) : h.$2 || "") + "_.push('"
        }) + "');}return _;")
    }

    function n(c, b) {
        c._wrap = i(c, true, a.isArray(b) ? b : [q.test(b) ? b : a(b).html()]).join("")
    }

    function k(a) {
        return a ? a.replace(/\\'/g, "'").replace(/\\\\/g, "\\") : null
    }

    function s(b) {
        var a = document.createElement("div");
        a.appendChild(b.cloneNode(true));
        return a.innerHTML
    }

    function m(o) {
        var n = "_" + c,
            k, j, l = {},
            e, p, i;
        for (e = 0, p = o.length; e < p; e++) {
            if ((k = o[e]).nodeType !== 1) continue;
            j = k.getElementsByTagName("*");
            for (i = j.length - 1; i >= 0; i--) m(j[i]);
            m(k)
        }

        function m(j) {
            var p, i = j,
                k, e, m;
            if (m = j.getAttribute(d)) {
                while (i.parentNode && (i = i.parentNode).nodeType === 1 && !(p = i.getAttribute(d)));
                if (p !== m) {
                    i = i.parentNode ? i.nodeType === 11 ? 0 : i.getAttribute(d) || 0 : 0;
                    if (!(e = b[m])) {
                        e = f[m];
                        e = g(e, b[i] || f[i], null, true);
                        e.key = ++h;
                        b[h] = e
                    }
                    c && o(m)
                }
                j.removeAttribute(d)
            } else if (c && (e = a.data(j, "tmplItem"))) {
                o(e.key);
                b[e.key] = e;
                i = a.data(j.parentNode, "tmplItem");
                i = i ? i.key : 0
            }
            if (e) {
                k = e;
                while (k && k.key != i) {
                    k.nodes.push(j);
                    k = k.parent
                }
                delete e._ctnt;
                delete e._wrap;
                a.data(j, "tmplItem", e)
            }

            function o(a) {
                a = a + n;
                e = l[a] = l[a] || g(e, b[e.parent.key + n] || e.parent, null, true)
            }
        }
    }

    function u(a, d, c, b) {
        if (!a) return l.pop();
        l.push({
            _: a,
            tmpl: d,
            item: this,
            data: c,
            options: b
        })
    }

    function w(d, c, b) {
        return a.tmpl(a.template(d), c, b, this)
    }

    function x(b, d) {
        var c = b.options || {};
        c.wrapped = d;
        return a.tmpl(a.template(b.tmpl), b.data, c, b.item)
    }

    function v(d, c) {
        var b = this._wrap;
        return a.map(a(a.isArray(b) ? b.join("") : b).filter(d || "*"), function(a) {
            return c ? a.innerText || a.textContent : a.outerHTML || s(a)
        })
    }

    function t() {
        var b = this.nodes;
        a.tmpl(null, null, null, this).insertBefore(b[0]);
        a(b).remove()
    }
})(jQuery);
(function(Isporttl_Comment, $, undefined) {
    var jComment = null;
    Isporttl_Comment.statusPENDING = 'PENDING';
    Isporttl_Comment.statusACTIVE = 'ACTIVE';
    Isporttl_Comment.init = function() {
        $('#jsUpdateComment').click(function() {
            var commentContent = $("#commentPendingContent").html();
            Isporttl_Comment.jComment.val(commentContent);
            Isporttl_Comment.jComment.focus();
            $('#statusComment').val(Isporttl_Comment.statusACTIVE);
            Isporttl_Comment.hidePopupError();
        });
        $('#btnCommentPending').click(function() {
            $("#divAlertBgWU").hide();
            $('#divAlertCommentPending').hide();
            Isporttl_Comment.jComment.val('');
            Isporttl_Comment.jComment.focus();
        });
    };
    Isporttl_Comment.showPopupError = function(jComment, commentContent) {
        Isporttl_Comment.jComment = jComment;
        $("#commentPendingContent").html(commentContent);
        $("#divAlertBgWU").show();
        $('#divAlertComment').center().show();
    };
    Isporttl_Comment.showPopupPending = function() {
        $('#commentStatus').val(Isporttl_Comment.statusACTIVE);
        $("#divAlertBgWU").show();
        $('#divAlertCommentPending').center().show();
    };
    Isporttl_Comment.hidePopupError = function() {
        $("#divAlertBgWU").hide();
        $('#divAlertComment').hide();
    };
    $(function() {
        Isporttl_Comment.init();
    });
}(window.Isporttl_Comment = window.Isporttl_Comment || {}, jQuery));