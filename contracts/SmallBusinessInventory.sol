// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract SmallBusinessInventory {
    struct Product {
        string name;
        uint quantity;
        uint price;
    }

    mapping (uint => Product) public products;
    uint public productIndex;

    address public owner;

    event ProductAdded(uint index, string name, uint quantity, uint price);
    event QuantityUpdated(uint index, uint oldQuantity, uint newQuantity);
    event ProductSold(uint index, uint quantity);
    event ProductRemoved(uint index);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this operation");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addProduct(string memory name, uint quantity, uint price) public onlyOwner {
        require(bytes(name).length > 0, "Product name cannot be empty");
        require(quantity > 0, "Product quantity must be greater than zero");
        require(price > 0, "Product price must be greater than zero");

        products[productIndex] = Product(name, quantity, price);
        emit ProductAdded(productIndex, name, quantity, price);
        productIndex++;
    }

    function updateQuantity(uint index, uint quantity) public onlyOwner {
        require(index < productIndex, "Product not found");
        require(quantity >= 0, "Product quantity cannot be negative");

        uint oldQuantity = products[index].quantity;
        products[index].quantity = quantity;
        emit QuantityUpdated(index, oldQuantity, quantity);
    }

    function sellProduct(uint index, uint quantity) public onlyOwner {
        require(index < productIndex, "Product not found");
        require(products[index].quantity >= quantity, "Not enough stock to sell");
        require(quantity > 0, "Sale quantity must be greater than zero");

        products[index].quantity -= quantity;
        emit ProductSold(index, quantity);
    }

    function removeProduct(uint index) public onlyOwner {
        require(index < productIndex, "Product not found");

        for (uint i = index; i < productIndex-1; i++){
            products[i] = products[i+1];
        }
        delete products[productIndex-1];
        productIndex--;
        emit ProductRemoved(index);
    }

    function checkProductQuantity(uint index) public view returns (uint quantity) {
        require(index < productIndex, "Product not found");
        return products[index].quantity;
    }

    function getProducts() public view returns (Product[] memory) {
       Product[] memory productList = new Product[](productIndex);
        for (uint i = 0; i < productIndex; i++) {
            productList[i] = products[i];
        }
        return productList;
    }
}
