import {ActionReducer, Action} from '@ngrx/store';
import {merge, pick} from 'lodash-es';

function setSavedState(state: any, lsKey: string) {
  localStorage.setItem(lsKey, JSON.stringify(state));
}
function getSavedState(lsKey: string): any {
  return JSON.parse(localStorage.getItem(lsKey));
}

// the keys from state which we'd like to save.
const stateKeys = ['layout.theme'];
// the key for the local storage.
const localStorageKey = '__app_storage__';

export function storageMetaReducer<S, A extends Action = Action>(reducer: ActionReducer<S, A>) {
  let onInit = true; // after load/refresh…
  return (state: S, action: A): S => {
    // reduce the nextState.
    const nextState = reducer(state, action);
    // init the application state.
    if (onInit) {
      onInit           = false;
      const savedState = getSavedState(localStorageKey);
      return merge(nextState, savedState);
    }
    // save the next state to the application storage.
    const stateToSave = pick(nextState, stateKeys);
    setSavedState(stateToSave, localStorageKey);
    return nextState;
  };
}
