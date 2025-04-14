<script>
(function() {
  /***************************************************************************************
   **************EDITABLE SECTION - CONFIGURE THESE VALUES - CREATED BY KINESSO***********
   ***************************************************************************************/
  
  // UTM parameters to match
  var utmSource = "wpmyproject"; //Edit the value of UTMS based on which content needs to be changed
  var utmMedium = "wpmyproject"; //Edit the value of UTMS based on which content needs to be changed
  
  // New values to display
  var newPrice = "$55000";              //Edit the value of the element
  var newButtonValue = "Special Offer"; //Edit the value of the element
  
  // Cookie settings
  var cookieExpiryDays = 30;     //Edit the expiration of the cookie
  var cookieName = "ksowpmatch"; //Edit the cookie name
  
  // CSS selectors
  var priceSelectors = [
    "span.price-item--regular",     //Add the selectors for textContent changes
    "dd[data-cart-item-regular-price]"
  ];
  
  var buttonSelectors = [
    "input.cart__submit.btn.btn--small-wide",  //Add the selectors for value attribute content changes
    "button.checkout"
  ];
  
  // Tracking data
  var personalizationData = {                 //Edit the dataLayer variables as required
    campaignType: "price_promotion",         
    audienceSegment: "high_value_customers",
    promotionTier: "premium_discount"
  };

  /********************************************************************************
   ***********MAIN CODE - DO NOT EDIT BELOW THIS SECTION OF THE CODE***************
   ********************************************************************************/
  
  priceSelectors.forEach(function(s) {
    var style = document.createElement('style');
    style.innerHTML = s + "{visibility:hidden;}";
    document.head.appendChild(style);
  });

  function setCookie(source, medium) {
    var d = new Date();
    d.setTime(d.getTime() + (cookieExpiryDays * 864e5));
    var v = JSON.stringify({ source: source, medium: medium, metadata: personalizationData });
    document.cookie = cookieName + "=" + encodeURIComponent(v) + ";expires=" + d.toUTCString() + ";path=/";
  }

  function getCookie() {
    var n = cookieName + "=";
    var c = document.cookie.split(";");
    for (var i = 0; i < c.length; i++) {
      var x = c[i].trim();
      if (x.indexOf(n) === 0) {
        try {
          return JSON.parse(decodeURIComponent(x.substring(n.length)));
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  function getUTMParams() {
    var p = {}, q = window.location.search.substring(1).split("&");
    for (var i = 0; i < q.length; i++) {
      var pair = q[i].split("=");
      if (pair.length === 2) p[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return p;
  }

  function checkUTMMatch(p) {
    var matchSource = p.utm_source && p.utm_source.toLowerCase() === utmSource.toLowerCase();
    var matchMedium = !utmMedium || (p.utm_medium && p.utm_medium.toLowerCase() === utmMedium.toLowerCase());
    if (matchSource && matchMedium) {
      setCookie(p.utm_source, p.utm_medium);
      return true;
    }
    var c = getCookie();
    return !!c && c.source && c.source.toLowerCase() === utmSource.toLowerCase() &&
      (!utmMedium || (c.medium && c.medium.toLowerCase() === utmMedium.toLowerCase()));
  }

  function pushToDataLayer(original, updated, type, selector) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "wp_contentmodify",
      original_text: original,
      updated_text: updated,
      field_type: type,
      element_selector: selector,
      personalization_data: personalizationData,
      utm_match: { source: utmSource, medium: utmMedium },
      timestamp: new Date().toISOString()
    });
  }

  function updateContent() {
    var params = getUTMParams();
    if (!checkUTMMatch(params)) return false;
    var changed = false;

    priceSelectors.forEach(function(sel) {
      var els = document.querySelectorAll(sel);
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el && el.textContent.trim() !== newPrice) {
          var orig = el.textContent.trim();
          el.textContent = newPrice;
          el.style.visibility = "visible";
          pushToDataLayer(orig, newPrice, "textContent", sel);
          changed = true;
        } else if (el) {
          el.style.visibility = "visible";
        }
      }
    });

    buttonSelectors.forEach(function(sel) {
      var els = document.querySelectorAll(sel);
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el && el.value.trim() !== newButtonValue) {
          var orig = el.value.trim();
          el.value = newButtonValue;
          pushToDataLayer(orig, newButtonValue, "valueAttribute", sel);
          changed = true;
        }
      }
    });

    return changed;
  }

  function init() {
    if (updateContent()) return;

    var observer = new MutationObserver(function() {
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
