<script>
(function() {
  /*****************************************************************
   * EDITABLE SECTION - CONFIGURE THESE VALUES - CREATED BY KINESSO
   *****************************************************************/
  
  // UTM parameters to match
  var utmSource = "wpmyproject";
  var utmMedium = "wpmyproject";
  
  // New values to display
  var newPrice = "$55000";              // For price/text elements
  var newButtonValue = "Special Offer"; // For button/input values
  
  // Cookie settings
  var cookieExpiryDays = 30;
  var cookieName = "ksowpmatch";
  
  // CSS selectors
  var priceSelectors = [
    "span.price-item--regular",
    "dd[data-cart-item-regular-price]"
  ];
  
  var buttonSelectors = [
    "input.cart__submit.btn.btn--small-wide",
    "button.checkout"
  ];
  
  // Tracking data
  var personalizationData = {
    campaignType: "price_promotion",
    audienceSegment: "high_value_customers",
    promotionTier: "premium_discount"
  };

  /*****************************************************************
   ***********MAIN CODE - DO NOT EDIT BELOW THIS LINE***************
   *****************************************************************/
  
  // 1. Cookie Functions
  function setCookie(source, medium) {
    var date = new Date();
    date.setTime(date.getTime() + (cookieExpiryDays * 24 * 60 * 60 * 1000));
    var cookieValue = JSON.stringify({
      source: source,
      medium: medium,
      metadata: personalizationData
    });
    document.cookie = cookieName + "=" + encodeURIComponent(cookieValue) + 
                     ";expires=" + date.toUTCString() + ";path=/";
  }
  
  function getCookie() {
    var name = cookieName + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.indexOf(name) === 0) {
        try {
          return JSON.parse(decodeURIComponent(cookie.substring(name.length)));
        } catch(e) {
          return null;
        }
      }
    }
    return null;
  }
  
  // 2. UTM Parameter Handling
  function getUTMParams() {
    var params = {};
    var query = window.location.search.substring(1).split('&');
    for (var i = 0; i < query.length; i++) {
      var pair = query[i].split('=');
      if (pair.length === 2) {
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
      }
    }
    return params;
  }
  
  function checkUTMMatch(params) {
    // Check URL params first
    var sourceMatch = params.utm_source && 
                     params.utm_source.toLowerCase() === utmSource.toLowerCase();
    var mediumMatch = !utmMedium || 
                     (params.utm_medium && 
                      params.utm_medium.toLowerCase() === utmMedium.toLowerCase());
    
    if (sourceMatch && mediumMatch) {
      setCookie(params.utm_source, params.utm_medium);
      return true;
    }
    
    // Check cookie if no URL match
    var cookie = getCookie();
    return !!cookie && 
           cookie.source && 
           cookie.source.toLowerCase() === utmSource.toLowerCase() && 
           (!utmMedium || 
            (cookie.medium && 
             cookie.medium.toLowerCase() === utmMedium.toLowerCase()));
  }
  
  // 3. Content Replacement
  function pushToDataLayer(original, updated, type, selector) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "wp_contentmodify",
      original_text: original,
      updated_text: updated,
      field_type: type,
      element_selector: selector,
      personalization_data: personalizationData,
      utm_match: {source: utmSource, medium: utmMedium},
      timestamp: new Date().toISOString()
    });
  }
  
  function updateContent() {
    var params = getUTMParams();
    if (!checkUTMMatch(params)) return false;
    
    var changesMade = false;
    
    // Update price/text elements
    priceSelectors.forEach(function(selector) {
      var elements = document.querySelectorAll(selector);
      elements.forEach(function(element) {
        if (element && element.textContent && element.textContent.trim() !== newPrice) {
          var original = element.textContent.trim();
          element.textContent = newPrice;
          pushToDataLayer(original, newPrice, "textContent", selector);
          changesMade = true;
        }
      });
    });
    
    // Update button/input values
    buttonSelectors.forEach(function(selector) {
      var elements = document.querySelectorAll(selector);
      elements.forEach(function(element) {
        if (element && element.value && element.value.trim() !== newButtonValue) {
          var original = element.value.trim();
          element.value = newButtonValue;
          pushToDataLayer(original, newButtonValue, "valueAttribute", selector);
          changesMade = true;
        }
      });
    });
    
    return changesMade;
  }
  
  // 4. Initialization
  function init() {
    // First try immediately
    if (updateContent()) return;
    
    // Set up observer for dynamic content
    var observer = new MutationObserver(function() {
      if (updateContent()) {
        observer.disconnect();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
    
    // Fallback check after 1 second
    setTimeout(updateContent, 1000);
  }
  
  // Start when DOM is ready
  if (document.readyState === "complete" || document.readyState === "interactive") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
</script>
