import { createSlice } from '@reduxjs/toolkit';
import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator';

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
                dictionaries: [adjectives, animals],
            });
            state.user = { ...state.user, username };
        },
    },
});

export const { updateUsername, randomizeUsername } = userSlice.actions;
export default userSlice.reducer;
