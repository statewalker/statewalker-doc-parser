import { newTreeWalker } from "@statewalker/tree";

export default function newHierarchyBuilder(
  openItem,
  closeItem,
) {
  const stack = [];
  const context = { stack };
  const loadNext = newTreeWalker(
    ({ current, stack }) => openItem(...current),
    ({ current, stack }) => closeItem(...current),
    context,
  );
  const update = (s) => loadNext(() => s);

  return function next(level, data) {
    const stack = context.stack;
    const len = stack.length;
    let i;
    for (i = len; i >= level; i--) update();
    for (; i < level; i++) update([i + 1, data]);
    return level;
  };
}

export function newHierarchyBuilder1(open, close) {
  const stack = [];
  return (level, data) => {
    while (stack.length && stack.length >= level) {
      close(stack.length, stack.pop());
    }
    while (stack.length < level) {
      stack.push(data);
      open(stack.length, data);
    }
    return stack.length;
  };
}
