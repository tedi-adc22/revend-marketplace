// import { createBrowserClient } from "@supabase/ssr";

// export function createClient() {
//   return createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
//   );
// }

import { createClient } from "@supabase/supabase-js";

createClient(supabase_url, publishable_key);
