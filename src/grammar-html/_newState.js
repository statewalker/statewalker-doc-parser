export default function _newState({
  // State key:
  key,
  // The main token opening this state. It is used only if the "tokens" list is not defined:
  token,
  // List of tokens opening this state:
  tokens,
  // Options default content of this state
  content,
  // Sub-states
  states,
  // List of other transitions
  transitions = [],
  // If another token of this type should close the previous one:
  selfClosing = false,
  // List of tokens closing this state.
  // It should contain tokens which can open a new substate,
  // but in this case they are used to close the parent state instead.
  // Example: "li" in another "li" should close the parent item
  // instead of creation of a new sub-list.
  closingTokens = [],
}) {
  const state = {
    key,
    transitions: [...transitions],
    states,
  };
  tokens = tokens || (token ? [token] : []);
  for (let token of tokens) {
    state.transitions.push(["", token, `_${key}:before`]);
    state.transitions.push(["*", `${token}:close`, `_${key}:after`]);
  }
  if (selfClosing) {
    closingTokens = [...closingTokens, ...tokens];
  }
  // If it is a self-closing token (ex: "li") then a new token will close this state:
  for (let closingToken of closingTokens) {
    state.transitions.push(["*", closingToken, ""]);
  }

  if (content) {
    state.transitions.push(
      [`_${key}:before`, "*", content],
      ["", "*", content]
    );
  }
  return state;
}
