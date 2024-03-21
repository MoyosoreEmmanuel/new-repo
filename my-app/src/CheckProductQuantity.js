import React, { useState, useEffect } from 'react';

const CheckProductQuantity = ({ contract }) => {
  const [account, setAccount] = useState('');
  const [productIndex, setProductIndex] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.');
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    };

    // Set the initial account
    window.ethereum.request({ method: 'eth_accounts' })
      .then(handleAccountsChanged)
      .catch((err) => {
        console.error(err);
      });

    // Subscribe to accounts change
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    // Unsubscribe on cleanup
    return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
  }, [account]);

  const handleCheckProductQuantity = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const quantity = await contract.methods.checkProductQuantity(productIndex).call({ from: account });

      setQuantity(quantity);
    } catch (error) {
      console.error(error);
      let errorMessage = 'Error checking product quantity: ';
  
      // Check if the error was due to a revert
      if (error.code === 'CALL_EXCEPTION') {
        errorMessage += error.data.message;
      } else {
        errorMessage += error.message;
      }

      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Check Product Quantity</h2>
      <input
        type="number"
        value={productIndex}
        onChange={e => setProductIndex(e.target.value)}
        placeholder="Enter product index"
      />
      <button onClick={handleCheckProductQuantity} disabled={isLoading}>
        {isLoading ? 'Checking...' : 'Check Quantity'}
      </button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <p>Quantity: {quantity}</p>
    </div>
  );
};

export default CheckProductQuantity;
