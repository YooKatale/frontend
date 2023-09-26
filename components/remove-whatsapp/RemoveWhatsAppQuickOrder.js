import { useRouter } from 'next/router';

function removeWhatsAppQuickOrder() {
  // Use the router to navigate to the page without the WhatsApp quick order feature.
  const router = useRouter();
  const pathname = router.pathname;
  const updatedPathname = removeWhatsAppFeature(pathname);
  router.replace(updatedPathname);
}

// Replace the WhatsApp quick order path segment with an empty string.
function removeWhatsAppFeature(pathname) {
  return pathname.replace('/whatsapp-quick-order', '');
}

export default removeWhatsAppQuickOrder;

