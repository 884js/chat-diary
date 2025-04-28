import { clearRedirectUrl, getRedirectUrl } from '@/actions/redirectUrlActions';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  // cookieからリダイレクト先URLをServer Actionを使って取得
  const redirectUrl = await getRedirectUrl();
  const next = redirectUrl || searchParams.get('next') || '/home';

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 使用したcookieをServer Actionを使って削除
      await clearRedirectUrl();

      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';

      // 完全なURLが指定されている場合はそのままリダイレクト
      if (redirectUrl?.startsWith('http')) {
        return NextResponse.redirect(redirectUrl);
      }

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      }

      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
