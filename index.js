const {createClient} = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePrivateKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabasePrivateKey);

async function repeatEveryFiveSeconds() {
  const {error, count} = await supabase
      .from('queue')
      .select('*', {count: 'exact', head: true})
      .eq('status', 'queued');

  if (error) {
    console.error(error);
  }

  if (count > 0) {
    await fetch(process.env.QUEUE_URL);
  }
}

setInterval(repeatEveryFiveSeconds, 3000);
