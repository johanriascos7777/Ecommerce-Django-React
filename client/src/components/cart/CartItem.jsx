import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheck, FaRegClock, FaTimes } from 'react-icons/fa';

const CartItem = ({ item, count, update_item, remove_item, setAlert }) => {
  const [formData, setFormData] = useState({
    item_count: 1,
  });

  const { item_count } = formData;

  useEffect(() => {
    if (count) {
      setFormData((prev) => ({
        ...prev,
        item_count: count,
      }));
    }
  }, [count]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const fetchData = async () => {
      try {
        if (item.product.quantity >= item_count) {
          await update_item(item, item_count);
        } else {
          setAlert("Not enough in stock", "danger");
        }
      } catch (err) {}
    };

    fetchData();
  };

  const removeItemHandler = async () => {
    await remove_item(item);
  };

  return (
    <div>
      <h1>Cart Item Page</h1>
      <img src={item.product.photo} alt="" className="w-24 h-24" />
      <Link to={`/product/${item.product.id}`}>
        <h2>{item.product.name}</h2>
           </Link>
        <p>{item.product.price} USD</p>
        <div className="mt-2">
          <form onSubmit={(e) => onSubmit(e)}>
            <label htmlFor="item_count" className="sr-only">
              Quantity, {item.product.name}
            </label>
            <select
              name="item_count"
              onChange={(e) => onChange(e)}
              value={item_count}
              className="max-w-full rounded-md border border-gray-300 py-1 px-2"
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
            </select>
            <button
              type="submit"
              className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
            >
              <span className="mx-2">Update</span>
            </button>
          </form>
        </div>{" "}
        <div className="">
          <button
            onClick={removeItemHandler}
            className="-m-2 p-2 inline-flex items-center text-red-600 hover:text-red-800"
          >
            <FaTimes className="h-5 w-5" aria-hidden="true" />
            <span className="ml-1">Remove</span>
          </button>
        </div>

         <p className="mt-4 flex items-center text-sm text-gray-700 space-x-2">
            {     
                item.product && 
                item.product.quantity > 0 ? 
            (
                <>
                <FaCheck className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                <span>In Stock</span>
                </>
            ) 
            : (
                <>
                <FaRegClock className="flex-shrink-0 h-5 w-5 text-gray-300" aria-hidden="true" />
                <span>Out of Stock</span>
                </>
            )}
        </p>
   
    </div>
  );
};

export default CartItem;
