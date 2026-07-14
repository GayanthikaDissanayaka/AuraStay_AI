import React, { useState } from 'react';
import { auth } from "../firebase/firebase";
import './FoodMenu.css';

const FoodMenu = () => {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Margherita Pizza', category: 'Main Course', price: 18.99, available: true },
    { id: 2, name: 'Caesar Salad', category: 'Appetizer', price: 12.99, available: true },
    { id: 3, name: 'Grilled Salmon', category: 'Main Course', price: 24.99, available: true },
    { id: 4, name: 'Chocolate Cake', category: 'Dessert', price: 8.99, available: false },
    { id: 5, name: 'Cappuccino', category: 'Beverage', price: 4.99, available: true },
  ]);

  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'Main Course', price: '', available: true });

  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      setMenuItems([...menuItems, { 
        id: menuItems.length + 1, 
        ...newItem, 
        price: parseFloat(newItem.price),
        available: true
      }]);
      setNewItem({ name: '', category: 'Main Course', price: '', available: true });
      setShowAddItem(false);
    }
  };

  const toggleAvailability = (id) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  return (
    <div className="food-menu">
      <div className="menu-header">
        <h2>Food Menu</h2>
        <button className="add-item-btn" onClick={() => setShowAddItem(true)}>+ Add Menu Item</button>
      </div>

      {showAddItem && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Menu Item</h3>
            <input type="text" placeholder="Item Name" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} />
            <select value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})}>
              <option value="Appetizer">Appetizer</option>
              <option value="Main Course">Main Course</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverage">Beverage</option>
            </select>
            <input type="number" step="0.01" placeholder="Price" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} />
            <div className="modal-buttons">
              <button onClick={handleAddItem}>Add Item</button>
              <button onClick={() => setShowAddItem(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="menu-categories">
        {['Appetizer', 'Main Course', 'Dessert', 'Beverage'].map(category => (
          <div key={category} className="category-section">
            <h3>{category}</h3>
            <div className="menu-items">
              {menuItems.filter(item => item.category === category).map(item => (
                <div key={item.id} className="menu-item">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p className="item-price">${item.price}</p>
                  </div>
                  <div className="item-status">
                    <span className={`availability ${item.available ? 'available' : 'unavailable'}`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                    <button onClick={() => toggleAvailability(item.id)} className="toggle-btn">
                      Toggle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodMenu;