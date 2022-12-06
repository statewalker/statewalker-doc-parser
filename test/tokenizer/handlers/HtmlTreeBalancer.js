export default class HtmlTreeBalancer {
  constructor({

    handler, 

    // Empty Elements - HTML 4.01
    emptyElements =
      "area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed",

    // Block Elements - HTML 4.01
    blockElements =
      "address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul",

    // Block Container Elements
    blockContainerElements =
      "address,blockquote,dd,del,dir,div,fieldset,form,frameset,ins,isindex,li,menu,noscript,pre,td,th",

    // Inline Elements - HTML 4.01
    inlineElements =
      "a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var",

    // Inline Elements - HTML 4.01
    inlineContainerElements =
      "a,abbr,acronym,b,bdo,big,button,cite,code,del,dfn,em,font,i,ins,kbd,label,map,q,s,samp,select,small,span,strike,strong,sub,sup,textarea,tt,u,var",

    // Elements that you can, intentionally, leave open
    // (and which close themselves)
    closeSelfElements = "colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr",
    // // Attributes that have their values filled in disabled="disabled"
    // fillAttributes = "checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected",
  } = {}) {

    this.handler = handler;

    // Empty Elements - HTML 4.01
    this.empty = toSet(emptyElements);

    // Block Elements - HTML 4.01
    this.block = toSet(blockElements);

    this.blockConainers = toSet(blockContainerElements);

    // Inline Elements - HTML 4.01
    this.inline = toSet(inlineElements);

    this.inlineContainers = toSet(inlineContainerElements);

    // Elements that you can, intentionally, leave open
    // (and which close themselves)
    this.closeSelf = toSet(closeSelfElements);

    // // Attributes that have their values filled in disabled="disabled"
    // this.fillAttrs = toSet(fillAttributes);

    // Special Elements (can contain anything)
    this.special = makeMap(specialElements);

    function toSet(list) {
      return new Set(...list.split(","));
    }
  }

  beginTag(type, attrs, ...options) {
    this.handler.beginTag(type, attrs, ...options);
    this.stack.push({ 
      type,
      attrs
    })

    if (this.closeSelf.has(type)) {

      this.handler.endTag(type, ...options);
    } else {

    }
  }

  endTag(type, ...options) {
    const peek = this.stack[this.stack.length - 1];
    if (!peek) return ;
    if (peek.type === type) {
      this.stack.pop();
    }
    // if (this. peek.type)

  }

  onText(...options) {
    this.handler.onText(...options);
  }

  static read(readr, str) {
    const builder = new HtmlTreeBalancer();
    readr(str, builder);
    return builder.result;
  }
}
