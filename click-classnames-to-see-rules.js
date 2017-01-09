    <script type="text/javascript">
    // Add this chunk of code to your hologram footer
    // to enable the ability to see the rules that
    // define a class when you click on it.
    // NOTE: you may need to adjust the index of the css style sheet
    // that `mainCssRules` targets to properly read
    // your CSS file.
    (function(document) {

      //elements that hold classnames
      var sClass = document.getElementsByClassName('s');  
      var codeTags = document.getElementsByTagName('code');

      //attach events to the potential classnames
      Array.prototype.forEach.call(sClass, function(el){
        el.onclick = cssNameInspect;
      });

      Array.prototype.forEach.call(codeTags, function(el){
        el.onclick = cssNameInspect;
      });

      /**
       * Given an element that might have css classnames in it
       * get the css for those classnames.
       */
      function cssNameInspect(event){
        var el = event.currentTarget;
        var cssRegex = /[^a-zA-Z0-9\s]{1,}/;
        var valid = false;
        var matchingRulesArray =[]; 
        // you may have to change this index to target the right css file  
        var mainCssRules = document.styleSheets[2].cssRules;

        //if it's CODE, make sure it looks like css class(es)
        //if it's an .s, make sure it's prevSibling .na says 'class='
        if(el.nodeName == 'CODE' && !cssRegex.test(el.innerText)) {
          valid = true;
        } else if (el.nodeName == 'SPAN' && prevNode(el).innerText == "class=") {
          valid = true;
        }
        
        if(valid) {
          el.innerText.split(/\s+/).forEach(function(selectorRaw) {
            var selector = selectorRaw.replace(/\"/g, '');
            matchingRulesArray = matchingRulesArray.concat(getMatchesFromRules(selector, mainCssRules));
          });

          if (matchingRulesArray) {
            cssContentFormatted = rulesArrayToHtml(matchingRulesArray);
            infoPane(cssContentFormatted, [event.pageX, event.pageY]);
          }
        }
      }

      /**
       * Given an array of css rules and a selector
       * get the css rules that apply to just that selector
       * and return them in an array.
       */
      function getMatchesFromRules(selector, rules) {
        var cssContent = [];
        Array.prototype.forEach.call(rules, function(rule){
          //for 'foo' match .foo | .bar, .foo, .baz | .bar, .foo | element.foo | .foo:hover | .foo::before
          regexString = '(^|, |[a-z]{1,})\\.' + selector + '(\\:{1,2}[^\\s]{1,}|,|\\.|[\\s]{1,}\\{)';

          var regexp = new RegExp(regexString);
          // console.log('regex: ' + regexp);
          if (regexp.test(rule.cssText)) { 
            cssContent.push(rule.cssText);
          }
        });
        return cssContent;
      }

      function rulesArrayToHtml(content) {
        return content
                .join('<hr>')
                .replace(/(;)/g,'$1<br>\n')
                .replace(/({)/g,'$1<div style="padding-left: 5px">\n')
                .replace(/(})/g,'</div>$1\n');
      }

      /**
       * Create the hovering element with content
       * right where the user clicked. coords is [X,Y]
       */
      function infoPane(content, coords) {
        var popUp = document.createElement("div");
        var close  = document.createElement("div");
        var css  = document.createElement("div");
        
        popUp.style.position = 'absolute';
        popUp.style.left = coords[0] + 'px';
        popUp.style.top = coords[1] + 'px';
        popUp.style.maxWidth = '500px';
        popUp.style.maxHeight = '500px';
        popUp.style.overflow = 'scroll';
        popUp.style.color = '#eee';
        popUp.style.backgroundColor = '#202020';
        popUp.style.border =  '2px solid #000';
        popUp.style.padding =  '5px';
        popUp.style.borderRadius = '5px';
        
        close.style.backgroundColor = '#000';
        close.style.color = '#ddd';
        close.style.fontSize = '80%';
        close.style.fontStyle = 'italic';
        close.style.textAlign = 'center';
        close.style.cursor = 'pointer';
        close.innerHTML = "click here to close";

        css.innerHTML = content;

        popUp.appendChild(close);
        popUp.appendChild(css);

        //add the ability to close the div.
        close.onclick = function(event) {
          document.body.removeChild(popUp);
        };

        document.body.appendChild(popUp);
      }

      /**
       * Helper function to get the non text node
       * previousSibling of an element
       */
      function prevNode(el) {
        var prevSibling = el.previousSibling;
        if (prevSibling.nodeType != Node.TEXT_NODE) {
          return prevSibling;
        } else {
          prevNode(prevSibling);
        }
      }
    })(document);
    </script>
