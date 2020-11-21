import React, { Component } from "react";
import "./App.css";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";

const formatNumber = (number) =>
  new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);
class App extends Component {
  state = {
    products: [],
    search: "",
    loading: false,
    value: { min: 0, max: 14 },
  };

  componentDidMount() {
    this.setState({
      loading: true,
    });

    const getProducts = async () => {
      const request = await fetch("data/data.json");
      const response = await request.json();

      let result = Object.values(
        [...response.products].reduce((item, { id, name, unitPrice, sold }) => {
          item[id] = {
            id,
            name,
            unitPrice,
            sold: (item[id] ? item[id].sold : 0) + sold,
          };
          return item;
        }, {})
      );

      result.sort((a, b) => a.name.localeCompare(b.name));

      this.setState({
        product: result,
        loading: false,
      });
    };
    getProducts();
  }

  render() {
    let products = this.state.search
      ? this.state.product.filter((item) =>
          item.name.toLowerCase().includes(this.state.search.toLowerCase())
        )
      : this.state.product;

    products = products?.filter(
      (item) =>
        item.unitPrice <= this.state.value.max &&
        item.unitPrice >= this.state.value.min
    );

    let total = 0;

    return (
      <div className="product-list">
        {this.state.loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <label>Search Products</label>

            <div>
              <input
                type="text"
                value={this.state.search}
                name="search"
                placeholder="Search by Product"
                onChange={(event) =>
                  this.setState({ search: event.target.value })
                }
              />
              <InputRange
                minValue={0}
                maxValue={14}
                value={this.state.value}
                onChange={(value) => this.setState({ value })}
              />
            </div>

            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Unit Price</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((item, index) => {
                  total = total + item.unitPrice * item.sold;
                  return (
                    <tr key={item.name}>
                      <td>{item.name}</td>
                      <td>{item.unitPrice}</td>
                      <td>{formatNumber(item.unitPrice * item.sold)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td></td>
                  <td>{formatNumber(total)}</td>
                </tr>
              </tfoot>
            </table>
          </>
        )}
      </div>
    );
  }
}

export default App;
