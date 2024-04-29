import { createSlice } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Import any action creators you might need here

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        isLoading: true,
    },
    reducers: {       
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});


// Define an async action creator using Redux Thunk
export const fetchUserInfo = (uid) => async (dispatch) => {
    if (!uid) {
        dispatch(userSlice.actions.setCurrentUser(null));
        dispatch(userSlice.actions.setLoading(false));
        return;
    }

    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            dispatch(userSlice.actions.setCurrentUser(docSnap.data()));
        } else {
            dispatch(userSlice.actions.setCurrentUser(null));
        }
    } catch (err) {
        console.log(err);
        dispatch(userSlice.actions.setCurrentUser(null));
    } finally {
        dispatch(userSlice.actions.setLoading(false));
    }
};

// Export any additional action creators here if needed
export default userSlice.reducer;
