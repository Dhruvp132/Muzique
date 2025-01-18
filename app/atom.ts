import {atom } from "recoil"

export const creatorState = atom<string>({
    key: 'creatorState', // unique ID (with respect to other atoms/selectors)
    default: '', // default value
});