"use client";

import { Box } from "@chakra-ui/react";
import { PaymentLogos } from "@constants/constants";

/**
 * Renders MTN or Airtel logo for payment options (cashout, payment page, etc.)
 * @param {Object} props
 * @param {"MTN"|"AIRTEL"} props.provider
 * @param {number} [props.size=24] - width/height in px
 * @param {Object} [props.sx] - extra Chakra props
 */
export default function PaymentProviderLogo({ provider, size = 24, sx = {} }) {
  const src = provider === "MTN" ? PaymentLogos.mtn : provider === "AIRTEL" ? PaymentLogos.airtel : null;
  if (!src) return null;
  return (
    <Box
      as="img"
      src={src}
      alt={provider === "MTN" ? "MTN Mobile Money" : "Airtel Money"}
      w={`${size}px`}
      h={`${size}px`}
      minW={`${size}px`}
      minH={`${size}px`}
      objectFit="contain"
      flexShrink={0}
      {...sx}
    />
  );
}
