export default function _addExitTransitions(state) {
  // return state;
  const result = {
    ...state,
    transitions: [
      ["*", "exit", ""],
      ...(state.transitions || []),
    ],
  };
  if (state.states && state.states.length) {
    result.states = state.states.map(_addExitTransitions);
  }
  return result;
}
