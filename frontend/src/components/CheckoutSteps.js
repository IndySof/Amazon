import React from 'react';

export default function CheckoutSteps(props) {
  return (
    <div className="row checkout-steps">
      <div className={props.step2 ? 'active' : ''}>Se connecter</div>
      <div className={props.step3 ? 'active' : ''}>Coordonnées</div>
      <div className={props.step4 ? 'active' : ''}>Paiement</div>
      <div className={props.step5 ? 'active' : ''}>Valider</div>
    </div>
  );
}
