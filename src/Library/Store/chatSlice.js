import { createSlice } from '@reduxjs/toolkit';
// Import any action creators you might need here

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chatId: null,
        user: null,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
    },
    reducers: {
        changeChat: (state, action) => {
            const { chatId, user , currentUser} = action.payload;
            if (user.blocked.includes(currentUser.id)) {
                state.chatId = chatId;
                state.user = null;
                state.isCurrentUserBlocked = true;
                state.isReceiverBlocked = false;
            } else if (currentUser.blocked.includes(user.id)) {
                state.chatId = chatId;
                state.user = user;
                state.isCurrentUserBlocked = false;
                state.isReceiverBlocked = true;
            } else {
                state.chatId = chatId;
                state.user = user;
                state.isCurrentUserBlocked = false;
                state.isReceiverBlocked = false;
            }
        },
        changeBlock: (state) => {
            return {
                ...state,
                isReceiverBlocked: !state.isReceiverBlocked
            };
        },
        resetChat: (state) => {
            state.chatId = null;
            state.user = null;
            state.isCurrentUserBlocked = false;
            state.isReceiverBlocked = false;
        },
    },
});


export const { changeChat, changeBlock, resetChat } = chatSlice.actions;

// Export any additional action creators here if needed
export default chatSlice.reducer;
