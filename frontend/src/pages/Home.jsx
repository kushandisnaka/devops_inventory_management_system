import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

export default function Home({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { id: 1, name: 'Laptop', category: 'Electronics', quantity: 5, value: 5000 },
    { id: 2, name: 'Desk Chair', category: 'Furniture', quantity: 12, value: 300 },
    { id: 3, name: 'Monitor', category: 'Electronics', quantity: 8, value: 2400 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Electronics',
    quantity: '',
    value: '',
  });

  const currentUser = localStorage.getItem('currentUser');
  const user = currentUser ? JSON.parse(currentUser) : null;

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.value) {
      alert('Please fill in all fields');
      return;
    }

    const item = {
      id: Math.max(...items.map(i => i.id), 0) + 1,
      name: newItem.name,
      category: newItem.category,
      quantity: parseInt(newItem.quantity),
      value: parseFloat(newItem.value),
    };

    setItems([...items, item]);
    setNewItem({ name: '', category: 'Electronics', quantity: '', value: '' });
    setShowModal(false);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.value), 0);

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo"></div>
            <h1>InventoryPro</h1>
          </div>
          <div className="header-info">
            <span className="user-name">Hello, {user?.fullName || 'User'}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="home-main">
        <div className="dashboard-grid">
          {/* Stats Cards */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Total Items</h3>
                <p className="stat-value">{totalItems}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Value</h3>
                <p className="stat-value">${totalValue.toFixed(2)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3>Categories</h3>
                <p className="stat-value">{new Set(items.map(i => i.category)).size}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✓</div>
              <div className="stat-content">
                <h3>Total Products</h3>
                <p className="stat-value">{items.length}</p>
              </div>
            </div>
          </div>

          {/* Inventory Table Section */}
          <div className="inventory-section">
            <div className="section-header">
              <h2>Inventory Items</h2>
              <button onClick={() => setShowModal(true)} className="add-btn">
                + Add New Item
              </button>
            </div>

            {items.length > 0 ? (
              <div className="table-wrapper">
                <table className="inventory-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Category</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total Value</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="item-name">{item.name}</td>
                        <td>
                          <span className="category-badge">{item.category}</span>
                        </td>
                        <td className="quantity">
                          <span className={item.quantity > 5 ? 'high' : 'low'}>
                            {item.quantity}
                          </span>
                        </td>
                        <td>${item.value.toFixed(2)}</td>
                        <td className="total-value">
                          ${(item.quantity * item.value).toFixed(2)}
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="delete-btn"
                            title="Delete item"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No items in inventory yet</p>
                <button onClick={() => setShowModal(true)} className="add-btn-empty">
                  Add Your First Item
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Item</h2>
              <button
                onClick={() => setShowModal(false)}
                className="close-btn"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  placeholder="Enter item name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  className="form-input"
                >
                  <option>Electronics</option>
                  <option>Furniture</option>
                  <option>Supplies</option>
                  <option>Tools</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, quantity: e.target.value })
                    }
                    placeholder="0"
                    className="form-input"
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Unit Price ($)</label>
                  <input
                    type="number"
                    value={newItem.value}
                    onChange={(e) =>
                      setNewItem({ ...newItem, value: e.target.value })
                    }
                    placeholder="0.00"
                    className="form-input"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button onClick={handleAddItem} className="confirm-btn">
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
