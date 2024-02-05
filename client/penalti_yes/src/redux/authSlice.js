import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading: false,
    id: localStorage.getItem('id'),
    token: localStorage.getItem('token'),
    role: localStorage.getItem("role"),
    phone: localStorage.getItem("phone"),
    error: undefined
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut: (state) => {
            state.error = undefined
            state.loading = true
            state.id = undefined
            state.phone = undefined
            state.role = undefined
            state.token = undefined

            localStorage.removeItem("token")
            localStorage.removeItem("id")
            localStorage.removeItem("role")
            localStorage.removeItem("phone")
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginThunk.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(loginThunk.fulfilled, (state, action) => {
            const payload = action.payload
            state.token = payload.token
            state.phone = payload.user.phone
            state.role = payload.user.role
            state.id = payload.id

            localStorage.setItem("token", payload.token)
            localStorage.setItem("phone", payload.user.phone)
            localStorage.setItem("role", payload.user.role)
            localStorage.setItem("id", payload.id)

            state.error = undefined
            state.loading = false
        })
        builder.addCase(loginThunk.rejected, (state, action) => {
            const payload = action.payload

            state.error = payload.message
            state.loading = false
        })
    }
})

export const loginThunk = createAsyncThunk("logThunk", async (data, { rejectWithValue }) => {
    const { phone, password } = data

    try {
        const result = await fetch('http://localhost:3002/auth', {
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        const json = await result.json()
        if (result.status === 400) {
            return rejectWithValue(json)
        }
        return json
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.message)
    }
})

// Action creators are generated for each case reducer function
export const { logOut } = authSlice.actions

export default authSlice.reducer