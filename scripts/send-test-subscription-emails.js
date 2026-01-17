/**
 * Test Subscription Email Script
 * 
 * Sends test subscription emails to 3 test addresses
 * Run this before bulk subscription to verify email template
 * 
 * Usage:
 *   node scripts/send-test-subscription-emails.js
 * 
 * Or from project root:
 *   cd frontend
 *   node scripts/send-test-subscription-emails.js
 */

const testEmails = [
  'arihotimothy89@gmail.com',
  'timothy.arihoz@protonmail.com',
  'yookatale256@gmail.com'
];

async function sendTestEmails() {
  console.log('🧪 Starting test email sending...\n');
  console.log('Test emails:', testEmails);
  console.log('');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/mail`;

  const results = [];

  for (const email of testEmails) {
    try {
      console.log(`📧 Sending test email to: ${email}...`);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          type: 'subscription'
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log(`✅ Successfully sent to ${email}`);
        results.push({ email, status: 'success', message: result.message });
      } else {
        console.error(`❌ Failed to send to ${email}:`, result.error || result.details);
        results.push({ email, status: 'error', message: result.error || result.details });
      }
    } catch (error) {
      console.error(`❌ Error sending to ${email}:`, error.message);
      results.push({ email, status: 'error', message: error.message });
    }

    // Small delay between emails
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n📊 Test Results Summary:');
  console.log('='.repeat(50));
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  results.forEach(result => {
    const icon = result.status === 'success' ? '✅' : '❌';
    console.log(`${icon} ${result.email}: ${result.message}`);
  });

  console.log('='.repeat(50));
  console.log(`Total: ${results.length} | Success: ${successCount} | Errors: ${errorCount}`);

  if (successCount === results.length) {
    console.log('\n🎉 All test emails sent successfully!');
    console.log('You can now proceed with bulk subscription.');
  } else {
    console.log('\n⚠️ Some emails failed. Please check the errors above.');
  }
}

// Run the script
sendTestEmails().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
