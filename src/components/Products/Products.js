import React from "react";

const formatNumber = (number) =>
  new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);

const Products = (props) => {
  let total = 0;
  return (
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Unit Price</th>
          <th>Revenue</th>
        </tr>
      </thead>
      <tbody>
        {props.products?.map((item, index) => {
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
  );
};

export default Products;
