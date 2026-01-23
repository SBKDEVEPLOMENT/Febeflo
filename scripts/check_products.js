const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://olhvqojytqfsgernosmj.supabase.co';
const supabaseKey = 'sb_secret_LcksiKzzQQYqBFkZKQj02Q_XoTK3TIt'; // Service Role Key

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Products found:', data.length);
    console.log(JSON.stringify(data, null, 2));
  }
}

checkProducts();
