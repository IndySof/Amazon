import Axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deliverOrder, detailsOrder, payOrder } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
// import numSuivi from '../shipmentNumber';
import MessageBox from '../components/MessageBox';
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from '../constants/orderConstants';

export default function OrderScreen(props) {
  const orderId = props.match.params.id;
  const [sdkReady, setSdkReady] = useState(false);
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = orderDeliver;
  const dispatch = useDispatch();
  useEffect(() => {
    const addPayPalScript = async () => {
      const { data } = await Axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (
      !order ||
      successPay ||
      successDeliver ||
      (order && order._id !== orderId)
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(detailsOrder(orderId));
    } else {
      if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
  }, [dispatch, orderId, sdkReady, successPay, successDeliver, order]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
  };
  const deliverHandler = () => {
    dispatch(deliverOrder(order._id));
  };


  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <h1>Commande n&#176; {order.suivi}</h1>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Exp??dition</h2>
                <p>
                  <strong>Nom:</strong> {order.shippingAddress.fullName} <br />
                  <strong>Num??ro de t??l??phone:</strong> {order.shippingAddress.phone} <br />
                  <strong>Adresse: </strong> {order.shippingAddress.address},{' '}
                  {order.shippingAddress.postalCode},{' '}
                  {order.shippingAddress.city},{' '}
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    Delivr?? 
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Non delivr??</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Paiement</h2>
                <p>
                  <strong>M??thode de paiement:</strong> {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    Paiement re??u {order.paidAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Non pay??</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Articles de la commande</h2>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="small"
                          ></img>
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div>
                          {item.qty} x {item.price}??? = {item.qty * item.price}???
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2>R??sum?? de la commande</h2>
              </li>
              <li>
                <div className="row">
                  <div>Articles</div>
                  <div>{order.itemsPrice.toFixed(2)}???</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Exp??dition</div>
                  <div>{order.shippingPrice.toFixed(2)}???</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Taxes</div>
                  <div>{order.taxPrice.toFixed(2)}???</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong>Total de la commande</strong>
                  </div>
                  <div>
                    <strong>{order.totalPrice.toFixed(2)}???</strong>
                  </div>
                </div>
              </li>
              {!order.isPaid && (
                <li>
                  {!sdkReady ? (
                    <LoadingBox></LoadingBox>
                  ) : (
                    <div>
                      {errorPay && (
                        <MessageBox variant="danger">{errorPay}</MessageBox>
                      )}
                      {loadingPay && <LoadingBox></LoadingBox>}

                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      ></PayPalButton>
                    </div>
                  )}
                </li>
              )}
              {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <li>
                  {loadingDeliver && <LoadingBox></LoadingBox>}
                  {errorDeliver && (
                    <MessageBox variant="danger">{errorDeliver}</MessageBox>
                  )}
                  <button
                    type="button"
                    className="primary block"
                    onClick={deliverHandler}
                  >
                   Livrer la commande
                  </button>
                </li>
              )}
              <li>
                <div>
                  {!userInfo.isAdmin && order.isPaid && order.isDelivered? (
                <a href="http://10.196.116.26/videostream.cgi?user=client&pwd=Amazing921"
                 target="_blank"><img src="http://10.196.116.26/videostream.cgi?user=client&pwd=Amazing921"
                  alt="CameraLivreur" width='500px' height='auto'></img></a>)
                  :
                  (<div></div>)
                }
                </div>

              </li>
              <li>
                <div>
                {userInfo.isAdmin? (
                <Link to={`/etiquette/${order._id}`}><button className="fa">&#xf02f;</button></Link>)
                :
                (<div></div>)
                }
               </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}



/*
<h1>Order {order._id}</h1>


*/
