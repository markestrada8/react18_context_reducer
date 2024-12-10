import { createContext, useReducer } from 'react'
import { DUMMY_PRODUCTS } from '../dummy-products'

const INITIAL_CONTEXT = {
  items: [],
  addItemToCart: () => { },
  updateItemQuantity: () => { }
}

const INITIAL_STATE = {
  items: []
}

export const CartContext = createContext(INITIAL_CONTEXT)

function shoppingCartReducer(state, action) {

  if (action.type === 'ADD_ITEM') {

    const updatedItems = [...state.items]

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload
    )
    const existingCartItem = updatedItems[existingCartItemIndex]

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      }
      updatedItems[existingCartItemIndex] = updatedItem
    } else {
      const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload)
      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      })
    }

    return {
      ...state,
      items: updatedItems,
    }
  }

  if (action.type === 'UPDATE_ITEM_QUANTITY') {

    const updatedItems = [...state.items]
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    )

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    }

    updatedItem.quantity += action.payload.amount

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1)
    } else {
      updatedItems[updatedItemIndex] = updatedItem
    }

    return {
      ...state,
      items: updatedItems,
    }
  }

  return state
}

export default function CartContextProvider({ children }) {

  const [shoppingCartState, shoppingCartDispatch] = useReducer(shoppingCartReducer, INITIAL_STATE)

  // const [shoppingCart, setShoppingCart] = useState({
  //   items: [],
  // })

  function handleAddItemToCart(id) {

    shoppingCartDispatch({
      type: 'ADD_ITEM',
      payload: id
    })

    // setShoppingCart((prevShoppingCart) => {

    // })
  }

  function handleUpdateCartItemQuantity(productId, amount) {

    shoppingCartDispatch({
      type: 'UPDATE_ITEM_QUANTITY',
      payload: { productId, amount }
    })
    // setShoppingCart((prevShoppingCart) => {

    // })
  }

  const contextValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}



