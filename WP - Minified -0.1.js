<script>
(function () {
  /*****************************************************************
   * EDITABLE SECTION - CREATED BY KINESSO
   *****************************************************************/
  
  // UTM Source to match (case insensitive) - Add the values here you want to match
  var utmSource = "wpmyproject";
  
  // UTM Medium to match - Add the values here you want to match (optional, set to empty string to ignore)
  var utmMedium = "wpmyproject"; // Example: "email" or "social"
  
  // New price to display when conditions are met - Add the modified Display Price here
  var newPrice = "$ 55000";
  
  // Cookie expiration in days (30 days as requested)
  var cookieExpiryDays = 30;
  
  // CSS selectors where price should be replaced
  // Add more selectors as needed for your elements to change the values as defined
  var priceSelectors = [
    "input.cart__submit.btn.btn--small-wide",
    "span.price-item--regular",
    "dd[data-cart-item-regular-price]",
    
  ];
  //Fire dataLayer for the audience segment
   var personalizationData = {
    campaignType: "price_promotion",
    audienceSegment: "high_value_customers",
    promotionTier: "premium_discount"
  };
  
  /*****************************************************************
   ***********MAIN CODE - DO NOT EDIT BELOW ************************
   *****************************************************************/
  function setKsCookie(t,e){var n=new Date;n.setTime(n.getTime()+864e5*cookieExpiryDays),document.cookie="ksowpmatch="+encodeURIComponent(JSON.stringify({source:t,medium:e,metadata:personalizationData}))+"; expires="+n.toUTCString()+"; path=/"}function getKsCookie(){var t="ksowpmatch=",e=document.cookie.split(";");for(var n=0;n<e.length;n++){for(var o=e[n];" "==o.charAt(0);)o=o.substring(1);if(0==o.indexOf(t))try{return JSON.parse(decodeURIComponent(o.substring(t.length)))}catch(t){}}return null}function getUTMParams(){for(var t={},e=window.location.search.substring(1).split("&"),n=0;n<e.length;n++){var o=e[n].split("=");2==o.length&&(t[decodeURIComponent(o[0])]=decodeURIComponent(o[1]))}return t}function pushDataLayer(t,e,n){window.dataLayer=window.dataLayer||[],window.dataLayer.push({event:"wp_contentmodify",changed_text:t,updated_text:e,original_text:n,personalization_data:personalizationData,utm_match:{source:utmSource,medium:utmMedium},timestamp:new Date().toISOString()})}function checkUTMMatch(t){var e=t.utm_source&&t.utm_source.toLowerCase()===utmSource.toLowerCase(),n=!utmMedium||t.utm_medium&&t.utm_medium.toLowerCase()===utmMedium.toLowerCase();if(e&&n)return setKsCookie(t.utm_source,t.utm_medium),!0;var o=getKsCookie();return!!o&&o.source&&o.source.toLowerCase()===utmSource.toLowerCase()&&(!utmMedium||o.medium&&o.medium.toLowerCase()===utmMedium.toLowerCase())}function updateAllPrices(){var t=getUTMParams();if(!checkUTMMatch(t))return!1;for(var e=!1,n=0;n<priceSelectors.length;n++)for(var o=document.querySelectorAll(priceSelectors[n]),r=0;r<o.length;r++)if(o[r]&&o[r].textContent.trim()!==newPrice){var c=o[r].textContent.trim();o[r].textContent=newPrice,pushDataLayer(newPrice,newPrice,c),e=!0}return e}function observeAndUpdate(){updateAllPrices()||new MutationObserver(function(){updateAllPrices()&&this.disconnect()}).observe(document.body,{childList:!0,subtree:!0})}"complete"===document.readyState||"interactive"===document.readyState?observeAndUpdate():document.addEventListener("DOMContentLoaded",observeAndUpdate);
})();
</script>
