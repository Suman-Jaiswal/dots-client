import { createSlice } from '@reduxjs/toolkit';
import {
    NumberDictionary,
    adjectives,
    animals,
    uniqueNamesGenerator,
} from 'unique-names-generator';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        error: null,
    },
    reducers: {
        updateUsername(state, action) {
            const { username } = action.payload;
            if (!username || username.length < 5) {
                state.error = 'Username must be at least 5 characters long';
                return;
            }
            state.user = { ...state.user, username };
            state.error = null;
        },
        randomizeUsername(state, action) {
            const username = uniqueNamesGenerator({
                dictionaries: [
                    adjectives,
                    animals,
                    NumberDictionary.generate({ min: 100, max: 999 }),
                ],
            });
            state.user = { ...state.user, username };
        },
    },
});

export const { updateUsername, randomizeUsername } = userSlice.actions;
export default userSlice.reducer;
