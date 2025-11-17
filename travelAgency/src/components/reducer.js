const initialState = {
  isOpen: false,
  isDelay: true,
  isNotification: false
};

function reducer(state, action) {
  switch (action.type) {
    case "open":
      return {
        ...state,
        isOpen: true,
        isNotification: false
      };
    case "close":
      return {
        ...state,
        isOpen: false
      };
    case "delay":
      return {
        ...state,
        isDelay: false
      };
    case "notification":
      return {
        ...state,
        isNotification: true
      };
    default:
      return state;
  }
}

export { reducer, initialState };