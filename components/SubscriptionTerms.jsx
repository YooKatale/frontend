"use client";

import { Box, Text, Heading } from "@chakra-ui/react";
import React from "react";

const TERMS_CSS = `
.terms-m-banner{position:relative;overflow:hidden;background:linear-gradient(135deg,#0e1e0e 0%,#1a5c1a 50%,#2d8c2d 100%);padding:18px 24px;}
.terms-m-banner::before{content:'';position:absolute;inset:0;opacity:.06;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
.terms-m-banner::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.06) 50%,transparent 70%);background-size:300% 100%;animation:terms-shimmer 5s infinite;}
@keyframes terms-shimmer{from{background-position:300% 0}to{background-position:-300% 0}}
.terms-m-title{font-family:'DM Serif Display',serif;font-size:20px;color:#fff;margin-bottom:4px;position:relative;z-index:1;}
.terms-m-sub{font-size:12px;color:rgba(255,255,255,.8);position:relative;z-index:1;}
.terms-body{font-family:'Sora',sans-serif;padding:20px 24px;font-size:13px;line-height:1.6;color:#445444;}
.terms-body h3{font-family:'DM Serif Display',serif;font-size:16px;color:#0e180e;margin:16px 0 8px;}
.terms-body p{margin-bottom:10px;}
.terms-body .strong{font-weight:800;color:#0e180e;}
.terms-delivery{border-top:1px solid rgba(0,0,0,.1);margin-top:16px;padding-top:16px;}
`;

const SubscriptionTerms = ({ handleModalClose }) => {
  return (
    <>
      <style>{TERMS_CSS}</style>
      <div className="terms-m-banner">
        <div className="terms-m-title">YooKatale premium promotional offer terms</div>
        <div className="terms-m-sub">Terms and conditions that apply to the promotional offer you signed up for.</div>
      </div>
      <Box className="terms-body">
        <p className="strong">Please read these terms in full. They contain conditions and restrictions on YooKatale Premium promotional offers and what happens after your offer ends.</p>

        <h3>Introduction</h3>
        <p>YooKatale Premium Promotional Offers (each a &quot;Promotional Offer&quot;) are made available by YooKatale subject to YooKatale Terms and Conditions of Use (&quot;YooKatale Terms of Use&quot;). Each offer is made in connection with a Paid Subscription (e.g. YooKatale Premium, YooKatale Duo Premium) as advertised. These Promotional Offer Terms supplement the terms for that YooKatale Premium Service. In case of inconsistency, these Promotional Offer Terms prevail.</p>

        <h3>The promotional offer</h3>
        <p>Each Promotional Offer provides access to the YooKatale Premium Service advertised: (A) at the price advertised (if any); (B) for an initial introductory delivery period (the &quot;Promotional Period&quot;) from when you confirm acceptance by submitting valid payment details accepted by YooKatale.</p>
        <p>By submitting payment details you: (i) confirm acceptance of the advertised Promotional Offer; (ii) accept these Promotional Offer Terms and the relevant terms for that YooKatale Premium Service; (iii) agree to YooKatale Terms of Use. Data is used in accordance with our Privacy Policy. Promotional Offers do not permit access to third party goods or services other than those stipulated.</p>

        <h3>Eligibility</h3>
        <p>To be eligible you must: (1) Be a new subscriber to YooKatale Premium Service (or Unlimited service) and not have subscribed or accepted a trial of Premium or Duo Premium before—unless the offer is advertised for past subscribers. (2) If the offer is for past subscribers only, your subscription must have expired before the advertised date. (3) Meet any additional eligibility in the plan terms. (4) Provide a valid payment method approved by YooKatale (prepaid cards and YooKatale gift cards/coupons are not valid). (5) Provide payment directly to YooKatale, not via a third party. (6) Meet any other advertised requirements. Eligible users may accept a Promotional Offer once; previous users may not redeem again.</p>

        <h3>Availability</h3>
        <p>A Promotional Offer must be accepted before any advertised expiration date. YooKatale may modify, suspend or terminate an offer at any time; we will not honour subsequent enrollments after that.</p>

        <h3>Duration and cancellation</h3>
        <p>The Promotional Period continues for the period advertised. Unless you cancel before it ends, you become a recurring subscriber and your payment method will be charged the then-current price. Time-capped features are reduced by the length of the Promotional Period. If you cancel during the Promotional Period, you lose access at the end of that period and your account switches to YooKatale Free. To cancel: log in and follow the Account page prompts, or contact info@yookatale.com.</p>

        <Box className="terms-delivery">
          <h3>Delivery terms &amp; conditions</h3>
          <p><span className="strong">Free delivery:</span> For orders where delivery distance is within 3 km from restaurant/vendor to customer address.</p>
          <p><span className="strong">Additional charges:</span> Beyond 3 km, 950 UGX per extra kilometre applies.</p>
          <p><span className="strong">Example:</span> 5 km total → 2 km extra → 2 × 950 = 1,900 UGX (plus any base fee).</p>
          <p>Distance is straight-line or routed as used by the app. The surcharge is shown in checkout before payment.</p>
        </Box>
      </Box>
    </>
  );
};

export default SubscriptionTerms;
