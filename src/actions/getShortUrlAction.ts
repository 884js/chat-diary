'use server';

export const getShortUrlAction = async (url: string) => {
  const apiUrl = new URL('https://xgd.io/V1/shorten');

  apiUrl.searchParams.set('key', process.env.XGD_API_KEY || '');
  apiUrl.searchParams.set('url', url);

  const result = await fetch(apiUrl.toString());

  const data = await result.json();

  return {
    shorturl: data.shorturl,
  };
};
