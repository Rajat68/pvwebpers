<script>
(function () {
  /***************************************************************************************
   **************EDITABLE SECTION - CONFIGURE THESE VALUES - CREATED BY KINESSO***********
   ***************************************************************************************/
  
  var u = "wpmyproject",          // Edit the value of UTM SOURCE based on which content needs to be changed
      m = "wpmyproject",          // Edit the value of UTM MEDIUM based on which content needs to be changed
      p = "$55000",               // Edit the value of the element
      btn = "Special Offer",      // Edit the value of the element
      exp = 30,                   // Edit the expiration of the cookie
      cname = "ksowpmatch",       // Edit the cookie name
      selPrice = [
        "span.price-item--regular",
        "dd[data-cart-item-regular-price]"
      ],                          // Add the comma-separated selectors for textContent changes
      selBtn = [
        "input.cart__submit.btn.btn--small-wide",
        "button.checkout"
      ],                          // Add the comma-separated selectors for value attribute content changes
      cid = {{Updated _ga value}}, // GTM variable to inject the updated GA client ID

      meta = {                    // Edit the dataLayer variables as required
        campaignType: "price_promotion",
        audienceSegment: "high_value_customers",
        promotionTier: "premium_discount"
      },

      isPriceEnabled = true,      // Set to 'true' if you want price updates to occur
      isBtnEnabled = true;        // Set to 'true' if you want button value updates to occur

  /********************************************************************************
   ***********MAIN CODE - DO NOT EDIT BELOW THIS SECTION OF THE CODE***************
   ********************************************************************************/

  // Hide initial price elements until updated
  selPrice.forEach(function (selector) {
    var style = document.createElement("style");
    style.innerHTML = selector + "{visibility:hidden;}";
    document.head.appendChild(style);
  });

  // Cookie setter
  function setCookie(src, med) {
    var d = new Date();
    d.setTime(d.getTime() + exp * 86400000); // 86400000 = ms in a day
    var value = JSON.stringify({
      source: src,
      medium: med,
      metadata: meta
    });
    document.cookie = cname + "=" + encodeURIComponent(value) + ";expires=" + d.toUTCString() + ";path=/";
  }

  // Cookie getter
  function getCookie() {
    var prefix = cname + "=";
    var parts = document.cookie.split(";");
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i].trim();
      if (part.indexOf(prefix) === 0) {
        try {
          return JSON.parse(decodeURIComponent(part.substring(prefix.length)));
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  // Get URL parameters
  function getParams() {
    var q = {};
    var qs = window.location.search.substring(1).split("&");
    for (var i = 0; i < qs.length; i++) {
      var pair = qs[i].split("=");
      if (pair.length === 2) {
        q[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      }
    }
    return q;
  }

  // Check if current user matches UTM parameters or has valid cookie
  function isMatch(params) {
    var srcMatch = params.utm_source && params.utm_source.toLowerCase() === u.toLowerCase();
    var medMatch = !m || (params.utm_medium && params.utm_medium.toLowerCase() === m.toLowerCase());

    if (srcMatch && medMatch) {
      setCookie(params.utm_source, params.utm_medium);
      return true;
    }

    var cookie = getCookie();
    return !!cookie &&
      cookie.source &&
      cookie.source.toLowerCase() === u.toLowerCase() &&
      (!m || (cookie.medium && cookie.medium.toLowerCase() === m.toLowerCase()));
  }

  // Push change data to dataLayer
  function pushData(originalText, updatedText, type, selector) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "wp_contentmodify",
      cid: cid,
      original_text: originalText,
      updated_text: updatedText,
      field_type: type,
      element_selector: selector,
      personalization_data: meta,
      utm_match: {
        source: u,
        medium: m
      },
      timestamp: new Date().toISOString()
    });
  }

  // Update content based on conditions
  function updateContent() {
    var params = getParams();
    if (!isMatch(params)) return false;

    var updated = false;

    if (isPriceEnabled) {
      selPrice.forEach(function (selector) {
        var elements = document.querySelectorAll(selector);
        for (var i = 0; i < elements.length; i++) {
          var el = elements[i];
          if (el && el.textContent.trim() !== p) {
            var originalText = el.textContent.trim();
            el.textContent = p;
            el.style.visibility = "visible";
            pushData(originalText, p, "textContent", selector);
            updated = true;
          } else if (el) {
            el.style.visibility = "visible";
          }
        }
      });
    }

    if (isBtnEnabled) {
      selBtn.forEach(function (selector) {
        var elements = document.querySelectorAll(selector);
        for (var i = 0; i < elements.length; i++) {
          var el = elements[i];
          if (el && el.value.trim() !== btn) {
            var originalVal = el.value.trim();
            el.value = btn;
            pushData(originalVal, btn, "valueAttribute", selector);
            updated = true;
          }
        }
      });
    }

    return updated;
  }

  // Initialization with MutationObserver fallback
  function init() {
    if (updateContent()) return;

    var observer = new MutationObserver(function () {
      if (updateContent()) observer.disconnect();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });

    setTimeout(updateContent, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
</script>
