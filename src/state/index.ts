import { atom } from 'jotai';

export const profileAtom = atom({
    name: '',
    isAdmin: false,
    avatar: '/user.png',
    initialized: false,
});