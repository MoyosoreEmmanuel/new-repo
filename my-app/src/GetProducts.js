import React, { useState, useEffect } from 'react';

const GetProducts = ({ contract }) => {
  const [account, setAccount] = useState('');
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    };

    window.ethereum.request({ method: 'eth_accounts' })
      .then(handleAccountsChanged)
      .catch((err) => {
        console.error(err);
      });

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
  }, [account]);

  const handleGetProducts = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const productList = await contract.methods.getProducts().call({ from: account });

      const formattedProducts = productList.map(product => ({
        name: product.name,
        quantity: Number(product.quantity),
        price: Number(product.price),
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error(error);
      let errorMessage = 'Error getting products: ';
  
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
      <h2>Get Products</h2>
      <button onClick={handleGetProducts} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Get Products'}
      </button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {products && products.map((product, index) => (
        <div key={index}>
          <p>Name: {product.name}</p>
          <p>Quantity: {product.quantity}</p>
          <p>Price: {product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default GetProducts;
