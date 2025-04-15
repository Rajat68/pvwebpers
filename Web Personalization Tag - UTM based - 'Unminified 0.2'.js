<script>
(function () {
  /***************************************************************************************
   **************EDITABLE SECTION - CONFIGURE THESE VALUES - CREATED BY KINESSO***********
   ***************************************************************************************/
  var utm_source = "wpmyproject", //Add UTM SOURCE to match
      utm_medium = "wpmyproject", //Add UTM MEDIUM to match
      price_value = "$55000", //Add updated price
      button_value = "Special Offer", // Add updated button or CTA value
      cookie_expiry_days = 30, //Set Cookie expiration days
      cookie_name = "ksowpmatch", //Set Cookie name
      price_selectors = [ //Add comma seperated price selectors
        "span.price-item--regular",
        "dd[data-cart-item-regular-price]"
      ],
      button_selectors = [  //Add comma seperated btn selectors
        "input.cart__submit.btn.btn--small-wide",
        "button.checkout"
      ],
      ga_client_id = {{Updated _ga value}}, //Map ga cookie id
      personalization_meta = {   //Configure dataLayer variables
        campaignType: "price_promotion",
        audienceSegment: "high_value_customers",
        promotionTier: "premium_discount"
      },
      enable_price_update = true, //Set to 'true' if you want price updates to occur
      enable_button_update = true; //Set to 'true' if you want btn updates to occur

  /********************************************************************************
   ***********MAIN CODE - DO NOT EDIT BELOW THIS SECTION OF THE CODE***************
   ********************************************************************************/

  function getUrlParams() {
    var queryParams = {};
    var queryString = window.location.search.substring(1).split("&");
    for (var i = 0; i < queryString.length; i++) {
      var pair = queryString[i].split("=");
      if (pair.length === 2) {
        queryParams[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      }
    }
    return queryParams;
  }

  function setCookie(source, medium) {
    var expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + cookie_expiry_days * 86400000);
    var value = JSON.stringify({
      source: source,
      medium: medium,
      metadata: personalization_meta
    });
    document.cookie = cookie_name + "=" + encodeURIComponent(value) + ";expires=" + expiryDate.toUTCString() + ";path=/";
  }

  function getCookie() {
    var prefix = cookie_name + "=";
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.indexOf(prefix) === 0) {
        try {
          return JSON.parse(decodeURIComponent(cookie.substring(prefix.length)));
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  function isMatchingUTM(params) {
    var sourceMatch = params.utm_source && params.utm_source.toLowerCase() === utm_source.toLowerCase();
    var mediumMatch = !utm_medium || (params.utm_medium && params.utm_medium.toLowerCase() === utm_medium.toLowerCase());

    if (sourceMatch && mediumMatch) {
      setCookie(params.utm_source, params.utm_medium);
      return true;
    }

    var cookieData = getCookie();
    return !!cookieData &&
      cookieData.source &&
      cookieData.source.toLowerCase() === utm_source.toLowerCase() &&
      (!utm_medium || (cookieData.medium && cookieData.medium.toLowerCase() === utm_medium.toLowerCase()));
  }

  function pushToDataLayer(originalText, updatedText, fieldType, selector) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "wp_contentmodify",
      cid: ga_client_id,
      original_text: originalText,
      updated_text: updatedText,
      field_type: fieldType,
      element_selector: selector,
      personalization_data: personalization_meta,
      utm_match: {
        source: utm_source,
        medium: utm_medium
      },
      timestamp: new Date().toISOString()
    });
  }

  function hidePriceSelectorsInitially() {
    if (!enable_price_update) return;

    var style = document.createElement("style");
    style.id = "ksopricehide";
    var css = price_selectors.map(function (selector) {
      return selector + " { display: none !important; }";
    }).join(" ");
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  function revealPriceElements() {
    var styleEl = document.getElementById("ksopricehide");
    if (styleEl && styleEl.parentNode) {
      styleEl.parentNode.removeChild(styleEl);
    }

    price_selectors.forEach(function (selector) {
      var elements = document.querySelectorAll(selector);
      for (var i = 0; i < elements.length; i++) {
        elements[i].style.visibility = "visible";
        elements[i].style.display = ""; // Reset in case CSS was applied inline before
      }
    });
  }

  function updatePageContent() {
    var params = getUrlParams();
    var matched = isMatchingUTM(params);

    var updated = false;

    if (enable_price_update) {
      price_selectors.forEach(function (selector) {
        var elements = document.querySelectorAll(selector);
        for (var i = 0; i < elements.length; i++) {
          var el = elements[i];
          if (!el) continue;

          if (matched && el.textContent.trim() !== price_value) {
            var original = el.textContent.trim();
            el.textContent = price_value;
            el.style.visibility = "visible";
            el.style.display = "";
            pushToDataLayer(original, price_value, "textContent", selector);
            updated = true;
          } else if (matched) {
            el.style.visibility = "visible";
            el.style.display = "";
          }
        }
      });
    }

    if (enable_button_update && matched) {
      button_selectors.forEach(function (selector) {
        var elements = document.querySelectorAll(selector);
        for (var i = 0; i < elements.length; i++) {
          var el = elements[i];
          if (!el) continue;

          if (el.value && el.value.trim() !== button_value) {
            var original = el.value.trim();
            el.value = button_value;
            pushToDataLayer(original, button_value, "valueAttribute", selector);
            updated = true;
          }
        }
      });
    }

    if (matched) revealPriceElements();
    return updated;
  }

  function initContentUpdate() {
    if (updatePageContent()) return;

    var observer = new MutationObserver(function () {
      if (updatePageContent()) observer.disconnect();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });

    setTimeout(updatePageContent, 500);
  }

  hidePriceSelectorsInitially();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContentUpdate);
  } else {
    initContentUpdate();
  }

})();
</script>
