import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import {
    ChatConversation,
    ChatMessage,
    CreateConversationRequest,
    SendMessageRequest,
    Instructor,
    Student,
} from '@/types';
import { chatApi } from '@/helpers/axios/api';
import { getErrorMessage } from '@/utils';

interface ChatState {
    conversations: ChatConversation[];
    activeConversation: ChatConversation | null;
    messages: ChatMessage[];
    instructors: Instructor[];
    students: Student[];
    unreadCount: number;
    isLoading: boolean;
    isMessagesLoading: boolean;
    isSending: boolean;
    error: string | null;
}

const initialState: ChatState = {
    conversations: [],
    activeConversation: null,
    messages: [],
    instructors: [],
    students: [],
    unreadCount: 0,
    isLoading: false,
    isMessagesLoading: false,
    isSending: false,
    error: null,
};

// Async thunks
export const fetchInstructors = createAsyncThunk(
    'chat/fetchInstructors',
    async (_, { rejectWithValue }) => {
        try {
            const response = await chatApi.getInstructors();
            return response.data.data!;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            return rejectWithValue(message);
        }
    }
);

export const fetchUnreadCount = createAsyncThunk(
    'chat/fetchUnreadCount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await chatApi.getUnreadCount();
            return response.data.data!.unreadCount;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            return rejectWithValue(message);
        }
    }
);

export const fetchStudents = createAsyncThunk(
    'chat/fetchStudents',
    async (_, { rejectWithValue }) => {
        try {
            const response = await chatApi.getStudents();
            return response.data.data!;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            return rejectWithValue(message);
        }
    }
);

export const fetchConversations = createAsyncThunk(
    'chat/fetchConversations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await chatApi.getConversations();
            return response.data.data!;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            return rejectWithValue(message);
        }
    }
);

export const fetchConversationById = createAsyncThunk(
    'chat/fetchConversationById',
    async (conversationId: string, { rejectWithValue }) => {
        try {
            const response = await chatApi.getConversationById(conversationId);
            return response.data.data!;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            return rejectWithValue(message);
        }
    }
);

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (
        { conversationId, page = 1 }: { conversationId: string; page?: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await chatApi.getMessages(conversationId, { page, limit: 50 });
            return response.data.data!;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            return rejectWithValue(message);
        }
    }
);

export const createConversation = createAsyncThunk(
    'chat/createConversation',
    async (data: CreateConversationRequest, { rejectWithValue }) => {
        try {
            const response = await chatApi.createConversation(data);
            toast.success('Conversation started!');
            return response.data.data!;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (
        { conversationId, data }: { conversationId: string; data: SendMessageRequest },
        { rejectWithValue }
    ) => {
        try {
            const response = await chatApi.sendMessage(conversationId, data);
            return response.data.data!;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const markConversationAsRead = createAsyncThunk(
    'chat/markConversationAsRead',
    async (conversationId: string, { rejectWithValue }) => {
        try {
            await chatApi.markConversationAsRead(conversationId);
            return conversationId;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            return rejectWithValue(message);
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        clearActiveConversation: (state) => {
            state.activeConversation = null;
            state.messages = [];
        },
        setActiveConversation: (state, action: PayloadAction<ChatConversation>) => {
            state.activeConversation = action.payload;
        },
        addMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.messages.push(action.payload);
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch instructors
        builder
            .addCase(fetchInstructors.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchInstructors.fulfilled, (state, action) => {
                state.isLoading = false;
                state.instructors = action.payload;
            })
            .addCase(fetchInstructors.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch students (for admin)
        builder
            .addCase(fetchStudents.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.students = action.payload;
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch unread count
        builder.addCase(fetchUnreadCount.fulfilled, (state, action) => {
            state.unreadCount = action.payload;
        });

        // Fetch conversations
        builder
            .addCase(fetchConversations.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.conversations = action.payload;
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch conversation by ID
        builder
            .addCase(fetchConversationById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchConversationById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activeConversation = action.payload;
            })
            .addCase(fetchConversationById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch messages
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.isMessagesLoading = true;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.isMessagesLoading = false;
                state.messages = action.payload.messages;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.isMessagesLoading = false;
                state.error = action.payload as string;
            });

        // Create conversation
        builder
            .addCase(createConversation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createConversation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activeConversation = action.payload;
                // Add to conversations if not already present
                const exists = state.conversations.find((c) => c._id === action.payload._id);
                if (!exists) {
                    state.conversations.unshift(action.payload);
                }
            })
            .addCase(createConversation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Send message
        builder
            .addCase(sendMessage.pending, (state) => {
                state.isSending = true;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isSending = false;
                state.messages.push(action.payload);
                // Update conversation's last message
                const conversation = state.conversations.find(
                    (c) => c._id === action.payload.conversation
                );
                if (conversation) {
                    conversation.lastMessage = {
                        _id: action.payload._id,
                        content: action.payload.content,
                        sender: action.payload.sender._id,
                        createdAt: action.payload.createdAt,
                    };
                    conversation.lastMessageAt = action.payload.createdAt;
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isSending = false;
                state.error = action.payload as string;
            });

        // Mark conversation as read
        builder.addCase(markConversationAsRead.fulfilled, (state, action) => {
            const conversation = state.conversations.find((c) => c._id === action.payload);
            if (conversation) {
                conversation.unreadCount = 0;
            }
            // Recalculate total unread
            state.unreadCount = state.conversations.reduce(
                (sum, c) => sum + (c.unreadCount || 0),
                0
            );
        });
    },
});

export const { clearActiveConversation, setActiveConversation, addMessage, clearError } =
    chatSlice.actions;
export default chatSlice.reducer;
