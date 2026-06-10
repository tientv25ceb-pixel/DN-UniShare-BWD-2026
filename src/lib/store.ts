import { create } from 'zustand'
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react'
import * as api from './api'
import { mockItems } from './data'

export type { Item, User, Request, Message, Conversation, Category, Condition, ExchangeType } from './data'
export { CATEGORY_MAP, CATEGORY_LABELS, CONDITION_LABELS, LOCATIONS } from './data'

interface ShareStore {
  items: any[]
  itemsLoading: boolean
  fetchItems: (params?: Record<string, string>) => Promise<void>
  addItem: (data: Record<string, any>) => Promise<any>
  updateItem: (id: string, data: Record<string, any>) => Promise<any>
  deleteItem: (id: string) => Promise<void>

  searchQuery: string
  setSearchQuery: (query: string) => void

  currentUser: any | null
  setCurrentUser: (user: any | null) => void

  requests: any[]
  requestsLoading: boolean
  fetchRequests: (type?: string) => Promise<void>
  sendRequest: (itemId: string) => Promise<void>
  updateRequestStatus: (requestId: string, status: string) => Promise<void>

  favorites: string[]
  fetchFavorites: () => Promise<void>
  toggleFavorite: (itemId: string) => Promise<void>

  conversations: any[]
  fetchConversations: () => Promise<void>
  startConversation: (otherUserId: string, otherUserName: string, itemId?: string, itemTitle?: string) => Promise<string>

  messages: Record<string, any[]>
  fetchMessages: (conversationId: string) => Promise<void>
  sendMessage: (conversationId: string, text: string) => Promise<void>

  login: (provider?: string) => Promise<void>
  logout: () => Promise<void>
}

function parseDbItem(item: any) {
  if (!item) return item;
  let parsedDesc = item.description;
  let price: number | undefined = undefined;
  let virtualExchangeType = item.exchangeType;
  let latitude: number | undefined = undefined;
  let longitude: number | undefined = undefined;
  let lostDate: string | undefined = undefined;
  let reward: string | undefined = undefined;
  let contactPhone: string | undefined = undefined;

  try {
    const raw = item.description || '';
    if (raw.trim().startsWith('{') && raw.trim().endsWith('}')) {
      const data = JSON.parse(raw);
      parsedDesc = data.description || '';
      price = data.price;
      virtualExchangeType = data.exchangeType || item.exchangeType;
      latitude = data.latitude;
      longitude = data.longitude;
      lostDate = data.lostDate;
      reward = data.reward;
      contactPhone = data.contactPhone;
    }
  } catch (e) {
    // ignore
  }

  return {
    ...item,
    rawDescription: item.description,
    description: parsedDesc,
    price,
    exchangeType: virtualExchangeType,
    latitude,
    longitude,
    lostDate,
    reward,
    contactPhone,
  };
}

export const useStore = create<ShareStore>()((set, get) => ({
  items: [],
  itemsLoading: false,
  fetchItems: async (params) => {
    set({ itemsLoading: true })
    try {
      const items = await api.getItems(params)
      set({ items: items.map(parseDbItem) })
    } catch (e) {
      console.error('fetchItems error:', e)
      set({ items: get().items.length > 0 ? get().items : mockItems.map(parseDbItem) })
    } finally {
      set({ itemsLoading: false })
    }
  },
  addItem: async (data) => {
    const item = await api.createItem(data)
    const parsed = parseDbItem(item)
    set((state) => ({ items: [parsed, ...state.items] }))
    return parsed
  },
  updateItem: async (id, data) => {
    const updated = await api.updateItem(id, data)
    const parsed = parseDbItem(updated)
    set((state) => ({
      items: state.items.map((item: any) => item.id === id ? parsed : item)
    }))
    return parsed
  },
  deleteItem: async (id) => {
    await api.deleteItem(id)
    set((state) => ({
      items: state.items.filter((item: any) => item.id !== id)
    }))
  },

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  requests: [],
  requestsLoading: false,
  fetchRequests: async (type = 'all') => {
    if (!get().currentUser) return
    set({ requestsLoading: true })
    try {
      const requests = await api.getRequests(type)
      set({ requests })
    } catch {
    } finally {
      set({ requestsLoading: false })
    }
  },
  sendRequest: async (itemId) => {
    await api.createRequest(itemId)
    const { fetchRequests, fetchItems } = get()
    await Promise.all([fetchRequests('all'), fetchItems()])
  },
  updateRequestStatus: async (requestId, status) => {
    await api.updateRequest(requestId, status)
    const { fetchRequests, fetchItems } = get()
    await Promise.all([fetchRequests('all'), fetchItems()])
  },

  favorites: [],
  fetchFavorites: async () => {
    if (!get().currentUser) return
    try {
      const favs = await api.getFavorites()
      set({ favorites: favs })
    } catch {
    }
  },
  toggleFavorite: async (itemId) => {
    const { favorites } = get()
    if (favorites.includes(itemId)) {
      await api.removeFavorite(itemId)
      set({ favorites: favorites.filter((id) => id !== itemId) })
    } else {
      await api.addFavorite(itemId)
      set({ favorites: [...favorites, itemId] })
    }
  },

  conversations: [],
  fetchConversations: async () => {
    if (!get().currentUser) return
    try {
      const convs = await api.getConversations()
      set({ conversations: convs })
    } catch (e) {
      console.error('fetchConversations error:', e)
    }
  },
  startConversation: async (otherUserId, otherUserName, itemId, itemTitle) => {
    const conv = await api.startConversation(otherUserId, otherUserName, itemId, itemTitle)
    set((state) => {
      if (!state.conversations.find((c: any) => c.id === conv.id)) {
        return { conversations: [conv, ...state.conversations] }
      }
      return state
    })
    return conv.id
  },

  messages: {},
  fetchMessages: async (conversationId) => {
    if (!get().currentUser) return
    try {
      const msgs = await api.getMessages(conversationId)
      set((state) => ({ messages: { ...state.messages, [conversationId]: msgs } }))
    } catch (e) {
      console.error('fetchMessages error:', e)
    }
  },
  sendMessage: async (conversationId, text) => {
    const msg = await api.sendMessage(conversationId, text)
    set((state) => {
      const existing = state.messages[conversationId] || []
      return {
        messages: { ...state.messages, [conversationId]: [...existing, msg] },
        conversations: state.conversations.map((c: any) =>
          c.id === conversationId
            ? { ...c, lastMessage: text, lastMessageTime: msg.createdAt }
            : c
        ),
      }
    })
  },

  login: async (provider = 'google') => {
    await nextAuthSignIn(provider, { callbackUrl: window.location.pathname })
  },
  logout: async () => {
    await nextAuthSignOut({ callbackUrl: '/' })
  },
}))
