import React from 'react'

const CartItem = ({
  item,
  count,
  update_item,
  remove_item,
  setAlert  
}) => {
  return (
    <div>
      <h1>Cart Item Page</h1>
      <img src={
        item.product.photo
      } alt="" className='w-24 h-24'/>
    </div>
  )
}

export default CartItem