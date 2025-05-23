<script>
(function() {
  /***************************************************************************************
   **************EDITABLE SECTION - CONFIGURE THESE VALUES - CREATED BY KINESSO***********
   ***************************************************************************************/
  
           var u = "wpmyproject", //Edit the value of UTM SOURCE based on which content needs to be changed
                m = "wpmyproject", //Edit the value of UTM MEDIUM based on which content needs to be changed
                p = "$55000",      //Edit the value of the element
                btn = "Special Offer",  //Edit the value of the element
                exp = 30,              //Edit the expiration of the cookie
                cname = "ksowpmatch",  //Edit the cookie name
                selPrice = ["span.price-item--regular", "dd[data-cart-item-regular-price]"], //Add the comma seperated selectors for textContent changes
                selBtn = ["input.cart__submit.btn.btn--small-wide", "button.checkout"], //Add the comma separated selectors for value attribute content changes
                meta = {                               
                    campaignType: "price_promotion",         //Edit the dataLayer variables as required
                    audienceSegment: "high_value_customers",
                    promotionTier: "premium_discount"
                };

  /********************************************************************************
   ***********MAIN CODE - DO NOT EDIT BELOW THIS SECTION OF THE CODE***************
   ********************************************************************************/
  selPrice.forEach(function(s){
    var st=document.createElement("style");
    st.innerHTML=s+"{visibility:hidden;}";
    document.head.appendChild(st);
  });

  function setCookie(src,med){
    var d=new Date(); d.setTime(d.getTime()+exp*864e5);
    var v=JSON.stringify({source:src,medium:med,metadata:meta});
    document.cookie=cname+"="+encodeURIComponent(v)+";expires="+d.toUTCString()+";path=/";
  }

  function getCookie(){
    var prefix=cname+"=", parts=document.cookie.split(";");
    for(var i=0;i<parts.length;i++){
      var part=parts[i].trim();
      if(part.indexOf(prefix)===0){
        try{return JSON.parse(decodeURIComponent(part.substring(prefix.length)));}
        catch(e){return null;}
      }
    }
    return null;
  }

  function getParams(){
    var q={}, qs=window.location.search.substring(1).split("&");
    for(var i=0;i<qs.length;i++){
      var pair=qs[i].split("=");
      if(pair.length===2)q[decodeURIComponent(pair[0])]=decodeURIComponent(pair[1]);
    }
    return q;
  }

  function isMatch(params){
    var src=params.utm_source&&params.utm_source.toLowerCase()===u.toLowerCase(),
        med=!m||(params.utm_medium&&params.utm_medium.toLowerCase()===m.toLowerCase());
    if(src&&med){setCookie(params.utm_source,params.utm_medium); return true;}
    var ck=getCookie();
    return !!ck&&ck.source&&ck.source.toLowerCase()===u.toLowerCase()&&(!m||(ck.medium&&ck.medium.toLowerCase()===m.toLowerCase()));
  }

  function pushData(orig,newVal,type,selector){
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({
      event:"wp_contentmodify",
      original_text:orig,
      updated_text:newVal,
      field_type:type,
      element_selector:selector,
      personalization_data:meta,
      utm_match:{source:u,medium:m},
      timestamp:new Date().toISOString()
    });
  }

  function updateContent(){
    var params=getParams(); if(!isMatch(params)) return false;
    var updated=false;

    selPrice.forEach(function(s){
      var els=document.querySelectorAll(s);
      for(var i=0;i<els.length;i++){
        var el=els[i];
        if(el&&el.textContent.trim()!==p){
          var orig=el.textContent.trim();
          el.textContent=p;
          el.style.visibility="visible";
          pushData(orig,p,"textContent",s);
          updated=true;
        } else if(el){ el.style.visibility="visible"; }
      }
    });

    selBtn.forEach(function(s){
      var els=document.querySelectorAll(s);
      for(var i=0;i<els.length;i++){
        var el=els[i];
        if(el&&el.value.trim()!==btn){
          var orig=el.value.trim();
          el.value=btn;
          pushData(orig,btn,"valueAttribute",s);
          updated=true;
        }
      }
    });

    return updated;
  }

  function init(){
    if(updateContent()) return;
    var obs=new MutationObserver(function(){if(updateContent()) obs.disconnect();});
    obs.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true});
    setTimeout(updateContent,500);
  }

  document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init):init();
})();
</script>
