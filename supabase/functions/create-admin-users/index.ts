import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface UserData {
  email: string;
  password: string;
}

interface CreateUsersRequest {
  users: UserData[];
  adminKey: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { users, adminKey }: CreateUsersRequest = await req.json();

    // Verify admin key
    if (adminKey !== 'innpulsa2026') {
      return new Response(
        JSON.stringify({ error: 'Invalid admin key' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!users || !Array.isArray(users) || users.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Users array is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create Supabase admin client using service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const results = [];

    for (const userData of users) {
      let { email, password } = userData;

      if (!email || !password) {
        results.push({
          email: email || 'unknown',
          success: false,
          message: 'Email and password are required'
        });
        continue;
      }

      // Always add @innpulsacolombia.com domain
      const fullEmail = `${email}@innpulsacolombia.com`;

      // Create new user directly, let Supabase handle duplicate checks
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: fullEmail,
        password: password,
        email_confirm: true,
      });

      if (error) {
        results.push({
          email: fullEmail,
          success: false,
          message: error.message
        });
      } else {
        results.push({
          email: fullEmail,
          success: true,
          message: 'Usuario creado exitosamente',
          user_id: data.user?.id
        });
      }
    }

    const allSuccessful = results.every(r => r.success);

    return new Response(
      JSON.stringify({
        success: allSuccessful,
        results
      }),
      {
        status: allSuccessful ? 200 : 207, // 207 Multi-Status for partial success
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error creating users:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
