import React, { useEffect, useState } from 'react';
import { contractInstance, initializeWeb3 } from './web3'; // Import contractInstance, and initializeWeb3 from web3.js
import AddProduct from './AddProduct';
import RemoveProduct from './RemoveProduct';
import SellProduct from './SellProduct';
import UpdateQuantity from './UpdateQuantity';
import GetProducts from './GetProducts';
import CheckProductQuantity from './CheckProductQuantity';

const App = () => {
  const [isLoading, setIsLoading] = useState(true); // Add this line

  useEffect(() => {
    initializeWeb3(setIsLoading); // Pass setIsLoading to initializeWeb3
  }, []);

  if (isLoading) { // Add this block
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <AddProduct contract={contractInstance} />
      <RemoveProduct contract={contractInstance} />
      <SellProduct contract={contractInstance} />
      <UpdateQuantity contract={contractInstance} />
      <GetProducts contract={contractInstance} />
      <CheckProductQuantity contract={contractInstance} />
    </div>
  );
};

export default App;
