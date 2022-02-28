//import Axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
//import { Link } from 'react-router-dom';
//import { deliverOrder, detailsOrder, payOrder } from '../actions/orderActions';
//import { detailsUser} from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
// import numSuivi from '../shipmentNumber';
import MessageBox from '../components/MessageBox';


export default function etiquetteScreen(props) {
//const sellerMode = props.match.path.indexOf('/seller') >= 0;
//const orderId = props.match.params.id;

const orderDetails = useSelector((state) => state.orderDetails);
const { order, loading, error } = orderDetails;

//const userDetails = useSelector((state) => state.userDetails);
//const { user } = userDetails;

//const userSignin = useSelector((state) => state.userSignin);
//const { userInfo } = userSignin;
 
//const dispatch = useDispatch();
var JsBarcode = require('jsbarcode');
var printJS = require('print-js');
// var Canvas = require('canvas');
// var{createCanvas} = require('canvas');
// var canvas = new Canvas();
// var canvas = createCanvas();

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth()+ 1).padStart(2, '0');
var yyyy = today.getFullYear();
today = dd+ "/" + mm + "/" + yyyy;

return loading ? (
<LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
   
    

<div className="etiquette" id="etiquette">
<div className="section1">
         <img className='detail1' src="/images/detail1.png" alt="detail"></img> 
        <div className='line'>
        <div>
        <div className="expediteur">
            EXPEDITEUR
        </div>
        <div className='adresse1'>
        <div>
            <b>AMAZON</b>
        </div>
        <div>
            7 RUE BADAT,<br></br>
             06300, NICE, FRANCE
        </div>
        </div>
        <div>
        <script>
      {  window.setTimeout(function(){
          JsBarcode( "#barcode1", order.suivi)}, 0)
          }
        </script>
            <img className="barcode1" id='barcode1' />
        </div>
    </div>
   

    <div className="dest">DESTINATAIRE &nbsp;&nbsp;&nbsp; Réf DESTINATAIRE: FRANCE </div>
    <div className="client">
        <div>
        {order.shippingAddress.fullName}
        </div>
        <br></br>
        <div>
            <b>
            {order.shippingAddress.postalCode}{' '} {order.shippingAddress.city} {order.shippingAddress.country}
            </b>
        </div>
        <br></br>
        <div className="tel">
            TEL : {order.shippingAddress.phone}
        </div>
    </div>
    </div>
    </div>
    <div className="section3">
        <img className="cut" src="/images/cut.png" alt={"cut"}></img>
    </div>
    <div className='section2'>
            <div className="adresse3">
              <div>
                 EXPEDITEUR
              </div>
            <div>
                AMAZON
            </div><br></br>
            <div>
                7 RUE BADAT
            </div><br></br>
            <div>
                06300 NICE 
            </div><br></br>
            <div>
                SITE DE PRISE EN CHARGE
            </div>
            <div>
                AMAZON
            </div>

        </div>
        <div className="adresse2">
            <div>
                <b>
                Edité le : {today}
                </b>
            </div><br></br>
            <div>
                <u>
                DESTINATAIRE
                </u>
            </div><br></br>
            <div>
            {order.shippingAddress.fullName}
            </div><br></br>
            <div>
            {order.shippingAddress.address}
            </div><br></br>
            <div>
            {order.shippingAddress.postalCode}{' '} {order.shippingAddress.city} {order.shippingAddress.country}
            </div><br></br>
            <div>
                TEL :  {order.shippingAddress.phone}
            </div>
            <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
            <div>
                COLIS N&#186; : {order.suivi}
            </div>
            <br></br><br></br>
            <div>
                POIDS : 1.00KG
            </div>
        </div>
    </div>

{/* <div>
    <button id='print' className='fa' onClick={window.print()}>&#xf02f;</button>
</div> */}
</div>

  );
}