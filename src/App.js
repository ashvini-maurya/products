import React, { Component } from "react";
import "./App.css";
import "react-input-range/lib/css/index.css";
import InfiniteScroll from "./components/InfiniteScroll/InfiniteScroll";
import Products from "./components/Products/Products";
import ProductFilter from "./components/ProductFilter/ProductFilter";

class App extends Component {
  state = {
    products: [],
    search: "",
    loading: false,
    value: {},
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

      const unitPriceMinObj = result?.reduce((prev, curr) => {
        return prev.unitPrice < curr.unitPrice ? prev : curr;
      });
      const unitPriceMin = unitPriceMinObj.unitPrice;

      const unitPriceObj = result?.reduce((prev, curr) => {
        return prev.unitPrice > curr.unitPrice ? prev : curr;
      });
      const unitPriceMax = unitPriceObj.unitPrice;

      this.setState({
        product: result,
        loading: false,
        value: { min: unitPriceMin, max: unitPriceMax },
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

    const inputChangeHandler = (event) => {
      this.setState({ search: event.target.value });
    };

    const rangeChangeHandler = (value) => {
      this.setState({ value });
    };

    return (
      <>
        <div className="product-list">
          {this.state.loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <ProductFilter
                search={this.state.search}
                value={this.state.value}
                inputChangeHandler={inputChangeHandler}
                rangeChangeHandler={rangeChangeHandler}
              />
              <Products products={products} />
            </>
          )}
        </div>
        <InfiniteScroll />
      </>
    );
  }
}

export default App;
