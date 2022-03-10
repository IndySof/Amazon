import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';

export default function Product(props) {
  const { product } = props;
  return (
    
    <div key={product._id} className="card">
      <Link to={`/product/${product._id}`}>
      <div className="card-body">
          <div>{product.name}</div>
          <div>{product.brand}</div>
          {product.price !== 0 ? 
          (
          <div>Stage rémunéré : {product.price}€</div>
          ) : (
          <div><b>Stage non rémunéré</b></div>
          )}
          <Rating
          rating={product.rating}
          numReviews={product.numReviews}
          >
          </Rating>
          <div>{product.description}</div>
      </div>
      </Link>
    </div>
    
  );
}
