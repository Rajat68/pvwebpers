window.priceChanger = {
  init: function(config) {
    function getUTMSource() {
      const params = new URLSearchParams(window.location.search);
      return params.get('utm_source') ? params.get('utm_source').toLowerCase() : '';
    }

    function updatePrice() {
      const source = getUTMSource();
      if (source === config.utmSource.toLowerCase()) {
        const el = document.querySelector(config.cssSelector);
        if (el) {
          el.textContent = config.newPrice;
          return true;
        }
      }
      return false;
    }

    if (config.runOnDOMReady) {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        updatePrice();
      } else {
        document.addEventListener('DOMContentLoaded', updatePrice);
      }
    } else {
      if (!updatePrice()) {
        const observer = new MutationObserver(function() {
          if (updatePrice()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }
  }
};
