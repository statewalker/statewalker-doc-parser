export function newHtmlTagsRebalancer({
  // Empty Elements - HTML 4.01
  emptyElements =
    "area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed",

  // Block Elements - HTML 4.01
  blockElements =
    "address,applet,blockquote,button,center,del,dir,div,dl,fieldset,form,frameset,h1,h2,h3,h4,h5,h6,hr,iframe,ins,isindex,map,menu,noframes,noscript,object,ol,p,pre,script,table,ul",
  // "address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,h1,h2,h3,h4,h5,h6,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul",

  // Block Container Elements
  blockContainerElements =
    "address,blockquote,dd,del,dir,div,fieldset,form,frameset,ins,isindex,li,menu,noscript,pre,td,th",

  // Inline Elements - HTML 4.01
  inlineElements =
    "a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var",

  textContainerElements =
    "address,blockquote,button,center,dd,dt,del,dir,div,fieldset,form,h1,h2,h3,h4,h5,h6,ins,isindex,li,map,menu,noframes,noscript,object,p,pre,script,td,th,a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var",

  // Inline Elements - HTML 4.01
  inlineContainerElements =
    "a,abbr,acronym,b,bdo,big,button,cite,code,del,dfn,em,font,h1,h2,h3,h4,h5,h6,i,ins,kbd,label,map,p,q,s,samp,select,small,span,strike,strong,sub,sup,textarea,tt,u,var",

  //////////////
  // Elements that you can, intentionally, leave open
  // (and which close themselves)
  closeSelfElements = "colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr",

  // Elements which can not exist alone - without containers
  internalElements = "thead,tbody,tfoot,head,body",
  // // Attributes that have their values filled in disabled="disabled"
  // fillAttributes = "checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected",

  requiedParentElements = {
    li: "ul,ol",
    dd: "dl",
    dt: "dl",

    // Table elements,
    thead: "table",
    tbody: "table",
    tfoot: "table",
    tr: "tbody,thead,tfoot,table",
    th: "tr",
    td: "tr",

    // // Paragraph
    // span : "p"
  },

  possibleChildrenElements = {
    // Lists
    "ul": "li",
    "ol": "li",
    "dl": "dd,dt",

    // Tables
    "table": "tbody,thead,tfoot",
    "tbody": "tr",
    "thead": "tr",
    "tfoot": "tr",
    "tr": "td,th",
  },
} = {}) {
  // Empty Elements - HTML 4.01
  const empty = toSet(emptyElements);

  // Block Elements - HTML 4.01
  const block = toSet(blockElements);

  const blockContainers = toSet(blockContainerElements);

  // Inline Elements - HTML 4.01
  const inline = toSet(inlineElements);

  const inlineContainers = toSet(inlineContainerElements);

  const textContainer = toSet(textContainerElements);

  // Elements that you can, intentionally, leave open
  // (and which close themselves)
  const closeSelf = toSet(closeSelfElements);

  const internals = toSet(internalElements);

  const known = new Set([
    ...empty,
    ...block,
    ...blockContainers,
    ...inline,
    ...inlineContainers,
    ...closeSelf,
    ...internals,
  ]);

  const requiredParents = toMap(requiedParentElements);

  const possibleChildren = toMap(possibleChildrenElements);

  function getTagInfo(type) {
    return {
      type,
      empty: empty.has(type),
      selfClosing: closeSelf.has(type),
      known: known.has(type),
      requiredParents: requiredParents.get(type),
      possibleChildren: possibleChildren.get(type),
      block: block.has(type),
      blockContainer: blockContainers.has(type),
      inline: inline.has(type),
      inlineContainer: inlineContainers.has(type) || blockContainers.has(type),
    };
  }

  function acceptText(tagInfo) {
    return !tagInfo.known || textContainer.has(tagInfo.type); // !tagInfo.known || tagInfo.inline || tagInfo.block;
  }

  function acceptChild(parentTagInfo, tagInfo) {
    if (!tagInfo.known) return true;
    if (!parentTagInfo.known) return true;
    if (tagInfo.selfClosing && (parentTagInfo.type === tagInfo.type)) {
      return false;
    }
    if (tagInfo.requiredParents) {
      return (tagInfo.requiredParents.has(parentTagInfo.type));
    }
    if (parentTagInfo.possibleChildren) {
      return parentTagInfo.possibleChildren.has(tagInfo.type);
    }
    if (tagInfo.block && parentTagInfo.blockContainer) return true;
    if (tagInfo.inline && parentTagInfo.inlineContainer) return true;
    return false;
  }

  return function* rebalanceHtmlTokens(tokens) {
    // return console.log(acceptChild(getTagInfo("li"), getTagInfo("li")));
    const stack = [];
    for (let token of tokens) {
      const { token: tokenType, type, attrs, positions } = token;
      if (tokenType === "open") {
        yield* openTag(type, attrs, positions);
      } else if (tokenType === "close") {
        yield* closeTag(type, positions);
      } else if (tokenType === "text") {
        yield* onText(token.text, positions);
      }
    }

    function* dump(accept, positions, shift = 1) {
      let prevIndex = -1;
      for (let i = stack.length - 1; prevIndex < 0 && i >= 0; i--) {
        const t = stack[i];
        if (accept(t.tagInfo)) prevIndex = i;
      }
      if (prevIndex >= 0) {
        while (stack.length > prevIndex + shift) {
          const t = stack.pop();
          yield {
            token: "close",
            type: t.type,
            positions,
          };
        }
      }
    }

    function* onText(text, positions) {
      const parent = stack[stack.length - 1];
      if (
        !parent || !acceptText(parent.tagInfo)
      ) {
        yield* openTag("span", {}, positions);
      }
      // yield* dump(parentTagInfo => acceptText(parentTagInfo), positions);
      yield { token: "text", text, positions };
    }

    function* openTag(type, attrs, positions) {
      const tagInfo = getTagInfo(type);

      if (tagInfo.known) {
        // Check if there are already such an element in the stack:
        yield* dump(
          (parentTagInfo) => acceptChild(parentTagInfo, tagInfo),
          positions,
        );

        let parent;

        parent = stack[stack.length - 1];
        if (
          tagInfo.requiredParents &&
          (!parent || !tagInfo.requiredParents.has(parent.tagInfo.type))
        ) {
          const [parentType] = [...tagInfo.requiredParents];
          yield* openTag(parentType, {}, positions);
        }

        parent = stack[stack.length - 1];
        if (
          parent && parent.tagInfo.possibleChildren &&
          !parent.tagInfo.possibleChildren.has(tagInfo.type)
        ) {
          const [childType] = [...parent.tagInfo.possibleChildren];
          yield* openTag(childType, {}, positions);
        }
      }

      yield { token: "open", type, attrs, positions };
      stack.push({
        type,
        attrs,
        tagInfo,
        // positions
      });
      if (tagInfo.empty) {
        yield* closeTag(type, positions);
      }
    }

    function* closeTag(type, positions) {
      yield* dump((parentTagInfo) => parentTagInfo.type === type, positions, 0);
    }
  };

  function toSet(list) {
    const set = new Set(list.split(","));
    // console.log(set);
    return set;
  }

  function toMap(obj) {
    return new Map(
      Object.entries(obj).map(([key, list]) => [key, toSet(list)]),
    );
  }
}

export default newHtmlTagsRebalancer();
