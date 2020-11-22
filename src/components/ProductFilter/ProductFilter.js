import React from "react";
import InputRange from "react-input-range";

const ProductFilter = (props) => (
  <>
    <label className="search-products">Search Products</label>

    <div className="labels">
      <label className="first-label">Product Name</label>
      <label className="second-label">Price Range</label>
    </div>

    <div>
      <input
        type="text"
        value={props.search}
        name="search"
        placeholder="Search by Product"
        onChange={(event) => props.inputChangeHandler(event)}
      />
      {props.value?.max ? (
        <InputRange
          minValue={0}
          maxValue={14}
          value={props.value}
          // onChange={(value) => this.setState({ value })}
          onChange={(value) => props.rangeChangeHandler(value)}
        />
      ) : null}
    </div>
  </>
);

export default ProductFilter;
