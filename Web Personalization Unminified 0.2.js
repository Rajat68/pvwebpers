<script>
(function () {
  /*****************************************************************
   * EDITABLE SECTION - CREATED BY KINESSO
   *****************************************************************/

  var utmSource = "testwp12345";
  var utmMedium = "testwp12345";
  var newPrice = "Rs. 54,000.00";
  var cookieExpiryDays = 30;
  var priceSelectors = [
    "span.price-item--regular",
    "dd[data-cart-item-regular-price]"
  ];

  // Custom audience data
  var personalizationData = {
    campaignType: "price_promotion",
    audienceSegment: "high_value_customers",
    promotionTier: "premium_discount"
  };

  /*****************************************************************
   * MAIN CODE - DO NOT EDIT BELOW
   *****************************************************************/

  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + expires + "; path=/";
  }

  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        try {
          return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  function getUTMParams() {
    var params = {};
    var queryString = window.location.search.substring(1);
    var pairs = queryString.split("&");

    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");
      if (pair.length === 2) {
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        params[key] = value;
      }
    }
    return params;
  }

  function pushDataLayer(changedText, updatedText, originalText) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "wp_contentmodify",
      changed_text: changedText,
      updated_text: updatedText,
      original_text: originalText,
      personalization_data: personalizationData,
      utm_match: {
        source: utmSource,
        medium: utmMedium
      },
      timestamp: new Date().toISOString()
    });
  }

  function checkUTMMatch(utms) {
    var urlSourceMatch = utms.utm_source && utms.utm_source.toLowerCase() === utmSource.toLowerCase();
    var urlMediumMatch = !utmMedium || (utms.utm_medium && utms.utm_medium.toLowerCase() === utmMedium.toLowerCase());

    if (urlSourceMatch && urlMediumMatch) {
      setCookie('ksowpmatch', {
        source: utms.utm_source,
        medium: utms.utm_medium,
        metadata: personalizationData
      }, cookieExpiryDays);
      return true;
    }

    var cookieData = getCookie('ksowpmatch');
    if (cookieData) {
      var cookieSourceMatch = cookieData.source && cookieData.source.toLowerCase() === utmSource.toLowerCase();
      var cookieMediumMatch = !utmMedium || (cookieData.medium && cookieData.medium.toLowerCase() === utmMedium.toLowerCase());
      return cookieSourceMatch && cookieMediumMatch;
    }

    return false;
  }

  function updateAllPrices() {
    var utms = getUTMParams();

    if (!checkUTMMatch(utms)) return false;

    var updated = false;

    for (var i = 0; i < priceSelectors.length; i++) {
      var elements = document.querySelectorAll(priceSelectors[i]);
      for (var j = 0; j < elements.length; j++) {
        if (elements[j] && elements[j].textContent.trim() !== newPrice) {
          var originalText = elements[j].textContent.trim();
          elements[j].textContent = newPrice;
          pushDataLayer(newPrice, newPrice, originalText);
          updated = true;
        }
      }
    }

    return updated;
  }

  function observeAndUpdate() {
    if (updateAllPrices()) return;

    var observer = new MutationObserver(function () {
      if (updateAllPrices()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    observeAndUpdate();
  } else {
    document.addEventListener("DOMContentLoaded", observeAndUpdate);
  }
})();
</script>
