import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://5d54bfd6-9650-496b-88a1-74114dff175c.preview.emergentagent.com';
const API = `${BACKEND_URL}/api`;

// Set up axios defaults for auth
const setupAxiosInterceptors = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Landing Page Component
const LandingPage = ({ onShowLogin, onShowRegister }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="text-white text-2xl font-bold">PayMe</div>
        <div className="space-x-4">
          <button 
            onClick={onShowLogin}
            className="text-white hover:text-green-200 transition-colors"
          >
            Login
          </button>
          <button 
            onClick={onShowRegister}
            className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-6xl font-bold text-white mb-6">
          Send Money<br />
          <span className="text-green-200">Instantly</span>
        </h1>
        <p className="text-xl text-green-100 mb-8 max-w-2xl">
          Transfer money to friends, family, and businesses with just an email or phone number. 
          Fast, secure, and always free for standard transfers.
        </p>
        <button 
          onClick={onShowRegister}
          className="bg-white text-green-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-50 transition-colors"
        >
          Get Started Free
        </button>
      </div>

      {/* Features */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl mx-6 p-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💸</span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Send & Request</h3>
            <p className="text-green-100">Send or request money instantly with email or phone</p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏦</span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Withdraw Funds</h3>
            <p className="text-green-100">Transfer to your bank account or debit card</p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Secure</h3>
            <p className="text-green-100">Bank-level security and encryption</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-green-200 pb-8">
        <p>Support: PayMe.help2026@gmail.com</p>
      </footer>
    </div>
  );
};

// Login Component
const LoginForm = ({ onLogin, onBack, onShowRegister }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/auth/login`, {
        identifier,
        password
      });

      localStorage.setItem('paymeToken', response.data.token);
      localStorage.setItem('paymeUser', JSON.stringify(response.data.user));
      setupAxiosInterceptors(response.data.token);
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md">
        <button onClick={onBack} className="text-green-500 mb-4">← Back</button>
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email, Phone, or Username
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          Don't have an account?{' '}
          <button onClick={onShowRegister} className="text-green-500 hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

// Register Component
const RegisterForm = ({ onRegister, onBack, onShowLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/auth/register`, formData);
      
      localStorage.setItem('paymeToken', response.data.token);
      localStorage.setItem('paymeUser', JSON.stringify(response.data.user));
      setupAxiosInterceptors(response.data.token);
      onRegister(response.data.user);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md">
        <button onClick={onBack} className="text-green-500 mb-4">← Back</button>
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Join PayMe</h2>
        
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
              placeholder="+1234567890"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          Already have an account?{' '}
          <button onClick={onShowLogin} className="text-green-500 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

// Cash App Style Dashboard
const CashAppDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('payment');
  const [amount, setAmount] = useState('0');
  const [transactions, setTransactions] = useState([]);
  const [userProfile, setUserProfile] = useState(user);
  const [moneyRequests, setMoneyRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search and selection states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [description, setDescription] = useState('');

  // Card states
  const [cardData, setCardData] = useState(null);
  const [cardSpending, setCardSpending] = useState(null);

  // Connected accounts states
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    account_type: 'bank_account',
    account_name: '',
    account_number: '',
    routing_number: ''
  });

  // Withdraw states
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [transferSpeed, setTransferSpeed] = useState('standard');

  // Profile picture states
  const [showProfilePicture, setShowProfilePicture] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  // Invite states
  const [inviteInfo, setInviteInfo] = useState(null);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchTransactions();
    fetchMoneyRequests();
    fetchCardData();
    fetchConnectedAccounts();
    fetchInviteInfo();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API}/user/profile`);
      setUserProfile(response.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API}/transactions`);
      setTransactions(response.data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  const fetchMoneyRequests = async () => {
    try {
      const receivedResponse = await axios.get(`${API}/payments/requests/received`);
      setMoneyRequests(receivedResponse.data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };

  const fetchCardData = async () => {
    try {
      const [cardResponse, spendingResponse] = await Promise.all([
        axios.get(`${API}/card`),
        axios.get(`${API}/card/spending`)
      ]);
      setCardData(cardResponse.data);
      setCardSpending(spendingResponse.data);
    } catch (err) {
      console.error('Failed to fetch card data:', err);
    }
  };

  const fetchConnectedAccounts = async () => {
    try {
      const response = await axios.get(`${API}/accounts/connected`);
      setConnectedAccounts(response.data);
    } catch (err) {
      console.error('Failed to fetch connected accounts:', err);
    }
  };

  const fetchInviteInfo = async () => {
    try {
      const response = await axios.get(`${API}/user/invite-info`);
      setInviteInfo(response.data);
    } catch (err) {
      console.error('Failed to fetch invite info:', err);
    }
  };

  const searchUsers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await axios.get(`${API}/user/search?query=${query}`);
      setSearchResults(response.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleNumberPress = (num) => {
    if (amount === '0') {
      setAmount(num);
    } else {
      setAmount(amount + num);
    }
  };

  const handleDecimalPress = () => {
    if (!amount.includes('.')) {
      setAmount(amount + '.');
    }
  };

  const handleBackspace = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount('0');
    }
  };

  const handlePay = async () => {
    if (!selectedUser) {
      alert('Please search and select someone first');
      setActiveTab('search');
      return;
    }
    
    if (parseFloat(amount) <= 0) {
      alert('Please enter an amount greater than $0');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/payments/send`, {
        recipient_identifier: selectedUser.username,
        amount: parseFloat(amount),
        description: description || 'PayMe payment'
      });

      alert(`$${parseFloat(amount).toFixed(2)} sent to ${selectedUser.username}! Fee: $${response.data.fee.toFixed(2)}`);
      setAmount('0');
      setSelectedUser(null);
      setDescription('');
      setSearchQuery('');
      setSearchResults([]);
      
      fetchUserProfile();
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.detail || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    if (!selectedUser) {
      alert('Please search and select someone first');
      setActiveTab('search');
      return;
    }
    
    if (parseFloat(amount) <= 0) {
      alert('Please enter an amount greater than $0');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/payments/request`, {
        requestee_identifier: selectedUser.username,
        amount: parseFloat(amount),
        description: description || 'PayMe request'
      });

      alert(`$${parseFloat(amount).toFixed(2)} request sent to ${selectedUser.username}!`);
      setAmount('0');
      setSelectedUser(null);
      setDescription('');
      setSearchQuery('');
      setSearchResults([]);
      
      fetchMoneyRequests();
    } catch (err) {
      alert(err.response?.data?.detail || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePayRequest = async (requestId) => {
    try {
      await axios.post(`${API}/payments/requests/pay`, {
        request_id: requestId
      });

      alert('Request paid successfully!');
      fetchUserProfile();
      fetchTransactions();
      fetchMoneyRequests();
    } catch (err) {
      alert(err.response?.data?.detail || 'Payment failed');
    }
  };

  const addFunds = async () => {
    const amountToAdd = prompt('Enter amount to add ($):');
    if (!amountToAdd || parseFloat(amountToAdd) <= 0) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API}/payments/add-funds`, {
        amount: parseFloat(amountToAdd),
        payment_method_id: 'pm_card_visa_demo'
      });

      alert(`$${parseFloat(amountToAdd).toFixed(2)} added successfully!`);
      fetchUserProfile();
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add funds');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('paymeToken');
    localStorage.removeItem('paymeUser');
    setupAxiosInterceptors(null);
    onLogout();
  };

  const toggleCardLock = async () => {
    try {
      const response = await axios.post(`${API}/card/lock`);
      setCardData(prev => ({
        ...prev,
        is_locked: response.data.is_locked
      }));
      alert(response.data.message);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to toggle card lock');
    }
  };

  const copyCardNumber = () => {
    if (cardData) {
      navigator.clipboard.writeText(cardData.card_number.replace(/\s/g, ''));
      alert('Card number copied to clipboard!');
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/accounts/connect`, newAccount);
      alert('Account connected successfully!');
      setShowAddAccount(false);
      setNewAccount({
        account_type: 'bank_account',
        account_name: '',
        account_number: '',
        routing_number: ''
      });
      fetchConnectedAccounts();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to connect account');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/payments/withdraw`, {
        amount: parseFloat(withdrawAmount),
        account_id: selectedAccount,
        transfer_speed: transferSpeed
      });

      alert(`Withdrawal initiated! ${response.data.estimated_arrival}`);
      setShowWithdraw(false);
      setWithdrawAmount('');
      setSelectedAccount('');
      
      fetchUserProfile();
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to withdraw money');
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePictureFile) return;

    try {
      const formData = new FormData();
      formData.append('image', profilePictureFile);

      await axios.post(`${API}/user/profile-picture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Profile picture updated successfully!');
      setShowProfilePicture(false);
      setProfilePictureFile(null);
      fetchUserProfile();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update profile picture');
    }
  };

  const shareInviteCode = () => {
    if (inviteInfo) {
      const message = `Join PayMe and get $${inviteInfo.bonus_amount}! Use my code: ${inviteInfo.invite_code}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Join PayMe',
          text: message,
          url: inviteInfo.invite_link
        });
      } else {
        navigator.clipboard.writeText(message);
        alert('Invite message copied to clipboard!');
      }
    }
  };

  // Profile Picture Component
  const ProfilePicture = ({ src, size = 'w-10 h-10', name, showCamera = false, onClick }) => {
    if (src) {
      return (
        <div className={`relative ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
          <img src={src} alt={name} className={`${size} rounded-full object-cover`} />
          {showCamera && (
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">📷</span>
            </div>
          )}
        </div>
      );
    }
    
    const initials = name ? name.charAt(0).toUpperCase() : '?';
    return (
      <div className={`relative ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
        <div className={`${size} rounded-full bg-green-500 flex items-center justify-center text-white font-semibold`}>
          {initials}
        </div>
        {showCamera && (
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">📷</span>
          </div>
        )}
      </div>
    );
  };

  // Main Payment Screen (Cash App Style)
  const PaymentScreen = () => (
    <div className="flex flex-col h-full">
      {/* Amount Display */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-light text-white mb-8">
            ${amount}
          </div>
          
          {/* Selected User Display */}
          {selectedUser && (
            <div className="mb-4 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <ProfilePicture src={selectedUser.profile_picture} name={selectedUser.username} />
                <span className="text-white font-medium">{selectedUser.username}</span>
              </div>
            </div>
          )}

          {/* Description Input */}
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this for?"
            className="w-full max-w-sm px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 mb-4"
          />
        </div>
      </div>

      {/* Number Keypad */}
      <div className="grid grid-cols-3 gap-4 p-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberPress(num.toString())}
            className="h-16 text-2xl text-white font-light hover:bg-gray-800 rounded-lg transition-colors"
          >
            {num}
          </button>
        ))}
        
        <button
          onClick={handleDecimalPress}
          className="h-16 text-2xl text-white font-light hover:bg-gray-800 rounded-lg transition-colors"
        >
          .
        </button>
        
        <button
          onClick={() => handleNumberPress('0')}
          className="h-16 text-2xl text-white font-light hover:bg-gray-800 rounded-lg transition-colors"
        >
          0
        </button>
        
        <button
          onClick={handleBackspace}
          className="h-16 text-2xl text-white font-light hover:bg-gray-800 rounded-lg transition-colors"
        >
          ⌫
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 p-4">
        <button
          onClick={handleRequest}
          disabled={loading}
          className="flex-1 bg-gray-700 text-white py-4 rounded-full text-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          Request
        </button>
        <button
          onClick={handlePay}
          disabled={loading}
          className="flex-1 bg-gray-700 text-white py-4 rounded-full text-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          Pay
        </button>
      </div>
    </div>
  );

  // Activity Screen - Cash App Style with REAL DATA
  const ActivityScreen = () => {
    // Get recent contacts from transactions
    const getRecentContacts = () => {
      const contacts = new Map();
      
      transactions.forEach(txn => {
        if (txn.type === 'send' || txn.type === 'receive') {
          const contact = txn.is_outgoing ? txn.recipient : txn.sender;
          if (contact && contact.username) {
            contacts.set(contact.username, {
              username: contact.username,
              profile_picture: contact.profile_picture,
              user_id: contact.user_id || contact.username,
              last_interaction: txn.created_at
            });
          }
        }
      });
      
      return Array.from(contacts.values())
        .sort((a, b) => new Date(b.last_interaction) - new Date(a.last_interaction))
        .slice(0, 4);
    };

    const recentContacts = getRecentContacts();

    const handleContactClick = (contact) => {
      setSelectedUser(contact);
      setActiveTab('payment');
    };

    const handleAddClick = () => {
      setActiveTab('search');
    };

    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-white">Activity</h1>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">🌍</span>
          </div>
        </div>

        <div className="px-4 pb-20">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search transactions"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400"
                onChange={(e) => {
                  // Could implement search functionality here
                }}
              />
            </div>
          </div>

          {/* Quick Actions - Real Recent Contacts */}
          <div className="mb-6">
            <div className="flex space-x-4 overflow-x-auto">
              {/* Add Money/Send Money Button */}
              <div 
                className="flex flex-col items-center min-w-0 cursor-pointer"
                onClick={handleAddClick}
              >
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-2 hover:bg-gray-700 transition-colors">
                  <span className="text-white text-2xl">+</span>
                </div>
                <span className="text-white text-sm">Send</span>
              </div>
              
              {/* Recent Contacts from Real Transactions */}
              {recentContacts.map((contact, index) => (
                <div 
                  key={contact.username}
                  className="flex flex-col items-center min-w-0 cursor-pointer"
                  onClick={() => handleContactClick(contact)}
                >
                  <div className="relative">
                    <ProfilePicture 
                      src={contact.profile_picture} 
                      name={contact.username}
                      size="w-16 h-16"
                    />
                  </div>
                  <span className="text-white text-sm mt-2 truncate w-16 text-center">
                    {contact.username.length > 8 ? contact.username.substring(0, 8) + '...' : contact.username}
                  </span>
                </div>
              ))}
              
              {/* Fill remaining slots with sample if needed */}
              {recentContacts.length < 4 && (
                <>
                  {recentContacts.length < 1 && (
                    <div className="flex flex-col items-center min-w-0">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-2">
                        <span className="text-white text-sm">E</span>
                      </div>
                      <span className="text-white text-sm">Emergent</span>
                    </div>
                  )}
                  
                  {recentContacts.length < 2 && (
                    <div className="flex flex-col items-center min-w-0">
                      <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mb-2">
                        <span className="text-white text-sm">F</span>
                      </div>
                      <span className="text-white text-sm">Fiverr</span>
                    </div>
                  )}
                  
                  {recentContacts.length < 3 && (
                    <div className="flex flex-col items-center min-w-0">
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-2">
                        <span className="text-white text-sm">R</span>
                      </div>
                      <span className="text-white text-sm">Remote</span>
                    </div>
                  )}
                  
                  {recentContacts.length < 4 && (
                    <div className="flex flex-col items-center min-w-0">
                      <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-2">
                        <span className="text-white text-sm">P</span>
                      </div>
                      <span className="text-white text-sm">Patrick</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Pending Section - Real Money Requests */}
          {moneyRequests.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white text-xl font-semibold mb-4">Pending</h3>
              {moneyRequests.map((request) => (
                <div key={request.request_id} className="flex items-center justify-between p-4 mb-3 hover:bg-gray-900 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <ProfilePicture 
                      src={request.requester.profile_picture} 
                      name={request.requester.username}
                      size="w-12 h-12"
                    />
                    <div>
                      <div className="text-white font-medium">{request.requester.username}</div>
                      <div className="text-gray-400 text-sm">PayMe Request</div>
                      <div className="text-gray-500 text-xs">
                        {new Date(request.created_at).toLocaleDateString('en-US', { 
                          weekday: 'long' 
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">${request.amount.toFixed(2)}</div>
                    <button
                      onClick={() => handlePayRequest(request.request_id)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm mt-1 hover:bg-green-700 transition-colors"
                    >
                      Pay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* This Month Section - Real Transactions */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">This month</h3>
            <div className="space-y-3">
              {transactions.length > 0 ? transactions.map((txn) => (
                <div 
                  key={txn.transaction_id} 
                  className="flex items-center justify-between p-2 hover:bg-gray-900 rounded-lg transition-colors cursor-pointer"
                  onClick={() => {
                    // Could show transaction details
                    alert(`Transaction: ${txn.description || txn.type} - $${txn.amount}`);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    {txn.type === 'add_funds' ? (
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">$</span>
                      </div>
                    ) : txn.type === 'withdraw' ? (
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🏦</span>
                      </div>
                    ) : txn.type === 'card_purchase' ? (
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">💳</span>
                      </div>
                    ) : txn.is_outgoing ? (
                      <ProfilePicture 
                        src={txn.recipient?.profile_picture} 
                        name={txn.recipient?.username || 'Unknown'}
                        size="w-12 h-12"
                      />
                    ) : (
                      <ProfilePicture 
                        src={txn.sender?.profile_picture} 
                        name={txn.sender?.username || 'Unknown'}
                        size="w-12 h-12"
                      />
                    )}
                    
                    <div>
                      <div className="text-white font-medium">
                        {txn.type === 'add_funds' ? 'Add money' :
                         txn.type === 'withdraw' ? 'Withdrawal' :
                         txn.type === 'card_purchase' ? (txn.description?.replace('Purchase at ', '') || 'Card Purchase') :
                         txn.is_outgoing ? txn.recipient?.username || 'Unknown' :
                         txn.sender?.username || 'Unknown'}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {txn.type === 'add_funds' ? 'Stripe Bank, National Association' :
                         txn.type === 'withdraw' ? 'Bank Transfer' :
                         txn.type === 'card_purchase' ? 'Card Purchase' :
                         'PayMe Transfer'}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {new Date(txn.created_at).toLocaleDateString('en-US', { 
                          weekday: 'long' 
                        })} • {txn.type === 'card_purchase' ? 'PayMe Card' : 'PayMe'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {(txn.is_outgoing || txn.type === 'withdraw' || txn.type === 'card_purchase') ? 
                        '' : '+'}${txn.amount.toFixed(2)}
                    </div>
                    {txn.fee > 0 && (
                      <div className="text-gray-500 text-xs">Fee: ${txn.fee.toFixed(2)}</div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-lg mb-2">No activity yet</div>
                  <div className="text-gray-500 text-sm">Start by sending money or adding funds</div>
                  <button
                    onClick={() => setActiveTab('payment')}
                    className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Send Money
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Search Screen
  const SearchScreen = () => (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-white mb-4">Find People</h2>
      
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          searchUsers(e.target.value);
        }}
        placeholder="Search by username, email, or phone"
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 mb-4"
      />

      <div className="space-y-2">
        {searchResults.map((user) => (
          <div
            key={user.user_id}
            onClick={() => {
              setSelectedUser(user);
              setActiveTab('payment');
            }}
            className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <ProfilePicture src={user.profile_picture} name={user.username} />
            <div>
              <div className="text-white font-medium">{user.username}</div>
              <div className="text-gray-400 text-sm">{user.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Cash App Style Card Screen with FULL Functionality
  const CardScreen = () => (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-white">Card</h1>
      </div>

      <div className="px-4 pb-20">
        {/* Virtual Card Display */}
        {cardData && (
          <div className="mb-6">
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-6 mb-4 relative">
              {/* Card Lock/Unlock Icon */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={toggleCardLock}
                  className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-sm">
                    {cardData.is_locked ? '🔒' : '🔓'}
                  </span>
                </button>
              </div>
              
              {/* Card Number */}
              <div className="text-white text-2xl font-mono mb-6 tracking-wider">
                {cardData.card_number}
              </div>
              
              {/* Card Holder Info */}
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-gray-300 text-lg font-medium">
                    {cardData.card_holder_name}
                  </div>
                  <div className="text-gray-400 text-sm">
                    CVV {cardData.cvv} EXP {cardData.expiry_date}
                  </div>
                </div>
                <div className="text-white text-2xl font-bold">VISA</div>
              </div>
            </div>

            {/* Card Action Buttons */}
            <div className="flex space-x-3 mb-6">
              <button
                onClick={toggleCardLock}
                className="flex-1 bg-gray-800 text-white py-4 rounded-xl font-medium hover:bg-gray-700 transition-colors"
              >
                {cardData.is_locked ? 'Unlock card' : 'Lock card'}
              </button>
              <button
                onClick={copyCardNumber}
                className="flex-1 bg-gray-800 text-white py-4 rounded-xl font-medium hover:bg-gray-700 transition-colors"
              >
                Copy number
              </button>
            </div>
          </div>
        )}

        {/* My Spend Section */}
        <div className="mb-6">
          <h2 className="text-white text-xl font-semibold mb-4">My spend</h2>
          
          <div className="space-y-1">
            <div className="flex items-center p-4 bg-gray-800 rounded-lg">
              <span className="text-2xl mr-4">📊</span>
              <div className="flex-1">
                <div className="text-white font-medium">Monthly spending</div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">
                  ${cardSpending?.monthly_total?.toFixed(2) || '0.00'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Purchase Section */}
        <div className="mb-6">
          <h2 className="text-white text-xl font-semibold mb-4">Test Card Purchase</h2>
          <button
            onClick={() => {
              const amount = prompt('Enter purchase amount:');
              const merchant = prompt('Enter merchant name:');
              if (amount && merchant) {
                axios.post(`${API}/card/purchase`, {
                  amount: parseFloat(amount),
                  merchant,
                  description: `Test purchase`
                }).then(() => {
                  alert('Purchase successful!');
                  fetchUserProfile();
                  fetchTransactions();
                  fetchCardData();
                }).catch(err => {
                  alert(err.response?.data?.detail || 'Purchase failed');
                });
              }
            }}
            className="w-full bg-purple-600 text-white py-4 rounded-xl font-medium hover:bg-purple-700 transition-colors"
          >
            Test Online Purchase
          </button>
        </div>

        {/* Banking Information Section */}
        <div className="text-center px-4 mb-8">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl">🛡️</span>
          </div>
          
          <div className="text-gray-300 text-sm leading-relaxed mb-6">
            Your balance is eligible for FDIC pass-through insurance through 
            our Program Banks Wells Fargo Bank, N.A. and/or Sutton Bank, 
            Members FDIC for up to $250,000 per customer when aggregated with 
            all other deposits held in the same legal capacity at each Program Bank 
            above, if certain conditions are met.
          </div>
          
          <div className="text-gray-300 text-sm leading-relaxed mb-4">
            PayMe is a financial services platform powered by Stripe, and not an FDIC-insured 
            bank. Prepaid debit cards issued by our partner banks, Member FDIC.
          </div>
          
          <div className="text-gray-400 text-xs leading-relaxed">
            Banking services provided by PayMe's bank partner(s) through Stripe. 
            Payment processing services by Stripe Payments Company LLC, member of Stripe, Inc. 
            Card services powered by Stripe Issuing.
          </div>
        </div>
      </div>
    </div>
  );

  // Full-Featured Profile Screen
  const ProfileScreen = () => (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
      </div>

      {/* Profile Section */}
      <div className="text-center px-6 pb-6">
        <ProfilePicture 
          src={userProfile.profile_picture} 
          name={userProfile.username}
          size="w-24 h-24"
          showCamera={true}
          onClick={() => setShowProfilePicture(true)}
        />
        
        <h1 className="text-3xl font-bold text-white mt-4 mb-2">
          {userProfile.username}
        </h1>
        
        <div className="bg-gray-800 rounded-full px-4 py-2 inline-block">
          <span className="text-white font-medium">${userProfile.username}</span>
        </div>
      </div>

      {/* Invite Friends Section */}
      <div className="px-6 mb-6">
        <div 
          onClick={() => setShowInvite(true)}
          className="flex items-center p-4 bg-gray-900 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
        >
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
            <span className="text-white text-xl">+</span>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">Invite friends</h3>
            <p className="text-green-400 text-sm">Get $15 for each friend who joins</p>
          </div>
          <span className="text-gray-400">›</span>
        </div>
      </div>

      {/* Account Options */}
      <div className="px-6 mb-8">
        <h2 className="text-white text-xl font-semibold mb-4">Account & settings</h2>
        
        <div className="space-y-1">
          <div 
            onClick={() => setShowAddAccount(true)}
            className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <span className="text-2xl mr-4">🏦</span>
            <div className="flex-1">
              <div className="text-white font-medium">Linked banks</div>
              <div className="text-gray-400 text-sm">{connectedAccounts.length} connected</div>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Balance and Actions */}
        <div className="space-y-2">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Current Balance</div>
            <div className="text-2xl font-semibold text-white">${userProfile.balance?.toFixed(2) || '0.00'}</div>
          </div>
          
          <button
            onClick={addFunds}
            className="w-full bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            💳 Add Funds
          </button>

          <button
            onClick={() => setShowWithdraw(true)}
            className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🏦 Withdraw Money
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Profile Picture Modal */}
      {showProfilePicture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">Update Profile Picture</h2>
            
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePictureFile(e.target.files[0])}
              className="w-full mb-4 text-white"
            />

            <div className="flex space-x-4">
              <button
                onClick={() => setShowProfilePicture(false)}
                className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProfilePictureUpload}
                disabled={!profilePictureFile}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">Connect Bank Account</h2>
            
            <form onSubmit={handleAddAccount}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Account Type
                </label>
                <select
                  value={newAccount.account_type}
                  onChange={(e) => setNewAccount({...newAccount, account_type: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                >
                  <option value="bank_account">Bank Account</option>
                  <option value="debit_card">Debit Card</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={newAccount.account_name}
                  onChange={(e) => setNewAccount({...newAccount, account_name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="My Checking Account"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={newAccount.account_number}
                  onChange={(e) => setNewAccount({...newAccount, account_number: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="1234567890"
                  required
                />
              </div>

              {newAccount.account_type === 'bank_account' && (
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    value={newAccount.routing_number}
                    onChange={(e) => setNewAccount({...newAccount, routing_number: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="021000021"
                    required
                  />
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddAccount(false)}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">Withdraw Money</h2>
            
            {connectedAccounts.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-400 mb-4">No bank accounts connected</p>
                <button
                  onClick={() => {
                    setShowWithdraw(false);
                    setShowAddAccount(true);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Connect Bank Account
                </button>
              </div>
            ) : (
              <form onSubmit={handleWithdraw}>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Withdraw To
                  </label>
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    required
                  >
                    <option value="">Select account...</option>
                    {connectedAccounts.map((account) => (
                      <option key={account.account_id} value={account.account_id}>
                        {account.account_name} (...{account.last_four})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={userProfile.balance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Transfer Speed
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="standard"
                        checked={transferSpeed === 'standard'}
                        onChange={(e) => setTransferSpeed(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-white">Standard (1-3 business days) - Free</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="instant"
                        checked={transferSpeed === 'instant'}
                        onChange={(e) => setTransferSpeed(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-white">Instant (within minutes) - 1.5% fee</span>
                    </label>
                  </div>
                  
                  {withdrawAmount && transferSpeed === 'instant' && (
                    <p className="text-sm text-gray-400 mt-2">
                      Fee: ${Math.max(0.25, parseFloat(withdrawAmount) * 0.015).toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowWithdraw(false)}
                    className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Withdraw
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && inviteInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">Invite Friends</h2>
            
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">👥</div>
              <p className="text-gray-300 mb-4">
                Share your invite code and both you and your friend get ${inviteInfo.bonus_amount}!
              </p>
              
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="text-gray-400 text-sm">Your invite code</div>
                <div className="text-2xl font-bold text-white">{inviteInfo.invite_code}</div>
              </div>
              
              <div className="text-gray-400 text-sm mb-4">
                Friends invited: {inviteInfo.invited_count}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowInvite(false)}
                className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={shareInviteCode}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Share Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Money Tab with Withdraw Button
  const HomeScreen = () => (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-white">Money</h1>
      </div>

      <div className="px-4 pb-20">
        {/* Cash Balance Section */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Cash balance</div>
          </div>
          <div className="text-4xl font-light text-white mb-6">
            ${userProfile.balance?.toFixed(2) || '0.00'}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={addFunds}
              className="flex-1 bg-gray-700 text-white py-4 rounded-xl font-medium hover:bg-gray-600 transition-colors"
            >
              Add money
            </button>
            <button
              onClick={() => setShowWithdraw(true)}
              className="flex-1 bg-gray-700 text-white py-4 rounded-xl font-medium hover:bg-gray-600 transition-colors"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Banking Information Section */}
        <div className="text-center px-4 mb-8">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl">🛡️</span>
          </div>
          
          <div className="text-gray-300 text-sm leading-relaxed mb-6">
            Your balance is eligible for FDIC pass-through insurance through 
            our Program Banks including Wells Fargo Bank, N.A. and Evolve Bank & Trust, 
            Members FDIC for up to $250,000 per customer when aggregated with 
            all other deposits held in the same legal capacity at each Program Bank 
            above, if certain conditions are met.
          </div>
          
          <div className="text-gray-300 text-sm leading-relaxed mb-4">
            PayMe is a financial services platform powered by Stripe, and not an FDIC-insured 
            bank. Prepaid debit cards issued by our partner banks, Member FDIC.
          </div>
          
          <div className="text-gray-400 text-xs leading-relaxed">
            Banking services provided by PayMe's bank partner(s) through Stripe. 
            Payment processing services by Stripe Payments Company LLC, member of Stripe, Inc. 
            Financial services powered by Stripe Atlas. Tax filing services by 
            PayMe Taxes.
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">Withdraw Money</h2>
            
            {connectedAccounts.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-400 mb-4">No bank accounts connected</p>
                <button
                  onClick={() => {
                    setShowWithdraw(false);
                    setShowAddAccount(true);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Connect Bank Account
                </button>
              </div>
            ) : (
              <form onSubmit={handleWithdraw}>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Withdraw To
                  </label>
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    required
                  >
                    <option value="">Select account...</option>
                    {connectedAccounts.map((account) => (
                      <option key={account.account_id} value={account.account_id}>
                        {account.account_name} (...{account.last_four})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={userProfile.balance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Transfer Speed
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="standard"
                        checked={transferSpeed === 'standard'}
                        onChange={(e) => setTransferSpeed(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-white">Standard (1-3 business days) - Free</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="instant"
                        checked={transferSpeed === 'instant'}
                        onChange={(e) => setTransferSpeed(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-white">Instant (within minutes) - 1.5% fee</span>
                    </label>
                  </div>
                  
                  {withdrawAmount && transferSpeed === 'instant' && (
                    <p className="text-sm text-gray-400 mt-2">
                      Fee: ${Math.max(0.25, parseFloat(withdrawAmount) * 0.015).toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowWithdraw(false)}
                    className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Withdraw
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">Connect Bank Account</h2>
            
            <form onSubmit={handleAddAccount}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Account Type
                </label>
                <select
                  value={newAccount.account_type}
                  onChange={(e) => setNewAccount({...newAccount, account_type: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                >
                  <option value="bank_account">Bank Account</option>
                  <option value="debit_card">Debit Card</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={newAccount.account_name}
                  onChange={(e) => setNewAccount({...newAccount, account_name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="My Checking Account"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={newAccount.account_number}
                  onChange={(e) => setNewAccount({...newAccount, account_number: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="1234567890"
                  required
                />
              </div>

              {newAccount.account_type === 'bank_account' && (
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    value={newAccount.routing_number}
                    onChange={(e) => setNewAccount({...newAccount, routing_number: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="021000021"
                    required
                  />
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddAccount(false)}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'activity' && <ActivityScreen />}
        {activeTab === 'payment' && <PaymentScreen />}
        {activeTab === 'card' && <CardScreen />}
        {activeTab === 'search' && <SearchScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </div>

      {/* Bottom Navigation */}
      <div className="flex bg-gray-900 border-t border-gray-800">
        {[
          { id: 'home', icon: '🏠', label: 'Home' },
          { id: 'activity', icon: '📋', label: 'Activity' },
          { id: 'payment', icon: '$', label: '' },
          { id: 'card', icon: '💳', label: 'Card' },
          { id: 'search', icon: '🔍', label: 'Search' },
          { id: 'profile', icon: '👤', label: 'Profile' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-1 text-center ${
              activeTab === tab.id ? 'text-white' : 'text-gray-500'
            } ${tab.id === 'payment' ? 'text-2xl' : 'text-sm'}`}
          >
            <div className={tab.id === 'payment' ? 'text-3xl' : 'text-lg'}>{tab.icon}</div>
            {tab.label && <div className="text-xs mt-1">{tab.label}</div>}
          </button>
        ))}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('paymeToken');
    const savedUser = localStorage.getItem('paymeUser');
    
    if (token && savedUser) {
      setupAxiosInterceptors(token);
      setUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  return (
    <div className="App">
      {currentView === 'landing' && (
        <LandingPage 
          onShowLogin={() => setCurrentView('login')}
          onShowRegister={() => setCurrentView('register')}
        />
      )}
      
      {currentView === 'login' && (
        <LoginForm 
          onLogin={handleLogin}
          onBack={() => setCurrentView('landing')}
          onShowRegister={() => setCurrentView('register')}
        />
      )}
      
      {currentView === 'register' && (
        <RegisterForm 
          onRegister={handleRegister}
          onBack={() => setCurrentView('landing')}
          onShowLogin={() => setCurrentView('login')}
        />
      )}
      
      {currentView === 'dashboard' && user && (
        <CashAppDashboard 
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;