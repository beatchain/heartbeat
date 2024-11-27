const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseDevUrl = process.env.SUPABASE_DEV_URL;
const supabasePrivateKey = process.env.SUPABASE_KEY;
const supabaseDevPrivateKey = process.env.SUPABASE_DEV_KEY;
const supabase = createClient(supabaseUrl, supabasePrivateKey);
const supabaseDevClient = createClient(supabaseDevUrl, supabaseDevPrivateKey);

async function repeatEveryThreeSeconds() {
  const { error, count } = await supabase
    .from("queue")
    .select("*", { count: "exact", head: true })
    .eq("status", "queued");
  console.log("🚀 ~ repeatEveryThreeSeconds ~ count:", count);

  if (error) {
    console.error(error);
  }

  if (count > 0) {
    await fetch(process.env.QUEUE_URL);
  }
  // do the same thing for dev
  const { error: devError, count: devCount } = await supabaseDevClient
    .from("queue")
    .select("*", { count: "exact", head: true })
    .eq("status", "queued");
  console.log("🚀 ~ repeatEveryThreeSeconds ~ devCount:", devCount);

  if (devError) {
    console.error(devError);
  }

  if (devCount > 0) {
    await fetch(process.env.QUEUE_DEV_URL);
  }
}

setInterval(repeatEveryThreeSeconds, 3000);
