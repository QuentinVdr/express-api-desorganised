class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }

  static fromRow(row) {
    return new Product(row.id, row.name, row.price);
  }
}

export default Product;
