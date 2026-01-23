/**
 * Bulk Subscription Script
 * 
 * Reads emails from emailnew.csv and subscribes them all
 * - Subscribes to database
 * - Sends subscription welcome email
 * 
 * Usage:
 *   node scripts/bulk-subscribe.js
 * 
 * Or from project root:
 *   cd frontend
 *   node scripts/bulk-subscribe.js
 */

const fs = require('fs');
const path = require('path');

async function bulkSubscribe() {
  console.log('📧 Starting bulk subscription process...\n');

  // Read CSV file
  const csvPath = path.join(__dirname, '../../emailnew.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found at: ${csvPath}`);
    console.error('Please ensure emailnew.csv exists in the project root.');
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Skip header row if it exists
  const emails = lines
    .slice(1) // Skip header
    .map(line => {
      // Handle CSV format - take first column (email)
      const parts = line.split(',');
      return parts[0]?.trim().toLowerCase();
    })
    .filter(email => email && email.includes('@'));

  if (emails.length === 0) {
    console.error('❌ No valid emails found in CSV file');
    process.exit(1);
  }

  console.log(`📋 Found ${emails.length} emails in CSV file\n`);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/subscription/bulk`;

  try {
    console.log('📤 Sending bulk subscription request...');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emails }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('\n✅ Bulk subscription completed!\n');
      console.log('📊 Summary:');
      console.log(`   Total emails: ${result.total}`);
      console.log(`   ✅ Success: ${result.successCount}`);
      console.log(`   ⚠️  Partial: ${result.partialCount}`);
      console.log(`   ❌ Errors: ${result.errorCount}\n`);

      if (result.errorCount > 0) {
        console.log('❌ Failed emails:');
        result.results
          .filter(r => r.status === 'error')
          .forEach(r => {
            console.log(`   - ${r.email}: ${r.message}`);
          });
      }

      if (result.successCount > 0) {
        console.log('\n✅ Successfully subscribed emails:');
        result.results
          .filter(r => r.status === 'success')
          .slice(0, 10) // Show first 10
          .forEach(r => {
            console.log(`   ✓ ${r.email}`);
          });
        if (result.successCount > 10) {
          console.log(`   ... and ${result.successCount - 10} more`);
        }
      }
    } else {
      console.error('❌ Bulk subscription failed:', result.error || result.details);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error during bulk subscription:', error.message);
    process.exit(1);
  }
}

// Run the script
bulkSubscribe().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
